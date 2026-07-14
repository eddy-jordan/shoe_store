import { Suspense } from "react";
import { CheckoutCallback } from "@/components/checkout/CheckoutCallback";

export default function CheckoutCallbackPage() {
  return (
    <Suspense>
      <CheckoutCallback />
    </Suspense>
  );
}
