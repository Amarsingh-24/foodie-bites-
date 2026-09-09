import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FoodRushLayout } from "../components/FoodRushLayout";
import { RestaurantCard } from "../components/RestaurantCard";
import { categories, restaurants } from "../data";

type SortKey = "relevance" | "rating" | "delivery" | "costLow" | "costHigh";

const sorters: Record<SortKey, (a: typeof restaurants[number], b: typeof restaurants[number]) => number> = {
  relevance: () => 0,
  rating: (a, b) => b.rating - a.rating,
  delivery: (a, b) => a.deliveryMinutes - b.deliveryMinutes,
  costLow: (a, b) => a.costForTwo - b.costForTwo,
  costHigh: (a, b) => b.costForTwo - a.costForTwo,
};

const FoodRushRestaurants = () => {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") ?? "all";
  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [fastOnly, setFastOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("relevance");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return restaurants
      .filter((r) => (category === "all" ? true : r.categoryIds.includes(category)))
      .filter((r) => (vegOnly ? r.isVeg : true))
      .filter((r) => (fastOnly ? r.deliveryMinutes <= 30 : true))
      .filter((r) =>
        q ? r.name.toLowerCase().includes(q) || r.cuisines.some((c) => c.toLowerCase().includes(q)) : true,
      )
      .sort(sorters[sort]);
  }, [category, query, vegOnly, fastOnly, sort]);

  return (
    <FoodRushLayout onSearch={setQuery} searchValue={query}>
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold">Restaurants delivering to you</h1>
        <p className="mt-2 text-muted-foreground">{list.length} places open right now</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={category === "all" ? "default" : "outline"}
            onClick={() => setParams({})}
          >
            All
          </Button>
          {categories.map((c) => (
            <Button
              key={c.id}
              size="sm"
              variant={category === c.id ? "default" : "outline"}
              onClick={() => setParams({ category: c.id })}
            >
              {c.name}
            </Button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button size="sm" variant={vegOnly ? "secondary" : "outline"} onClick={() => setVegOnly((v) => !v)}>
            Pure veg
          </Button>
          <Button size="sm" variant={fastOnly ? "secondary" : "outline"} onClick={() => setFastOnly((v) => !v)}>
            Under 30 min
          </Button>
          <label className="ml-auto flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Sort by</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            >
              <option value="relevance">Relevance</option>
              <option value="rating">Rating</option>
              <option value="delivery">Delivery time</option>
              <option value="costLow">Cost: low to high</option>
              <option value="costHigh">Cost: high to low</option>
            </select>
          </label>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>

        {list.length === 0 && (
          <p className="py-20 text-center text-muted-foreground">
            No restaurants match these filters. Try clearing a few.
          </p>
        )}
      </div>
    </FoodRushLayout>
  );
};

export default FoodRushRestaurants;
