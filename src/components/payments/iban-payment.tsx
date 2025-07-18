'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  QrCode, 
  Copy, 
  Check, 
  Download,
  Smartphone,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react'
import QRCode from 'qrcode'

interface IBANPaymentProps {
  paymentData: {
    orderId: string
    reference: string
    amount: number
    currency: string
    qrCodeData: string
    instructions: {
      title: string
      instructions: string[]
      paymentDetails: Array<{ label: string; value: string }>
    }
    bankDetails: {
      iban: string
      bic: string
      beneficiaryName: string
      address: {
        street: string
        city: string
        postalCode: string
        country: string
      }
    }
  }
  onPaymentConfirm: () => void
}

export function IBANPayment({ paymentData, onPaymentConfirm }: IBANPaymentProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [copiedField, setCopiedField] = useState<string>('')
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'confirmed'>('pending')

  useEffect(() => {
    generateQRCode()
  }, [paymentData.qrCodeData]) // eslint-disable-line react-hooks/exhaustive-deps

  const generateQRCode = async () => {
    try {
      const url = await QRCode.toDataURL(paymentData.qrCodeData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#2D3748',
          light: '#FFFFFF'
        }
      })
      setQrCodeUrl(url)
    } catch (error) {
      console.error('QR code generation error:', error)
    }
  }

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(''), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a')
      link.download = `qr-code-${paymentData.orderId}.png`
      link.href = qrCodeUrl
      link.click()
    }
  }

  const checkPaymentStatus = async () => {
    setPaymentStatus('checking')
    try {
      const response = await fetch(`/api/payments/iban/create?reference=${paymentData.reference}`)
      const data = await response.json()
      
      if (data.success && data.payment.status === 'received') {
        setPaymentStatus('confirmed')
        onPaymentConfirm()
      } else {
        setPaymentStatus('pending')
      }
    } catch (error) {
      console.error('Payment status check failed:', error)
      setPaymentStatus('pending')
    }
  }

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <QrCode className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-charcoal">Platba bankovým prevodom</h3>
                <p className="text-sm text-muted">Objednávka #{paymentData.orderId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={paymentStatus === 'confirmed' ? 'default' : 'secondary'}>
                {paymentStatus === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                {paymentStatus === 'checking' && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                {paymentStatus === 'confirmed' && <CheckCircle className="w-3 h-3 mr-1" />}
                {paymentStatus === 'pending' && 'Čaká na platbu'}
                {paymentStatus === 'checking' && 'Kontroluje sa...'}
                {paymentStatus === 'confirmed' && 'Platba prijatá'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              QR kód platby
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-4">
              <div className="inline-block p-4 bg-white rounded-lg shadow-sm border">
                {qrCodeUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={qrCodeUrl} 
                      alt="QR kód pre platbu" 
                      className="mx-auto"
                      width={300}
                      height={300}
                    />
                  </>
                ) : (
                  <div className="w-[300px] h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="loading-spinner" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-sm text-muted">
                <Smartphone className="w-4 h-4" />
                <span>Naskenujte QR kód vo svojej bankovej aplikácii</span>
              </div>
              
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={downloadQRCode}>
                  <Download className="w-4 h-4 mr-2" />
                  Stiahnuť QR
                </Button>
                <Button variant="outline" size="sm" onClick={checkPaymentStatus}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Skontrolovať platbu
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Platobné údaje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentData.instructions.paymentDetails.map((detail, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-charcoal">{detail.label}</p>
                    <p className="text-sm text-muted font-mono">{detail.value}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(detail.value, detail.label)}
                  >
                    {copiedField === detail.label ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Pokyny na platbu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-3">
              {paymentData.instructions.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-sm text-charcoal">{instruction}</p>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Dôležité upozornenie
                  </p>
                  <p className="text-sm text-blue-800">
                    Prosím uveďte správny variabilný symbol <strong>{paymentData.reference}</strong> pre správne spárovanie platby. 
                    Bez tohto symbolu nebude možné vašu platbu identifikovať.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Confirmation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-charcoal">
                Platbu som odoslal/a
              </p>
              <p className="text-sm text-muted">
                Objednávka bude spracovaná po pripísaní platby na účet
              </p>
            </div>
            <Button onClick={onPaymentConfirm}>
              <CheckCircle className="w-5 h-5 mr-2" />
              Potvrdiť platbu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}