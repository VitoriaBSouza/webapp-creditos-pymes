import HeroSection from "../features/HeroSection/HeroSection";
import LoanAmount from "../features/LoanAmount/LoanAmount";
import Comments from "../components/Comments/Comments";

const HomePage = () => {
  return (
    <div className="container-fluid bg-light">
      <div className="row">
        <div className="col-12 p-0">
          <HeroSection /> 
        </div>
      </div>
      <div className="row">
        <div className="col-12 p-0 m-0">
          <LoanAmount /> 
        </div>
      </div>
      {/* Sección de reseñas */}
      <div className="row justify-content-center m-0 px-4 py-5">
          <h5 className="my-4 fw-bold">Opinión de nuestros clientes</h5>
          <div className="col-4 m-0">
            <Comments 
              rating={5}
              title="Excelente servicio"
              body="Me ayudaron con mi crédito rápido y fácil."
              reviewer="Juan Pérez"
              date="Septiembre 2023"
              avatar="https://i.pravatar.cc/40?img=1"
            />
          </div>
          <div className="col-4 m-0">
            <Comments 
              rating={4}
              title="Muy recomendable"
              body="Transparencia y buena atención al cliente."
              reviewer="María Gómez"
              date="Octubre 2023"
              avatar="https://i.pravatar.cc/40?img=2"
            />
          </div>
          <div className="col-4 m-0">
            <Comments 
              rating={5}
              title="Fácil y rápido"
              body="Pude gestionar todo online sin problemas."
              reviewer="Carlos López"
              date="Agosto 2023"
              avatar="https://i.pravatar.cc/40?img=3"
            />
          </div>
        </div>
    </div>
  );
};

export default HomePage;
