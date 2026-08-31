import { SITE } from "../site.config";
import avatar from "../assets/photos/ig/brand-icon-sq.jpg";
import ig1 from "../assets/photos/ig/ig-1.jpg";
import ig2 from "../assets/photos/ig/ig-2.jpg";
import ig3 from "../assets/photos/ig/ig-3.jpg";
import ig4 from "../assets/photos/ig/ig-4.jpg";
import ig5 from "../assets/photos/ig/ig-5.jpg";
import ig6 from "../assets/photos/ig/ig-6.jpg";

const GRID = [ig1, ig2, ig3, ig4, ig5, ig6];

export default function Instagram() {
  return (
    <section id="instagram" className="instagram">
      <div className="container">
        <div className="instagram-head">
          <div className="section-head">
            <div className="instagram-handle-row">
              <img className="instagram-avatar" src={avatar} alt={`Foto de perfil de ${SITE.instagramHandle}`} />
              <p className="eyebrow-plain">{SITE.instagramHandle}</p>
            </div>
            <h2>Seguinos en Instagram</h2>
            <p>Novedades, looks del día y lanzamientos, primero ahí.</p>
          </div>

          <a
            className="btn btn-primary"
            href={SITE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Seguinos en Instagram
          </a>
        </div>

        <div className="instagram-grid">
          {GRID.map((src, i) => (
            <a
              key={i}
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-item"
            >
              <img src={src} alt="Publicación de Encanto en Instagram" loading="lazy" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
