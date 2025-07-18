'use client'

import { Button } from '@/components/ui/button'

export function SkipLinks() {
  const handleSkipToContent = () => {
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView()
    }
  }

  const handleSkipToNavigation = () => {
    const navigation = document.getElementById('main-navigation')
    if (navigation) {
      navigation.focus()
      navigation.scrollIntoView()
    }
  }

  const handleSkipToSearch = () => {
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="hľadať"], input[placeholder*="search"]') as HTMLInputElement
    if (searchInput) {
      searchInput.focus()
      searchInput.scrollIntoView()
    }
  }

  return (
    <div className="sr-only focus-within:not-sr-only">
      <div className="fixed top-0 left-0 z-[9999] bg-white border-2 border-primary p-2 m-2 rounded-lg shadow-lg">
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSkipToContent}
            className="focus:bg-primary focus:text-white"
          >
            Preskočiť na hlavný obsah
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSkipToNavigation}
            className="focus:bg-primary focus:text-white"
          >
            Preskočiť na navigáciu
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSkipToSearch}
            className="focus:bg-primary focus:text-white"
          >
            Preskočiť na vyhľadávanie
          </Button>
        </div>
      </div>
    </div>
  )
}