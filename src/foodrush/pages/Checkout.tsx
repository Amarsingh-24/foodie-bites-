import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FoodRushLayout } from "../components/FoodRushLayout";
import { PriceSummary } from "../components/PriceSummary";
import { useFoodRushCart } from "../CartContext";
import { inr } from "../pricing";

const savedAddresses = [
  { id: "home", label: "Home", value: "302, Lotus Residency, Road No. 12, Banjara Hills, Hyderabad 500034" },
  { id: "work", label: "Work", value: "Level 6, Cyber Gateway, Hitec City, Hyderabad 500081" },
];

const paymentModes = ["UPI", "Credit / Debit card", "Cash on delivery"];

const FoodRushCheckout = () => {
  const navigate = useNavigate();
  const { items, pricing, coupon, placeOrder } = useFoodRushCart();
  const [addressId, setAddressId] = useState("home");
  const [customAddress, setCustomAddress] = useState("");
  const [payment, setPayment] = useState(paymentModes[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  if (items.length === 0) {
    return (
      <FoodRushLayout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold">There is nothing to check out</h1>
          <Button asChild className="mt-6"><Link to="/foodrush/restaurants">Browse restaurants</Link></Button>
        </div>
      </FoodRushLayout>
    );
  }

  const address =
    addressId === "new" ? customAddress : savedAddresses.find((a) => a.id === addressId)?.value ?? "";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.trim().length < 10 || !address.trim()) {
      setError("Please add your name, a 10-digit phone number and a delivery address.");
      return;
    }
    const order = placeOrder({ address, paymentMode: payment });
    navigate(`/foodrush/order/${order.id}`);
  };

  return (
    <FoodRushLayout>
      <form onSubmit={submit} className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
        <section className="space-y-6">
          <h1 className="text-3xl font-extrabold">Checkout</h1>

          <fieldset className="rounded-lg border border-border bg-card p-5">
            <legend className="px-1 font-semibold">Contact</legend>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="fr-name">Full name</Label>
                <Input id="fr-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <Label htmlFor="fr-phone">Phone number</Label>
                <Input
                  id="fr-phone"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10-digit mobile"
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="rounded-lg border border-border bg-card p-5">
            <legend className="px-1 font-semibold">Delivery address</legend>
            <div className="mt-3 space-y-3">
              {savedAddresses.map((a) => (
                <label key={a.id} className="flex cursor-pointer gap-3 rounded-md border border-border p-3">
                  <input
                    type="radio"
                    name="address"
                    className="mt-1"
                    checked={addressId === a.id}
                    onChange={() => setAddressId(a.id)}
                  />
                  <span>
                    <span className="block font-medium">{a.label}</span>
                    <span className="block text-sm text-muted-foreground">{a.value}</span>
                  </span>
                </label>
              ))}
              <label className="flex cursor-pointer gap-3 rounded-md border border-border p-3">
                <input
                  type="radio"
                  name="address"
                  className="mt-1"
                  checked={addressId === "new"}
                  onChange={() => setAddressId("new")}
                />
                <span className="flex-1">
                  <span className="block font-medium">Use a different address</span>
                  {addressId === "new" && (
                    <Input
                      className="mt-2"
                      aria-label="New delivery address"
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                      placeholder="Flat, street, area, city, pincode"
                    />
                  )}
                </span>
              </label>
            </div>
          </fieldset>

          <fieldset className="rounded-lg border border-border bg-card p-5">
            <legend className="px-1 font-semibold">Payment method</legend>
            <div className="mt-3 space-y-3">
              {paymentModes.map((m) => (
                <label key={m} className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-3">
                  <input type="radio" name="payment" checked={payment === m} onChange={() => setPayment(m)} />
                  <span>{m}</span>
                </label>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              This is a demo checkout — no real payment is taken.
            </p>
          </fieldset>

          {error && (
            <p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          )}
        </section>

        <aside className="h-fit rounded-lg border border-border bg-card p-5 lg:sticky lg:top-24">
          <h2 className="font-semibold">Order summary</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3">
                <span className="text-muted-foreground">{i.quantity} × {i.name}</span>
                <span>{inr(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-border pt-4">
            <PriceSummary pricing={pricing} couponCode={coupon?.code} />
          </div>
          <Button type="submit" size="lg" className="mt-6 w-full">
            Place order · {inr(pricing.total)}
          </Button>
        </aside>
      </form>
    </FoodRushLayout>
  );
};

export default FoodRushCheckout;
