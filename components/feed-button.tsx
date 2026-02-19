'use client'

interface FeedButtonProps {
  hunger: number
  onFeed: () => void
  disabled?: boolean
}

export function FeedButton({ hunger, onFeed, disabled = false }: FeedButtonProps) {
  const canFeed = hunger > 0 && !disabled

  return (
    <button
      onClick={onFeed}
      disabled={!canFeed}
      className="w-full px-4 py-2 rounded-lg border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[9px] font-bold text-green-400"
    >
      🍎 Alimentar
    </button>
  )
}

