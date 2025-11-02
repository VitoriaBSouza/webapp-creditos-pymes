import './Footer.css';
export default function Footer(){
    return (
        <footer className='footer footer_container'>
            <div className='ps-4'>
                <div>
                    <img src="/logo.svg" alt="Logo Fintech NC"/>
                </div>
                <div>
                    <a href=""><img src="/x.svg" alt="X"/></a>
                    <a href=""><img src="/instagram.svg" alt="Instagram"/></a>
                    <a href=""><img src="/youtube.svg" alt="Youtube"/></a>
                    <a href=""><img src="/linkedin.svg" alt="LinkedIn"/></a>
                </div>
            </div>
            <div className='d-flex justify-content-center'>
                <ul>
                    <li>
                        <a href="">Condiciones y Políticas</a>
                    </li>
                    <li>
                        <a href="">Términos y Condicione</a>
                    </li>
                    <li>
                        <a href="">Política de Privacida</a>
                    </li>
                    <li>
                        <a href="">Política de Cookies</a>
                    </li>
                </ul>
            </div>
            <div>
                <ul>
                    <li>
                        <a href="">Explore</a>
                    </li>
                    <li>
                        <a href="">Sobre Nosotros</a>
                    </li>
                    <li>
                        <a href="">Precios</a>
                    </li>
                    <li>
                        <a href="">Empresas</a>
                    </li>
                    <li>
                        <a href="">Partners</a>
                    </li>
                </ul>
            </div>
            <div>
                <ul>
                    <li>
                        <a href="">Recursos</a>
                    </li>
                    <li>
                        <a href="">Soporte</a>
                    </li>
                    <li>
                        <a href="">FAQ - Partners</a>
                    </li>
                    <li>
                        <a href="">FAQ - Empresas</a>
                    </li>
                </ul>
            </div>
        </footer>
    )
}