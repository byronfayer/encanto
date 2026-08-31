import { useEffect, useState } from "react";
import { SITE } from "../site.config";
import logo from "../assets/photos/logo-encanto.png";

const LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#catalogo", label: "Catálogo" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#instagram", label: "Instagram" },
  { href: "#contacto", label: "Contacto" },
];

export default function Navbar({ cartCount = 0 }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container navbar-inner">
        <a href="#inicio" className="navbar-brand">
          <img src={logo} alt={`${SITE.brand} ${SITE.tagline}`} className="navbar-logo" />
        </a>

        <nav className="navbar-links" aria-label="Navegación principal">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="navbar-actions">
          <button className="cart-btn" aria-label="Carrito">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="21" r="1.4" fill="currentColor" />
              <circle cx="18" cy="21" r="1.4" fill="currentColor" />
            </svg>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>

          <button
            className="navbar-burger"
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {open && (
        <nav className="navbar-mobile" aria-label="Navegación móvil">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
