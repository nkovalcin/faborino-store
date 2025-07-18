'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Search, 
  Filter, 
  X, 
  Settings,
  Star,
  Baby,
  Palette,
  Shield,
  Truck,
  Calendar,
  Weight,
  Ruler,
  Package
} from 'lucide-react'

interface AdvancedSearchProps {
  children: React.ReactNode
  onSearch: (filters: SearchFilters) => void
  currentFilters?: SearchFilters
}

export interface SearchFilters {
  query: string
  categories: string[]
  priceRange: [number, number]
  ageRange: [number, number]
  materials: string[]
  safetyCertifications: string[]
  inStock: boolean
  onSale: boolean
  minRating: number
  dimensions: {
    maxLength?: number
    maxWidth?: number
    maxHeight?: number
  }
  assemblyRequired?: boolean
  fastDelivery?: boolean
  brand?: string
  colors: string[]
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'name-asc' | 'name-desc' | 'rating' | 'newest'
}

const defaultFilters: SearchFilters = {
  query: '',
  categories: [],
  priceRange: [0, 500],
  ageRange: [0, 72],
  materials: [],
  safetyCertifications: [],
  inStock: false,
  onSale: false,
  minRating: 0,
  dimensions: {},
  assemblyRequired: undefined,
  fastDelivery: false,
  brand: undefined,
  colors: [],
  sortBy: 'relevance'
}

export function AdvancedSearch({ children, onSearch, currentFilters = defaultFilters }: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>(currentFilters)

  const categories = [
    { id: 'first-steps', name: 'Prvé kroky', icon: Baby },
    { id: 'brave-explorers', name: 'Odvážni objavitelia', icon: Baby },
    { id: 'confident-climbers', name: 'Istí lezci', icon: Baby },
    { id: 'creative-spaces', name: 'Kreatívne priestory', icon: Palette },
    { id: 'learning-towers', name: 'Učiace veže', icon: Package },
    { id: 'climbing-furniture', name: 'Lezecký nábytok', icon: Package },
    { id: 'balance-toys', name: 'Balančné hračky', icon: Package },
    { id: 'educational-toys', name: 'Vzdelávacie hračky', icon: Package }
  ]

  const materials = [
    'Bukové drevo',
    'Borovicové drevo',
    'Preglejka',
    'Látka',
    'Kov',
    'Plast (bez BPA)',
    'Prírodné farby',
    'Bezpečné laky'
  ]

  const safetyCertifications = [
    'CE',
    'EN 71',
    'FSC',
    'GREENGUARD',
    'OEKO-TEX',
    'PEFC'
  ]

  const colors = [
    'Prírodné drevo',
    'Biela',
    'Čierna',
    'Modrá',
    'Červená',
    'Zelená',
    'Žltá',
    'Ružová',
    'Sivá'
  ]

  const brands = [
    'Faborino',
    'Montessori Kids',
    'Natural Wood',
    'Eco Baby',
    'Safe Play'
  ]

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleCategoryToggle = (categoryId: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }))
  }

  const handleMaterialToggle = (material: string) => {
    setFilters(prev => ({
      ...prev,
      materials: prev.materials.includes(material)
        ? prev.materials.filter(m => m !== material)
        : [...prev.materials, material]
    }))
  }

  const handleCertificationToggle = (cert: string) => {
    setFilters(prev => ({
      ...prev,
      safetyCertifications: prev.safetyCertifications.includes(cert)
        ? prev.safetyCertifications.filter(c => c !== cert)
        : [...prev.safetyCertifications, cert]
    }))
  }

  const handleColorToggle = (color: string) => {
    setFilters(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }))
  }

  const handleSearch = () => {
    onSearch(filters)
    setIsOpen(false)
  }

  const handleReset = () => {
    setFilters(defaultFilters)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.query) count++
    if (filters.categories.length > 0) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) count++
    if (filters.ageRange[0] > 0 || filters.ageRange[1] < 72) count++
    if (filters.materials.length > 0) count++
    if (filters.safetyCertifications.length > 0) count++
    if (filters.inStock) count++
    if (filters.onSale) count++
    if (filters.minRating > 0) count++
    if (filters.colors.length > 0) count++
    if (filters.brand) count++
    if (filters.assemblyRequired !== undefined) count++
    if (filters.fastDelivery) count++
    return count
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Pokročilé vyhľadávanie
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()} aktívnych filtrov
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Search Query */}
          <div className="space-y-2">
            <Label htmlFor="search-query">Hľadaný výraz</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                id="search-query"
                type="text"
                placeholder="Zadajte hľadaný výraz..."
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                className="smart-input pl-10"
              />
            </div>
          </div>

          <Separator />

          {/* Categories */}
          <div className="space-y-3">
            <Label>Kategórie</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-cream-white/50 rounded">
                  <Checkbox
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <category.icon className="w-4 h-4 text-muted" />
                  <span className="text-sm">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* Price Range */}
          <div className="space-y-3">
            <Label>Cenový rozsah</Label>
            <div className="space-y-2">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => handleFilterChange('priceRange', value)}
                max={500}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted">
                <span>{filters.priceRange[0]}€</span>
                <span>{filters.priceRange[1]}€</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Age Range */}
          <div className="space-y-3">
            <Label>Vek (mesiace)</Label>
            <div className="space-y-2">
              <Slider
                value={filters.ageRange}
                onValueChange={(value) => handleFilterChange('ageRange', value)}
                max={72}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted">
                <span>{filters.ageRange[0]} mes.</span>
                <span>{filters.ageRange[1]} mes.</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Materials */}
          <div className="space-y-3">
            <Label>Materiály</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {materials.map((material) => (
                <label key={material} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-cream-white/50 rounded">
                  <Checkbox
                    checked={filters.materials.includes(material)}
                    onCheckedChange={() => handleMaterialToggle(material)}
                  />
                  <span className="text-sm">{material}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* Safety Certifications */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Bezpečnostné certifikáty
            </Label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {safetyCertifications.map((cert) => (
                <label key={cert} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-cream-white/50 rounded">
                  <Checkbox
                    checked={filters.safetyCertifications.includes(cert)}
                    onCheckedChange={() => handleCertificationToggle(cert)}
                  />
                  <span className="text-sm font-medium">{cert}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* Colors */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Farby
            </Label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {colors.map((color) => (
                <label key={color} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-cream-white/50 rounded">
                  <Checkbox
                    checked={filters.colors.includes(color)}
                    onCheckedChange={() => handleColorToggle(color)}
                  />
                  <span className="text-sm">{color}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* Rating */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Minimálne hodnotenie
            </Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[filters.minRating]}
                onValueChange={(value) => handleFilterChange('minRating', value[0])}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
              <span className="text-sm text-muted min-w-[40px]">
                {filters.minRating}★
              </span>
            </div>
          </div>

          <Separator />

          {/* Other Options */}
          <div className="space-y-3">
            <Label>Ďalšie možnosti</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-cream-white/50 rounded">
                <Checkbox
                  checked={filters.inStock}
                  onCheckedChange={(checked) => handleFilterChange('inStock', checked)}
                />
                <Package className="w-4 h-4 text-muted" />
                <span className="text-sm">Len skladom</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-cream-white/50 rounded">
                <Checkbox
                  checked={filters.onSale}
                  onCheckedChange={(checked) => handleFilterChange('onSale', checked)}
                />
                <span className="text-sm">Akciové produkty</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-cream-white/50 rounded">
                <Checkbox
                  checked={filters.fastDelivery}
                  onCheckedChange={(checked) => handleFilterChange('fastDelivery', checked)}
                />
                <Truck className="w-4 h-4 text-muted" />
                <span className="text-sm">Rýchle doručenie</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-cream-white/50 rounded">
                <Checkbox
                  checked={filters.assemblyRequired === false}
                  onCheckedChange={(checked) => handleFilterChange('assemblyRequired', checked ? false : undefined)}
                />
                <span className="text-sm">Bez montáže</span>
              </label>
            </div>
          </div>

          <Separator />

          {/* Brand */}
          <div className="space-y-3">
            <Label>Značka</Label>
            <select 
              value={filters.brand || ''}
              onChange={(e) => handleFilterChange('brand', e.target.value || undefined)}
              className="smart-input"
            >
              <option value="">Všetky značky</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <Separator />

          {/* Sort By */}
          <div className="space-y-3">
            <Label>Zoradiť podľa</Label>
            <select 
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="smart-input"
            >
              <option value="relevance">Relevantnosť</option>
              <option value="price-low">Cena: od najnižšej</option>
              <option value="price-high">Cena: od najvyššej</option>
              <option value="name-asc">Názov: A-Z</option>
              <option value="name-desc">Názov: Z-A</option>
              <option value="rating">Hodnotenie</option>
              <option value="newest">Najnovšie</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-cream-white">
            <Button variant="outline" onClick={handleReset}>
              Vynulovať filtre
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Zrušiť
              </Button>
              <Button onClick={handleSearch}>
                Hľadať produkty
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}