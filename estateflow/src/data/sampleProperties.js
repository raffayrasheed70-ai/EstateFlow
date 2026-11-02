import { daysAgoISO } from '../utils/dates'

// SAMPLE DATA (names and numbers are fictional) — these listings are made up so the app has something to show
// on first launch. They are not real properties, prices or addresses.
// Image URLs point to Unsplash stock photos; if one fails to load the UI shows
// a placeholder instead.

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=70`

const rows = [
  {
    id: 'prop-sample-1',
    title: 'Modern 1 Kanal House in DHA Phase 6',
    description:
      'Spacious modern house with a double-height lounge, covered parking for three cars, a landscaped lawn and a separate servant quarter. Close to schools and parks.',
    price: 85000000,
    type: 'House',
    listingType: 'For Sale',
    city: 'Lahore',
    address: 'DHA Phase 6, Block C',
    bedrooms: 5,
    bathrooms: 6,
    area: 1,
    areaUnit: 'Kanal',
    imageUrl: img('photo-1568605114967-8130f3a36994'),
    status: 'Available',
    ownerName: 'Ali Raza',
    contactNumber: '0300 1112233',
    daysAgo: 4,
  },
  {
    id: 'prop-sample-2',
    title: 'Luxury 3-Bed Apartment with City View',
    description:
      'Bright apartment on the 12th floor with floor-to-ceiling windows, a modular kitchen, gym and backup power. Secure building with 24/7 front desk.',
    price: 32500000,
    type: 'Apartment',
    listingType: 'For Sale',
    city: 'Islamabad',
    address: 'Gulberg Greens, Tower B',
    bedrooms: 3,
    bathrooms: 3,
    area: 1850,
    areaUnit: 'Sq Ft',
    imageUrl: img('photo-1545324418-cc1a3fa10c00'),
    status: 'Available',
    ownerName: 'Fatima Noor',
    contactNumber: '0321 2223344',
    daysAgo: 12,
  },
  {
    id: 'prop-sample-3',
    title: 'Garden Villa with Private Pool',
    description:
      'Elegant villa set in a quiet gated community, featuring a private pool, covered terrace, home theatre room and a fully fitted kitchen. Move-in ready.',
    price: 145000000,
    type: 'Villa',
    listingType: 'For Sale',
    city: 'Karachi',
    address: 'Bahria Town, Precinct 10',
    bedrooms: 6,
    bathrooms: 7,
    area: 2,
    areaUnit: 'Kanal',
    imageUrl: img('photo-1613490493576-7fde63acd811'),
    status: 'Pending',
    ownerName: 'Hamza Khalid',
    contactNumber: '0333 3334455',
    daysAgo: 21,
  },
  {
    id: 'prop-sample-4',
    title: 'Prime Commercial Shop on Main Boulevard',
    description:
      'Ground-floor commercial unit with high foot traffic, double-height frontage and a mezzanine. Ideal for a showroom, bank branch or retail outlet.',
    price: 120000,
    type: 'Commercial',
    listingType: 'For Rent',
    city: 'Multan',
    address: 'Gulgasht Colony, Main Boulevard',
    bedrooms: 0,
    bathrooms: 2,
    area: 900,
    areaUnit: 'Sq Ft',
    imageUrl: img('photo-1486406146926-c627a92ad1ab'),
    status: 'Available',
    ownerName: 'Imran Siddiqui',
    contactNumber: '0345 4445566',
    daysAgo: 30,
  },
  {
    id: 'prop-sample-5',
    title: 'Cozy 10 Marla Family Home',
    description:
      'Well-maintained family home with a neat lawn, tiled floors, a large kitchen and a dedicated drawing room. Walking distance to a mosque and market.',
    price: 55000,
    type: 'House',
    listingType: 'For Rent',
    city: 'Faisalabad',
    address: 'Citi Housing, Block D',
    bedrooms: 4,
    bathrooms: 4,
    area: 10,
    areaUnit: 'Marla',
    imageUrl: img('photo-1564013799919-ab600027ffc6'),
    status: 'Rented',
    ownerName: 'Nadia Hussain',
    contactNumber: '0301 5556677',
    daysAgo: 55,
  },
  {
    id: 'prop-sample-6',
    title: 'Furnished 2-Bed Apartment near Mall',
    description:
      'Fully furnished two-bedroom apartment with a balcony, high-speed internet ready, and parking. Suitable for a small family or working professionals.',
    price: 75000,
    type: 'Apartment',
    listingType: 'For Rent',
    city: 'Lahore',
    address: 'Gulberg III, near MM Alam Road',
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    areaUnit: 'Sq Ft',
    imageUrl: img('photo-1512917774080-9991f1c4c750'),
    status: 'Available',
    ownerName: 'Omar Farooq',
    contactNumber: '0312 6667788',
    daysAgo: 8,
  },
]

export function buildSampleProperties() {
  return rows.map(({ daysAgo, ...property }) => ({
    ...property,
    createdAt: daysAgoISO(daysAgo),
  }))
}
