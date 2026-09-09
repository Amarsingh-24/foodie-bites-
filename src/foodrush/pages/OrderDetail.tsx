import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ChefHat, Bike, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FoodRushLayout } from "../components/FoodRushLayout";
import { PriceSummary } from "../components/PriceSummary";
import { useFoodRushCart } from "../CartContext";
import { getRestaurant } from "../data";
import { inr } from "../pricing";

const steps = [
  { icon: CheckCircle2, label: "Order confirmed", detail: "The restaurant has your order" },
  { icon: ChefHat, label: "Being prepared", detail: "Fresh from the kitchen" },
  { icon: Bike, label: "Out for delivery", detail: "Your rider is on the way" },
  { icon: PartyPopper, label: "Delivered", detail: "Enjoy your meal" },
];

const FoodRushOrderDetail = () => {
  const { id = "" } = useParams();
  const { getOrder } = useFoodRushCart();
  const order = getOrder(id);

  if (!order) {
    return (
      <FoodRushLayout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold">We couldn’t find that order</h1>
          <Button asChild className="mt-6"><Link to="/foodrush/orders">See your orders</Link></Button>
        </div>
      </FoodRushLayout>
    );
  }

  const restaurant = getRestaurant(order.restaurantId);

  return (
    <FoodRushLayout>
      <div className="container mx-auto grid gap-8 px-4 py-10 lg:grid-cols-[1fr_380px]">
        <section>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Order placed</p>
          <h1 className="mt-2 text-3xl font-extrabold">Thanks — your food is on its way</h1>
          <p className="mt-2 text-muted-foreground">
            Order <strong>#{order.id}</strong>
            {restaurant && <> from {restaurant.name}</>} · arriving in about {order.etaMinutes} minutes
          </p>

          <ol className="mt-8 space-y-5">
            {steps.map(({ icon: Icon, label, detail }, index) => (
              <li key={label} className="flex gap-4">
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                    index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-medium">{label}</span>
                  <span className="block text-sm text-muted-foreground">{detail}</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-lg border border-border bg-card p-5">
            <h2 className="font-semibold">Delivering to</h2>
            <p className="mt-2 text-sm text-muted-foreground">{order.address}</p>
            <p className="mt-2 text-sm text-muted-foreground">Paying by {order.paymentMode}</p>
          </div>
        </section>

        <aside className="h-fit rounded-lg border border-border bg-card p-5">
          <h2 className="font-semibold">Bill</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {order.lines.map((l) => (
              <li key={l.name} className="flex justify-between gap-3">
                <span className="text-muted-foreground">{l.quantity} × {l.name}</span>
                <span>{inr(l.price * l.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-border pt-4">
            <PriceSummary pricing={order.pricing} couponCode={order.couponCode} />
          </div>
          <Button asChild variant="outline" className="mt-6 w-full">
            <Link to="/foodrush/restaurants">Order something else</Link>
          </Button>
        </aside>
      </div>
    </FoodRushLayout>
  );
};

export default FoodRushOrderDetail;
