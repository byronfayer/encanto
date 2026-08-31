import { useMemo, useState, useEffect } from "react";
import { CATEGORIES, PRODUCTS } from "../products";
import { waLink } from "../site.config";

const PRICE_RANGES = [
  { id: "all", label: "Todos los precios" },
  { id: "0-20000", label: "Hasta $20.000" },
  { id: "20000-40000", label: "$20.000 – $40.000" },
  { id: "40000-99999999", label: "Más de $40.000" },
];

const currency = (n) =>
  n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export default function Catalog({ activeCategory, setActiveCategory }) {
  const [query, setQuery] = useState("");
  const [size, setSize] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  useEffect(() => {
    if (activeCategory) {
      document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeCategory]);

  const allSizes = useMemo(
    () => Array.from(new Set(PRODUCTS.flatMap((p) => p.sizes))).sort(),
    []
  );

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (activeCategory && p.category !== activeCategory) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (size !== "all" && !p.sizes.includes(size)) return false;
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number);
        if (p.price < min || p.price > max) return false;
      }
      return true;
    });
  }, [activeCategory, query, size, priceRange]);

  return (
    <section id="catalogo" className="catalog">
      <div className="container">
        <div className="section-head">
          <h2>Catálogo</h2>
          <p>Cada prenda, a un mensaje de distancia. Consultá disponibilidad y coordinamos todo por WhatsApp.</p>
        </div>

        <div className="catalog-toolbar">
          <div className="catalog-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
              <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Buscar prenda..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar producto"
            />
          </div>

          <div className="catalog-selects">
            <select value={size} onChange={(e) => setSize(e.target.value)} aria-label="Filtrar por talle">
              <option value="all">Todos los talles</option>
              {allSizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              aria-label="Filtrar por precio"
            >
              {PRICE_RANGES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="catalog-chips">
          <button
            className={`chip ${!activeCategory ? "is-active" : ""}`}
            onClick={() => setActiveCategory(null)}
          >
            Todas
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`chip ${activeCategory === c.id ? "is-active" : ""}`}
              onClick={() => setActiveCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="catalog-empty">No encontramos prendas con esos filtros. Probá ajustarlos.</p>
        ) : (
          <div className="catalog-grid">
            {filtered.map((p) => (
              <article className="product-card" key={p.id}>
                <div className="product-image">
                  <img src={p.image} alt={p.name} loading="lazy" />
                  <span className={`status-badge ${p.status}`}>
                    {p.status === "disponible" ? "Disponible" : "Agotado"}
                  </span>
                </div>

                <div className="product-info">
                  <h3>{p.name}</h3>
                  <p className="product-price">{currency(p.price)}</p>

                  <div className="product-meta">
                    <span>Talles: {p.sizes.join(" / ")}</span>
                    <span>Colores: {p.colors.join(", ")}</span>
                  </div>

                  <div className="product-actions">
                    <a
                      className="btn btn-primary btn-sm"
                      href={waLink(`Hola! Me interesa "${p.name}", ¿me contás disponibilidad?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Consultar
                    </a>
                    <a
                      className="btn btn-whatsapp btn-sm"
                      href={waLink(`Hola! Quiero comprar "${p.name}".`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Comprar ${p.name} por WhatsApp`}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.6 14.3c-.2.6-1.3 1.2-1.9 1.3-.5.1-1.1.1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.7-1.2-4.5-3.9-4.6-4.1-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.4.2.5.7 1.8.8 1.9.1.2.1.3 0 .5-.1.2-.1.3-.3.5l-.4.5c-.1.2-.3.3-.1.6.2.3.9 1.4 1.9 2.3 1.3 1.2 2.4 1.5 2.7 1.7.3.2.5.1.7-.1l.6-.7c.2-.3.4-.2.7-.1.3.1 1.7.8 2 .9.3.1.5.2.6.3.1.2.1.7-.1 1.3Z"/>
                      </svg>
                      Comprar
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
