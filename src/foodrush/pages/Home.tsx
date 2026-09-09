import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Timer, BadgePercent, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FoodRushLayout } from "../components/FoodRushLayout";
import { RestaurantCard } from "../components/RestaurantCard";
import { categories, heroImage, restaurants, foodItems } from "../data";

const FoodRushHome = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return {
      restaurants: restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisines.some((c) => c.toLowerCase().includes(q)),
      ),
      dishes: foodItems.filter((f) => f.name.toLowerCase().includes(q)).slice(0, 8),
    };
  }, [query]);

  const topRated = [...restaurants].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const fastest = [...restaurants].sort((a, b) => a.deliveryMinutes - b.deliveryMinutes).slice(0, 3);

  return (
    <FoodRushLayout onSearch={setQuery} searchValue={query}>
      {results ? (
        <section className="container mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold">Results for “{query}”</h1>
          <h2 className="mt-8 text-lg font-semibold">Restaurants</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.restaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
            {results.restaurants.length === 0 && (
              <p className="text-muted-foreground">No restaurants matched.</p>
            )}
          </div>
          <h2 className="mt-10 text-lg font-semibold">Dishes</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.dishes.map((d) => (
              <li key={d.id}>
                <Link
                  to={`/foodrush/food/${d.id}`}
                  className="flex items-center gap-3 rounded-md border border-border bg-card p-3 hover:shadow-md"
                >
                  <img src={d.image} alt={d.name} loading="lazy" width={800} height={600} className="h-14 w-14 rounded object-cover" />
                  <span>
                    <span className="block font-medium">{d.name}</span>
                    <span className="block text-sm text-muted-foreground">₹{d.price}</span>
                  </span>
                </Link>
              </li>
            ))}
            {results.dishes.length === 0 && <p className="text-muted-foreground">No dishes matched.</p>}
          </ul>
        </section>
      ) : (
        <>
          <section className="relative">
            <img
              src={heroImage}
              alt="A spread of freshly cooked Indian dishes"
              width={1920}
              height={1024}
              className="h-[420px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/10" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-xl text-white">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                    Delivering in Hyderabad
                  </p>
                  <h1 className="mt-3 text-4xl font-extrabold leading-tight md:text-5xl">
                    Great food, rushed to your door
                  </h1>
                  <p className="mt-4 text-white/80">
                    Ten kitchens, fifty dishes, honest pricing — no surprises at checkout.
                  </p>
                  <Button
                    size="lg"
                    className="mt-7"
                    onClick={() => navigate("/foodrush/restaurants")}
                  >
                    Browse restaurants
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="border-b border-border bg-card">
            <div className="container mx-auto grid gap-6 px-4 py-6 sm:grid-cols-3">
              {[
                { icon: Timer, title: "Under 30 min", text: "Nearby kitchens prioritised" },
                { icon: BadgePercent, title: "Real offers", text: "Coupons applied before tax" },
                { icon: ShieldCheck, title: "Clear billing", text: "Every fee itemised" },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-center gap-3">
                  <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="text-sm text-muted-foreground">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="container mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold">What are you craving?</h2>
            <ul className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-10">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    to={`/foodrush/restaurants?category=${c.id}`}
                    className="group flex flex-col items-center gap-2 text-center"
                  >
                    <img
                      src={c.image}
                      alt={c.name}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="h-20 w-20 rounded-full object-cover transition-transform group-hover:scale-105"
                    />
                    <span className="text-sm font-medium">{c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="container mx-auto px-4 pb-4">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-bold">Top rated near you</h2>
              <Link to="/foodrush/restaurants" className="text-sm font-semibold text-primary">
                See all
              </Link>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {topRated.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          </section>

          <section className="container mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold">Fastest delivery</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {fastest.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          </section>
        </>
      )}
    </FoodRushLayout>
  );
};

export default FoodRushHome;
