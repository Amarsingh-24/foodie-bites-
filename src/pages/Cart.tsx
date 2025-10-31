import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to view cart");
        navigate("/auth");
        return;
      }
      fetchCartItems(user.id);
    };
    checkAuth();
  }, [navigate]);

  const fetchCartItems = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        *,
        foods (*)
      `)
      .eq("user_id", userId);

    if (error) {
      toast.error("Failed to load cart");
      setLoading(false);
      return;
    }

    setCartItems(data || []);
    setLoading(false);
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQuantity })
      .eq("id", itemId);

    if (error) {
      toast.error("Failed to update quantity");
      return;
    }

    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = async (itemId: string) => {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", itemId);

    if (error) {
      toast.error("Failed to remove item");
      return;
    }

    setCartItems(cartItems.filter(item => item.id !== itemId));
    toast.success("Item removed from cart");
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let discount = 0;
    let gst = 0;
    const deliveryCharge = cartItems.length > 0 ? cartItems[0].foods.delivery_charge : 0;

    cartItems.forEach(item => {
      const itemPrice = item.foods.base_price * item.quantity;
      const itemDiscount = (itemPrice * item.foods.discount_percent) / 100;
      subtotal += itemPrice;
      discount += itemDiscount;
    });

    const discountedSubtotal = subtotal - discount;
    gst = (discountedSubtotal * 5) / 100;
    const total = discountedSubtotal + gst + deliveryCharge;

    return { subtotal, discount, gst, deliveryCharge, total };
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation cartCount={0} />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading cart...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation cartCount={0} />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some delicious food to get started!</p>
          <Button onClick={() => navigate("/")}>Browse Menu</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation cartCount={cartItems.length} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.foods.image_url}
                      alt={item.foods.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{item.foods.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.foods.category}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-semibold w-8 text-center">{item.quantity}</span>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            ₹{((item.foods.base_price - (item.foods.base_price * item.foods.discount_percent / 100)) * item.quantity).toFixed(2)}
                          </p>
                          {item.foods.discount_percent > 0 && (
                            <p className="text-sm text-muted-foreground line-through">
                              ₹{(item.foods.base_price * item.quantity).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-lg">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex justify-between text-secondary">
                      <span>Discount</span>
                      <span>-₹{totals.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (5%)</span>
                    <span>₹{totals.gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>₹{totals.deliveryCharge.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{totals.total.toFixed(2)}</span>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
