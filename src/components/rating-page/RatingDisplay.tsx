import { useTranslation } from 'react-i18next'

import NumberFlow from '@number-flow/react'
import { AnimatePresence, motion } from 'framer-motion'
import { FC } from 'react'
import { usePrevious } from 'react-use'

const RATINGS = [
  { ratingLowerBound: 0, icon: 'tier1.png', color: '#86ff02' },
  { ratingLowerBound: 1, icon: 'tier1.png', color: '#86ff02' },
  { ratingLowerBound: 2, icon: 'tier2.png', color: '#06ff02' },
  { ratingLowerBound: 3, icon: 'tier2.png', color: '#06ff02' },
  { ratingLowerBound: 4, icon: 'tier3.png', color: '#09ff68' },
  { ratingLowerBound: 5, icon: 'tier3.png', color: '#09ff68' },
  { ratingLowerBound: 6, icon: 'tier3.png', color: '#09ff68' },
  { ratingLowerBound: 7, icon: 'tier4.png', color: '#02e0ff' },
  { ratingLowerBound: 8, icon: 'tier5.png', color: '#02e0ff' },
  { ratingLowerBound: 9, icon: 'tier6.png', color: '#02e0ff' },
  { ratingLowerBound: 10, icon: 'tier7.png', color: '#fcd906' },
  { ratingLowerBound: 11, icon: 'tier8.png', color: '#fcd906' },
  { ratingLowerBound: 12, icon: 'tier9.png', color: '#ff090b' },
  { ratingLowerBound: 13, icon: 'tier10.png', color: '#fc0fae' },
  { ratingLowerBound: 14, icon: 'tier11.png', color: '#d90dff' },
  { ratingLowerBound: 15, icon: 'tier12.png', color: '#fc8301' },
  { ratingLowerBound: 16, icon: 'tier13.png', color: '#fc8101' },
]
RATINGS.reverse()

const MotionNumberFlow = motion.create(NumberFlow)

export const RatingDisplay: FC<{
  rating: number
}> = ({ rating }) => {
  const { i18n } = useTranslation()
  const ratingBucket = RATINGS.find((r) => rating >= r.ratingLowerBound)
  const icon = ratingBucket
    ? `https://rotaenokit-assets.imgg.dev/images/rating-tiers/${ratingBucket?.icon}`
    : undefined

  const previousRating = usePrevious(rating) ?? rating

  return (
    <motion.div
      layout
      className="inline-flex items-center gap-2 rounded-lg px-4 text-5xl font-bold leading-none tracking-tight"
      animate={{ backgroundColor: ratingBucket ? `${ratingBucket.color}7f` : undefined }}
      transition={{ layout: { duration: 0.9, bounce: 0, type: 'spring' } }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          layout
          key={icon}
          src={icon}
          alt={ratingBucket?.icon}
          className="size-8"
          initial={{ opacity: 0, y: previousRating > rating ? -5 : 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.45, bounce: 0, type: 'spring' }}
        />
      </AnimatePresence>

      <MotionNumberFlow
        value={rating}
        format={{ minimumFractionDigits: 3, maximumFractionDigits: 3 }}
        locales={i18n.language}
        layout
        layoutRoot
      />
    </motion.div>
  )
}
