import { fetchApi } from "@/lib/utils";
import ProductContent from "./ProductContent";

export async function generateMetadata({ params }) {
  const { slug } = params;
  let title = "Product Details | Being Genuine Nutrition";
  let description =
    "Premium quality fitness supplements with lab-tested ingredients for maximum effectiveness. Enjoy a free scratch card with all orders above ₹999.";
  let image = null;

  try {
    // Fetch product details from API
    const response = await fetchApi(`/public/products/${slug}`);
    const product = response.data.product;

    if (product) {
      title = product.metaTitle || `${product.name} | Being Genuine Nutrition`;
      description =
        product.metaDescription || product.description || description;

      // Get the product image
      if (product.image) {
        image = product.image;
      }
    }
  } catch (error) {
    console.error("Error fetching product metadata:", error);
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : [],
      type: "website",
    },
  };
}

export default function ProductDetailPage({ params }) {
  return <ProductContent slug={params.slug} />;
}
