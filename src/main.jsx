import React from 'react'
import ReactDOM from 'react-dom/client'
import "./styles/index.css";
import { RouterProvider } from "react-router-dom";
import { AppRoutes } from './routes/AppRoutes';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Main = () => {

  if (! import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL == "") return (
    <React.StrictMode>
      <div className="container mt-5">
        <div className="alert alert-danger text-center" role="alert">
          <h4 className="alert-heading">Error de configuración</h4>
          <p>La variable de entorno <strong>VITE_BACKEND_URL</strong> no está definida. Por favor, configurela para continuar.</p>
        </div>
      </div>
    </React.StrictMode>
  );
  return (
    <React.StrictMode>
      {/* Set up routing for the application */}
        <RouterProvider router={AppRoutes} />
       <ToastContainer position="top-right" autoClose={6000} />
    </React.StrictMode>
  );
}

// Render the Main component into the root DOM element.
ReactDOM.createRoot(document.getElementById('root')).render(<Main />)
