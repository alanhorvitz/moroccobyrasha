import { TransportService } from '../types';

export const transportServices: TransportService[] = [
  {
    id: "transport-001",
    name: "Marrakech Luxury Transfers",
    type: "car",
    description: "Premium sedan car service with professional drivers offering comfort and style for city tours and airport transfers in and around Marrakech.",
    pricePerDay: 80,
    features: [
      "Professional English-speaking drivers",
      "Air conditioning",
      "Bottled water provided",
      "WiFi available",
      "Flexible scheduling"
    ],
    imageUrl: "/images/transport/luxury-sedan.jpg",
    capacity: 3,
    available: true
  },
  {
    id: "transport-002",
    name: "Atlas Mountain 4x4 Adventures",
    type: "4x4",
    description: "Rugged 4x4 vehicles perfect for exploring Morocco's mountainous terrain, desert landscapes, and remote villages with experienced drivers familiar with challenging routes.",
    pricePerDay: 120,
    features: [
      "Off-road capable vehicles",
      "Experienced mountain drivers",
      "Roof racks for luggage",
      "Air conditioning",
      "First aid equipment"
    ],
    imageUrl: "/images/transport/4x4-vehicle.jpg",
    capacity: 5,
    available: true
  },
  {
    id: "transport-003",
    name: "Morocco Group Tours Mini-Bus",
    type: "bus",
    description: "Comfortable mini-buses ideal for small group tours, providing a balance of comfort and economy while traveling between cities and attractions.",
    pricePerDay: 150,
    features: [
      "15-20 passenger capacity",
      "Air conditioning",
      "Reclining seats",
      "Microphone system",
      "Luggage storage"
    ],
    imageUrl: "/images/transport/mini-bus.jpg",
    capacity: 16,
    available: true
  },
  {
    id: "transport-004",
    name: "Casablanca Airport Express",
    type: "airport",
    description: "Reliable airport transfer service operating from Mohammed V International Airport to Casablanca city and surrounding areas with 24/7 availability.",
    pricePerDay: 60,
    features: [
      "Flight tracking",
      "Meet and greet service",
      "24/7 availability",
      "Fixed transparent pricing",
      "Child seats available on request"
    ],
    imageUrl: "/images/transport/airport-transfer.jpg",
    capacity: 4,
    available: true
  },
  {
    id: "transport-005",
    name: "Sahara Desert Expedition Vehicles",
    type: "4x4",
    description: "Specialized 4x4s equipped for desert exploration with experienced drivers who know how to navigate the challenging terrain of the Sahara.",
    pricePerDay: 140,
    features: [
      "Desert-ready 4x4s",
      "Satellite communication devices",
      "Extra fuel and water storage",
      "Desert-experienced drivers",
      "Shade canopies"
    ],
    imageUrl: "/images/transport/desert-4x4.jpg",
    capacity: 6,
    available: true
  },
  {
    id: "transport-006",
    name: "Morocco Family Vans",
    type: "car",
    description: "Spacious vans perfect for family travel with ample space for passengers and luggage, offering comfort for longer journeys between Moroccan destinations.",
    pricePerDay: 100,
    features: [
      "Spacious 7-seat configuration",
      "Extra luggage capacity",
      "Child seats available",
      "Entertainment system",
      "Panoramic windows"
    ],
    imageUrl: "/images/transport/family-van.jpg",
    capacity: 7,
    available: true
  },
  {
    id: "transport-007",
    name: "Fès Medina Electric Carts",
    type: "car",
    description: "Eco-friendly electric carts designed to navigate the narrow streets around Fès medina, providing a convenient solution for luggage transport and short distances.",
    pricePerDay: 40,
    features: [
      "Zero emissions",
      "Narrow streets accessible",
      "Silent operation",
      "Luggage transport capability",
      "Experienced medina drivers"
    ],
    imageUrl: "/images/transport/electric-cart.jpg",
    capacity: 4,
    available: true
  },
  {
    id: "transport-008",
    name: "Moroccan Royal Routes",
    type: "bus",
    description: "Luxury coaches for large group travel between major cities, featuring premium amenities and professional drivers for a comfortable journey across Morocco.",
    pricePerDay: 300,
    features: [
      "30-45 passenger capacity",
      "Onboard restroom",
      "Adjustable seats with extra legroom",
      "Individual AC and reading lights",
      "Entertainment system"
    ],
    imageUrl: "/images/transport/luxury-coach.jpg",
    capacity: 40,
    available: false
  },
  {
    id: "transport-009",
    name: "Marrakech Airport Shuttle",
    type: "airport",
    description: "Scheduled and private shuttle services connecting Marrakech Menara Airport with hotels and riads throughout the city at affordable rates.",
    pricePerDay: 50,
    features: [
      "Scheduled departures",
      "Hotel/riad drop-off",
      "Air conditioning",
      "Flight delay monitoring",
      "Online booking system"
    ],
    imageUrl: "/images/transport/airport-shuttle.jpg",
    capacity: 8,
    available: true
  },
  {
    id: "transport-010",
    name: "Coastal Explorer Convertibles",
    type: "car",
    description: "Convertible cars perfect for exploring Morocco's scenic coastal roads, offering an open-air experience ideal for photography and enjoying beautiful weather.",
    pricePerDay: 90,
    features: [
      "Retractable roof",
      "GPS navigation system",
      "Bluetooth connectivity",
      "Leather seating",
      "Enhanced safety features"
    ],
    imageUrl: "/images/transport/convertible.jpg",
    capacity: 2,
    available: true
  }
];