
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
    title: "Homemade Vegetable Lasagna",
    description: "Freshly made vegetable lasagna. Made too much for my family dinner. Enough for 2-3 people. Pick up only.",
    price: 5.99,
    quantity: {
      amount: 1,
      unit: "tray"
    },
    imageUrl: "https://source.unsplash.com/R-zOqJpAQ3I",
    location: {
      display: "Downtown",
      distance: 0.8
    },
    postedAt: new Date(Date.now() - 3600000), // 1 hour ago
    seller: {
      id: "user1",
      name: "Marie K.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.8
    },
    tags: ["homemade", "italian", "dinner"],
    dietary: ["vegetarian"]
  },
  {
    id: "2",
    title: "Chocolate Chip Cookies",
    description: "Baked too many cookies for a birthday party. Two dozen chocolate chip cookies available.",
    price: 3.50,
    quantity: {
      amount: 24,
      unit: "pieces"
    },
    imageUrl: "https://source.unsplash.com/O5EMzfdxedg",
    location: {
      display: "Rose Hill",
      distance: 1.2
    },
    postedAt: new Date(Date.now() - 7200000), // 2 hours ago
    seller: {
      id: "user2",
      name: "James L.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.6
    },
    tags: ["dessert", "baked", "sweet"],
    dietary: []
  },
  {
    id: "3",
    title: "Chicken Curry with Rice",
    description: "Made extra chicken curry with basmati rice. Spicy and delicious! Enough for 2 people.",
    price: 7.99,
    quantity: {
      amount: 2,
      unit: "servings"
    },
    imageUrl: "https://source.unsplash.com/XaDsH-O2QXs",
    location: {
      display: "Westside",
      distance: 1.5
    },
    postedAt: new Date(Date.now() - 5400000), // 1.5 hours ago
    seller: {
      id: "user3",
      name: "Priya S.",
      avatar: "https://randomuser.me/api/portraits/women/67.jpg",
      rating: 4.9
    },
    tags: ["indian", "spicy", "dinner"],
    dietary: ["gluten-free"]
  },
  {
    id: "4",
    title: "Garden Fresh Salad",
    description: "Fresh garden salad with homegrown vegetables. Giving away as I'm going out of town tomorrow.",
    price: null, // Free
    quantity: {
      amount: 1,
      unit: "large bowl"
    },
    imageUrl: "https://source.unsplash.com/IGfIGP5ONV0",
    location: {
      display: "Greenview",
      distance: 0.6
    },
    postedAt: new Date(Date.now() - 1800000), // 30 mins ago
    seller: {
      id: "user4",
      name: "Thomas H.",
      avatar: "https://randomuser.me/api/portraits/men/55.jpg",
      rating: 4.7
    },
    tags: ["fresh", "healthy", "salad"],
    dietary: ["vegan", "organic"]
  },
  {
    id: "5",
    title: "Homemade Apple Pie",
    description: "Freshly baked apple pie. Made an extra one and it's still warm!",
    price: 8.50,
    quantity: {
      amount: 1,
      unit: "pie (8 slices)"
    },
    imageUrl: "https://source.unsplash.com/uQs1802D0CQ",
    location: {
      display: "North End",
      distance: 2.1
    },
    postedAt: new Date(Date.now() - 9000000), // 2.5 hours ago
    seller: {
      id: "user5",
      name: "Emma W.",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      rating: 4.9
    },
    tags: ["dessert", "baked", "sweet"],
    dietary: ["contains nuts"]
  },
  {
    id: "6",
    title: "Pasta Primavera",
    description: "Extra pasta with spring vegetables in a light cream sauce. Restaurant quality from a home chef!",
    price: 6.75,
    quantity: {
      amount: 3,
      unit: "servings"
    },
    imageUrl: "https://source.unsplash.com/oBbTc1VoT-0",
    location: {
      display: "Midtown",
      distance: 1.8
    },
    postedAt: new Date(Date.now() - 10800000), // 3 hours ago
    seller: {
      id: "user6",
      name: "Carlos M.",
      avatar: "https://randomuser.me/api/portraits/men/26.jpg",
      rating: 4.7
    },
    tags: ["italian", "dinner", "pasta"],
    dietary: ["vegetarian"]
  }
];

export const dietaryTags = [
  "vegetarian", 
  "vegan", 
  "gluten-free", 
  "dairy-free", 
  "nut-free", 
  "organic", 
  "contains nuts"
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
  "italian", 
  "indian", 
  "asian", 
  "mexican"
];
