import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions — Sanoosha Premium',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 max-w-[800px] py-16">
      <h1 className="font-serif text-4xl font-semibold text-charcoal mb-2">Terms &amp; Conditions</h1>
      <p className="text-sm text-gray-brand mb-10">Last updated: April 2026</p>

      <div className="space-y-10 text-gray-brand leading-8">

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Sanoosha Premium website (&ldquo;Site&rdquo;), you agree to be
            bound by these Terms &amp; Conditions. If you do not agree, please do not use the Site.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">2. Products</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>All products are authentic and sourced directly from Nepal.</li>
            <li>Product images are representative; slight variations in natural stones and beads are normal.</li>
            <li>Prices are in Indian Rupees (INR) and inclusive of all applicable taxes unless stated otherwise.</li>
            <li>We reserve the right to change prices without prior notice.</li>
            <li>Product availability is subject to stock. We may cancel orders for out-of-stock items with a full refund.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">3. Orders & Payment</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>By placing an order, you confirm that you are 18 years of age or older.</li>
            <li>Order confirmation email will be sent after successful payment.</li>
            <li>Payments are processed by Razorpay. We do not store payment credentials.</li>
            <li>In case of payment failure, please check with your bank before retrying to avoid duplicate charges.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">4. Shipping</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>We ship across India. International shipping may be available on request.</li>
            <li>Standard delivery: 5–8 business days. Express delivery available at extra cost.</li>
            <li>Shipping charges (if any) are displayed at checkout before payment.</li>
            <li>We are not responsible for delays caused by courier partners, natural events, or customs.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">5. Intellectual Property</h2>
          <p>
            All content on this Site — including text, images, logos, and product descriptions —
            is the property of Sanoosha Premium and protected by copyright law.
            You may not reproduce, distribute, or use our content without prior written permission.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">6. Disclaimer</h2>
          <p>
            Spiritual and healing properties described for our products are based on traditional
            beliefs and are not scientifically proven. Our products are not a substitute for
            medical advice, diagnosis, or treatment. Always consult a qualified professional for
            health-related decisions.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">7. Limitation of Liability</h2>
          <p>
            Sanoosha Premium shall not be liable for any indirect, incidental, or consequential
            damages arising from the use of our products or website. Our maximum liability to any
            customer is limited to the amount paid for the specific order in question.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">8. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India. Any disputes shall be subject to the
            exclusive jurisdiction of courts in India.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Updated terms will be posted
            on this page. Continued use of the Site after changes constitutes your acceptance.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">10. Contact</h2>
          <p>
            For any questions regarding these Terms:<br />
            <strong>Email:</strong> support@sanoosha.com<br />
            <strong>Website:</strong> sanoosha-premium.vercel.app
          </p>
        </section>

      </div>
    </div>
  )
}
