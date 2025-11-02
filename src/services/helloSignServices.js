// const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

import { supabase } from "../auth/supabaseClient";

// export async function getAccessToken() {
//   const token = localStorage.getItem("sb-token");
//   if (!token) throw new Error("Usuario no autenticado");
//   return token;
// }

// const helloSignServices = {};


// helloSignServices.requestSignature = async ({ signerEmail, signerName, fileUrl }) => {
//   const token = await getAccessToken();

//   try {
//     const response = await fetch(`${SUPABASE_URL}/functions/v1/request-signature`, {
//       method: "POST",
//       headers: { 
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       },
//       body: JSON.stringify({ signerEmail, signerName, fileUrl }),
//     });

//     const data = await response.json().catch(() => ({}));

//     if (!response.ok) {
//       throw new Error(JSON.stringify(data)); // <-- stringify object
//     }

//     return data;
//   } catch (err) {
//     console.error("Error enviando solicitud de firma:", err);
//     throw err;
//   }
// };

// export default helloSignServices;


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error("No se pudo obtener la sesión: " + error.message);
  const token = data?.session?.access_token;
  if (!token) throw new Error("Usuario no autenticado");
  return token;
}

const helloSignServices = {};

helloSignServices.requestSignature = async ({ documentId, signerEmail, signerName }) => {
    const token = await getAccessToken();

    try {
        const response = await fetch(`${BACKEND_URL}/api/v1/documents/${documentId}/sign`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                signer_email: signerEmail,
                signer_name: signerName
            }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(JSON.stringify(data));
        }

        return data;
    } catch (err) {
        console.error("Error enviando solicitud de firma:", err);
        throw err;
    }
};

export default helloSignServices;