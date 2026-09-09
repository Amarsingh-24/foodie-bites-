import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Coupon, FoodItem, coupons, getFoodItem } from "./data";
import { calculatePricing, PriceLine } from "./pricing";

export interface CartLine {
  itemId: string;
  quantity: number;
}

export interface StoredOrder {
  id: string;
  placedAt: string;
  restaurantId: string;
  lines: { name: string; quantity: number; price: number }[];
  pricing: PriceLine;
  address: string;
  paymentMode: string;
  couponCode?: string;
  etaMinutes: number;
}

interface CartState {
  lines: CartLine[];
  restaurantId: string | null;
  coupon: Coupon | null;
  items: (FoodItem & { quantity: number })[];
  itemCount: number;
  pricing: PriceLine;
  add: (item: FoodItem) => { replaced: boolean };
  setQuantity: (itemId: string, quantity: number) => void;
  quantityOf: (itemId: string) => number;
  clear: () => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
  orders: StoredOrder[];
  placeOrder: (details: { address: string; paymentMode: string }) => StoredOrder;
  getOrder: (id: string) => StoredOrder | undefined;
}

const CartContext = createContext<CartState | null>(null);

const CART_KEY = "foodrush.cart";
const ORDERS_KEY = "foodrush.orders";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const FoodRushCartProvider = ({ children }: { children: ReactNode }) => {
  const [lines, setLines] = useState<CartLine[]>(() => read<CartLine[]>(CART_KEY, []));
  const [couponCode, setCouponCode] = useState<string | null>(() => read<string | null>("foodrush.coupon", null));
  const [orders, setOrders] = useState<StoredOrder[]>(() => read<StoredOrder[]>(ORDERS_KEY, []));

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
  }, [lines]);
  useEffect(() => {
    localStorage.setItem("foodrush.coupon", JSON.stringify(couponCode));
  }, [couponCode]);
  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const items = useMemo(
    () =>
      lines
        .map((line) => {
          const item = getFoodItem(line.itemId);
          return item ? { ...item, quantity: line.quantity } : null;
        })
        .filter(Boolean) as (FoodItem & { quantity: number })[],
    [lines],
  );

  const restaurantId = items[0]?.restaurantId ?? null;
  const coupon = coupons.find((c) => c.code === couponCode) ?? null;

  const pricing = useMemo(
    () => calculatePricing({ items, coupon, distanceKm: 3 }),
    [items, coupon],
  );

  const value: CartState = {
    lines,
    restaurantId,
    coupon,
    items,
    itemCount: items.reduce((n, i) => n + i.quantity, 0),
    pricing,
    add: (item) => {
      let replaced = false;
      setLines((prev) => {
        const current = prev
          .map((l) => getFoodItem(l.itemId))
          .find(Boolean);
        if (current && current.restaurantId !== item.restaurantId) {
          replaced = true;
          return [{ itemId: item.id, quantity: 1 }];
        }
        const existing = prev.find((l) => l.itemId === item.id);
        if (existing) {
          return prev.map((l) => (l.itemId === item.id ? { ...l, quantity: l.quantity + 1 } : l));
        }
        return [...prev, { itemId: item.id, quantity: 1 }];
      });
      return { replaced };
    },
    setQuantity: (itemId, quantity) =>
      setLines((prev) =>
        quantity <= 0
          ? prev.filter((l) => l.itemId !== itemId)
          : prev.map((l) => (l.itemId === itemId ? { ...l, quantity } : l)),
      ),
    quantityOf: (itemId) => lines.find((l) => l.itemId === itemId)?.quantity ?? 0,
    clear: () => {
      setLines([]);
      setCouponCode(null);
    },
    applyCoupon: (code) => {
      const found = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
      if (!found) return { ok: false, message: "That coupon code is not valid." };
      const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
      if (subtotal < found.minOrder)
        return { ok: false, message: `Add items worth ₹${found.minOrder} to use ${found.code}.` };
      setCouponCode(found.code);
      return { ok: true, message: `${found.code} applied — ${found.label}` };
    },
    removeCoupon: () => setCouponCode(null),
    orders,
    placeOrder: ({ address, paymentMode }) => {
      const order: StoredOrder = {
        id: `FR${Date.now().toString().slice(-8)}`,
        placedAt: new Date().toISOString(),
        restaurantId: restaurantId ?? "",
        lines: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
        pricing,
        address,
        paymentMode,
        couponCode: coupon?.code,
        etaMinutes: 32,
      };
      setOrders((prev) => [order, ...prev]);
      setLines([]);
      setCouponCode(null);
      return order;
    },
    getOrder: (id) => orders.find((o) => o.id === id),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useFoodRushCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useFoodRushCart must be used inside FoodRushCartProvider");
  return ctx;
};
