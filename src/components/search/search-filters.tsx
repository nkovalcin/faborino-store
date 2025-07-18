'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { SearchFilters } from './advanced-search'
import { 
  Filter, 
  X, 
  Star, 
  Package, 
  Truck, 
  Shield,
  Palette,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface SearchFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onClearAll: () => void
  className?: string
}

export function SearchFiltersComponent({ 
  filters, 
  onFiltersChange, 
  onClearAll, 
  className = '' 
}: SearchFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['categories', 'price'])
  )

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  const categories = [
    { id: 'first-steps', name: 'Prvé kroky', count: 24 },
    { id: 'brave-explorers', name: 'Odvážni objavitelia', count: 18 },
    { id: 'confident-climbers', name: 'Istí lezci', count: 15 },
    { id: 'creative-spaces', name: 'Kreatívne priestory', count: 32 },
    { id: 'learning-towers', name: 'Učiace veže', count: 12 },
    { id: 'climbing-furniture', name: 'Lezecký nábytok', count: 8 },
    { id: 'balance-toys', name: 'Balančné hračky', count: 16 },
    { id: 'educational-toys', name: 'Vzdelávacie hračky', count: 28 }
  ]

  const materials = [
    { id: 'bukove-drevo', name: 'Bukové drevo', count: 45 },
    { id: 'borovicove-drevo', name: 'Borovicové drevo', count: 32 },
    { id: 'preglejka', name: 'Preglejka', count: 28 },
    { id: 'latka', name: 'Látka', count: 12 },
    { id: 'prirodne-farby', name: 'Prírodné farby', count: 38 },
    { id: 'bezpecne-laky', name: 'Bezpečné laky', count: 24 }
  ]

  const safetyCertifications = [
    { id: 'ce', name: 'CE', count: 89 },
    { id: 'en-71', name: 'EN 71', count: 76 },
    { id: 'fsc', name: 'FSC', count: 54 },
    { id: 'greenguard', name: 'GREENGUARD', count: 23 },
    { id: 'oeko-tex', name: 'OEKO-TEX', count: 18 },
    { id: 'pefc', name: 'PEFC', count: 41 }
  ]

  const colors = [
    { id: 'prirodne-drevo', name: 'Prírodné drevo', count: 67 },
    { id: 'biela', name: 'Biela', count: 34 },
    { id: 'cierna', name: 'Čierna', count: 12 },
    { id: 'modra', name: 'Modrá', count: 18 },
    { id: 'cervena', name: 'Červená', count: 15 },
    { id: 'zelena', name: 'Zelená', count: 21 },
    { id: 'zlta', name: 'Žltá', count: 9 },
    { id: 'ruzova', name: 'Ružová', count: 14 }
  ]

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId]
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    })
  }

  const handleMaterialToggle = (materialId: string) => {
    const newMaterials = filters.materials.includes(materialId)
      ? filters.materials.filter(id => id !== materialId)
      : [...filters.materials, materialId]
    
    onFiltersChange({
      ...filters,
      materials: newMaterials
    })
  }

  const handleCertificationToggle = (certId: string) => {
    const newCertifications = filters.safetyCertifications.includes(certId)
      ? filters.safetyCertifications.filter(id => id !== certId)
      : [...filters.safetyCertifications, certId]
    
    onFiltersChange({
      ...filters,
      safetyCertifications: newCertifications
    })
  }

  const handleColorToggle = (colorId: string) => {
    const newColors = filters.colors.includes(colorId)
      ? filters.colors.filter(id => id !== colorId)
      : [...filters.colors, colorId]
    
    onFiltersChange({
      ...filters,
      colors: newColors
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.categories.length > 0) count += filters.categories.length
    if (filters.materials.length > 0) count += filters.materials.length
    if (filters.safetyCertifications.length > 0) count += filters.safetyCertifications.length
    if (filters.colors.length > 0) count += filters.colors.length
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) count++
    if (filters.ageRange[0] > 0 || filters.ageRange[1] < 72) count++
    if (filters.minRating > 0) count++
    if (filters.inStock) count++
    if (filters.onSale) count++
    if (filters.fastDelivery) count++
    if (filters.assemblyRequired === false) count++
    return count
  }

  const FilterSection = ({ 
    title, 
    sectionKey, 
    icon: Icon, 
    children 
  }: { 
    title: string
    sectionKey: string
    icon: React.ElementType
    children: React.ReactNode 
  }) => {
    const isExpanded = expandedSections.has(sectionKey)
    
    return (
      <div className="space-y-3">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center justify-between w-full p-2 hover:bg-cream-white/50 rounded transition-colors"
        >
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-muted" />
            <span className="font-medium text-charcoal">{title}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-muted" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted" />
          )}
        </button>
        
        {isExpanded && (
          <div className="pl-6">
            {children}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className={`sticky top-20 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtre
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              Vymazať
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Categories */}
        <FilterSection title="Kategórie" sectionKey="categories" icon={Package}>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-cream-white/50 rounded">
                <Checkbox
                  checked={filters.categories.includes(category.id)}
                  onCheckedChange={() => handleCategoryToggle(category.id)}
                />
                <span className="text-sm flex-1">{category.name}</span>
                <span className="text-xs text-muted">({category.count})</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <Separator />

        {/* Price Range */}
        <FilterSection title="Cena" sectionKey="price" icon={Package}>
          <div className="space-y-3">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => onFiltersChange({
                ...filters,
                priceRange: value as [number, number]
              })}
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
        </FilterSection>

        <Separator />

        {/* Age Range */}
        <FilterSection title="Vek" sectionKey="age" icon={Package}>
          <div className="space-y-3">
            <Slider
              value={filters.ageRange}
              onValueChange={(value) => onFiltersChange({
                ...filters,
                ageRange: value as [number, number]
              })}
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
        </FilterSection>

        <Separator />

        {/* Materials */}
        <FilterSection title="Materiály" sectionKey="materials" icon={Package}>
          <div className="space-y-2">
            {materials.map((material) => (
              <label key={material.id} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-cream-white/50 rounded">
                <Checkbox
                  checked={filters.materials.includes(material.id)}
                  onCheckedChange={() => handleMaterialToggle(material.id)}
                />
                <span className="text-sm flex-1">{material.name}</span>
                <span className="text-xs text-muted">({material.count})</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <Separator />

        {/* Safety Certifications */}
        <FilterSection title="Certifikáty" sectionKey="certifications" icon={Shield}>
          <div className="space-y-2">
            {safetyCertifications.map((cert) => (
              <label key={cert.id} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-cream-white/50 rounded">
                <Checkbox
                  checked={filters.safetyCertifications.includes(cert.id)}
                  onCheckedChange={() => handleCertificationToggle(cert.id)}
                />
                <span className="text-sm flex-1 font-medium">{cert.name}</span>
                <span className="text-xs text-muted">({cert.count})</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <Separator />

        {/* Colors */}
        <FilterSection title="Farby" sectionKey="colors" icon={Palette}>
          <div className="space-y-2">
            {colors.map((color) => (
              <label key={color.id} className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-cream-white/50 rounded">
                <Checkbox
                  checked={filters.colors.includes(color.id)}
                  onCheckedChange={() => handleColorToggle(color.id)}
                />
                <span className="text-sm flex-1">{color.name}</span>
                <span className="text-xs text-muted">({color.count})</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <Separator />

        {/* Rating */}
        <FilterSection title="Hodnotenie" sectionKey="rating" icon={Star}>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Slider
                value={[filters.minRating]}
                onValueChange={(value) => onFiltersChange({
                  ...filters,
                  minRating: value[0]
                })}
                max={5}
                min={0}
                step={0.5}
                className="flex-1"
              />
              <span className="text-sm text-muted min-w-[40px]">
                {filters.minRating}★
              </span>
            </div>
          </div>
        </FilterSection>

        <Separator />

        {/* Other Options */}
        <FilterSection title="Ďalšie" sectionKey="other" icon={Package}>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-cream-white/50 rounded">
              <Checkbox
                checked={filters.inStock}
                onCheckedChange={(checked) => onFiltersChange({
                  ...filters,
                  inStock: checked as boolean
                })}
              />
              <span className="text-sm">Len skladom</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-cream-white/50 rounded">
              <Checkbox
                checked={filters.onSale}
                onCheckedChange={(checked) => onFiltersChange({
                  ...filters,
                  onSale: checked as boolean
                })}
              />
              <span className="text-sm">Akciové produkty</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-cream-white/50 rounded">
              <Checkbox
                checked={filters.fastDelivery}
                onCheckedChange={(checked) => onFiltersChange({
                  ...filters,
                  fastDelivery: checked as boolean
                })}
              />
              <Truck className="w-4 h-4 text-muted" />
              <span className="text-sm">Rýchle doručenie</span>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-cream-white/50 rounded">
              <Checkbox
                checked={filters.assemblyRequired === false}
                onCheckedChange={(checked) => onFiltersChange({
                  ...filters,
                  assemblyRequired: checked ? false : undefined
                })}
              />
              <span className="text-sm">Bez montáže</span>
            </label>
          </div>
        </FilterSection>
      </CardContent>
    </Card>
  )
}