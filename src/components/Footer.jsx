import { SITE, waLink } from "../site.config";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <p className="footer-logo">{SITE.brand}</p>
          <p>Prendas seleccionadas para vos.</p>
        </div>

        <nav className="footer-links" aria-label="Enlaces del pie de página">
          <a href="#inicio">Inicio</a>
          <a href="#catalogo">Catálogo</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#contacto">Contacto</a>
        </nav>

        <div className="footer-social">
          <a href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href={waLink("Hola! Quería hacer una consulta.")} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} {SITE.brand}. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
