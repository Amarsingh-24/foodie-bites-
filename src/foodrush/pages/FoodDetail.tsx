import { Link, useParams } from "react-router-dom";
import { Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FoodRushLayout } from "../components/FoodRushLayout";
import { QuantityControl } from "../components/QuantityControl";
import { VegBadge } from "../components/DishCard";
import { getFoodItem, getItemsForRestaurant, getRestaurant } from "../data";
import { calculatePricing, inr } from "../pricing";

const FoodRushFoodDetail = () => {
  const { id = "" } = useParams();
  const item = getFoodItem(id);
  const restaurant = item ? getRestaurant(item.restaurantId) : undefined;

  if (!item || !restaurant) {
    return (
      <FoodRushLayout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold">We couldn’t find that dish</h1>
          <Button asChild className="mt-6">
            <Link to="/foodrush/restaurants">Browse restaurants</Link>
          </Button>
        </div>
      </FoodRushLayout>
    );
  }

  const sample = calculatePricing({ items: [{ price: item.price, quantity: 1 }], distanceKm: restaurant.distanceKm });
  const similar = getItemsForRestaurant(item.restaurantId).filter((i) => i.id !== item.id).slice(0, 4);

  return (
    <FoodRushLayout>
      <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link to="/foodrush" className="hover:text-foreground">Home</Link></li>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <li>
            <Link to={`/foodrush/restaurant/${restaurant.id}`} className="hover:text-foreground">
              {restaurant.name}
            </Link>
          </li>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <li aria-current="page" className="text-foreground">{item.name}</li>
        </ol>
      </nav>

      <div className="container mx-auto grid gap-10 px-4 py-8 lg:grid-cols-2">
        <img
          src={item.image}
          alt={item.name}
          width={800}
          height={600}
          className="w-full rounded-lg border border-border object-cover"
        />

        <div>
          <VegBadge isVeg={item.isVeg} />
          <h1 className="mt-2 text-3xl font-extrabold">{item.name}</h1>
          <Link to={`/foodrush/restaurant/${restaurant.id}`} className="mt-1 inline-block text-sm text-primary">
            from {restaurant.name}
          </Link>
          <p className="mt-4 text-muted-foreground">{item.description}</p>

          <div className="mt-4 flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 font-semibold text-secondary">
              <Star className="h-4 w-4 fill-current" aria-hidden="true" /> {item.rating}
            </span>
            <span className="text-muted-foreground">{item.serves}</span>
          </div>

          <p className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{inr(item.price)}</span>
            {item.mrp && <span className="text-muted-foreground line-through">{inr(item.mrp)}</span>}
          </p>

          <div className="mt-6">
            <QuantityControl item={item} size="lg" />
          </div>

          <div className="mt-8 rounded-lg border border-border bg-card p-5">
            <h2 className="font-semibold">If you order just this</h2>
            <Separator className="my-3" />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Item total</dt><dd>{inr(sample.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">GST (5%)</dt><dd>{inr(sample.gst)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{sample.deliveryFee === 0 ? "FREE" : inr(sample.deliveryFee)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Packaging + platform</dt><dd>{inr(sample.packagingFee + sample.platformFee)}</dd></div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold"><dt>Total</dt><dd>{inr(sample.total)}</dd></div>
            </dl>
          </div>
        </div>
      </div>

      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold">More from {restaurant.name}</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {similar.map((s) => (
            <li key={s.id}>
              <Link
                to={`/foodrush/food/${s.id}`}
                className="block rounded-lg border border-border bg-card p-3 hover:shadow-md"
              >
                <img src={s.image} alt={s.name} loading="lazy" width={800} height={600} className="h-28 w-full rounded object-cover" />
                <p className="mt-2 font-medium line-clamp-1">{s.name}</p>
                <p className="text-sm text-muted-foreground">{inr(s.price)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </FoodRushLayout>
  );
};

export default FoodRushFoodDetail;
