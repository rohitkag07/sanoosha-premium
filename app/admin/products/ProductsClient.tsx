'use client'

import { useState, useTransition } from 'react'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import type { Product, ProductCategory } from '@/types'
import { formatPrice } from '@/lib/utils'
import { createProduct, updateProduct, deleteProduct, toggleStock } from './actions'

const categories: ProductCategory[] = ['rudraksha', 'crystal', 'combo']

interface ProductFormData {
  name: string
  slug: string
  description: string
  price: string
  compare_price: string
  category: ProductCategory
  image_url: string
  in_stock: boolean
  featured: boolean
}

const emptyForm: ProductFormData = {
  name: '',
  slug: '',
  description: '',
  price: '',
  compare_price: '',
  category: 'rudraksha',
  image_url: '',
  in_stock: true,
  featured: false,
}

export default function ProductsClient({ products }: { products: Product[] }) {
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<ProductFormData>(emptyForm)
  const [isPending, startTransition] = useTransition()

  function openAdd() {
    setEditProduct(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  function openEdit(product: Product) {
    setEditProduct(product)
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description ?? '',
      price: (product.price / 100).toString(),
      compare_price: product.compare_price ? (product.compare_price / 100).toString() : '',
      category: product.category,
      image_url: product.images?.[0] ?? '',
      in_stock: product.in_stock,
      featured: product.featured,
    })
    setShowModal(true)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      if (editProduct) {
        await updateProduct(editProduct.id, formData)
      } else {
        await createProduct(formData)
      }
      setShowModal(false)
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return
    startTransition(() => deleteProduct(id))
  }

  function handleToggleStock(id: string, current: boolean) {
    startTransition(() => toggleStock(id, !current))
  }

  return (
    <div className="p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-white">Products</h1>
          <p className="text-white/50 mt-2">Manage inventory, pricing, and featured products.</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-2xl bg-gold px-5 py-3 text-sm font-semibold text-charcoal transition hover:bg-gold-light"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0f172a]">
        <table className="min-w-full text-left text-sm text-white/70">
          <thead className="border-b border-white/10 bg-white/5 text-white/50 uppercase tracking-[0.2em] text-xs">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Featured</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-2xl bg-white/10">
                      <img
                        src={product.images?.[0] ?? ''}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-white font-medium">{product.name}</p>
                      <p className="text-white/40 text-xs truncate max-w-[240px]">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-white/60 capitalize">{product.category}</td>
                <td className="px-6 py-4 text-gold font-semibold">{formatPrice(product.price)}</td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => handleToggleStock(product.id, product.in_stock)}
                    className="inline-flex items-center"
                  >
                    {product.in_stock ? (
                      <ToggleRight size={22} className="text-emerald-400" />
                    ) : (
                      <ToggleLeft size={22} className="text-white/30" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.featured ? 'bg-gold/20 text-gold' : 'bg-white/5 text-white/50'}`}>
                    {product.featured ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
                      className="rounded-2xl p-2 text-white/60 hover:text-white transition"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      className="rounded-2xl p-2 text-white/60 hover:text-red-400 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-[#0f172a] p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-white">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-white/50 hover:text-white"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-white/50">
                  Name
                  <input
                    name="name"
                    value={form.name}
                    onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold"
                    required
                  />
                </label>
                <label className="block text-sm text-white/50">
                  Slug
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-white/50">
                  Price (₹)
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
                    className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold"
                    required
                  />
                </label>
                <label className="block text-sm text-white/50">
                  Compare Price (₹)
                  <input
                    name="compare_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.compare_price}
                    onChange={e => setForm(prev => ({ ...prev, compare_price: e.target.value }))}
                    className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-white/50">
                  Category
                  <select
                    name="category"
                    value={form.category}
                    onChange={e => setForm(prev => ({ ...prev, category: e.target.value as ProductCategory }))}
                    className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold"
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-[#0f172a] text-white">
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm text-white/50">
                  Image URL
                  <input
                    name="image_url"
                    type="url"
                    value={form.image_url}
                    onChange={e => setForm(prev => ({ ...prev, image_url: e.target.value }))}
                    className="mt-2 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold"
                  />
                </label>
              </div>

              <label className="block text-sm text-white/50">
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-2 w-full min-h-[120px] rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-gold resize-none"
                />
              </label>

              <div className="flex flex-wrap gap-3">
                <label className="inline-flex items-center gap-2 text-sm text-white/60">
                  <input
                    type="checkbox"
                    name="in_stock"
                    checked={form.in_stock}
                    onChange={e => setForm(prev => ({ ...prev, in_stock: e.target.checked }))}
                    className="accent-gold"
                  />
                  In stock
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-white/60">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={e => setForm(prev => ({ ...prev, featured: e.target.checked }))}
                    className="accent-gold"
                  />
                  Featured
                </label>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex justify-center rounded-3xl bg-gold px-6 py-3 text-sm font-semibold text-charcoal transition hover:bg-gold-light disabled:opacity-60"
                >
                  {isPending ? 'Saving...' : editProduct ? 'Update product' : 'Create product'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="inline-flex justify-center rounded-3xl border border-white/10 px-6 py-3 text-sm font-semibold text-white/70 transition hover:border-gold hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
