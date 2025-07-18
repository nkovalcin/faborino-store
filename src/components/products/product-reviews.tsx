'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  User, 
  Calendar, 
  CheckCircle,
  Filter,
  MoreVertical
} from 'lucide-react'
import { Review } from '@/lib/types'

interface ProductReviewsProps {
  productId: string
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

export function ProductReviews({ 
  productId, 
  reviews, 
  averageRating, 
  totalReviews 
}: ProductReviewsProps) {
  const [showAll, setShowAll] = useState(false)
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'helpful' | 'rating'>('newest')

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3)
  const filteredReviews = filterRating 
    ? displayedReviews.filter(r => r.rating === filterRating)
    : displayedReviews

  const ratingCounts = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / totalReviews) * 100
  }))

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (sortBy === 'helpful') return b.helpful - a.helpful
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Recenzie zákazníkov
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-charcoal mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              <div className="text-sm text-muted">
                Na základe {totalReviews} {totalReviews === 1 ? 'recenzie' : totalReviews < 5 ? 'recenzií' : 'recenzií'}
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {ratingCounts.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm font-medium w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted" />
              <span className="text-sm font-medium">Filtrovať:</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterRating === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterRating(null)}
              >
                Všetky
              </Button>
              {[5, 4, 3, 2, 1].map(rating => (
                <Button
                  key={rating}
                  variant={filterRating === rating ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterRating(rating)}
                >
                  {rating}★
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-muted">Zoradiť:</span>
              <select 
                className="text-sm border rounded px-2 py-1"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="newest">Najnovšie</option>
                <option value="helpful">Najužitočnejšie</option>
                <option value="rating">Hodnotenie</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <Card key={review.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-charcoal">{review.customerName}</span>
                    {review.verified && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Overený nákup
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < review.rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted">
                      <Calendar className="w-3 h-3" />
                      {new Date(review.createdAt).toLocaleDateString('sk-SK')}
                    </div>
                  </div>

                  <h4 className="font-medium text-charcoal mb-2">{review.title}</h4>
                  <p className="text-muted leading-relaxed mb-4">{review.comment}</p>

                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      Užitočné ({review.helpful})
                    </button>
                    <button className="flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors">
                      <ThumbsDown className="w-4 h-4" />
                      Neužitočné
                    </button>
                  </div>
                </div>
                
                <button className="text-muted hover:text-charcoal transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show More Button */}
      {!showAll && reviews.length > 3 && (
        <div className="text-center">
          <Button 
            variant="outline"
            onClick={() => setShowAll(true)}
          >
            Zobraziť všetky recenzie ({reviews.length - 3} ďalších)
          </Button>
        </div>
      )}

      {/* Write Review CTA */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6 text-center">
          <h3 className="text-h3 font-bold text-charcoal mb-2">
            Zdieľajte svoju skúsenosť
          </h3>
          <p className="text-muted mb-4">
            Pomôžte ostatným rodičom pri rozhodovaní napísaním recenzie
          </p>
          <Button>
            <Star className="w-4 h-4 mr-2" />
            Napísať recenziu
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}