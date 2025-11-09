import { Star } from 'lucide-react'
import { useState } from 'react'

export default function StarRating({ rating, onRate, readonly = false, size = 20 }) {
  const [hover, setHover] = useState(0)

  const handleClick = (value) => {
    if (!readonly && onRate) {
      onRate(value)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (hover || rating) >= star
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            disabled={readonly}
            className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
          >
            <Star
              size={size}
              className={`${
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-300 dark:text-slate-600'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
