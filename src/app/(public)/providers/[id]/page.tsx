import { Suspense } from "react";
import ProviderProfileContent from "./ProviderProfileContent";

export function generateStaticParams() {
  return [
    { id: "carevet-dhanmondi" },
    { id: "paws-clinic-gulshan" },
    { id: "uttara-pet-wellness" },
    { id: "chittagong-pet-care" },
    { id: "dhanmondi-fluffy-groomers" },
    { id: "mirpur-central-vet" },
  ];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProviderProfilePage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-sky-50 text-sm text-[#06395F]">
          <div className="w-8 h-8 border-2 border-[#0D8BE0] border-t-transparent rounded-full animate-spin mb-2" />
        </div>
      }
    >
      <ProviderProfileContent id={id} />
    </Suspense>
  );
}
