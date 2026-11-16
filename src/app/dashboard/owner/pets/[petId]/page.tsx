import { Suspense } from "react";
import PetHealthHubContent from "./PetHealthHubContent";

export function generateStaticParams() {
  return [
    { petId: "pet-1" },
    { petId: "pet-2" },
  ];
}

interface PageProps {
  params: Promise<{ petId: string }>;
}

export default async function PetHealthPage({ params }: PageProps) {
  const { petId } = await params;

  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm text-[#06395F]">
          <div className="w-8 h-8 mx-auto border-2 border-[#0D8BE0] border-t-transparent rounded-full animate-spin mb-2" />
          <span>Loading pet health hub...</span>
        </div>
      }
    >
      <PetHealthHubContent petId={petId} />
    </Suspense>
  );
}
