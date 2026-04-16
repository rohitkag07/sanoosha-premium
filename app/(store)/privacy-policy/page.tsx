import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Sanoosha Premium',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 max-w-[800px] py-16">
      <h1 className="font-serif text-4xl font-semibold text-charcoal mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-brand mb-10">Last updated: April 2026</p>

      <div className="space-y-10 text-gray-brand leading-8">

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">1. Who We Are</h2>
          <p>
            Sanoosha Premium (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is an e-commerce brand selling authentic
            Rudraksha beads, crystal bracelets, and spiritual jewellery sourced from Nepal.
            Our website is <strong>sanoosha-premium.vercel.app</strong> (and associated domains).
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Account information:</strong> Name, email address, and password when you register.</li>
            <li><strong>Order information:</strong> Shipping address, phone number, and purchase history.</li>
            <li><strong>Payment information:</strong> We do not store card or UPI details. Payments are processed securely by Razorpay.</li>
            <li><strong>Usage data:</strong> Pages visited, browser type, device info, and IP address collected automatically.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To process and fulfil your orders.</li>
            <li>To send order confirmations and shipping updates via email.</li>
            <li>To respond to your customer service inquiries.</li>
            <li>To improve our website and product offerings.</li>
            <li>To send promotional emails (you can unsubscribe at any time).</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">4. Sharing Your Information</h2>
          <p>
            We do not sell or rent your personal information. We share data only with:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li><strong>Razorpay</strong> — for secure payment processing.</li>
            <li><strong>Shipping partners</strong> — to deliver your orders (name, address, phone).</li>
            <li><strong>Supabase</strong> — our database provider, for storing account and order data securely.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">5. Cookies</h2>
          <p>
            We use essential cookies to keep you logged in and maintain your cart session.
            We do not use advertising or tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">6. Data Security</h2>
          <p>
            Your data is stored on secure, encrypted servers. We use industry-standard SSL encryption
            for all data transmitted between your browser and our servers. Access to personal data
            is restricted to authorised personnel only.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your account and data.</li>
            <li>Opt out of marketing emails at any time.</li>
          </ul>
          <p className="mt-3">
            To exercise these rights, email us at <strong>support@sanoosha.com</strong>.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page
            with an updated &ldquo;last updated&rdquo; date. Continued use of the site after changes
            constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">9. Contact Us</h2>
          <p>
            For any privacy-related queries, contact us at:<br />
            <strong>Email:</strong> support@sanoosha.com<br />
            <strong>Website:</strong> sanoosha-premium.vercel.app
          </p>
        </section>

      </div>
    </div>
  )
}
