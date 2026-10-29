export default function ValueBanner() {
  return (
    <section className="value-banner">
      <div className="container value-banner-inner">
        <div className="value-stat">
          <span className="value-stat-number">100+</span>
          <span className="value-stat-label">Prendas seleccionadas</span>
        </div>
        <div className="value-divider" />
        <div className="value-stat">
          <span className="value-stat-number">Córdoba</span>
          <span className="value-stat-label">Envíos a toda la ciudad</span>
        </div>
        <div className="value-divider" />
        <div className="value-stat">
          <span className="value-stat-number">1:1</span>
          <span className="value-stat-label">Atención personalizada</span>
        </div>
        <p className="value-quote">Cada prenda fue elegida pensando en vos</p>
      </div>
    </section>
  );
}
