import { Link } from "react-router-dom";
import { Star, Clock, Leaf } from "lucide-react";
import { Restaurant } from "../data";

export const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => (
  <Link
    to={`/foodrush/restaurant/${restaurant.id}`}
    className="group block rounded-lg overflow-hidden bg-card border border-border transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <div className="relative aspect-[16/10] overflow-hidden">
      <img
        src={restaurant.image}
        alt={`${restaurant.name} — ${restaurant.tagline}`}
        loading="lazy"
        width={1024}
        height={640}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {restaurant.offer && (
        <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-8 text-sm font-semibold text-white">
          {restaurant.offer}
        </span>
      )}
    </div>
    <div className="p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold leading-tight">{restaurant.name}</h3>
        <span className="flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-xs font-bold text-secondary-foreground">
          <Star className="h-3 w-3 fill-current" aria-hidden="true" />
          {restaurant.rating}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
        {restaurant.cuisines.join(" • ")}
      </p>
      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {restaurant.deliveryMinutes} min
        </span>
        <span>₹{restaurant.costForTwo} for two</span>
        {restaurant.isVeg && (
          <span className="flex items-center gap-1 text-secondary">
            <Leaf className="h-3.5 w-3.5" aria-hidden="true" /> Pure veg
          </span>
        )}
      </div>
    </div>
  </Link>
);
