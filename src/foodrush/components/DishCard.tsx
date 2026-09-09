import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { FoodItem } from "../data";
import { inr } from "../pricing";
import { QuantityControl } from "./QuantityControl";

export const VegBadge = ({ isVeg }: { isVeg: boolean }) => (
  <span
    aria-label={isVeg ? "Vegetarian" : "Non-vegetarian"}
    className={`inline-grid h-4 w-4 place-items-center rounded-sm border ${
      isVeg ? "border-secondary" : "border-destructive"
    }`}
  >
    <span className={`h-2 w-2 rounded-full ${isVeg ? "bg-secondary" : "bg-destructive"}`} />
  </span>
);

export const DishCard = ({ item }: { item: FoodItem }) => (
  <article className="flex gap-4 border-b border-border py-5 last:border-0">
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <VegBadge isVeg={item.isVeg} />
        {item.bestseller && (
          <span className="text-[11px] font-bold uppercase tracking-wide text-accent-foreground bg-accent rounded px-1.5 py-0.5">
            Bestseller
          </span>
        )}
      </div>
      <h3 className="mt-1 font-semibold">
        <Link to={`/foodrush/food/${item.id}`} className="hover:text-primary">
          {item.name}
        </Link>
      </h3>
      <p className="mt-1 flex items-center gap-2 text-sm font-medium">
        {inr(item.price)}
        {item.mrp && <span className="text-muted-foreground line-through">{inr(item.mrp)}</span>}
      </p>
      <p className="mt-1 flex items-center gap-1 text-xs text-secondary">
        <Star className="h-3 w-3 fill-current" aria-hidden="true" /> {item.rating} · {item.serves}
      </p>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
    </div>

    <div className="relative w-32 shrink-0">
      <img
        src={item.image}
        alt={item.name}
        loading="lazy"
        width={800}
        height={600}
        className="h-24 w-32 rounded-md object-cover"
      />
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
        <QuantityControl item={item} />
      </div>
    </div>
  </article>
);
