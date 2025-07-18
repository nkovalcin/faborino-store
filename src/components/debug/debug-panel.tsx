'use client'

import React, { useState, useEffect } from 'react'
import { Bug, X, Trash2, RefreshCw, ShoppingCart, Database, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartStore } from '@/stores/cart'
import { FEATURE_FLAGS, DEV_TOOLS } from '@/lib/debug'

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('cart')
  const { items, totalAmount, itemCount } = useCartStore()

  // Only show in development
  if (!FEATURE_FLAGS.SHOW_DEBUG_PANEL) {
    return null
  }

  const tabs = [
    { id: 'cart', label: 'Cart', icon: ShoppingCart },
    { id: 'storage', label: 'Storage', icon: Database },
    { id: 'tools', label: 'Tools', icon: Zap },
  ]

  return (
    <>
      {/* Debug Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
        title="Debug Panel"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Bug className="w-5 h-5" />}
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 max-h-96 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
          <div className="bg-red-500 text-white p-3">
            <h3 className="font-semibold text-sm">Debug Panel</h3>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-red-50 text-red-600 border-b-2 border-red-500'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-3 max-h-64 overflow-y-auto">
            {activeTab === 'cart' && (
              <div className="space-y-3">
                <div className="text-xs">
                  <div className="font-medium text-gray-900 mb-1">Cart State</div>
                  <div className="text-gray-600">
                    Items: {itemCount} | Total: €{totalAmount.toFixed(2)}
                  </div>
                </div>
                
                {items.length > 0 ? (
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="text-xs bg-gray-50 p-2 rounded">
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-gray-600">
                          Qty: {item.quantity} | €{item.price}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">Cart is empty</div>
                )}
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={DEV_TOOLS.resetCart}
                  className="w-full text-xs"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Reset Cart
                </Button>
              </div>
            )}

            {activeTab === 'storage' && (
              <div className="space-y-3">
                <div className="text-xs">
                  <div className="font-medium text-gray-900 mb-1">Local Storage</div>
                  <div className="space-y-1">
                    {Object.keys(localStorage).map((key) => (
                      <div key={key} className="flex justify-between items-center bg-gray-50 p-1 rounded">
                        <span className="truncate">{key}</span>
                        <span className="text-gray-500">
                          {localStorage.getItem(key)?.length || 0} chars
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={DEV_TOOLS.clearAllLocalStorage}
                  className="w-full text-xs"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear All Storage
                </Button>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={DEV_TOOLS.fillTestData}
                  className="w-full text-xs"
                >
                  Fill Test Data
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={DEV_TOOLS.logCartState}
                  className="w-full text-xs"
                >
                  Log Cart State
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => DEV_TOOLS.simulateError('Test error')}
                  className="w-full text-xs"
                >
                  Simulate Error
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="w-full text-xs"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Reload Page
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}