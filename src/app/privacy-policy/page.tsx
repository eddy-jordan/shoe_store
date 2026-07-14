import { LegalLayout } from "@/components/legal/LegalLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" updatedAt="July 2026">
      <section>
        <h2>Introduction</h2>
        <p>
          This Privacy Policy explains how STRIDE (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;)
          collects, uses, and protects information when you use our website to browse or purchase
          shoes.
        </p>
      </section>

      <section>
        <h2>Information We Collect</h2>
        <ul>
          <li>Account details: name, email address, and password (stored as a hash, never in plain text).</li>
          <li>Order details: shipping address, phone number, and the items you purchase.</li>
          <li>Payment information: we never store your card details ourselves — payments are processed by Paystack, and we only receive a transaction reference and status.</li>
          <li>Usage data: pages visited and cart contents, stored locally in your browser (not on our servers) until you check out.</li>
        </ul>
      </section>

      <section>
        <h2>How We Use Your Information</h2>
        <ul>
          <li>To process and fulfil your orders, including shipping and customer support.</li>
          <li>To maintain your account and order history.</li>
          <li>To detect and prevent fraud or abuse of the platform.</li>
        </ul>
      </section>

      <section>
        <h2>Payment Processing</h2>
        <p>
          Payments are handled by Paystack. When you check out, you are redirected to Paystack&apos;s
          secure hosted payment page. We do not see or store your card number, expiry date, or CVV.
          Paystack&apos;s own privacy policy governs how they handle your payment details.
        </p>
      </section>

      <section>
        <h2>Cookies and Local Storage</h2>
        <p>
          We use your browser&apos;s local storage to keep track of your shopping cart between visits,
          and a session cookie to keep you signed in. We do not use third-party advertising or
          tracking cookies.
        </p>
      </section>

      <section>
        <h2>Data Sharing</h2>
        <p>
          We share order and shipping details with Paystack (to process payment) and do not sell
          or share your personal information with any other third party for marketing purposes.
        </p>
      </section>

      <section>
        <h2>Data Security</h2>
        <p>
          Passwords are hashed with bcrypt before storage. All traffic to and from the site is
          encrypted in transit (HTTPS). Access to the admin dashboard is restricted to accounts
          with an administrator role.
        </p>
      </section>

      <section>
        <h2>Your Rights</h2>
        <p>
          You may request a copy of the personal information we hold about you, or request that we
          delete your account and associated data, by contacting us using the details below.
          Deleting your account will not remove records we are legally required to retain, such as
          completed order and payment records.
        </p>
      </section>

      <section>
        <h2>Changes to This Policy</h2>
        <p>
          We may update this policy from time to time. Material changes will be reflected by
          updating the &quot;Last updated&quot; date above.
        </p>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>
          If you have questions about this policy or your data, email us at{" "}
          <a href="mailto:support@stride-shoes.com" className="font-medium text-zinc-900 underline">
            support@stride-shoes.com
          </a>
          .
        </p>
      </section>
    </LegalLayout>
  );
}
