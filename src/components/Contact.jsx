import { SITE, waLink } from "../site.config";

export default function Contact() {
  return (
    <section id="contacto" className="contact">
      <div className="container contact-inner">
        <div className="section-head">
          <p className="eyebrow-plain">Contacto</p>
          <h2>¿Hablamos?</h2>
          <p>Contanos qué buscás y te ayudamos a encontrar tu prenda ideal.</p>
        </div>

        <div className="contact-grid">
          <a
            className="contact-card"
            href={waLink("Hola! Quería hacer una consulta.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="contact-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.6 14.3c-.2.6-1.3 1.2-1.9 1.3-.5.1-1.1.1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.7-1.2-4.5-3.9-4.6-4.1-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.4.2.5.7 1.8.8 1.9.1.2.1.3 0 .5-.1.2-.1.3-.3.5l-.4.5c-.1.2-.3.3-.1.6.2.3.9 1.4 1.9 2.3 1.3 1.2 2.4 1.5 2.7 1.7.3.2.5.1.7-.1l.6-.7c.2-.3.4-.2.7-.1.3.1 1.7.8 2 .9.3.1.5.2.6.3.1.2.1.7-.1 1.3Z"/>
              </svg>
            </span>
            <h3>WhatsApp</h3>
            <p>Respuesta rápida para consultas y pedidos.</p>
          </a>

          <a
            className="contact-card"
            href={SITE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="contact-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
              </svg>
            </span>
            <h3>Instagram</h3>
            <p>{SITE.instagramHandle}</p>
          </a>

          <div className="contact-card contact-card-static">
            <span className="contact-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 21s-7-6.1-7-11.4A7 7 0 0 1 19 9.6C19 14.9 12 21 12 21Z" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </span>
            <h3>Ubicación</h3>
            <p>{SITE.location}</p>
          </div>

          <div className="contact-card contact-card-static">
            <span className="contact-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <h3>Horarios</h3>
            <p>{SITE.hours}</p>
          </div>
        </div>

        <a
          className="btn btn-primary contact-cta"
          href={waLink("Hola! Quería hacer una consulta.")}
          target="_blank"
          rel="noopener noreferrer"
        >
          Hacer una consulta
        </a>
      </div>
    </section>
  );
}
