import { useState, useEffect } from "react";
import { api } from "../lib/api";
import remeras from "../assets/photos/cat-remeras.jpg";
import vestidos from "../assets/photos/cat-vestidos.jpg";
import conjuntos from "../assets/photos/cat-conjuntos.jpg";
import pantalones from "../assets/photos/cat-pantalones.jpg";
import tops from "../assets/photos/cat-tops.jpg";
import accesorios from "../assets/photos/cat-accesorios.jpg";

const CATEGORY_IMAGES = { remeras, vestidos, conjuntos, pantalones, tops, accesorios };

export default function Categories({ onSelect }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.categories().then(setCategories).catch(() => {});
  }, []);

  return (
    <section className="categories" aria-label="Categorías">
      <div className="container">
        <div className="section-head">
          <h2>Explorá por categoría</h2>
          <p>Encontrá justo lo que buscás, de tu prenda favorita a un accesorio nuevo.</p>
        </div>

        <div className="categories-grid">
          {categories.map((c, i) => (
            <button
              key={c.id}
              className="category-card"
              onClick={() => onSelect(c.slug)}
              style={{ "--seed": i }}
            >
              <img
                src={c.image_url || CATEGORY_IMAGES[c.slug] || `https://picsum.photos/seed/cat-${c.slug}/400/500`}
                alt={c.name}
                loading="lazy"
              />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
