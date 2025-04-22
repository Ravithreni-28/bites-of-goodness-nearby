import { addDays, subHours, subDays } from 'date-fns';

export interface FoodListing {
  id: string;
  title: string;
  description: string;
  price: number | null; // null means free
  quantity: number;
  imageUrl: string;
  location: {
    display: string; // Human readable location
    distance: number; // Distance in km
    coordinates?: [number, number]; // [latitude, longitude]
  };
  postedAt: Date;
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    phone?: string;
  };
  tags: string[];
  dietary: string[]; // vegetarian, vegan, contains_nuts, etc.
}

export const dietaryTags = [
  'vegetarian',
  'vegan',
  'non-vegetarian',
  'gluten-free',
  'dairy-free',
  'nut-free',
  'contains-eggs',
  'contains-nuts',
  'contains-dairy',
  'spicy',
  'no onion no garlic'
];

export const foodTags = [
  'breakfast',
  'lunch',
  'dinner',
  'snacks',
  'dessert',
  'biryani',
  'curry',
  'street-food',
  'south-indian',
  'north-indian',
  'chinese',
  'continental',
  'sweets',
  'bakery',
  'homemade',
  'organic',
  'healthy',
  'fast-food'
];

export const mockFoodListings: FoodListing[] = [
  {
    id: '1',
    title: 'Homemade Biryani',
    description: 'Delicious homemade chicken biryani, cooked today. Can serve 3-4 people. Fragrant basmati rice with tender chicken pieces.',
    price: 299,
    quantity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    location: {
      display: 'Himayatnagar, Hyderabad',
      distance: 2.3,
      coordinates: [17.4037, 78.4584]
    },
    postedAt: subHours(new Date(), 2),
    seller: {
      id: 'user1',
      name: 'Priya S.',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      rating: 4.8,
      phone: '+91 9876543210'
    },
    tags: ['biryani', 'lunch', 'dinner', 'non-veg'],
    dietary: ['Non-vegetarian']
  },
  {
    id: '2',
    title: 'Paneer Butter Masala',
    description: 'Fresh homemade paneer butter masala with 6 rotis. Made with organic ingredients and pure ghee. No artificial flavors.',
    price: 180,
    quantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1631452180539-96aca7d48617?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    location: {
      display: 'Banjara Hills, Hyderabad',
      distance: 4.7,
      coordinates: [17.4156, 78.4347]
    },
    postedAt: subHours(new Date(), 5),
    seller: {
      id: 'user2',
      name: 'Rahul M.',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4.5,
      phone: '+91 8765432109'
    },
    tags: ['paneer', 'dinner', 'lunch', 'curry'],
    dietary: ['Vegetarian']
  },
  {
    id: '3',
    title: 'Leftover Dal & Rice',
    description: 'Fresh dal and rice from today\'s lunch. Still warm and very tasty. Free to anyone who can pick up in the next hour.',
    price: null,
    quantity: 1,
    imageUrl: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    location: {
      display: 'Ameerpet, Hyderabad',
      distance: 1.2,
      coordinates: [17.4375, 78.4483]
    },
    postedAt: subHours(new Date(), 1),
    seller: {
      id: 'user3',
      name: 'Ananya K.',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      rating: 4.2,
      phone: '+91 7654321098'
    },
    tags: ['dal', 'rice', 'lunch', 'quick-pickup'],
    dietary: ['Vegetarian']
  },
  {
    id: '4',
    title: 'Homemade Gulab Jamun',
    description: 'Freshly made gulab jamun for dessert. Made with khoya and dipped in cardamom sugar syrup. Pack of 8 pieces.',
    price: 150,
    quantity: 8,
    imageUrl: 'https://images.unsplash.com/photo-1615832494873-b3556edfd726?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    location: {
      display: 'Begumpet, Hyderabad',
      distance: 3.8,
      coordinates: [17.4422, 78.4677]
    },
    postedAt: subHours(new Date(), 8),
    seller: {
      id: 'user4',
      name: 'Vikram S.',
      avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
      rating: 4.9,
      phone: '+91 6543210987'
    },
    tags: ['dessert', 'sweets', 'gulab-jamun'],
    dietary: ['Vegetarian', 'Contains Sugar']
  },
  {
    id: '5',
    title: 'Homestyle Veg Thali',
    description: 'Complete vegetarian thali with dal, sabzi, rice, 4 rotis, pickle, and salad. Home-cooked with love and traditional spices.',
    price: 220,
    quantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1567337710282-00832b415979?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    location: {
      display: 'Secunderabad, Hyderabad',
      distance: 5.9,
      coordinates: [17.4399, 78.4983]
    },
    postedAt: subDays(new Date(), 1),
    seller: {
      id: 'user5',
      name: 'Meera L.',
      avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
      rating: 4.7,
      phone: '+91 5432109876'
    },
    tags: ['thali', 'lunch', 'dinner', 'complete-meal'],
    dietary: ['Vegetarian', 'No Onion No Garlic']
  },
  {
    id: '6',
    title: 'Andhra Style Chicken Curry',
    description: 'Spicy Andhra-style chicken curry with tender pieces of chicken. Best enjoyed with rice or roti. Serves 3 people.',
    price: 280,
    quantity: 3,
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    location: {
      display: 'Kukatpally, Hyderabad',
      distance: 8.2,
      coordinates: [17.4849, 78.4138]
    },
    postedAt: subHours(new Date(), 20),
    seller: {
      id: 'user6',
      name: 'Karthik N.',
      avatar: 'https://randomuser.me/api/portraits/men/78.jpg',
      rating: 4.6,
      phone: '+91 4321098765'
    },
    tags: ['chicken', 'curry', 'spicy', 'andhra'],
    dietary: ['Non-vegetarian', 'Spicy']
  },
  {
    id: '7',
    title: 'Mysore Masala Dosa',
    description: 'Crispy Mysore masala dosa with potato filling and spicy chutney spread inside. Comes with coconut chutney and sambar.',
    price: 120,
    quantity: 3,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f86762b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    location: {
      display: 'Gachibowli, Hyderabad',
      distance: 9.5,
      coordinates: [17.4400, 78.3489]
    },
    postedAt: subDays(new Date(), 2),
    seller: {
      id: 'user7',
      name: 'Lakshmi R.',
      avatar: 'https://randomuser.me/api/portraits/women/89.jpg',
      rating: 4.8,
      phone: '+91 3210987654'
    },
    tags: ['breakfast', 'dosa', 'south-indian'],
    dietary: ['Vegetarian']
  },
  {
    id: '8',
    title: 'Hyderabadi Chicken Haleem',
    description: 'Authentic Hyderabadi chicken haleem, perfect for Iftar or dinner. Rich, flavorful and filling. Made fresh today.',
    price: 320,
    quantity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710a13?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    location: {
      display: 'Charminar, Hyderabad',
      distance: 7.3,
      coordinates: [17.3616, 78.4747]
    },
    postedAt: subHours(new Date(), 12),
    seller: {
      id: 'user8',
      name: 'Farhan M.',
      avatar: 'https://randomuser.me/api/portraits/men/92.jpg',
      rating: 4.9,
      phone: '+91 2109876543'
    },
    tags: ['haleem', 'chicken', 'hyderabadi', 'dinner'],
    dietary: ['Non-vegetarian']
  },
  {
    id: '9',
    title: 'Homemade Veg Samosas',
    description: 'Crispy vegetable samosas with spicy potato filling. Fresh from the kitchen. Pack of 6 pieces with mint chutney.',
    price: 90,
    quantity: 6,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    location: {
      display: 'Dilsukhnagar, Hyderabad',
      distance: 6.1,
      coordinates: [17.3687, 78.5247]
    },
    postedAt: subHours(new Date(), 6),
    seller: {
      id: 'user9',
      name: 'Nandini P.',
      avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
      rating: 4.5,
      phone: '+91 1098765432'
    },
    tags: ['snacks', 'samosa', 'evening'],
    dietary: ['Vegetarian']
  },
  {
    id: '10',
    title: 'Extra Wedding Food',
    description: 'Various items from a wedding dinner including rice, curry, paneer dishes, and desserts. Free to those in need.',
    price: null,
    quantity: 10,
    imageUrl: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    location: {
      display: 'Miyapur, Hyderabad',
      distance: 10.8,
      coordinates: [17.4958, 78.3856]
    },
    postedAt: subHours(new Date(), 4),
    seller: {
      id: 'user10',
      name: 'Ramesh A.',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      rating: 4.6,
      phone: '+91 0987654321'
    },
    tags: ['wedding-food', 'variety', 'donation', 'free'],
    dietary: ['Vegetarian', 'Non-vegetarian']
  }
];

export default mockFoodListings;
