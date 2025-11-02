import { supabase } from "../auth/supabaseClient";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error("No se pudo obtener la sesión: " + error.message);
  const token = data?.session?.access_token;
  if (!token) throw new Error("Usuario no autenticado");
  return token;
}

// export async function fetchCreditApplications(
//   user_id,
//   page = 1,
//   limit = 10,
//   status = null,
//   company_id = null
// ) {
//   try {
//     const token = await getAccessToken();

//     const query = new URLSearchParams();
//     query.append("page", page);
//     query.append("limit", limit);
//     query.append("order", "desc"); // por defecto descendente
//     if (status) query.append("status", status);
//     if (company_id) query.append("company_id", company_id);

//     const response = await fetch(
//       `${BACKEND_URL}/api/v1/credit-applications/?${query.toString()}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       let errorMessage = "Error al obtener las solicitudes de crédito";
//       try {
//         const errorData = await response.json();
//         if (errorData.detail) errorMessage = errorData.detail;
//       } catch {
//         /* ignore parse error */
//       }
//       throw new Error(errorMessage);
//     }

//     const data = await response.json();

//     // ✅ Adaptamos correctamente al formato del backend
//     const meta = data.meta || {};

//     return {
//       items: data.items || [],
//       total: meta.total || 0,
//       perPage: meta.per_page || limit,
//       totalPages: meta.pages || 1,
//       page: meta.page || page,
//       hasNext: meta.has_next || false,
//       hasPrev: meta.has_prev || false,
//     };
//   } catch (err) {
//     console.error("Error obteniendo las solicitudes de crédito:", err);
//     return {
//       items: [],
//       total: 0,
//       perPage: limit,
//       totalPages: 1,
//       page: 1,
//       hasNext: false,
//       hasPrev: false,
//     };
//   }
// }

export async function fetchCreditApplications(
  user_id = null, // null para operadores, id para usuarios
  page = 1,
  limit = 10,
  status = null,
  company_id = null
) {
  try {
    const token = await getAccessToken();

    const query = new URLSearchParams();
    query.append("page", page);
    query.append("limit", limit);
    if (status) query.append("status", status);
    if (company_id) query.append("company_id", company_id);

    // Solo agregamos user_id si es un usuario
    if (user_id) query.append("user_id", user_id);

    const response = await fetch(`${BACKEND_URL}/api/v1/credit-applications/?${query.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Error al obtener las solicitudes de crédito");
    }

    const data = await response.json();

    // Adaptamos la respuesta para que ambos dashboards funcionen igual
    return {
      items: data.items || [],
      totalPages: data.meta?.pages || 1,
      perPage: data.meta?.per_page || limit,
      page: data.meta?.page || 1,
      total: data.meta?.total || 0,
    };

  } catch (err) {
    console.error("Error obteniendo las solicitudes de crédito:", err);
    return { items: [], totalPages: 1, perPage: limit, page: 1, total: 0 };
  }
}


export async function getLoanById(loan_id) {
  try {

    const token = await getAccessToken();

    // Fetch the loan by ID
    const response = await fetch(`${BACKEND_URL}/api/v1/credit-applications/${loan_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Error al obtener la solicitud de crédito");
    }

    const loanData = await response.json();
    return loanData;

  } catch (err) {
    console.error("Error obteniendo la solicitud de crédito:", err);
    return null;
  }
}

export async function createNewLoan(newLoanData) {
  try {
    const token = await getAccessToken();
    if (!token) throw new Error("No se encontró token de autenticación.");

    const response = await fetch(`${BACKEND_URL}/api/v1/credit-applications/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(newLoanData),
    });

    // Si el servidor no responde con 2xx
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Respuesta del backend:", errorData);
      throw new Error(errorData.detail || `Error ${response.status}: al crear la solicitud de crédito`);
    }

    const createdLoan = await response.json();
    console.log("Solicitud de crédito creada:", createdLoan);
    return createdLoan;

  } catch (err) {
    console.error("Error creando la solicitud de crédito:", err.message);
    return null;
  }
}

//Actualiza el estado de una solicitud de crédiot - operadores
export async function updateLoanStatus(applicationId, newStatus, currentLoanData) {
  try {
    const token = await getAccessToken();

    const bodyData = {
      ...currentLoanData,
      status: newStatus
    };

    const response = await fetch(`${BACKEND_URL}/api/v1/credit-applications/${applicationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Error al actualizar la solicitud de crédito");
    }

    const updatedLoan = await response.json();
    return updatedLoan;

  } catch (err) {
    console.error("Error actualizando la solicitud de crédito:", err?.message || err);
    console.error("Full error object:", err);
  }
};

export const updateLoanDraft = async (application_id, updateData) => {
  try {
    const token = await getAccessToken();
    const resp = await fetch(`${BACKEND_URL}/api/v1/credit-applications/${application_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(updateData)
    });

    if (!resp.ok) {
      const errorData = await resp.json();
      throw new Error(JSON.stringify(errorData));
    }

    return await resp.json();
  } catch (error) {
    console.error("Error actualizando borrador:", error);
    throw error;
  }
};

export const deleteCreditApplication = async (application_id) => {
  try {
    const token = await getAccessToken();
    const resp = await fetch(`${BACKEND_URL}/api/v1/credit-applications/${application_id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (resp.status === 204) return true;

    if (!resp.ok) {
      const errorData = await resp.json();
      throw new Error(JSON.stringify(errorData));
    }

    return false;
  } catch (error) {
    console.error("Error eliminando solicitud:", error);
    throw error;
  }
};
