import ProductDetailClient from "./ProductDetailClient";

export const dynamicParams = false;

export async function generateStaticParams() {
  return [
    { id: "101" }, { id: "102" }, { id: "103" }, { id: "104" },
    { id: "201" }, { id: "202" }, { id: "203" }, { id: "204" },
    { id: "301" }, { id: "302" },
    { id: "401" },
    { id: "501" },
  ];
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailClient id={id} />;
}
