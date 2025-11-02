import './HeroSection.css';
import Button from '@/components/Button/Button';

export default function HeroSection() {
  return (
    <div className="heroe text-center p-5">
      <div className="content">
        <h1 className="display-4">
          Soluciones financieras adaptadas a cada etapa de crecimiento
        </h1>

        <Button text="Iniciar Sesión" color="trird" size="md" action="loginUser" className="me-2"/>
        
        <Button text="Registrarse" color="secondary" size="md" action="register"> </Button>
      
      </div>
    </div>
  );
}

