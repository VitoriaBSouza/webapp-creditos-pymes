import { supabase } from "../auth/supabaseClient";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error("No se pudo obtener la sesión: " + error.message);
  const token = data?.session?.access_token;
  if (!token) throw new Error("Usuario no autenticado");
  return token;
}

const documentServices = {};

export const DocumentTypes = {
  TAX_RETURN: "tax_return",
  FINANCIAL_STATEMENT: "financial_statement",
  ID_DOCUMENT: "id_document",
  BUSINESS_LICENSE: "business_license",
  BANK_STATEMENT: "bank_statement",
  OTHER: "other",
};

documentServices.getDocuments = async ({ application_id, page = 1, limit = 10, order = "desc" } = {}) => {
  try {
    const token = await getAccessToken();

    const params = new URLSearchParams();

    if (!application_id) {
      throw new Error("application_id is required to fetch documents");
    }

    params.append("application_id", application_id);
    params.append("page", page);
    params.append("limit", limit);
    params.append("order", order);

    const response = await fetch(`${BACKEND_URL}/api/v1/documents/?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "No se pudieron obtener los documentos");
    }

    return await response.json();

  } catch (err) {
    console.error("Error obteniendo documentos:", err);
    return null;
  }
};

// Guarda en carpeta temporal en supabase, para uso con hellosign o pedir documents
documentServices.uploadLoanDraftDocument = async (loanId, documentType, file, isTemp = false) => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${documentType}_${Date.now()}.${fileExt}`;

    // Subir a tmp/ fuera de private si es temporal
    const filePath = isTemp
      ? `tmp/${loanId}/${fileName}`       // carpeta tmp fuera de private
      : `private/${loanId}/${fileName}`   // carpeta principal para documentos finales

    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase.storage
      .from("documents")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        metadata: {
          application_id: loanId,
          document_type: documentType,
          user_id: user?.id,
          temporary: isTemp,
        },
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error subiendo ${documentType}:`, error);
    return null;
  }
};

//Guardar un documento en supbase storage
documentServices.uploadLoanDocument = async (loanId, documentType, file) => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${documentType}_${Date.now()}.${fileExt}`;
    const filePath = `private/${loanId}/${fileName}`;

    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase.storage
      .from("documents")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        metadata: {
          application_id: loanId,
          document_type: documentType,
          user_id: user?.id,
        },
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error subiendo ${documentType}:`, error);
    return null;
  }
};

// Mover archivo de tmp a carpeta principal
documentServices.moveLoanDocumentFromTmp = async (loanId, fileName) => {
  try {
    const tmpPath = `tmp/${loanId}/${fileName}`;       // tmp fuera de private
    const finalPath = `private/${loanId}/${fileName}`; // carpeta principal

    // Descargar el archivo temporal
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("documents")
      .download(tmpPath);

    if (downloadError) throw downloadError;

    // Subirlo a la carpeta principal
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("documents")
      .upload(finalPath, fileData, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Borrar el archivo original del tmp
    const { error: deleteError } = await supabase.storage
      .from("documents")
      .remove([tmpPath]);

    if (deleteError) throw deleteError;

    console.log(`Documento movido de tmp a carpeta principal: ${fileName}`);
    return uploadData;
  } catch (error) {
    console.error(`Error moviendo archivo ${fileName} desde tmp:`, error);
    return null;
  }
};

// Borrar un documento por nombre dentro de una solicitud, buscando en private y tmp
documentServices.deleteLoanDocument = async (loanId, fileName) => {
  try {
    const pathsToTry = [
      `private/${loanId}/${fileName}`,
      `tmp/${loanId}/${fileName}`,
    ];

    for (const filePath of pathsToTry) {
      const { data, error } = await supabase.storage
        .from("documents")
        .remove([filePath]);

      // Si no hay error y se borró algo, devolver el resultado
      if (!error && data?.length > 0) {
        console.log(`Archivo eliminado correctamente: ${fileName} desde ${filePath}`);
        return data;
      }
    }

    console.log(`No se encontró el archivo ${fileName} en private ni tmp.`);
    return null;

  } catch (error) {
    console.error(`Error eliminando archivo ${fileName}:`, error);
    return null;
  }
};

// Borrar todos los documentos asociados a una solicitud (incluyendo tmp)
documentServices.deleteAllLoanDocuments = async (loanId) => {
  try {
    const privatePath = `private/${loanId}`;
    const tmpPath = `tmp/${loanId}`; // tmp fuera de private

    // Listar archivos en private
    const { data: mainFiles, error: mainError } = await supabase.storage
      .from("documents")
      .list(privatePath);

    if (mainError) throw mainError;

    // Listar archivos en tmp
    const { data: tmpFiles, error: tmpError } = await supabase.storage
      .from("documents")
      .list(tmpPath);

    if (tmpError) throw tmpError;

    const filePaths = [
      ...(mainFiles?.map(f => `${privatePath}/${f.name}`) || []),
      ...(tmpFiles?.map(f => `${tmpPath}/${f.name}`) || []),
    ];

    if (filePaths.length === 0) {
      console.log(`No hay archivos para eliminar en solicitud ${loanId}`);
      return [];
    }

    // Eliminar todos los archivos
    const { data, error: removeError } = await supabase.storage
      .from("documents")
      .remove(filePaths);

    if (removeError) throw removeError;

    console.log(`Archivos (incluyendo tmp) eliminados correctamente para solicitud ${loanId}`);
    return data;
  } catch (error) {
    console.error(`Error eliminando archivos de solicitud ${loanId}:`, error);
    return null;
  }
};

documentServices.updateStatus = async ({ document_id, status } = {}) => {
  try {
    if (!document_id) throw new Error("document_id is required");
    if (!status) throw new Error("status is required");

    const token = await getAccessToken();

    const response = await fetch(`${BACKEND_URL}/api/v1/documents/${document_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "No se pudo actualizar el documento");
    }

    const data = await response.json();
    console.log(`Documento actualizado correctamente: ${document_id}`, data);
    return data;

  } catch (err) {
    console.error("Error actualizando documento:", err);
    return null;
  }
};

// Helpers
documentServices.approve = async ({ document_id } = {}) => {
  return await documentServices.updateStatus({ document_id, status: "approved" });
};

documentServices.reject = async ({ document_id } = {}) => {
  return await documentServices.updateStatus({ document_id, status: "rejected" });
};

documentServices.requestDocument = async ({ application_id, user_id, document_type, title }) => {
  try {
    // Use a placeholder file (empty blob) to track the request
    const fileName = `${application_id}_${document_type}_${Date.now()}.txt`;
    const filePath = `private/${fileName}`;
    const placeholder = new Blob([""], { type: "text/plain" });

    const { data, error } = await supabase.storage
      .from("documents")
      .upload(filePath, placeholder, {
        cacheControl: "3600",
        upsert: false,
        metadata: {
          application_id,
          user_id,
          document_type,
          title,
          status: "pending" // track requested status
        }
      });

    if (error) throw error;

    console.log("Documento solicitado correctamente:", data);
    return data;
  } catch (err) {
    console.error("Error solicitando documento:", err);
    return null;
  }
};

export default documentServices;