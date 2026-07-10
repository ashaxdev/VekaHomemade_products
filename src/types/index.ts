export interface Product {
  _id: string;
  name: string;
  category: "Pickles" | "Thokku" | "Podis" | "Snacks" | "Combo Packs";
  price: number;
  discountPrice: number;
  weight: string;
  description: string;
  ingredients: string;
  shelfLife: string;
  stock: number;
  image: string;
  imagePublicId: string;
  isBestSeller: boolean;
  isFeatured: boolean;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  weight: string;
  quantity: number;
  stock: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Packed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    mobile: string;
    email: string;
    address: string;
    city: string;
    pincode: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: "COD" | "UPI";
  paymentStatus: "Pending" | "Paid";
  status: OrderStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
