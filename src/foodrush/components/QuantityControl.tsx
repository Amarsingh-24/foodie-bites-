import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FoodItem } from "../data";
import { useFoodRushCart } from "../CartContext";

export const QuantityControl = ({ item, size = "sm" }: { item: FoodItem; size?: "sm" | "lg" }) => {
  const { add, setQuantity, quantityOf } = useFoodRushCart();
  const quantity = quantityOf(item.id);

  if (quantity === 0) {
    return (
      <Button
        size={size === "lg" ? "default" : "sm"}
        onClick={() => {
          const { replaced } = add(item);
          toast.success(
            replaced ? `Cart cleared for ${item.name}` : `${item.name} added to cart`,
          );
        }}
        className="w-28 font-semibold shadow-sm"
      >
        ADD
      </Button>
    );
  }

  return (
    <div className="flex w-28 items-center justify-between rounded-md border border-primary bg-card px-1 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-primary"
        aria-label={`Remove one ${item.name}`}
        onClick={() => setQuantity(item.id, quantity - 1)}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="text-sm font-bold text-primary" aria-live="polite">
        {quantity}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-primary"
        aria-label={`Add one ${item.name}`}
        onClick={() => setQuantity(item.id, quantity + 1)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
