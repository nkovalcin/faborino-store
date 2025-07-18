'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Maximize2, 
  User,
  Bot,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  Smile
} from 'lucide-react'
import { ChatWidgetTrigger } from './chat-widget-trigger'

interface Message {
  id: string
  text: string
  sender: 'user' | 'agent' | 'bot'
  timestamp: Date
  avatar?: string
  senderName?: string
  status?: 'sending' | 'sent' | 'delivered' | 'read'
}

interface LiveChatProps {
  className?: string
}

export function LiveChat({ className = '' }: LiveChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Ahoj! Som tu, aby som vám pomohol s výberom Montessori nábytku. Ako sa máte?',
      sender: 'agent',
      timestamp: new Date(),
      senderName: 'Michaela',
      status: 'delivered'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [agentStatus, setAgentStatus] = useState<'online' | 'away' | 'busy'>('online')
  const [unreadCount, setUnreadCount] = useState(0)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setUnreadCount(0)
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Simulate agent responses
  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1].sender === 'user') {
      setIsTyping(true)
      const timer = setTimeout(() => {
        const responses = [
          'Ďakujem za vašu otázku! Rád vám pomôžem s výberom vhodného produktu.',
          'To je skvelý výber! Tento produkt je veľmi obľúbený medzi našimi zákazníkmi.',
          'Môžem vám odporučiť niekoľko podobných produktov, ktoré by mohli byť vhodné.',
          'Pre vaše dieťa odporúčam pozrieť si našu kategóriu produktov pre daný vek.',
          'Ak máte ešte nejaké otázky, neváhajte sa opýtať!'
        ]
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: randomResponse,
          sender: 'agent',
          timestamp: new Date(),
          senderName: 'Michaela',
          status: 'delivered'
        }])
        
        setIsTyping(false)
        
        if (!isOpen || isMinimized) {
          setUnreadCount(prev => prev + 1)
        }
      }, 1500 + Math.random() * 1000)
      
      return () => clearTimeout(timer)
    }
  }, [messages, isOpen, isMinimized])

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return
    
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    }
    
    setMessages(prev => [...prev, newMessage])
    setInputMessage('')
    
    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
      ))
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getStatusColor = (status: typeof agentStatus) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'busy': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: typeof agentStatus) => {
    switch (status) {
      case 'online': return 'Online'
      case 'away': return 'Nedostupná'
      case 'busy': return 'Zaneprázdnená'
      default: return 'Offline'
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('sk-SK', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const quickResponses = [
    '👋 Ahoj!',
    '❓ Mám otázku',
    '📦 Informácie o produktoch',
    '🚚 Dodanie a doprava',
    '💳 Platobné možnosti',
    '📞 Kontakt'
  ]

  if (!isOpen) {
    return (
      <ChatWidgetTrigger
        onToggle={() => setIsOpen(true)}
        isOpen={isOpen}
        unreadCount={unreadCount}
        className={className}
      />
    )
  }

  return (
    <div className={`fixed bottom-4 right-4 z-40 ${className}`}>
      <Card className={`w-96 h-96 shadow-xl transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-[500px]'
      }`}>
        {/* Header */}
        <CardHeader className="p-4 bg-primary text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(agentStatus)}`} />
              </div>
              <div>
                <h3 className="font-medium text-sm">Michaela</h3>
                <p className="text-xs text-white/80">{getStatusText(agentStatus)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Messages */}
            <CardContent className="p-4 h-80 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`p-3 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-charcoal'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-70">
                            {formatTime(message.timestamp)}
                          </span>
                          {message.sender === 'user' && message.status && (
                            <div className="flex items-center gap-1">
                              {message.status === 'sending' && (
                                <Clock className="w-3 h-3 opacity-70" />
                              )}
                              {message.status === 'delivered' && (
                                <CheckCircle className="w-3 h-3 opacity-70" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {message.sender !== 'user' && (
                      <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                        <User className="w-3 h-3 text-gray-500" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                      <Bot className="w-3 h-3 text-gray-500" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            <Separator />

            {/* Quick Responses */}
            <div className="p-3 bg-gray-50">
              <div className="flex flex-wrap gap-2">
                {quickResponses.map((response, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 px-2"
                    onClick={() => {
                      setInputMessage(response)
                      inputRef.current?.focus()
                    }}
                  >
                    {response}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Input */}
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Napíšte správu..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="w-8 h-8 p-0"
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-2 text-xs text-muted">
                <span>Zvyčajne odpovedáme do 2 minút</span>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 hover:text-primary">
                    <Phone className="w-3 h-3" />
                    Zavolať
                  </button>
                  <button className="flex items-center gap-1 hover:text-primary">
                    <Mail className="w-3 h-3" />
                    Email
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}