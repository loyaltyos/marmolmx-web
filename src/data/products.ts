export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  slug: string;
  longDescription: string;
  specifications: string[];
  applications: string[];
  benefits: string[];
};

export const products: Product[] = [
  {
    id: 100,
    name: "Compra mínima de prueba",
    category: "Prueba",
    price: 100,
    description:
      "Producto temporal para validar pagos en producción Openpay.",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80&sat=-35",
    slug: "compra-minima-de-prueba",
    longDescription:
      "Producto temporal para validar pagos en producción Openpay sin modificar el flujo normal de compra, carrito, creación de órdenes ni procesamiento seguro con Openpay.",
    specifications: [
      "Producto temporal de validación",
      "Precio fijo de prueba",
      "Pago procesado por Openpay",
      "Disponible para checkout estándar",
    ],
    applications: [
      "Validación de pago en producción",
      "Prueba operativa de checkout",
      "Confirmación de 3D Secure",
    ],
    benefits: [
      "Monto mínimo controlado",
      "Flujo de carrito normal",
      "Validación sin exponer credenciales",
    ],
  },
  {
    id: 1,
    name: "Mármol Carrara Premium",
    category: "Mármol",
    price: 2990,
    description:
      "Placa premium para cubiertas, muros decorativos y acabados interiores de alto nivel.",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
    slug: "marmol-carrara-premium",
    longDescription:
      "Una selección de mármol Carrara pensada para proyectos que buscan luminosidad, sobriedad y una presencia arquitectónica atemporal. Su veta suave funciona especialmente bien en interiores residenciales y comerciales de alto nivel.",
    specifications: ["Piedra natural seleccionada", "Acabado pulido", "Venta por placa", "Cotización final según medidas"],
    applications: ["Cubiertas de cocina", "Muros decorativos", "Baños", "Mobiliario a medida"],
    benefits: ["Estética atemporal", "Aporta luminosidad", "Cada placa es única"],
  },
  {
    id: 2,
    name: "Mármol Travertino Beige",
    category: "Mármol",
    price: 2690,
    description:
      "Material elegante para pisos, muros y detalles arquitectonicos.",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
    slug: "marmol-travertino-beige",
    longDescription:
      "Travertino de tono beige cálido para crear superficies elegantes y serenas. Su textura mineral aporta carácter natural a espacios interiores, circulaciones y detalles arquitectónicos.",
    specifications: ["Piedra natural", "Tono beige", "Acabado adaptable al proyecto", "Cotización según formato"],
    applications: ["Pisos interiores", "Muros", "Vestíbulos", "Detalles arquitectónicos"],
    benefits: ["Calidez visual", "Versatilidad de aplicación", "Presencia natural"],
  },
  {
    id: 3,
    name: "Cubierta de Cocina Premium",
    category: "Cubiertas",
    price: 8990,
    description:
      "Cubierta fabricada a medida para cocinas residenciales y proyectos premium.",
    image:
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=900&q=80",
    slug: "cubierta-cocina-premium",
    longDescription:
      "Cubierta fabricada a medida para cocinas que requieren una superficie durable y una ejecución precisa. El material y los cantos se seleccionan de acuerdo con el estilo y uso del proyecto.",
    specifications: ["Fabricación a medida", "Selección de material", "Preparación para instalaciones", "Precio base estimado"],
    applications: ["Cocinas residenciales", "Cocinas integrales", "Islas", "Barras de servicio"],
    benefits: ["Ajuste preciso", "Superficie funcional", "Acabado de alto nivel"],
  },
  {
    id: 4,
    name: "Piso de Mármol Pulido",
    category: "Pisos",
    price: 1490,
    description:
      "Acabado resistente y elegante para interiores residenciales o comerciales.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    slug: "piso-marmol-pulido",
    longDescription:
      "Piso de mármol con acabado pulido para interiores que buscan una superficie resistente, luminosa y visualmente continua. Se especifica según tránsito, área y modulación requerida.",
    specifications: ["Acabado pulido", "Uso interior", "Formatos variables", "Precio estimado por unidad"],
    applications: ["Residencias", "Locales comerciales", "Recepciones", "Áreas sociales"],
    benefits: ["Fácil mantenimiento", "Alta presencia visual", "Durabilidad"],
  },
  {
    id: 5,
    name: "Granito Negro San Gabriel",
    category: "Granito",
    price: 1990,
    description:
      "Granito oscuro ideal para cubiertas, barras y superficies de alto uso.",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
    slug: "granito-negro-san-gabriel",
    longDescription:
      "Granito oscuro de gran resistencia para superficies sometidas a uso frecuente. Su apariencia sobria lo convierte en una opción confiable para cocinas, barras y proyectos comerciales.",
    specifications: ["Granito natural", "Tono negro", "Alta resistencia", "Acabado pulido"],
    applications: ["Cubiertas", "Barras", "Cocinas", "Superficies comerciales"],
    benefits: ["Resistencia al uso", "Estética sobria", "Mantenimiento práctico"],
  },
  {
    id: 6,
    name: "Granito Gris Oxford",
    category: "Granito",
    price: 1790,
    description:
      "Superficie resistente con estetica moderna para proyectos contemporaneos.",
    image:
      "https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=900&q=80",
    slug: "granito-gris-oxford",
    longDescription:
      "Superficie de granito gris con una estética equilibrada para interiores contemporáneos. Combina resistencia y neutralidad visual para integrarse con distintas paletas de proyecto.",
    specifications: ["Granito natural", "Tono gris", "Superficie resistente", "Acabado pulido"],
    applications: ["Cocinas", "Barras", "Baños", "Mobiliario fijo"],
    benefits: ["Fácil integración", "Alta resistencia", "Apariencia contemporánea"],
  },
  {
    id: 7,
    name: "Lavabo de Mármol Artesanal",
    category: "Baños",
    price: 4990,
    description:
      "Pieza artesanal para banos premium y proyectos de diseno interior.",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80",
    slug: "lavabo-marmol-artesanal",
    longDescription:
      "Lavabo artesanal tallado en piedra para baños con una intención distintiva. Cada pieza se trabaja como un elemento de diseño y puede variar ligeramente por la naturaleza del material.",
    specifications: ["Pieza artesanal", "Piedra natural", "Variación propia del material", "Cotización por pieza"],
    applications: ["Baños residenciales", "Hospitalidad", "Restaurantes", "Proyectos de interiorismo"],
    benefits: ["Pieza única", "Carácter artesanal", "Alto valor visual"],
  },
  {
    id: 8,
    name: "Escalón de Mármol a Medida",
    category: "Escaleras",
    price: 1290,
    description:
      "Escalon personalizado para residencias, edificios y espacios comerciales.",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
    slug: "escalon-marmol-medida",
    longDescription:
      "Escalón de mármol fabricado conforme a las dimensiones y necesidades de cada obra. Permite resolver escaleras interiores o comerciales con continuidad material y una terminación cuidada.",
    specifications: ["Fabricación a medida", "Piedra natural", "Cantos según proyecto", "Precio base estimado"],
    applications: ["Residencias", "Edificios", "Escaleras interiores", "Espacios comerciales"],
    benefits: ["Adaptación al proyecto", "Continuidad visual", "Durabilidad"],
  },
  {
    id: 9,
    name: "Piedra Natural para Fachada",
    category: "Fachadas",
    price: 1390,
    description:
      "Recubrimiento exterior para fachadas modernas y proyectos arquitectonicos.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80",
    slug: "piedra-natural-fachada",
    longDescription:
      "Recubrimiento de piedra natural para fachadas que requieren presencia, textura y resistencia exterior. La selección se define según lenguaje arquitectónico, superficie y condiciones de la obra.",
    specifications: ["Uso exterior", "Piedra natural", "Formatos variables", "Cotización según superficie"],
    applications: ["Fachadas residenciales", "Accesos", "Muros exteriores", "Locales comerciales"],
    benefits: ["Resistencia exterior", "Textura auténtica", "Mejora la presencia del inmueble"],
  },
  {
    id: 10,
    name: "Cuarzo Blanco Premium",
    category: "Cuarzo",
    price: 2490,
    description:
      "Material elegante y resistente para cocinas, banos y superficies premium.",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80",
    slug: "cuarzo-blanco-premium",
    longDescription:
      "Cuarzo blanco de estética limpia para proyectos que buscan una superficie uniforme, elegante y práctica. Es una solución especialmente adecuada para cocinas y baños contemporáneos.",
    specifications: ["Superficie de cuarzo", "Tono blanco", "Acabado uniforme", "Cotización según medidas"],
    applications: ["Cocinas", "Baños", "Islas", "Cubiertas de trabajo"],
    benefits: ["Apariencia uniforme", "Fácil mantenimiento", "Estética luminosa"],
  },
  {
    id: 11,
    name: "Ónix Iluminado Premium",
    category: "Onix",
    price: 4990,
    description:
      "Acabado decorativo exclusivo para muros, barras y espacios de alto impacto.",
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80",
    slug: "onix-iluminado-premium",
    longDescription:
      "Ónix decorativo pensado para integrarse con iluminación posterior y convertirse en un punto focal. Su veta translúcida crea una presencia singular en espacios comerciales y residenciales.",
    specifications: ["Piedra translúcida", "Compatible con retroiluminación", "Selección por placa", "Instalación especializada"],
    applications: ["Barras", "Recepciones", "Muros focales", "Espacios de hospitalidad"],
    benefits: ["Impacto visual", "Material exclusivo", "Iluminación ambiental"],
  },
  {
    id: 12,
    name: "Recubrimiento Decorativo Premium",
    category: "Recubrimientos",
    price: 1790,
    description:
      "Solucion decorativa para interiores, muros principales y proyectos comerciales.",
    image:
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=900&q=80",
    slug: "recubrimiento-decorativo-premium",
    longDescription:
      "Solución decorativa para transformar muros interiores y superficies principales con una composición más cuidada. Se adapta a proyectos comerciales, residenciales y corporativos.",
    specifications: ["Uso interior", "Selección según proyecto", "Formatos variables", "Precio base estimado"],
    applications: ["Muros principales", "Recepciones", "Locales comerciales", "Interiores residenciales"],
    benefits: ["Renueva espacios", "Aplicación versátil", "Acabado profesional"],
  },
];

export const productCategories = [
  "Todos",
  ...Array.from(new Set(products.map((product) => product.category))),
];
