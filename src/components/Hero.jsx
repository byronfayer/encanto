import heroImg from "../assets/photos/hero-vestido-rojo.jpg";

export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="eyebrow-plain">Nueva temporada</p>
          <h1>
            Vestite de <em>vos misma,</em>
            <br />
            todos los días.
          </h1>
          <p className="hero-sub">
            Prendas seleccionadas una por una para acompañar tu estilo: cómodas,
            femeninas y pensadas para durar en tu placard, no solo en una foto.
          </p>
          <div className="hero-ctas">
            <a href="#catalogo" className="btn btn-primary">
              Ver catálogo
            </a>
            <a href="#contacto" className="btn btn-ghost">
              Contactanos
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <img src={heroImg} alt="Vestido rojo de la colección Encanto" />
          <div className="hero-visual-tag">
            <span>Encanto</span>
            Calidad, estilo
            <br />y personalidad
          </div>
        </div>
      </div>
    </section>
  );
}
