import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund & Return Policy — Sanoosha Premium',
}

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 max-w-[800px] py-16">
      <h1 className="font-serif text-4xl font-semibold text-charcoal mb-2">Refund &amp; Return Policy</h1>
      <p className="text-sm text-gray-brand mb-10">Last updated: April 2026</p>

      <div className="space-y-10 text-gray-brand leading-8">

        <section className="rounded-3xl bg-gold/10 border border-gold/20 px-8 py-6">
          <p className="text-charcoal font-medium">
            At Sanoosha Premium, every product is carefully inspected and energised before shipping.
            We stand behind the quality of our products and want you to be completely satisfied with your purchase.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">1. Return Eligibility</h2>
          <p>We accept returns within <strong>7 days</strong> of delivery, provided:</p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>The product is unused and in its original packaging.</li>
            <li>The energisation/pooja thread seal is intact.</li>
            <li>You have the original invoice or order number.</li>
            <li>The product is not from the &ldquo;Final Sale&rdquo; or &ldquo;Custom Order&rdquo; category.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">2. Non-Returnable Items</h2>
          <p>The following items cannot be returned:</p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>Products with broken energisation seal.</li>
            <li>Custom-made or personalised malas.</li>
            <li>Items marked &ldquo;Final Sale&rdquo;.</li>
            <li>Gift cards.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">3. Damaged or Wrong Item</h2>
          <p>
            If you received a damaged, defective, or wrong product, please contact us within
            <strong> 48 hours</strong> of delivery with:
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>Your order number.</li>
            <li>Clear photos of the product and packaging.</li>
          </ul>
          <p className="mt-3">
            We will arrange a free replacement or full refund — no questions asked.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">4. How to Initiate a Return</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Email us at <strong>support@sanoosha.com</strong> with your order number and reason.</li>
            <li>We will confirm eligibility within 24–48 hours.</li>
            <li>Ship the product to the address provided (return shipping cost borne by customer, unless item is defective).</li>
            <li>Once received and inspected, refund will be processed.</li>
          </ol>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">5. Refund Timeline</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Credit/Debit Card:</strong> 5–7 business days to original payment method.</li>
            <li><strong>UPI / Net Banking:</strong> 3–5 business days.</li>
            <li><strong>Wallet:</strong> 1–3 business days.</li>
          </ul>
          <p className="mt-3">
            Refunds are processed once the returned product is received and inspected at our warehouse.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">6. Order Cancellation</h2>
          <p>
            Orders can be cancelled within <strong>12 hours</strong> of placing, before they are dispatched.
            Once dispatched, orders cannot be cancelled — you may initiate a return after delivery.
          </p>
          <p className="mt-3">
            To cancel, email <strong>support@sanoosha.com</strong> with your order number immediately.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-charcoal mb-3">7. Contact Us</h2>
          <p>
            For any return or refund queries:<br />
            <strong>Email:</strong> support@sanoosha.com<br />
            <strong>Response time:</strong> Within 24 hours on business days
          </p>
        </section>

      </div>
    </div>
  )
}
