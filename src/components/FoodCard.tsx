import { Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FoodCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  imageUrl: string;
  rating: number;
  discountPercent: number;
  onClick: () => void;
}

export const FoodCard = ({
  name,
  description,
  category,
  basePrice,
  imageUrl,
  rating,
  discountPercent,
  onClick,
}: FoodCardProps) => {
  const discountedPrice = basePrice - (basePrice * discountPercent) / 100;

  return (
    <Card 
      className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg border-border"
      onClick={onClick}
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={imageUrl}
          alt={name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
        />
        {discountPercent > 0 && (
          <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground">
            {discountPercent}% OFF
          </Badge>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 left-3 bg-card/80 backdrop-blur-sm hover:bg-card"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
          <div className="flex items-center space-x-1 text-sm">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="font-medium">{rating}</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{name}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-primary">
              ₹{discountedPrice.toFixed(0)}
            </span>
            {discountPercent > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{basePrice.toFixed(0)}
              </span>
            )}
          </div>
          <Button size="sm" onClick={(e) => { e.stopPropagation(); onClick(); }}>
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
