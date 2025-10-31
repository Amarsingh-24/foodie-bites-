import { useState } from "react";
import { Star, Plus, Minus, ShoppingCart, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface FoodDetailModalProps {
  food: {
    id: string;
    name: string;
    description: string;
    category: string;
    base_price: number;
    image_url: string;
    rating: number;
    discount_percent: number;
    gst_percent: number;
    delivery_charge: number;
  } | null;
  open: boolean;
  onClose: () => void;
}

export const FoodDetailModal = ({ food, open, onClose }: FoodDetailModalProps) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  if (!food) return null;

  const basePrice = food.base_price;
  const discount = (basePrice * food.discount_percent) / 100;
  const cardDiscount = quantity * discount;
  const subtotal = quantity * basePrice - cardDiscount;
  const gst = (subtotal * food.gst_percent) / 100;
  const deliveryCharge = food.delivery_charge;
  const total = subtotal + gst + deliveryCharge;

  const handleAddToCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/auth");
      return;
    }

    const { error } = await supabase
      .from("cart_items")
      .upsert({
        user_id: user.id,
        food_id: food.id,
        quantity: quantity,
      });

    if (error) {
      toast.error("Failed to add to cart");
      return;
    }

    toast.success("Added to cart!");
    onClose();
  };

  const handleGoToCart = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{food.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <img
              src={food.image_url}
              alt={food.name}
              className="object-cover w-full h-full"
            />
            {food.discount_percent > 0 && (
              <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground">
                {food.discount_percent}% OFF
              </Badge>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline">{food.category}</Badge>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-medium">{food.rating}</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2">{food.name}</h2>
            <p className="text-muted-foreground">{food.description}</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Price Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Price (x{quantity})</span>
                <span>₹{(basePrice * quantity).toFixed(2)}</span>
              </div>
              {food.discount_percent > 0 && (
                <div className="flex justify-between text-secondary">
                  <span className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-1" />
                    Card Discount ({food.discount_percent}%)
                  </span>
                  <span>-₹{cardDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST ({food.gst_percent}%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Charge</span>
                <span>₹{deliveryCharge.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button onClick={handleAddToCart} className="flex-1" variant="outline">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button onClick={handleGoToCart} className="flex-1">
              Go to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
