import aboutImg from "../assets/photos/extra-conjunto-bikini.jpg";

export default function About() {
  return (
    <section id="nosotros" className="about">
      <div className="container about-inner">
        <div className="about-image">
          <img src={aboutImg} alt="Prenda Encanto en detalle" />
        </div>

        <div className="about-copy">
          <p className="eyebrow-plain">Sobre Encanto</p>
          <h2>Ropa elegida con cariño, para que la sientas tuya</h2>
          <p>
            En Encanto elegimos cada prenda pensando en vos: en cómo te queda,
            en cómo la usás y en cómo te hace sentir. Nos gusta acompañarte de
            cerca en cada consulta, para que comprar sea simple, cómodo y con
            confianza.
          </p>
          <p>
            Trabajamos de forma cercana y personalizada: escribinos, contanos
            qué buscás y te ayudamos a encontrarlo.
          </p>
        </div>
      </div>
    </section>
  );
}
