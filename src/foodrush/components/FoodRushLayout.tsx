import { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, MapPin, Search, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFoodRushCart } from "../CartContext";

const navLinks = [
  { to: "/foodrush", label: "Home", end: true },
  { to: "/foodrush/restaurants", label: "Restaurants" },
  { to: "/foodrush/orders", label: "Orders" },
];

export const FoodRushLayout = ({
  children,
  onSearch,
  searchValue,
}: {
  children: ReactNode;
  onSearch?: (q: string) => void;
  searchValue?: string;
}) => {
  const { itemCount } = useFoodRushCart();
  const navigate = useNavigate();

  return (
    <div className="foodrush min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link to="/foodrush" className="flex items-center gap-2 shrink-0">
            <span className="grid place-items-center h-9 w-9 rounded-md bg-primary text-primary-foreground">
              <Flame className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-xl font-extrabold tracking-tight">FoodRush</span>
          </Link>

          <span className="hidden lg:flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" aria-hidden="true" /> Hyderabad
          </span>

          {onSearch && (
            <form
              className="flex-1 max-w-lg relative"
              role="search"
              onSubmit={(e) => e.preventDefault()}
            >
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                type="search"
                aria-label="Search restaurants and dishes"
                placeholder="Search restaurants or dishes"
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-md border border-input bg-background text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </form>
          )}

          <nav className="hidden md:flex items-center gap-1 ml-auto" aria-label="Main">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <Button
            variant="default"
            className="relative ml-auto md:ml-0"
            onClick={() => navigate("/foodrush/cart")}
          >
            <ShoppingBag className="h-4 w-4 mr-2" aria-hidden="true" />
            Cart
            {itemCount > 0 && (
              <span className="ml-2 rounded-full bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-10 grid gap-8 sm:grid-cols-3">
          <div>
            <p className="text-lg font-extrabold">FoodRush</p>
            <p className="text-sm text-muted-foreground mt-2">
              Food from the kitchens near you, delivered while it is still hot.
            </p>
          </div>
          <nav aria-label="Footer" className="text-sm space-y-2">
            <p className="font-semibold">Explore</p>
            <Link className="block text-muted-foreground hover:text-foreground" to="/foodrush/restaurants">
              All restaurants
            </Link>
            <Link className="block text-muted-foreground hover:text-foreground" to="/foodrush/orders">
              Your orders
            </Link>
            <Link className="block text-muted-foreground hover:text-foreground" to="/">
              Foodie bites
            </Link>
          </nav>
          <div className="text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Demo notice</p>
            <p className="mt-2">
              Restaurants, dishes and prices on this page are sample data for demonstration.
            </p>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} FoodRush
        </div>
      </footer>
    </div>
  );
};
