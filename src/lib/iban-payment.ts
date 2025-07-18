// IBAN Payment System with QR Code Generation
// Uses SEPA QR Code format for European bank transfers

interface IBANPaymentDetails {
  iban: string
  bic?: string
  beneficiaryName: string
  amount: number
  currency: string
  reference: string
  description: string
}

interface CompanyBankDetails {
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

class IBANPaymentSystem {
  private bankDetails: CompanyBankDetails

  constructor() {
    this.bankDetails = {
      iban: process.env.COMPANY_IBAN || 'SK31 1200 0000 1987 4263 7541',
      bic: process.env.COMPANY_BIC || 'GIBASKBX',
      beneficiaryName: process.env.COMPANY_NAME || 'Faborino s.r.o.',
      address: {
        street: process.env.COMPANY_ADDRESS_STREET || 'Hlavná 123',
        city: process.env.COMPANY_ADDRESS_CITY || 'Žilina',
        postalCode: process.env.COMPANY_ADDRESS_POSTAL || '01001',
        country: process.env.COMPANY_ADDRESS_COUNTRY || 'SK'
      }
    }
  }

  // Generate payment reference (variable symbol)
  generatePaymentReference(orderId: string): string {
    // Create a unique reference from order ID
    const timestamp = Date.now().toString().slice(-6)
    const orderNumber = orderId.replace(/[^0-9]/g, '').slice(-4).padStart(4, '0')
    return `${orderNumber}${timestamp}`
  }

  // Generate SEPA QR Code data
  generateQRCodeData(paymentDetails: IBANPaymentDetails): string {
    // EPC QR Code format according to European Payments Council guidelines
    const qrData = [
      'BCD',                                    // Service Tag
      '002',                                    // Version
      '1',                                      // Character set (1 = UTF-8)
      'SCT',                                    // Identification (SEPA Credit Transfer)
      paymentDetails.bic || '',                 // BIC (optional)
      paymentDetails.beneficiaryName,           // Beneficiary Name
      paymentDetails.iban,                      // Beneficiary IBAN
      `${paymentDetails.currency}${paymentDetails.amount.toFixed(2)}`, // Amount
      '',                                       // Purpose (optional)
      paymentDetails.reference,                 // Remittance Information (Structured)
      paymentDetails.description               // Remittance Information (Unstructured)
    ]

    return qrData.join('\n')
  }

  // Create payment details for order
  createPaymentDetails(
    orderId: string,
    amount: number,
    currency: string = 'EUR',
    description?: string
  ): IBANPaymentDetails {
    const reference = this.generatePaymentReference(orderId)
    
    return {
      iban: this.bankDetails.iban,
      bic: this.bankDetails.bic,
      beneficiaryName: this.bankDetails.beneficiaryName,
      amount: amount,
      currency: currency,
      reference: reference,
      description: description || `Faborino objednávka #${orderId}`
    }
  }

  // Generate QR code for payment
  async generatePaymentQRCode(paymentDetails: IBANPaymentDetails): Promise<string> {
    // This would normally use a QR code library
    // For now, return the data that should be encoded
    return this.generateQRCodeData(paymentDetails)
  }

  // Format payment instructions for display
  formatPaymentInstructions(paymentDetails: IBANPaymentDetails): {
    title: string
    instructions: string[]
    paymentDetails: Array<{ label: string; value: string }>
  } {
    return {
      title: 'Platba bankovým prevodom',
      instructions: [
        'Prihláste sa do svojho internetového bankovníctva',
        'Vytvorte nový prevod na účet príjemcu',
        'Zadajte údaje presne ako sú uvedené nižšie',
        'Potvrďte platbu v banke',
        'Objednávka bude spracovaná po pripísaní platby'
      ],
      paymentDetails: [
        {
          label: 'Príjemca',
          value: paymentDetails.beneficiaryName
        },
        {
          label: 'IBAN',
          value: this.formatIBAN(paymentDetails.iban)
        },
        {
          label: 'BIC/SWIFT',
          value: paymentDetails.bic || ''
        },
        {
          label: 'Suma',
          value: `${paymentDetails.amount.toFixed(2)} ${paymentDetails.currency}`
        },
        {
          label: 'Variabilný symbol',
          value: paymentDetails.reference
        },
        {
          label: 'Poznámka',
          value: paymentDetails.description
        }
      ]
    }
  }

  // Format IBAN for display (with spaces)
  private formatIBAN(iban: string): string {
    return iban.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
  }

  // Validate IBAN format
  validateIBAN(iban: string): boolean {
    const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/
    const cleanIBAN = iban.replace(/\s/g, '').toUpperCase()
    return ibanRegex.test(cleanIBAN)
  }

  // Check if payment was received (this would connect to bank API)
  async checkPaymentStatus(): Promise<{
    status: 'pending' | 'received' | 'failed'
    amount?: number
    receivedAt?: Date
  }> {
    // This would normally check with bank API or webhook
    // For now, return pending status
    return {
      status: 'pending'
    }
  }

  // Get company bank details
  getBankDetails(): CompanyBankDetails {
    return this.bankDetails
  }
}

export const ibanPaymentSystem = new IBANPaymentSystem()
export type { IBANPaymentDetails, CompanyBankDetails }