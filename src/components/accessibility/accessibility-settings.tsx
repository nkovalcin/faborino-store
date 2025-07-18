'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { 
  Settings, 
  Eye, 
  Type, 
  Contrast, 
  Volume2,
  MousePointer,
  Keyboard,
  Accessibility,
  RotateCcw,
  Check
} from 'lucide-react'

interface AccessibilitySettingsProps {
  className?: string
}

export function AccessibilitySettings({ className = '' }: AccessibilitySettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState({
    fontSize: 16,
    lineHeight: 1.5,
    letterSpacing: 0,
    highContrast: false,
    reducedMotion: false,
    focusIndicator: true,
    screenReader: false,
    keyboardNav: true,
    autoplay: true,
    animations: true
  })

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('accessibility-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  useEffect(() => {
    // Apply settings to document
    applySettings(settings)
    
    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings))
  }, [settings])

  const applySettings = (newSettings: typeof settings) => {
    const root = document.documentElement
    
    // Font size
    root.style.setProperty('--base-font-size', `${newSettings.fontSize}px`)
    
    // Line height
    root.style.setProperty('--base-line-height', newSettings.lineHeight.toString())
    
    // Letter spacing
    root.style.setProperty('--base-letter-spacing', `${newSettings.letterSpacing}px`)
    
    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }
    
    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduced-motion')
    } else {
      root.classList.remove('reduced-motion')
    }
    
    // Focus indicator
    if (newSettings.focusIndicator) {
      root.classList.add('enhanced-focus')
    } else {
      root.classList.remove('enhanced-focus')
    }
    
    // Keyboard navigation
    if (newSettings.keyboardNav) {
      root.classList.add('keyboard-nav')
    } else {
      root.classList.remove('keyboard-nav')
    }
    
    // Animations
    if (!newSettings.animations) {
      root.classList.add('no-animations')
    } else {
      root.classList.remove('no-animations')
    }
  }

  const updateSetting = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const resetSettings = () => {
    const defaultSettings = {
      fontSize: 16,
      lineHeight: 1.5,
      letterSpacing: 0,
      highContrast: false,
      reducedMotion: false,
      focusIndicator: true,
      screenReader: false,
      keyboardNav: true,
      autoplay: true,
      animations: true
    }
    setSettings(defaultSettings)
  }

  return (
    <div className={className}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="fixed bottom-4 left-4 z-50 bg-white shadow-lg hover:shadow-xl"
            aria-label="Nastavenia prístupnosti"
          >
            <Accessibility className="w-4 h-4 mr-2" />
            Prístupnosť
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Nastavenia prístupnosti
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Text Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Type className="w-5 h-5" />
                  Nastavenia textu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Veľkosť písma: {settings.fontSize}px</Label>
                  <Slider
                    value={[settings.fontSize]}
                    onValueChange={(value) => updateSetting('fontSize', value[0])}
                    min={12}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Výška riadku: {settings.lineHeight}</Label>
                  <Slider
                    value={[settings.lineHeight]}
                    onValueChange={(value) => updateSetting('lineHeight', value[0])}
                    min={1.2}
                    max={2.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Rozostup písmen: {settings.letterSpacing}px</Label>
                  <Slider
                    value={[settings.letterSpacing]}
                    onValueChange={(value) => updateSetting('letterSpacing', value[0])}
                    min={-1}
                    max={3}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Visual Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Eye className="w-5 h-5" />
                  Vizuálne nastavenia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Vysoký kontrast</Label>
                    <p className="text-sm text-muted">
                      Zvýši kontrast farieb pre lepšiu čitateľnosť
                    </p>
                  </div>
                  <Switch
                    checked={settings.highContrast}
                    onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Znížené animácie</Label>
                    <p className="text-sm text-muted">
                      Zníži alebo odstráni animácie
                    </p>
                  </div>
                  <Switch
                    checked={settings.reducedMotion}
                    onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Zvýraznené focus indikátory</Label>
                    <p className="text-sm text-muted">
                      Zobrazí jasnejšie ohraničenie pri navigácii klávesnicou
                    </p>
                  </div>
                  <Switch
                    checked={settings.focusIndicator}
                    onCheckedChange={(checked) => updateSetting('focusIndicator', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Animácie</Label>
                    <p className="text-sm text-muted">
                      Povoliť animácie a prechody
                    </p>
                  </div>
                  <Switch
                    checked={settings.animations}
                    onCheckedChange={(checked) => updateSetting('animations', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Navigation Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Keyboard className="w-5 h-5" />
                  Navigácia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Navigácia klávesnicou</Label>
                    <p className="text-sm text-muted">
                      Povoliť navigáciu pomocou klávesnice
                    </p>
                  </div>
                  <Switch
                    checked={settings.keyboardNav}
                    onCheckedChange={(checked) => updateSetting('keyboardNav', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Automatické prehrávanie</Label>
                    <p className="text-sm text-muted">
                      Povoliť automatické prehrávanie videí a animácií
                    </p>
                  </div>
                  <Switch
                    checked={settings.autoplay}
                    onCheckedChange={(checked) => updateSetting('autoplay', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Keyboard Shortcuts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Keyboard className="w-5 h-5" />
                  Klávesové skratky
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Vyhľadávanie</span>
                      <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + K</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Košík</span>
                      <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + B</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Domov</span>
                      <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + H</kbd>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Produkty</span>
                      <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + P</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Kontakt</span>
                      <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Ctrl + C</kbd>
                    </div>
                    <div className="flex justify-between">
                      <span>Pomoc</span>
                      <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">F1</kbd>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={resetSettings}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Resetovať nastavenia
              </Button>
              
              <Button
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Uložiť nastavenia
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}