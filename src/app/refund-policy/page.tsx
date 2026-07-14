import { LegalLayout } from "@/components/legal/LegalLayout";

export default function RefundPolicyPage() {
  return (
    <LegalLayout title="Refund & Return Policy" updatedAt="July 2026">
      <section>
        <h2>Overview</h2>
        <p>
          We want you to be happy with your purchase. If something isn&apos;t right, this policy
          explains how returns, exchanges, and refunds work.
        </p>
      </section>

      <section>
        <h2>Eligibility for Returns</h2>
        <ul>
          <li>Items must be returned within 14 days of delivery.</li>
          <li>Shoes must be unworn, in their original packaging, with tags attached.</li>
          <li>Proof of purchase (your order number) is required.</li>
        </ul>
      </section>

      <section>
        <h2>Non-Returnable Items</h2>
        <p>
          Items marked as final sale, or shoes that show signs of wear outside of trying them on
          indoors, are not eligible for return.
        </p>
      </section>

      <section>
        <h2>How to Start a Return</h2>
        <p>
          Email us at{" "}
          <a href="mailto:support@stride-shoes.com" className="font-medium text-zinc-900 underline">
            support@stride-shoes.com
          </a>{" "}
          with your order number and the reason for the return. We&apos;ll confirm eligibility and
          provide instructions for sending the item back.
        </p>
      </section>

      <section>
        <h2>Refunds</h2>
        <p>
          Once we receive and inspect the returned item, we&apos;ll process your refund to the
          original payment method via Paystack. Refunds typically appear within 5–10 business days,
          depending on your bank.
        </p>
      </section>

      <section>
        <h2>Exchanges</h2>
        <p>
          Need a different size instead? Let us know when you request your return and we&apos;ll
          arrange an exchange where stock allows, rather than a refund.
        </p>
      </section>

      <section>
        <h2>Damaged or Incorrect Items</h2>
        <p>
          If an item arrives damaged, defective, or different from what you ordered, contact us
          within 48 hours of delivery with photos of the item. We&apos;ll cover the cost of return
          shipping in these cases and prioritize a replacement or full refund.
        </p>
      </section>

      <section>
        <h2>Return Shipping Costs</h2>
        <p>
          Unless the return is due to our error (damaged, defective, or incorrect item), the cost
          of return shipping is the customer&apos;s responsibility.
        </p>
      </section>
    </LegalLayout>
  );
}
