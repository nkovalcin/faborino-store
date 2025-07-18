'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { 
  SlidersHorizontal, 
  X,
  Filter,
  ArrowUpDown,
  Grid3X3,
  List,
  Check
} from 'lucide-react'

interface MobileFiltersProps {
  filters: {
    ageGroups: string[]
    materials: string[]
    colors: string[]
    priceRange: [number, number]
    categories: string[]
  }
  activeFilters: {
    ageGroups: string[]
    materials: string[]
    colors: string[]
    priceRange: [number, number]
    categories: string[]
  }
  onFiltersChange: (filters: any) => void
  onClearFilters: () => void
}

const sortOptions = [
  { value: 'relevance', label: 'Relevantnosť' },
  { value: 'price-low', label: 'Cena: nízka → vysoká' },
  { value: 'price-high', label: 'Cena: vysoká → nízka' },
  { value: 'newest', label: 'Najnovšie' },
  { value: 'popular', label: 'Najpopulárnejšie' },
  { value: 'rating', label: 'Hodnotenie' }
]

export function MobileFilters({ 
  filters, 
  activeFilters, 
  onFiltersChange, 
  onClearFilters 
}: MobileFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentSort, setCurrentSort] = useState('relevance')

  const activeFilterCount = 
    activeFilters.ageGroups.length +
    activeFilters.materials.length +
    activeFilters.colors.length +
    activeFilters.categories.length +
    (activeFilters.priceRange[0] !== filters.priceRange[0] || 
     activeFilters.priceRange[1] !== filters.priceRange[1] ? 1 : 0)

  const handleFilterChange = (type: string, value: string, checked: boolean) => {
    const newFilters = { ...activeFilters }
    
    if (checked) {
      newFilters[type as keyof typeof newFilters] = [
        ...activeFilters[type as keyof typeof activeFilters] as string[],
        value
      ]
    } else {
      newFilters[type as keyof typeof newFilters] = (
        activeFilters[type as keyof typeof activeFilters] as string[]
      ).filter(item => item !== value)
    }
    
    onFiltersChange(newFilters)
  }

  const handlePriceChange = (value: [number, number]) => {
    onFiltersChange({
      ...activeFilters,
      priceRange: value
    })
  }

  const handleSortChange = (value: string) => {
    setCurrentSort(value)
    setIsSortOpen(false)
    // Handle sort logic here
  }

  return (
    <div className="md:hidden">
      {/* Mobile Filter Bar */}
      <div className="sticky top-14 z-40 bg-white border-b border-cream-white">
        <div className="container-responsive py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Filters Button */}
            <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtre
                  {activeFilterCount > 0 && (
                    <Badge className="ml-2 bg-primary text-white">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full">
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    Filtre
                    {activeFilterCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        className="text-red-500"
                      >
                        Vymazať všetko
                      </Button>
                    )}
                  </SheetTitle>
                </SheetHeader>
                
                <div className="py-4 space-y-6">
                  {/* Age Groups */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Vek</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {filters.ageGroups.map((age) => (
                        <div key={age} className="flex items-center space-x-2">
                          <Checkbox
                            id={`age-${age}`}
                            checked={activeFilters.ageGroups.includes(age)}
                            onCheckedChange={(checked) => 
                              handleFilterChange('ageGroups', age, checked as boolean)
                            }
                          />
                          <Label htmlFor={`age-${age}`} className="text-sm">
                            {age}
                          </Label>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Categories */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Kategórie</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {filters.categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={activeFilters.categories.includes(category)}
                            onCheckedChange={(checked) => 
                              handleFilterChange('categories', category, checked as boolean)
                            }
                          />
                          <Label htmlFor={`category-${category}`} className="text-sm">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Price Range */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Cena</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="px-2">
                        <Slider
                          value={activeFilters.priceRange}
                          onValueChange={handlePriceChange}
                          min={filters.priceRange[0]}
                          max={filters.priceRange[1]}
                          step={10}
                          className="w-full"
                        />
                      </div>
                      <div className="flex justify-between text-sm text-muted">
                        <span>{activeFilters.priceRange[0]}€</span>
                        <span>{activeFilters.priceRange[1]}€</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Materials */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Materiál</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {filters.materials.map((material) => (
                        <div key={material} className="flex items-center space-x-2">
                          <Checkbox
                            id={`material-${material}`}
                            checked={activeFilters.materials.includes(material)}
                            onCheckedChange={(checked) => 
                              handleFilterChange('materials', material, checked as boolean)
                            }
                          />
                          <Label htmlFor={`material-${material}`} className="text-sm">
                            {material}
                          </Label>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Colors */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Farba</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {filters.colors.map((color) => (
                        <div key={color} className="flex items-center space-x-2">
                          <Checkbox
                            id={`color-${color}`}
                            checked={activeFilters.colors.includes(color)}
                            onCheckedChange={(checked) => 
                              handleFilterChange('colors', color, checked as boolean)
                            }
                          />
                          <Label htmlFor={`color-${color}`} className="text-sm">
                            {color}
                          </Label>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <div className="sticky bottom-0 bg-white border-t border-cream-white p-4">
                  <Button 
                    className="w-full" 
                    onClick={() => setIsFiltersOpen(false)}
                  >
                    Zobraziť produkty
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort Button */}
            <Sheet open={isSortOpen} onOpenChange={setIsSortOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Zoradiť
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-auto">
                <SheetHeader>
                  <SheetTitle>Zoradiť podľa</SheetTitle>
                </SheetHeader>
                
                <div className="py-4 space-y-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-surface transition-colors ${
                        currentSort === option.value ? 'bg-primary/5 text-primary' : 'text-charcoal'
                      }`}
                    >
                      <span className="font-medium">{option.label}</span>
                      {currentSort === option.value && (
                        <Check className="w-5 h-5" />
                      )}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-cream-white rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="p-2 h-8"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="p-2 h-8"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto">
              <span className="text-sm text-muted whitespace-nowrap">Aktívne:</span>
              {activeFilters.ageGroups.map((age) => (
                <Badge key={age} variant="secondary" className="whitespace-nowrap">
                  {age}
                  <button
                    onClick={() => handleFilterChange('ageGroups', age, false)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {activeFilters.categories.map((category) => (
                <Badge key={category} variant="secondary" className="whitespace-nowrap">
                  {category}
                  <button
                    onClick={() => handleFilterChange('categories', category, false)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {activeFilters.materials.map((material) => (
                <Badge key={material} variant="secondary" className="whitespace-nowrap">
                  {material}
                  <button
                    onClick={() => handleFilterChange('materials', material, false)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {activeFilters.colors.map((color) => (
                <Badge key={color} variant="secondary" className="whitespace-nowrap">
                  {color}
                  <button
                    onClick={() => handleFilterChange('colors', color, false)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {(activeFilters.priceRange[0] !== filters.priceRange[0] || 
                activeFilters.priceRange[1] !== filters.priceRange[1]) && (
                <Badge variant="secondary" className="whitespace-nowrap">
                  {activeFilters.priceRange[0]}€ - {activeFilters.priceRange[1]}€
                  <button
                    onClick={() => handlePriceChange(filters.priceRange)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}