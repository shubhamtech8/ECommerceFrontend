export interface ProductVariant {
  variantId: number;
  variantName: string;
  color: string;
  price: number;
  description: string;
  stockQuantity: string;
  isActive: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  stock: number;
  variants: ProductVariant[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 4999,
    originalPrice: 9999,
    discount: 50,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    category: "Electronics",
    rating: 4.5,
    reviews: 328,
    stock: 15,
    variants: [],
  },
  {
    id: 2,
    name: "4K Ultra HD Smart TV 55 inch",
    price: 34999,
    originalPrice: 64999,
    discount: 46,
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&h=300&fit=crop",
    category: "Electronics",
    rating: 4.3,
    reviews: 1205,
    stock: 8,
    variants: [],
  },
  {
    id: 3,
    name: "Latest Smartphone Pro Max",
    price: 79999,
    originalPrice: 129999,
    discount: 38,
    image:
      "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=300&h=300&fit=crop",
    category: "Mobiles",
    rating: 4.7,
    reviews: 2841,
    stock: 20,
    variants: [],
  },
  {
    id: 4,
    name: "High-Performance Gaming Laptop",
    price: 89999,
    originalPrice: 149999,
    discount: 40,
    image:
      "https://images.unsplash.com/photo-1588872657840-790ff3bde126?w=300&h=300&fit=crop",
    category: "Laptops",
    rating: 4.6,
    reviews: 892,
    stock: 5,
    variants: [],
  },
  {
    id: 5,
    name: "Mechanical RGB Gaming Keyboard",
    price: 5499,
    originalPrice: 9999,
    discount: 45,
    image:
      "https://images.unsplash.com/photo-1587829191301-4b557373b3b5?w=300&h=300&fit=crop",
    category: "Accessories",
    rating: 4.4,
    reviews: 567,
    stock: 30,
    variants: [],
  },
  {
    id: 6,
    name: "USB-C Fast Charging Cable",
    price: 399,
    originalPrice: 999,
    discount: 60,
    image:
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=300&h=300&fit=crop",
    category: "Accessories",
    rating: 4.2,
    reviews: 1432,
    stock: 100,
    variants: [],
  },
  {
    id: 7,
    name: "Compact Mirrorless Camera",
    price: 65999,
    originalPrice: 119999,
    discount: 45,
    image:
      "https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=300&h=300&fit=crop",
    category: "Electronics",
    rating: 4.8,
    reviews: 743,
    stock: 12,
    variants: [],
  },
  {
    id: 8,
    name: "Professional Webcam 1080p",
    price: 3299,
    originalPrice: 6999,
    discount: 53,
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&h=300&fit=crop",
    category: "Accessories",
    rating: 4.3,
    reviews: 412,
    stock: 25,
    variants: [],
  },
  {
    id: 9,
    name: "Mid-Range Android Smartphone",
    price: 19999,
    originalPrice: 39999,
    discount: 50,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06ad39f8d61?w=300&h=300&fit=crop",
    category: "Mobiles",
    rating: 4.1,
    reviews: 2156,
    stock: 18,
    variants: [],
  },
  {
    id: 10,
    name: "Business Laptop Pro",
    price: 74999,
    originalPrice: 139999,
    discount: 46,
    image:
      "https://images.unsplash.com/photo-1603468620905-8de58ba7c928?w=300&h=300&fit=crop",
    category: "Laptops",
    rating: 4.5,
    reviews: 634,
    stock: 7,
    variants: [],
  },
  {
    id: 11,
    name: "Wireless Mouse Pro",
    price: 1899,
    originalPrice: 3999,
    discount: 52,
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=300&fit=crop",
    category: "Accessories",
    rating: 4.4,
    reviews: 876,
    stock: 40,
    variants: [],
  },
  {
    id: 12,
    name: "Premium Monitor 27 inch 144Hz",
    price: 19999,
    originalPrice: 44999,
    discount: 55,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop",
    category: "Electronics",
    rating: 4.6,
    reviews: 1098,
    stock: 10,
    variants: [],
  },
];
