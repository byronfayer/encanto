// Reemplazá estos placeholders por los datos reales de Encanto.
export const SITE = {
  brand: "Encanto",
  tagline: "Indumentaria",
  whatsappNumber: "5493511234567", // sin espacios ni signos, con código de país
  instagramHandle: "@eencantoc_",
  instagramUrl: "https://www.instagram.com/eencantoc_/",
  location: "Córdoba Capital, Argentina",
  hours: "Lunes a sábados, 10 a 20 hs",
};

export function waLink(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${SITE.whatsappNumber}?text=${text}`;
}
