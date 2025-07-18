'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, X, Minimize2 } from 'lucide-react'

interface ChatWidgetTriggerProps {
  onToggle: () => void
  isOpen: boolean
  unreadCount?: number
  className?: string
}

export function ChatWidgetTrigger({ 
  onToggle, 
  isOpen, 
  unreadCount = 0, 
  className = '' 
}: ChatWidgetTriggerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Show trigger after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isVisible && !isOpen) {
      // Show prompt after 10 seconds of being visible
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [isVisible, isOpen])

  if (!isVisible) return null

  return (
    <div className={`fixed bottom-4 right-4 z-40 ${className}`}>
      <div className="relative">
        {/* Prompt bubble */}
        {showPrompt && !isOpen && (
          <div className="absolute bottom-full right-0 mb-4 animate-fade-in">
            <div className="bg-white shadow-lg rounded-lg p-4 max-w-xs border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    Potrebujete pomoc?
                  </h4>
                  <p className="text-xs text-gray-600">
                    Náš tím je pripravený vám poradiť s výberom produktov
                  </p>
                </div>
                <button
                  onClick={() => setShowPrompt(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-3 h-3 text-gray-500" />
                </button>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    onToggle()
                    setShowPrompt(false)
                  }}
                  className="text-xs bg-primary text-white px-3 py-1 rounded-full hover:bg-primary/90"
                >
                  Začať chat
                </button>
                <button
                  onClick={() => setShowPrompt(false)}
                  className="text-xs text-gray-600 hover:text-gray-900"
                >
                  Neskôr
                </button>
              </div>
              
              {/* Arrow */}
              <div className="absolute bottom-0 right-6 transform translate-y-full">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
              </div>
            </div>
          </div>
        )}

        {/* Main trigger button */}
        <button
          onClick={onToggle}
          className={`group relative w-16 h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
            isOpen 
              ? 'bg-gray-500 hover:bg-gray-600' 
              : 'bg-primary hover:bg-primary/90'
          } text-white`}
        >
          {isOpen ? (
            <Minimize2 className="w-6 h-6 mx-auto" />
          ) : (
            <MessageCircle className="w-6 h-6 mx-auto" />
          )}
          
          {/* Unread badge */}
          {unreadCount > 0 && !isOpen && (
            <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 text-xs bg-red-500 text-white flex items-center justify-center animate-bounce">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          
          {/* Pulse animation when not open */}
          {!isOpen && (
            <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75"></div>
          )}
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-full right-1/2 transform translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-gray-900 text-white px-3 py-1 rounded text-xs whitespace-nowrap">
            {isOpen ? 'Minimalizovať chat' : 'Otvoriť chat'}
          </div>
        </div>
      </div>
    </div>
  )
}