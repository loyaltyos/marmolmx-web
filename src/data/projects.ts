export type Project = {
  name: string;
  type: string;
  description: string;
  image: string;
};

export const projects: Project[] = [
  {
    name: "Residencia Moderna",
    type: "Construccion residencial",
    description:
      "Ejecucion integral con volumetria limpia, materiales durables y acabados de alta especificacion.",
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Remodelacion de Cocina Premium",
    type: "Remodelacion interior",
    description:
      "Rediseno de cocina con cubierta a medida, iluminacion tecnica y superficies de uso intensivo.",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Bano de Lujo",
    type: "Acabados premium",
    description:
      "Intervencion de bano residencial con piedra natural, canceleria y detalles de carpinteria fina.",
    image:
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Fachada Comercial",
    type: "Proyecto comercial",
    description:
      "Renovacion de fachada con recubrimientos resistentes y una presencia corporativa sobria.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Piso Residencial en Marmol",
    type: "Instalacion especializada",
    description:
      "Suministro e instalacion de piso pulido para areas sociales con alto transito y gran luminosidad.",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Local Comercial Remodelado",
    type: "Remodelacion comercial",
    description:
      "Adecuacion de local con circulaciones eficientes, acabados resistentes y entrega lista para operar.",
    image:
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=900&q=80",
  },
];
