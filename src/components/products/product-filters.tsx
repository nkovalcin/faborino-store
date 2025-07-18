'use client'

import React, { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FilterOptions } from '@/lib/types'
import { categories } from '@/lib/products'

interface ProductFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  isOpen?: boolean
  onToggle?: () => void
}

export function ProductFilters({ filters, onFiltersChange, isOpen = false, onToggle }: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    const newPriceRange = { ...localFilters.priceRange, [type]: value }
    handleFilterChange('priceRange', newPriceRange)
  }

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      categories: [],
      ageGroups: [],
      priceRange: { min: 0, max: 500 },
      materials: [],
      inStock: undefined,
      sortBy: 'name',
      sortOrder: 'asc',
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = 
    localFilters.categories.length > 0 ||
    localFilters.ageGroups.length > 0 ||
    localFilters.materials.length > 0 ||
    localFilters.priceRange.min > 0 ||
    localFilters.priceRange.max < 500 ||
    localFilters.inStock !== undefined

  return (
    <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
      <Card className="sticky top-20">
        <div className="flex items-center justify-between p-4 border-b border-cream-white">
          <h3 className="font-semibold text-charcoal flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtre
          </h3>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Zmazať všetky
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onToggle} className="lg:hidden">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Categories */}
          <div>
            <h4 className="font-medium text-charcoal mb-3">Kategórie</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.categories.includes(category.slug)}
                    onChange={(e) => {
                      const newCategories = e.target.checked
                        ? [...localFilters.categories, category.slug]
                        : localFilters.categories.filter(c => c !== category.slug)
                      handleFilterChange('categories', newCategories)
                    }}
                    className="rounded border-muted/30 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-charcoal">{category.name}</span>
                  <span className="text-xs text-muted">({category.productCount})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Age Groups */}
          <div>
            <h4 className="font-medium text-charcoal mb-3">Vek</h4>
            <div className="space-y-2">
              {[
                { label: '0-6 mesiacov', min: 0, max: 6 },
                { label: '6-12 mesiacov', min: 6, max: 12 },
                { label: '1-2 roky', min: 12, max: 24 },
                { label: '2-3 roky', min: 24, max: 36 },
                { label: '3-6 rokov', min: 36, max: 72 },
                { label: '6+ rokov', min: 72, max: 999 },
              ].map((ageGroup) => (
                <label key={ageGroup.label} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.ageGroups.some(ag => ag.min === ageGroup.min && ag.max === ageGroup.max)}
                    onChange={(e) => {
                      const newAgeGroups = e.target.checked
                        ? [...localFilters.ageGroups, { min: ageGroup.min, max: ageGroup.max, label: ageGroup.label, description: '' }]
                        : localFilters.ageGroups.filter(ag => !(ag.min === ageGroup.min && ag.max === ageGroup.max))
                      handleFilterChange('ageGroups', newAgeGroups)
                    }}
                    className="rounded border-muted/30 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-charcoal">{ageGroup.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="font-medium text-charcoal mb-3">Cena</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={localFilters.priceRange.min}
                  onChange={(e) => handlePriceChange('min', parseInt(e.target.value) || 0)}
                  className="smart-input text-sm"
                />
                <span className="text-muted">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={localFilters.priceRange.max}
                  onChange={(e) => handlePriceChange('max', parseInt(e.target.value) || 500)}
                  className="smart-input text-sm"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <span>€{localFilters.priceRange.min}</span>
                <div className="flex-1 h-2 bg-muted/20 rounded-full relative">
                  <div 
                    className="absolute h-2 bg-primary rounded-full"
                    style={{
                      left: `${(localFilters.priceRange.min / 500) * 100}%`,
                      width: `${((localFilters.priceRange.max - localFilters.priceRange.min) / 500) * 100}%`
                    }}
                  />
                </div>
                <span>€{localFilters.priceRange.max}</span>
              </div>
            </div>
          </div>

          {/* Materials */}
          <div>
            <h4 className="font-medium text-charcoal mb-3">Materiály</h4>
            <div className="space-y-2">
              {[
                'Prírodné drevo',
                'Borovicové drevo',
                'Bukové drevo',
                'Bavlna',
                'Organická bavlna',
                'Kov',
              ].map((material) => (
                <label key={material} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.materials.includes(material)}
                    onChange={(e) => {
                      const newMaterials = e.target.checked
                        ? [...localFilters.materials, material]
                        : localFilters.materials.filter(m => m !== material)
                      handleFilterChange('materials', newMaterials)
                    }}
                    className="rounded border-muted/30 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-charcoal">{material}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <h4 className="font-medium text-charcoal mb-3">Dostupnosť</h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.inStock === true}
                onChange={(e) => {
                  handleFilterChange('inStock', e.target.checked ? true : undefined)
                }}
                className="rounded border-muted/30 text-primary focus:ring-primary"
              />
              <span className="text-sm text-charcoal">Len skladom</span>
            </label>
          </div>
        </div>
      </Card>
    </div>
  )
}