import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FoodRushLayout } from "../components/FoodRushLayout";
import { PriceSummary } from "../components/PriceSummary";
import { QuantityControl } from "../components/QuantityControl";
import { useFoodRushCart } from "../CartContext";
import { coupons, getRestaurant } from "../data";
import { inr } from "../pricing";

const FoodRushCart = () => {
  const navigate = useNavigate();
  const { items, pricing, coupon, applyCoupon, removeCoupon, setQuantity, restaurantId } = useFoodRushCart();
  const [code, setCode] = useState("");
  const restaurant = restaurantId ? getRestaurant(restaurantId) : undefined;

  if (items.length === 0) {
    return (
      <FoodRushLayout>
        <div className="container mx-auto px-4 py-24 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
          <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-muted-foreground">Pick a restaurant and add something delicious.</p>
          <Button asChild className="mt-6">
            <Link to="/foodrush/restaurants">Browse restaurants</Link>
          </Button>
        </div>
      </FoodRushLayout>
    );
  }

  return (
    <FoodRushLayout>
      <div className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
        <section>
          <h1 className="text-3xl font-extrabold">Your cart</h1>
          {restaurant && (
            <p className="mt-1 text-muted-foreground">
              from{" "}
              <Link className="text-primary" to={`/foodrush/restaurant/${restaurant.id}`}>
                {restaurant.name}
              </Link>
            </p>
          )}

          <ul className="mt-6 divide-y divide-border rounded-lg border border-border bg-card">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-4 p-4">
                <img src={i.image} alt={i.name} loading="lazy" width={800} height={600} className="h-16 w-16 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{i.name}</p>
                  <p className="text-sm text-muted-foreground">{inr(i.price)} each</p>
                </div>
                <QuantityControl item={i} />
                <p className="w-24 text-right font-semibold">{inr(i.price * i.quantity)}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${i.name}`}
                  onClick={() => setQuantity(i.id, 0)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-lg border border-border bg-card p-5">
            <h2 className="font-semibold">Offers</h2>
            <div className="mt-3 flex gap-2">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter coupon code"
                aria-label="Coupon code"
              />
              <Button
                onClick={() => {
                  const res = applyCoupon(code);
                  res.ok ? toast.success(res.message) : toast.error(res.message);
                  if (res.ok) setCode("");
                }}
              >
                Apply
              </Button>
            </div>
            {coupon && (
              <p className="mt-3 flex items-center justify-between rounded bg-secondary/10 px-3 py-2 text-sm text-secondary">
                <span>{coupon.code} applied — {coupon.label}</span>
                <button className="underline" onClick={removeCoupon}>Remove</button>
              </p>
            )}
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {coupons.map((c) => (
                <li key={c.code}>
                  <button
                    className="underline-offset-2 hover:underline"
                    onClick={() => {
                      const res = applyCoupon(c.code);
                      res.ok ? toast.success(res.message) : toast.error(res.message);
                    }}
                  >
                    <strong className="text-foreground">{c.code}</strong> — {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="h-fit rounded-lg border border-border bg-card p-5 lg:sticky lg:top-24">
          <h2 className="font-semibold">Bill details</h2>
          <div className="mt-4">
            <PriceSummary pricing={pricing} couponCode={coupon?.code} />
          </div>
          <Button className="mt-6 w-full" size="lg" onClick={() => navigate("/foodrush/checkout")}>
            Proceed to checkout
          </Button>
        </aside>
      </div>
    </FoodRushLayout>
  );
};

export default FoodRushCart;
