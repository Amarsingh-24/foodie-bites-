import { Coupon } from "./data";

export const GST_RATE = 0.05;
export const PLATFORM_FEE = 6;
export const PACKAGING_FEE_PER_ITEM = 5;
export const BASE_DELIVERY_FEE = 39;
export const FREE_DELIVERY_THRESHOLD = 999;

export interface PriceLine {
  subtotal: number;
  discount: number;
  gst: number;
  deliveryFee: number;
  platformFee: number;
  packagingFee: number;
  total: number;
}

export interface PricingInput {
  items: { price: number; quantity: number }[];
  coupon?: Coupon | null;
  distanceKm?: number;
}

const round = (n: number) => Math.round(n * 100) / 100;

export function calculatePricing({ items, coupon, distanceKm = 3 }: PricingInput): PriceLine {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  let discount = 0;
  let freeDelivery = false;

  if (coupon && subtotal >= coupon.minOrder) {
    if (coupon.freeDelivery) freeDelivery = true;
    if (coupon.type === "percent") {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.value;
    }
    discount = Math.min(discount, subtotal);
  }

  const taxable = subtotal - discount;
  const gst = taxable * GST_RATE;

  let deliveryFee = BASE_DELIVERY_FEE + Math.max(0, Math.ceil(distanceKm - 3)) * 10;
  if (freeDelivery || subtotal >= FREE_DELIVERY_THRESHOLD) deliveryFee = 0;

  const packagingFee = itemCount > 0 ? itemCount * PACKAGING_FEE_PER_ITEM : 0;
  const platformFee = itemCount > 0 ? PLATFORM_FEE : 0;

  const total = taxable + gst + deliveryFee + packagingFee + platformFee;

  return {
    subtotal: round(subtotal),
    discount: round(discount),
    gst: round(gst),
    deliveryFee: round(deliveryFee),
    platformFee: round(platformFee),
    packagingFee: round(packagingFee),
    total: round(total),
  };
}

export const inr = (amount: number) =>
  `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
