import { useState } from 'react'
import { X } from 'lucide-react'
import StarRating from './StarRating'

export default function RatingModal({ isOpen, onClose, onSubmit, targetName, targetRole }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating')
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(rating, comment)
      // Reset form
      setRating(0)
      setComment('')
      onClose()
    } catch (error) {
      alert('Failed to submit rating. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setRating(0)
    setComment('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Rate {targetName}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Your Rating
            </label>
            <div className="flex items-center gap-3">
              <StarRating rating={rating} onRate={setRating} size={32} />
              {rating > 0 && (
                <span className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                  {rating}/5
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`Share your experience with ${targetName}...`}
              rows={4}
              className="w-full border dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              maxLength={500}
            />
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right">
              {comment.length}/500
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || rating === 0}
              className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
