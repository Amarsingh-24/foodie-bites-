import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMode, setPaymentMode] = useState("cod");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to checkout");
        navigate("/auth");
        return;
      }
      fetchCartItems(user.id);
      fetchProfile(user.id);
    };
    checkAuth();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) {
      setFullName(data.full_name || "");
      setPhone(data.phone || "");
      setAddress(data.address || "");
    }
  };

  const fetchCartItems = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        *,
        foods (*)
      `)
      .eq("user_id", userId);

    if (error || !data || data.length === 0) {
      toast.error("No items in cart");
      navigate("/cart");
      return;
    }

    setCartItems(data);
    setLoading(false);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let discount = 0;
    const deliveryCharge = cartItems[0]?.foods.delivery_charge || 0;

    cartItems.forEach(item => {
      const itemPrice = item.foods.base_price * item.quantity;
      const itemDiscount = (itemPrice * item.foods.discount_percent) / 100;
      subtotal += itemPrice;
      discount += itemDiscount;
    });

    const discountedSubtotal = subtotal - discount;
    const gst = (discountedSubtotal * 5) / 100;
    const total = discountedSubtotal + gst + deliveryCharge;

    return { subtotal, discount, gst, deliveryCharge, total };
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const totals = calculateTotals();
    
    const orderItems = cartItems.map(item => ({
      food_id: item.food_id,
      name: item.foods.name,
      quantity: item.quantity,
      price: item.foods.base_price,
      discount_percent: item.foods.discount_percent,
    }));

    const { error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        items: orderItems,
        subtotal: totals.subtotal,
        discount: totals.discount,
        gst: totals.gst,
        delivery_charge: totals.deliveryCharge,
        total: totals.total,
        delivery_address: address,
        payment_mode: paymentMode,
        status: "pending",
      });

    if (orderError) {
      toast.error("Failed to place order");
      setPlacing(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fullName,
        phone: phone,
        address: address,
      });

    const { error: clearError } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);

    setOrderPlaced(true);
    setPlacing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation cartCount={0} />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation cartCount={0} />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <CheckCircle className="h-24 w-24 text-secondary mb-4" />
          <h2 className="text-3xl font-bold mb-2">Order Placed Successfully!</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Your order has been received and is being prepared.
          </p>
          <Button onClick={() => navigate("/")}>Continue Shopping</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation cartCount={cartItems.length} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMode} onValueChange={setPaymentMode}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="cursor-pointer">Cash on Delivery</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="cursor-pointer">Credit/Debit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="cursor-pointer">UPI</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.foods.name} x {item.quantity}
                        </span>
                        <span>
                          ₹{((item.foods.base_price - (item.foods.base_price * item.foods.discount_percent / 100)) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator />
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
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={placing}
                  >
                    {placing ? "Placing Order..." : "Place Order"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
