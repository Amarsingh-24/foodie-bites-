import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FoodCard } from "@/components/FoodCard";
import { FoodDetailModal } from "@/components/FoodDetailModal";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import pizzaImg from "@/assets/pizza.jpg";
import biryaniImg from "@/assets/biryani.jpg";
import burgerImg from "@/assets/burger.jpg";
import padthaiImg from "@/assets/padthai.jpg";
import caesarImg from "@/assets/caesar.jpg";
import sushiImg from "@/assets/sushi.jpg";
import butterchickenImg from "@/assets/butterchicken.jpg";
import greekImg from "@/assets/greek.jpg";

const imageMap: { [key: string]: string } = {
  "Margherita Pizza": pizzaImg,
  "Chicken Biryani": biryaniImg,
  "Veggie Burger": burgerImg,
  "Pad Thai": padthaiImg,
  "Caesar Salad": caesarImg,
  "Sushi Platter": sushiImg,
  "Butter Chicken": butterchickenImg,
  "Greek Salad": greekImg,
};

const Index = () => {
  const [foods, setFoods] = useState<any[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<any[]>([]);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchFoods();
    fetchCartCount();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredFoods(foods);
    } else {
      setFilteredFoods(foods.filter(food => food.category === selectedCategory));
    }
  }, [selectedCategory, foods]);

  const fetchFoods = async () => {
    const { data, error } = await supabase
      .from("foods")
      .select("*")
      .eq("is_available", true);

    if (data) {
      const foodsWithImages = data.map(food => ({
        ...food,
        image_url: imageMap[food.name] || food.image_url,
      }));
      setFoods(foodsWithImages);
      setFilteredFoods(foodsWithImages);
      
      const uniqueCategories = Array.from(new Set(data.map(f => f.category)));
      setCategories(["All", ...uniqueCategories]);
    }
  };

  const fetchCartCount = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id);

    if (data) {
      setCartCount(data.length);
    }
  };

  const handleFoodClick = (food: any) => {
    setSelectedFood(food);
    setModalOpen(true);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredFoods(foods);
      return;
    }
    
    const filtered = foods.filter(food =>
      food.name.toLowerCase().includes(query.toLowerCase()) ||
      food.category.toLowerCase().includes(query.toLowerCase()) ||
      food.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFoods(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation cartCount={cartCount} onSearch={handleSearch} />
      
      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Are you a foodie? Join the club with us 🤩
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Delicious food from the best restaurants. Fast delivery, great prices, amazing taste.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFoods.map((food) => (
              <FoodCard
                key={food.id}
                {...food}
                basePrice={food.base_price}
                imageUrl={food.image_url}
                discountPercent={food.discount_percent}
                onClick={() => handleFoodClick(food)}
              />
            ))}
          </div>

          {filteredFoods.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">No food items found</p>
            </div>
          )}
        </section>
      </main>

      <Footer />

      <FoodDetailModal
        food={selectedFood}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          fetchCartCount();
        }}
      />
    </div>
  );
};

export default Index;
