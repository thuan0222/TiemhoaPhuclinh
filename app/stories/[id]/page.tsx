import StoryDetailClient from "./StoryDetailClient";

export const dynamicParams = false;

export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }];
}

export default function Page({ params }: { params: { id: string } }) {
  return <StoryDetailClient id={params.id} />;
}
