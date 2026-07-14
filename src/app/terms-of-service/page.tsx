import { LegalLayout } from "@/components/legal/LegalLayout";

export default function TermsOfServicePage() {
  return (
    <LegalLayout title="Terms of Service" updatedAt="July 2026">
      <section>
        <h2>Acceptance of Terms</h2>
        <p>
          By accessing or using this website, you agree to be bound by these Terms of Service. If
          you do not agree, please do not use the site.
        </p>
      </section>

      <section>
        <h2>Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account password and for
          all activity under your account. You must provide accurate information when registering
          and placing an order.
        </p>
      </section>

      <section>
        <h2>Orders and Payment</h2>
        <ul>
          <li>All prices are listed in Nigerian Naira (NGN) and include applicable taxes unless stated otherwise.</li>
          <li>Payment is processed securely by Paystack at checkout. An order is only confirmed once payment has been verified.</li>
          <li>We reserve the right to refuse or cancel an order at our discretion, for example in cases of suspected fraud or a pricing/stock error, in which case any payment taken will be refunded in full.</li>
        </ul>
      </section>

      <section>
        <h2>Pricing and Availability</h2>
        <p>
          We make reasonable efforts to display accurate pricing and stock levels, but errors can
          occur. If a stock or pricing error is discovered after you place an order, we will
          contact you before proceeding.
        </p>
      </section>

      <section>
        <h2>Shipping</h2>
        <p>
          Estimated delivery times are provided at checkout and are not guaranteed. Risk of loss
          passes to you upon delivery to the shipping address provided.
        </p>
      </section>

      <section>
        <h2>Returns and Refunds</h2>
        <p>
          Returns, exchanges, and refunds are handled according to our{" "}
          <a href="/refund-policy" className="font-medium text-zinc-900 underline">
            Refund Policy
          </a>
          .
        </p>
      </section>

      <section>
        <h2>Intellectual Property</h2>
        <p>
          All content on this site — including text, images, and the STRIDE name and logo — is our
          property or used under license, and may not be reproduced without permission.
        </p>
      </section>

      <section>
        <h2>Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, STRIDE is not liable for any indirect,
          incidental, or consequential damages arising from your use of the site or products
          purchased through it. Nothing in these terms limits any liability that cannot be limited
          under applicable law, including consumer protection law.
        </p>
      </section>

      <section>
        <h2>Governing Law</h2>
        <p>
          These terms are governed by the laws of the Federal Republic of Nigeria, without regard
          to conflict-of-law principles.
        </p>
      </section>

      <section>
        <h2>Changes to These Terms</h2>
        <p>
          We may revise these terms from time to time. Continued use of the site after changes are
          posted constitutes acceptance of the revised terms.
        </p>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>
          If you have questions about these terms, email us at{" "}
          <a href="mailto:support@stride-shoes.com" className="font-medium text-zinc-900 underline">
            support@stride-shoes.com
          </a>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
