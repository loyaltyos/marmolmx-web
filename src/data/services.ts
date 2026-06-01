import {
  Building2,
  DraftingCompass,
  Gem,
  Hammer,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    title: "Construccion Integral",
    description:
      "Desarrollo y ejecucion de proyectos residenciales, comerciales e industriales desde la planeacion hasta la entrega.",
    icon: Building2,
  },
  {
    title: "Remodelaciones",
    description:
      "Renovacion de interiores, exteriores, cocinas, banos, locales comerciales y espacios corporativos.",
    icon: Hammer,
  },
  {
    title: "Acabados Premium",
    description:
      "Instalacion y suministro de marmol, granito, cuarzo, piedra natural y materiales de alta calidad.",
    icon: Gem,
  },
  {
    title: "Proyectos Personalizados",
    description:
      "Asesoria, diseno, planeacion y ejecucion adaptada a las necesidades de cada cliente.",
    icon: DraftingCompass,
  },
];
