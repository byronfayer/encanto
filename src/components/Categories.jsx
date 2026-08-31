import { CATEGORIES } from "../products";
import remeras from "../assets/photos/cat-remeras.jpg";
import vestidos from "../assets/photos/cat-vestidos.jpg";
import conjuntos from "../assets/photos/cat-conjuntos.jpg";
import pantalones from "../assets/photos/cat-pantalones.jpg";
import tops from "../assets/photos/cat-tops.jpg";
import accesorios from "../assets/photos/cat-accesorios.jpg";

const CATEGORY_IMAGES = {
  remeras,
  vestidos,
  conjuntos,
  pantalones,
  tops,
  accesorios,
};

export default function Categories({ onSelect }) {
  return (
    <section className="categories" aria-label="Categorías">
      <div className="container">
        <div className="section-head">
          <h2>Explorá por categoría</h2>
          <p>Encontrá justo lo que buscás, de tu prenda favorita a un accesorio nuevo.</p>
        </div>

        <div className="categories-grid">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.id}
              className="category-card"
              onClick={() => onSelect(c.id)}
              style={{ "--seed": i }}
            >
              <img
                src={CATEGORY_IMAGES[c.id] || `https://picsum.photos/seed/cat-${c.id}/400/500`}
                alt={c.label}
                loading="lazy"
              />
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
