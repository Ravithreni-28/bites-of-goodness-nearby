
import { MapPin } from "lucide-react";

export interface FoodListing {
  id: string;
  title: string;
  description: string;
  price: number | null; // null means free
  quantity: {
    amount: number;
    unit: string;
  };
  imageUrl: string;
  location: {
    display: string;
    distance: number; // in km
  };
  postedAt: Date;
  seller: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
  };
  tags: string[];
  dietary: string[];
}

export const mockFoodListings: FoodListing[] = [
  {
    id: "1",
    title: "Homemade Hyderabadi Biryani",
    description: "Authentic Hyderabadi dum biryani made with basmati rice and tender chicken. Made too much for family dinner. Enough for 3-4 people.",
    price: 250,
    quantity: {
      amount: 1,
      unit: "handi"
    },
    imageUrl: "https://source.unsplash.com/W3SEyZODn8U",
    location: {
      display: "Banjara Hills",
      distance: 1.2
    },
    postedAt: new Date(Date.now() - 3600000), // 1 hour ago
    seller: {
      id: "user1",
      name: "Arjun R.",
      avatar: "https://randomuser.me/api/portraits/men/44.jpg",
      rating: 4.8
    },
    tags: ["homemade", "biryani", "dinner"],
    dietary: ["non-vegetarian"]
  },
  {
    id: "2",
    title: "Osmania Biscuits",
    description: "Freshly baked Osmania biscuits. Perfect with Irani chai. Giving away extra from my bakery.",
    price: null, // Free
    quantity: {
      amount: 24,
      unit: "pieces"
    },
    imageUrl: "https://source.unsplash.com/nP11TkjxJ7s",
    location: {
      display: "Charminar",
      distance: 2.5
    },
    postedAt: new Date(Date.now() - 7200000), // 2 hours ago
    seller: {
      id: "user2",
      name: "Mohammed F.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.6
    },
    tags: ["baked", "sweet", "snack"],
    dietary: ["vegetarian"]
  },
  {
    id: "3",
    title: "Homemade Mirchi ka Salan",
    description: "Authentic spicy mirchi ka salan. Perfect side dish for biryani. Made extra for a family gathering.",
    price: 180,
    quantity: {
      amount: 500,
      unit: "grams"
    },
    imageUrl: "https://source.unsplash.com/6hnDJG4dO5o",
    location: {
      display: "Gachibowli",
      distance: 3.2
    },
    postedAt: new Date(Date.now() - 5400000), // 1.5 hours ago
    seller: {
      id: "user3",
      name: "Priya S.",
      avatar: "https://randomuser.me/api/portraits/women/67.jpg",
      rating: 4.9
    },
    tags: ["hyderabadi", "spicy", "curry"],
    dietary: ["vegetarian"]
  },
  {
    id: "4",
    title: "Irani Chai and Samosa",
    description: "Fresh samosas with Irani chai. Have extra from my cafe that would go to waste. Come pick up quickly!",
    price: null, // Free
    quantity: {
      amount: 6,
      unit: "servings"
    },
    imageUrl: "https://source.unsplash.com/y8OPPvo_7Hk",
    location: {
      display: "Himayat Nagar",
      distance: 0.8
    },
    postedAt: new Date(Date.now() - 1800000), // 30 mins ago
    seller: {
      id: "user4",
      name: "Rajesh K.",
      avatar: "https://randomuser.me/api/portraits/men/55.jpg",
      rating: 4.7
    },
    tags: ["snack", "tea", "evening"],
    dietary: ["vegetarian"]
  },
  {
    id: "5",
    title: "Double Ka Meetha",
    description: "Traditional Hyderabadi dessert. Made too much for a family function. Sweet and delicious!",
    price: 200,
    quantity: {
      amount: 500,
      unit: "grams"
    },
    imageUrl: "https://source.unsplash.com/c3LZ-FpF8RY",
    location: {
      display: "Mehdipatnam",
      distance: 2.8
    },
    postedAt: new Date(Date.now() - 9000000), // 2.5 hours ago
    seller: {
      id: "user5",
      name: "Lakshmi P.",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      rating: 4.9
    },
    tags: ["dessert", "sweet", "hyderabadi"],
    dietary: ["vegetarian", "contains dairy"]
  },
  {
    id: "6",
    title: "Homemade Haleem",
    description: "Authentic Hyderabadi haleem made with wheat, lentils and meat. Slow-cooked for hours. Special Ramzan recipe.",
    price: 300,
    quantity: {
      amount: 750,
      unit: "grams"
    },
    imageUrl: "https://source.unsplash.com/aX_ljOOyWJY",
    location: {
      display: "Tolichowki",
      distance: 1.5
    },
    postedAt: new Date(Date.now() - 10800000), // 3 hours ago
    seller: {
      id: "user6",
      name: "Imran S.",
      avatar: "https://randomuser.me/api/portraits/men/26.jpg",
      rating: 4.7
    },
    tags: ["haleem", "dinner", "ramzan"],
    dietary: ["non-vegetarian", "contains wheat"]
  }
];

export const dietaryTags = [
  "vegetarian", 
  "vegan", 
  "non-vegetarian",
  "gluten-free", 
  "dairy-free", 
  "nut-free", 
  "organic", 
  "contains nuts",
  "contains dairy",
  "contains wheat",
  "jain"
];

export const foodTags = [
  "homemade", 
  "fresh", 
  "dinner", 
  "lunch", 
  "breakfast", 
  "dessert", 
  "healthy", 
  "baked", 
  "sweet", 
  "spicy", 
  "biryani",
  "curry",
  "snack", 
  "hyderabadi",
  "south indian",
  "north indian",
  "street food",
  "haleem",
  "ramzan",
  "festive"
];
