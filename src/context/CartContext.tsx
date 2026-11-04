'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/data/products';

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, size: string, color?: string, qty?: number) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  freeShippingThreshold: number;
  toast: { message: string; visible: boolean };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const FREE_SHIPPING_THRESHOLD = 75000; // ₦75,000 for free delivery

export function getItemPrice(item: { product: Product; selectedSize?: string }): number {
  if (
    item.product.sizePrices &&
    item.selectedSize &&
    typeof item.product.sizePrices[item.selectedSize] === 'number' &&
    item.product.sizePrices[item.selectedSize] > 0
  ) {
    return item.product.sizePrices[item.selectedSize];
  }
  return item.product.price;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dofit_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dofit_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3500);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (product: Product, size: string, color?: string, qty = 1) => {
    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += qty;
        return next;
      }
      return [
        ...prev,
        {
          product,
          selectedSize: size,
          selectedColor: color || product.colors[0]?.name || 'Standard',
          quantity: qty,
        },
      ];
    });

    showToast(`Added ${product.name} (${size}) to your bag`);
    setIsOpen(true);
  };

  const updateQuantity = (productId: string, size?: string, quantity = 1) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        const itemSize = item.selectedSize || (item as any).size || 'M';
        const matchesProduct = item.product.id === productId;
        const matchesSize = !size || itemSize === size || item.selectedSize === size;
        return matchesProduct && matchesSize ? { ...item, quantity } : item;
      })
    );
  };

  const removeFromCart = (productId: string, size?: string) => {
    setItems((prev) =>
      prev.filter((item) => {
        const itemSize = item.selectedSize || (item as any).size || 'M';
        const matchesProduct = item.product.id === productId;
        const matchesSize = !size || itemSize === size || item.selectedSize === size;
        return !(matchesProduct && matchesSize);
      })
    );
  };

  const clearCart = () => setItems([]);

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + getItemPrice(item) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalCount,
        subtotal,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        toast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
