import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, Clock, MapPin, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FoodRushLayout } from "../components/FoodRushLayout";
import { DishCard } from "../components/DishCard";
import { categories, getItemsForRestaurant, getRestaurant } from "../data";
import { inr } from "../pricing";
import { useFoodRushCart } from "../CartContext";

const FoodRushRestaurantDetail = () => {
  const { id = "" } = useParams();
  const restaurant = getRestaurant(id);
  const [vegOnly, setVegOnly] = useState(false);
  const { itemCount, pricing } = useFoodRushCart();

  const items = useMemo(() => getItemsForRestaurant(id).filter((i) => (vegOnly ? i.isVeg : true)), [id, vegOnly]);

  const sections = useMemo(() => {
    const map = new Map<string, typeof items>();
    items.forEach((i) => {
      map.set(i.categoryId, [...(map.get(i.categoryId) ?? []), i]);
    });
    return Array.from(map.entries());
  }, [items]);

  if (!restaurant) {
    return (
      <FoodRushLayout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold">We couldn’t find that restaurant</h1>
          <Button asChild className="mt-6">
            <Link to="/foodrush/restaurants">Back to restaurants</Link>
          </Button>
        </div>
      </FoodRushLayout>
    );
  }

  return (
    <FoodRushLayout>
      <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-6 text-sm text-muted-foreground">
        <ol className="flex items-center gap-1">
          <li><Link to="/foodrush" className="hover:text-foreground">Home</Link></li>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <li><Link to="/foodrush/restaurants" className="hover:text-foreground">Restaurants</Link></li>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <li aria-current="page" className="text-foreground">{restaurant.name}</li>
        </ol>
      </nav>

      <header className="container mx-auto px-4 py-6">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            width={1024}
            height={640}
            className="h-56 w-full object-cover md:h-72"
          />
          <div className="p-6">
            <h1 className="text-3xl font-extrabold">{restaurant.name}</h1>
            <p className="mt-1 text-muted-foreground">{restaurant.tagline}</p>
            <div className="mt-4 flex flex-wrap items-center gap-5 text-sm">
              <span className="flex items-center gap-1 font-semibold text-secondary">
                <Star className="h-4 w-4 fill-current" aria-hidden="true" /> {restaurant.rating}
                <span className="font-normal text-muted-foreground">({restaurant.reviewCount} ratings)</span>
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" aria-hidden="true" /> {restaurant.deliveryMinutes} min
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" aria-hidden="true" /> {restaurant.area} · {restaurant.distanceKm} km
              </span>
              <span className="text-muted-foreground">{inr(restaurant.costForTwo)} for two</span>
            </div>
            {restaurant.offer && (
              <p className="mt-4 inline-block rounded border border-dashed border-primary px-3 py-1.5 text-sm font-semibold text-primary">
                {restaurant.offer}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-24">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-xl font-bold">Menu</h2>
          <Button size="sm" variant={vegOnly ? "secondary" : "outline"} onClick={() => setVegOnly((v) => !v)}>
            Veg only
          </Button>
        </div>

        {sections.map(([categoryId, list]) => (
          <section key={categoryId} className="mt-8">
            <h3 className="text-lg font-bold">
              {categories.find((c) => c.id === categoryId)?.name ?? "More"}
              <span className="ml-2 text-sm font-normal text-muted-foreground">({list.length})</span>
            </h3>
            <div className="mt-2">
              {list.map((i) => (
                <DishCard key={i.id} item={i} />
              ))}
            </div>
          </section>
        ))}

        {items.length === 0 && <p className="py-16 text-center text-muted-foreground">No dishes match this filter.</p>}
      </div>

      {itemCount > 0 && (
        <div className="sticky bottom-0 z-30 border-t border-border bg-card">
          <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
            <p className="text-sm">
              <strong>{itemCount}</strong> item{itemCount > 1 ? "s" : ""} · {inr(pricing.subtotal)}
            </p>
            <Button asChild>
              <Link to="/foodrush/cart">View cart</Link>
            </Button>
          </div>
        </div>
      )}
    </FoodRushLayout>
  );
};

export default FoodRushRestaurantDetail;
