import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FoodRushLayout } from "../components/FoodRushLayout";
import { useFoodRushCart } from "../CartContext";
import { getRestaurant } from "../data";
import { inr } from "../pricing";

const FoodRushOrders = () => {
  const { orders } = useFoodRushCart();

  return (
    <FoodRushLayout>
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold">Your orders</h1>

        {orders.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">You haven’t placed an order yet.</p>
            <Button asChild className="mt-6"><Link to="/foodrush/restaurants">Start ordering</Link></Button>
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {orders.map((o) => {
              const restaurant = getRestaurant(o.restaurantId);
              return (
                <li key={o.id} className="rounded-lg border border-border bg-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{restaurant?.name ?? "FoodRush order"}</p>
                      <p className="text-sm text-muted-foreground">
                        #{o.id} · {new Date(o.placedAt).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <p className="font-bold">{inr(o.pricing.total)}</p>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {o.lines.map((l) => `${l.quantity} × ${l.name}`).join(", ")}
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link to={`/foodrush/order/${o.id}`}>View details</Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </FoodRushLayout>
  );
};

export default FoodRushOrders;
