import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import { FoodRushCartProvider } from "./foodrush/CartContext";
import FoodRushHome from "./foodrush/pages/Home";
import FoodRushRestaurants from "./foodrush/pages/Restaurants";
import FoodRushRestaurantDetail from "./foodrush/pages/RestaurantDetail";
import FoodRushFoodDetail from "./foodrush/pages/FoodDetail";
import FoodRushCart from "./foodrush/pages/Cart";
import FoodRushCheckout from "./foodrush/pages/Checkout";
import FoodRushOrderDetail from "./foodrush/pages/OrderDetail";
import FoodRushOrders from "./foodrush/pages/Orders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <FoodRushCartProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/foodrush" element={<FoodRushHome />} />
            <Route path="/foodrush/restaurants" element={<FoodRushRestaurants />} />
            <Route path="/foodrush/restaurant/:id" element={<FoodRushRestaurantDetail />} />
            <Route path="/foodrush/food/:id" element={<FoodRushFoodDetail />} />
            <Route path="/foodrush/cart" element={<FoodRushCart />} />
            <Route path="/foodrush/checkout" element={<FoodRushCheckout />} />
            <Route path="/foodrush/orders" element={<FoodRushOrders />} />
            <Route path="/foodrush/order/:id" element={<FoodRushOrderDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </FoodRushCartProvider>
      </BrowserRouter>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
