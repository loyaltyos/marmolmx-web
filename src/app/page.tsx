import { HomePage } from "@/components/HomePage";
import {
  BUSINESS_LOCATION,
  CONTACT_PHONE,
  SERVICE_AREA,
  SITE_DESCRIPTION,
  SITE_URL,
} from "@/config/site";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: "MarmolMX",
    url: SITE_URL,
    telephone: CONTACT_PHONE,
    description: SITE_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Álvaro Obregón",
      addressRegion: "Ciudad de México",
      addressCountry: "MX",
    },
    location: {
      "@type": "Place",
      name: BUSINESS_LOCATION,
    },
    areaServed: {
      "@type": "Country",
      name: SERVICE_AREA,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePage />
    </>
  );
}
