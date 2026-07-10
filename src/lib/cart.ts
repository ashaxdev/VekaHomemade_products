import { CartItem } from "@/types";

const CART_KEY = "lkp_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const existing = cart.find((c) => c.productId === item.productId);
  if (existing) {
    existing.quantity = Math.min(existing.quantity + item.quantity, item.stock);
  } else {
    cart.push(item);
  }
  saveCart(cart);
  return cart;
}

export function updateCartQuantity(productId: string, quantity: number) {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter((c) => c.productId !== productId);
  } else {
    const item = cart.find((c) => c.productId === productId);
    if (item) item.quantity = Math.min(quantity, item.stock);
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: string) {
  const cart = getCart().filter((c) => c.productId !== productId);
  saveCart(cart);
  return cart;
}

export function clearCart() {
  saveCart([]);
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}
