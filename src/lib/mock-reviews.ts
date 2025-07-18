import { Review } from './types'

export const mockReviews: Review[] = [
  {
    id: '1',
    productId: '1',
    customerId: 'customer1',
    customerName: 'Zuzana K.',
    rating: 5,
    title: 'Perfektná kvalita a krásny design',
    comment: 'Táto zostava je naozaj krásna a kvalitná. Moja 2-ročná dcérka si s ní hrá celé hodiny. Montáž bola jednoduchá a všetko sedí perfektne. Odporúčam každému, kto hľadá kvalitný Montessori nábytok.',
    verified: true,
    helpful: 12,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    productId: '1',
    customerId: 'customer2',
    customerName: 'Marek D.',
    rating: 4,
    title: 'Veľmi spokojný s nákupom',
    comment: 'Kvalitné spracovanie, pekný dizajn. Jediná nevýhoda je, že súčiastky mohli byť lepšie označené pri montáži. Celkovo však veľmi spokojný.',
    verified: true,
    helpful: 8,
    createdAt: new Date('2024-01-10')
  },
  {
    id: '3',
    productId: '1',
    customerId: 'customer3',
    customerName: 'Lucia M.',
    rating: 5,
    title: 'Najlepšia investícia pre dieťa',
    comment: 'Môj syn má 18 mesiacov a táto zostava mu umožňuje byť nezávislý. Krásne spracovanie, bezpečné materiály. Faborino opäť preukázalo svoju kvalitu!',
    verified: true,
    helpful: 15,
    createdAt: new Date('2024-01-05')
  },
  {
    id: '4',
    productId: '1',
    customerId: 'customer4',
    customerName: 'Petra S.',
    rating: 4,
    title: 'Krásny a funkčný',
    comment: 'Veľmi sa nám páči dizajn a funkcionalita. Materiál je kvalitný a spracovanie na vysokej úrovni. Rýchla dodávka.',
    verified: false,
    helpful: 5,
    createdAt: new Date('2023-12-28')
  },
  {
    id: '5',
    productId: '1',
    customerId: 'customer5',
    customerName: 'Andrea B.',
    rating: 5,
    title: 'Absolútne dokonalé!',
    comment: 'Nemôžem si vynachváliť túto zostavu. Kvalita je výnimočná, dizajn krásny a funkčný. Dcérka sa stala vďaka tomu oveľa samostatnejšou.',
    verified: true,
    helpful: 20,
    createdAt: new Date('2023-12-20')
  },
  {
    id: '6',
    productId: '2',
    customerId: 'customer6',
    customerName: 'Michal H.',
    rating: 5,
    title: 'Výborná kvalita za túto cenu',
    comment: 'Veľmi kvalitný produkt, presne ako som očakával. Syn je nadšený a každý deň si s tým hrá. Odporúčam!',
    verified: true,
    helpful: 9,
    createdAt: new Date('2024-01-12')
  },
  {
    id: '7',
    productId: '2',
    customerId: 'customer7',
    customerName: 'Katarína V.',
    rating: 4,
    title: 'Spokojná mamička',
    comment: 'Pekný produktový dizajn, kvalitné materiály. Jediné mínus je doba dodania, ktorá bola trocha dlhšia ako sľúbená.',
    verified: true,
    helpful: 3,
    createdAt: new Date('2024-01-08')
  },
  {
    id: '8',
    productId: '3',
    customerId: 'customer8',
    customerName: 'Tomáš R.',
    rating: 5,
    title: 'Náš najlepší nákup',
    comment: 'Úžasná kvalita, nádherný dizajn. Dcérka si s tým hrá od rána do večera. Určite si objednáme aj ďalšie produkty.',
    verified: true,
    helpful: 14,
    createdAt: new Date('2024-01-03')
  },
  {
    id: '9',
    productId: '3',
    customerId: 'customer9',
    customerName: 'Silvia K.',
    rating: 4,
    title: 'Veľmi pekný produkt',
    comment: 'Kvalitné spracovanie, pekný vzhľad. Syn je spokojný, my tiež. Jediné čo by som vylepšila je balenie.',
    verified: false,
    helpful: 6,
    createdAt: new Date('2023-12-25')
  },
  {
    id: '10',
    productId: '4',
    customerId: 'customer10',
    customerName: 'Radoslav P.',
    rating: 5,
    title: 'Excelentná kvalita',
    comment: 'Perfektné spracovanie, krásny dizajn. Tento produkt naozaj podporuje nezávislosť dieťaťa podľa Montessori metódy.',
    verified: true,
    helpful: 11,
    createdAt: new Date('2023-12-15')
  }
]

export function getMockReviewsForProduct(productId: string): Review[] {
  return mockReviews.filter(review => review.productId === productId)
}

export function getReviewStats(reviews: Review[]) {
  const total = reviews.length
  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / total
  
  return {
    total,
    average: Math.round(average * 10) / 10,
    ratings: {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    }
  }
}