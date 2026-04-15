interface Props {
  label: string
  value: string
  sub?: string
  positive?: boolean
}

export default function StatsCard({ label, value, sub, positive }: Props) {
  return (
    <div className="bg-[#1e293b] rounded-3xl p-6 border border-white/5">
      <p className="text-white/40 text-xs uppercase tracking-[0.25em] mb-3">{label}</p>
      <p className="text-white text-3xl font-semibold mb-2">{value}</p>
      {sub && (
        <p className={`text-xs font-medium ${positive ? 'text-emerald-400' : 'text-white/50'}`}>
          {sub}
        </p>
      )}
    </div>
  )
}
