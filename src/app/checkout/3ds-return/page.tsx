import { Suspense } from "react";
import { Checkout3dsReturn } from "@/components/Checkout3dsReturn";

export default function Page() {
  return (
    <Suspense>
      <Checkout3dsReturn />
    </Suspense>
  );
}
