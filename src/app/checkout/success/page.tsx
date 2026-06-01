import { Suspense } from "react";
import { CheckoutSuccess } from "@/components/CheckoutSuccess";

export default function Page() {
  return (
    <Suspense>
      <CheckoutSuccess />
    </Suspense>
  );
}
