import { PriceLine, inr } from "../pricing";
import { Separator } from "@/components/ui/separator";

const Row = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div className="flex justify-between text-sm">
    <span className={accent ? "text-secondary" : "text-muted-foreground"}>{label}</span>
    <span className={accent ? "text-secondary" : ""}>{value}</span>
  </div>
);

export const PriceSummary = ({ pricing, couponCode }: { pricing: PriceLine; couponCode?: string }) => (
  <div className="space-y-2">
    <Row label="Item subtotal" value={inr(pricing.subtotal)} />
    {pricing.discount > 0 && (
      <Row label={`Discount${couponCode ? ` (${couponCode})` : ""}`} value={`− ${inr(pricing.discount)}`} accent />
    )}
    <Row label="GST (5%)" value={inr(pricing.gst)} />
    <Row label="Delivery fee" value={pricing.deliveryFee === 0 ? "FREE" : inr(pricing.deliveryFee)} />
    <Row label="Packaging" value={inr(pricing.packagingFee)} />
    <Row label="Platform fee" value={inr(pricing.platformFee)} />
    <Separator className="my-3" />
    <div className="flex justify-between text-base font-bold">
      <span>To pay</span>
      <span>{inr(pricing.total)}</span>
    </div>
  </div>
);
