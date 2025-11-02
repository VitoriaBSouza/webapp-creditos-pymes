import { supabase } from "../auth/supabaseClient";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const companyServices = {};

export async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error("No se pudo obtener la sesión: " + error.message);
  const token = data?.session?.access_token;
  if (!token) throw new Error("Usuario no autenticado");
  return token;
}

//Fetch de la lista de empresas
companyServices.getCompanies = async ({ page = 1, limit = 10, order = 'desc' } = {}) => {
    try {
        const token = await getAccessToken();

        const response = await fetch(
            `${BACKEND_URL}/api/v1/companies/?page=${page}&limit=${limit}&order=${order}`,
            {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error obteniendo lista de empresas');
        }

        const companies = await response.json();
        return companies;

    } catch (err) {
        console.error('Error fetching companies:', err);
        return null;
    }
};

//Fetch de los datos de la empresa de usuario
companyServices.getMyCompanyDetails = async () => {
    try {
        const token = await getAccessToken();

        console.log(token);

        const response = await fetch(`${BACKEND_URL}/api/v1/companies/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Empresa no encontrada');
        }

        const company = response.status !== 204 ? await response.json() : null;
        return company;

    } catch (err) {
        console.error('Error fetching company data:', err);
        return null;
    }
}

// Fetch datos empresa por ID (para operatoradores)
companyServices.getCompanyById = async (companyId) => {
  try {
    const token = await getAccessToken();

    const response = await fetch(`${BACKEND_URL}/api/v1/companies/${companyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Empresa no encontrada');
    }

    const company = response.status !== 204 ? await response.json() : null;
    return company;

  } catch (err) {
    console.error('Error fetching company by ID:', err);
    return null;
  }
};

// Actualiza los datos de contacto de la empresa del usuario
companyServices.updateCompanyContact = async (contactData) => {
    try {
        const token = await getAccessToken();

        const response = await fetch(`${BACKEND_URL}/api/v1/companies/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(contactData) // { contact_email, contact_phone }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail?.[0]?.msg || 'Error actualizando datos de empresa');
        }

        const updatedCompany = await response.json();
        return updatedCompany;

    } catch (err) {
        console.error('Error updating company contact:', err);
        return null;
    }
}

export default companyServices;
