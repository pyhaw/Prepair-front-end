import { Suspense } from "react";
import RequestDetails from "@/components/Request/RequestDetails";

export default function RequestDetailsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-600">Loading request details...</div>}>
      <RequestDetails />
    </Suspense>
  );
}
