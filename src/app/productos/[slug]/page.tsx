import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/ProductDetailPage";
import { SITE_DESCRIPTION, SITE_URL } from "@/config/site";
import { products } from "@/data/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((candidate) => candidate.slug === slug);

  if (!product) {
    return {
      title: "Producto no encontrado | MarmolMX",
      description: SITE_DESCRIPTION,
    };
  }

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `/productos/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | MarmolMX`,
      description: product.description,
      url: `${SITE_URL}/productos/${product.slug}`,
      images: [{ url: product.image, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | MarmolMX`,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((candidate) => candidate.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter((candidate) => candidate.id !== product.id)
    .sort((left, right) =>
      left.category === product.category
        ? -1
        : right.category === product.category
          ? 1
          : 0,
    )
    .slice(0, 3);

  return (
    <ProductDetailPage
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
