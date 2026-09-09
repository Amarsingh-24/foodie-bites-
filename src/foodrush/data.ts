import hero from "@/assets/foodrush/hero.jpg";
import rSpice from "@/assets/foodrush/r-spice-junction.jpg";
import rTandoori from "@/assets/foodrush/r-tandoori-tales.jpg";
import rDosa from "@/assets/foodrush/r-dosa-diaries.jpg";
import rBiryani from "@/assets/foodrush/r-biryani-house.jpg";
import rWok from "@/assets/foodrush/r-wok-and-roll.jpg";
import rSlice from "@/assets/foodrush/r-slice-theory.jpg";
import rBurger from "@/assets/foodrush/r-burger-baithak.jpg";
import rSweet from "@/assets/foodrush/r-sweet-karma.jpg";
import rChai from "@/assets/foodrush/r-chai-chowk.jpg";
import rGreen from "@/assets/foodrush/r-green-bowl.jpg";
import dBiryani from "@/assets/foodrush/d-biryani.jpg";
import dCurry from "@/assets/foodrush/d-curry.jpg";
import dDosa from "@/assets/foodrush/d-dosa.jpg";
import dPizza from "@/assets/foodrush/d-pizza.jpg";
import dBurger from "@/assets/foodrush/d-burger.jpg";
import dNoodles from "@/assets/foodrush/d-noodles.jpg";
import dDessert from "@/assets/foodrush/d-dessert.jpg";
import dDrinks from "@/assets/foodrush/d-drinks.jpg";
import dBowl from "@/assets/foodrush/d-bowl.jpg";
import dTandoori from "@/assets/foodrush/d-tandoori.jpg";

export const heroImage = hero;

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  image: string;
  cuisines: string[];
  categoryIds: string[];
  rating: number;
  reviewCount: number;
  deliveryMinutes: number;
  distanceKm: number;
  costForTwo: number;
  priceLevel: 1 | 2 | 3;
  isVeg: boolean;
  offer?: string;
  area: string;
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  mrp?: number;
  isVeg: boolean;
  rating: number;
  bestseller?: boolean;
  serves: string;
}

export const categories: Category[] = [
  { id: "biryani", name: "Biryani", image: dBiryani },
  { id: "north-indian", name: "North Indian", image: dCurry },
  { id: "south-indian", name: "South Indian", image: dDosa },
  { id: "pizza", name: "Pizza", image: dPizza },
  { id: "burgers", name: "Burgers", image: dBurger },
  { id: "chinese", name: "Chinese", image: dNoodles },
  { id: "desserts", name: "Desserts", image: dDessert },
  { id: "beverages", name: "Beverages", image: dDrinks },
  { id: "healthy", name: "Healthy", image: dBowl },
  { id: "grills", name: "Grills & Kebabs", image: dTandoori },
];

export const restaurants: Restaurant[] = [
  {
    id: "spice-junction",
    name: "Spice Junction",
    tagline: "Home-style North Indian thalis and curries",
    image: rSpice,
    cuisines: ["North Indian", "Thali"],
    categoryIds: ["north-indian", "grills"],
    rating: 4.5,
    reviewCount: 2840,
    deliveryMinutes: 32,
    distanceKm: 2.1,
    costForTwo: 450,
    priceLevel: 2,
    isVeg: false,
    offer: "50% off up to ₹100",
    area: "Jubilee Hills",
  },
  {
    id: "tandoori-tales",
    name: "Tandoori Tales",
    tagline: "Clay-oven kebabs, breads and smoky grills",
    image: rTandoori,
    cuisines: ["Kebabs", "Mughlai"],
    categoryIds: ["grills", "north-indian"],
    rating: 4.6,
    reviewCount: 3910,
    deliveryMinutes: 38,
    distanceKm: 3.4,
    costForTwo: 700,
    priceLevel: 3,
    isVeg: false,
    offer: "Free dessert above ₹599",
    area: "Banjara Hills",
  },
  {
    id: "dosa-diaries",
    name: "Dosa Diaries",
    tagline: "Crisp dosas, fluffy idlis, filter coffee",
    image: rDosa,
    cuisines: ["South Indian"],
    categoryIds: ["south-indian", "beverages"],
    rating: 4.4,
    reviewCount: 5120,
    deliveryMinutes: 24,
    distanceKm: 1.2,
    costForTwo: 300,
    priceLevel: 1,
    isVeg: true,
    offer: "20% off all day",
    area: "Madhapur",
  },
  {
    id: "bombay-biryani-house",
    name: "Bombay Biryani House",
    tagline: "Slow-cooked dum biryani in copper handis",
    image: rBiryani,
    cuisines: ["Biryani", "Hyderabadi"],
    categoryIds: ["biryani", "grills"],
    rating: 4.7,
    reviewCount: 8430,
    deliveryMinutes: 35,
    distanceKm: 4.0,
    costForTwo: 600,
    priceLevel: 2,
    isVeg: false,
    offer: "Buy 1 Get 1 on family packs",
    area: "Gachibowli",
  },
  {
    id: "wok-and-roll",
    name: "Wok & Roll",
    tagline: "Fiery Indo-Chinese straight off the wok",
    image: rWok,
    cuisines: ["Chinese", "Asian"],
    categoryIds: ["chinese"],
    rating: 4.2,
    reviewCount: 1980,
    deliveryMinutes: 29,
    distanceKm: 2.8,
    costForTwo: 400,
    priceLevel: 2,
    isVeg: false,
    area: "Kondapur",
  },
  {
    id: "slice-theory",
    name: "Slice Theory",
    tagline: "Wood-fired sourdough pizza, made to order",
    image: rSlice,
    cuisines: ["Pizza", "Italian"],
    categoryIds: ["pizza"],
    rating: 4.5,
    reviewCount: 2260,
    deliveryMinutes: 41,
    distanceKm: 5.2,
    costForTwo: 800,
    priceLevel: 3,
    isVeg: false,
    offer: "Flat ₹125 off above ₹499",
    area: "Hitec City",
  },
  {
    id: "burger-baithak",
    name: "Burger Baithak",
    tagline: "Smashed patties, crunchy fries, thick shakes",
    image: rBurger,
    cuisines: ["Burgers", "Fast Food"],
    categoryIds: ["burgers", "beverages"],
    rating: 4.1,
    reviewCount: 3320,
    deliveryMinutes: 26,
    distanceKm: 1.9,
    costForTwo: 350,
    priceLevel: 1,
    isVeg: false,
    area: "Kukatpally",
  },
  {
    id: "sweet-karma",
    name: "Sweet Karma",
    tagline: "Mithai, cakes and everything after dinner",
    image: rSweet,
    cuisines: ["Desserts", "Bakery"],
    categoryIds: ["desserts"],
    rating: 4.8,
    reviewCount: 1450,
    deliveryMinutes: 30,
    distanceKm: 3.1,
    costForTwo: 300,
    priceLevel: 2,
    isVeg: true,
    offer: "10% off on boxes of 12",
    area: "Begumpet",
  },
  {
    id: "chai-chowk",
    name: "Chai Chowk",
    tagline: "Kulhad chai, cold brews and evening snacks",
    image: rChai,
    cuisines: ["Beverages", "Snacks"],
    categoryIds: ["beverages"],
    rating: 4.3,
    reviewCount: 990,
    deliveryMinutes: 19,
    distanceKm: 0.9,
    costForTwo: 200,
    priceLevel: 1,
    isVeg: true,
    area: "Ameerpet",
  },
  {
    id: "green-bowl-co",
    name: "Green Bowl Co.",
    tagline: "Macro-counted bowls, salads and wraps",
    image: rGreen,
    cuisines: ["Healthy", "Salads"],
    categoryIds: ["healthy"],
    rating: 4.4,
    reviewCount: 760,
    deliveryMinutes: 33,
    distanceKm: 3.7,
    costForTwo: 550,
    priceLevel: 2,
    isVeg: true,
    offer: "Free delivery on first order",
    area: "Financial District",
  },
];

const item = (
  restaurantId: string,
  categoryId: string,
  name: string,
  description: string,
  price: number,
  image: string,
  isVeg: boolean,
  rating: number,
  serves: string,
  bestseller = false,
  mrp?: number,
): FoodItem => ({
  id: `${restaurantId}--${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  restaurantId,
  categoryId,
  name,
  description,
  price,
  mrp,
  image,
  isVeg,
  rating,
  serves,
  bestseller,
});

export const foodItems: FoodItem[] = [
  // Spice Junction
  item("spice-junction", "north-indian", "Paneer Butter Masala", "Cottage cheese simmered in a silky tomato-cashew gravy.", 289, dCurry, true, 4.5, "Serves 1", true, 349),
  item("spice-junction", "north-indian", "Dal Tadka", "Yellow lentils tempered with ghee, cumin and garlic.", 199, dCurry, true, 4.3, "Serves 1"),
  item("spice-junction", "north-indian", "Rajma Chawal Bowl", "Kidney beans in thick masala with steamed basmati.", 229, dBiryani, true, 4.2, "Serves 1"),
  item("spice-junction", "grills", "Chicken Kadai", "Chicken tossed with bell peppers and crushed spices.", 349, dCurry, false, 4.6, "Serves 1", true),
  item("spice-junction", "north-indian", "Butter Naan (2 pcs)", "Soft tandoor naan brushed with white butter.", 89, dCurry, true, 4.4, "2 pieces"),

  // Tandoori Tales
  item("tandoori-tales", "grills", "Murgh Malai Tikka", "Creamy chicken tikka with cardamom and cheese.", 419, dTandoori, false, 4.7, "6 pieces", true, 469),
  item("tandoori-tales", "grills", "Achari Paneer Tikka", "Pickle-marinated paneer charred in the tandoor.", 349, dTandoori, true, 4.5, "6 pieces"),
  item("tandoori-tales", "grills", "Seekh Kebab Platter", "Minced mutton skewers with mint chutney and onions.", 469, dTandoori, false, 4.6, "Serves 2"),
  item("tandoori-tales", "north-indian", "Dal Bukhara", "Black lentils slow-cooked overnight with butter.", 329, dCurry, true, 4.8, "Serves 2", true),
  item("tandoori-tales", "north-indian", "Laccha Paratha", "Flaky layered whole wheat paratha.", 79, dCurry, true, 4.2, "1 piece"),

  // Dosa Diaries
  item("dosa-diaries", "south-indian", "Classic Masala Dosa", "Crisp rice crepe with spiced potato, sambar and chutney.", 149, dDosa, true, 4.6, "Serves 1", true),
  item("dosa-diaries", "south-indian", "Ghee Podi Idli", "Steamed idlis tossed in gunpowder and ghee.", 129, dDosa, true, 4.5, "6 pieces"),
  item("dosa-diaries", "south-indian", "Mysore Rava Dosa", "Lacy semolina dosa with a spicy red chutney base.", 169, dDosa, true, 4.4, "Serves 1"),
  item("dosa-diaries", "south-indian", "Curd Rice with Pickle", "Comforting tempered curd rice, served chilled.", 119, dBowl, true, 4.1, "Serves 1"),
  item("dosa-diaries", "beverages", "Filter Coffee", "Strong degree coffee frothed in a steel tumbler.", 59, dDrinks, true, 4.7, "180 ml", true),

  // Bombay Biryani House
  item("bombay-biryani-house", "biryani", "Hyderabadi Chicken Dum Biryani", "Long-grain rice layered with marinated chicken and saffron.", 329, dBiryani, false, 4.8, "Serves 1", true, 379),
  item("bombay-biryani-house", "biryani", "Mutton Kacchi Biryani", "Raw mutton cooked with rice in a sealed handi.", 449, dBiryani, false, 4.7, "Serves 1"),
  item("bombay-biryani-house", "biryani", "Veg Dum Biryani", "Seasonal vegetables and paneer in fragrant rice.", 259, dBiryani, true, 4.3, "Serves 1"),
  item("bombay-biryani-house", "biryani", "Egg Biryani", "Boiled eggs folded into masala rice with fried onions.", 239, dBiryani, false, 4.2, "Serves 1"),
  item("bombay-biryani-house", "grills", "Chicken 65", "Crispy fried chicken with curry leaves and chilli.", 279, dTandoori, false, 4.5, "Serves 1", true),

  // Wok & Roll
  item("wok-and-roll", "chinese", "Veg Hakka Noodles", "Wok-tossed noodles with julienned vegetables.", 199, dNoodles, true, 4.2, "Serves 1", true),
  item("wok-and-roll", "chinese", "Chilli Paneer Dry", "Crisp paneer in a sticky garlic-chilli glaze.", 249, dNoodles, true, 4.4, "Serves 1"),
  item("wok-and-roll", "chinese", "Chicken Schezwan Fried Rice", "Fiery schezwan rice with shredded chicken.", 259, dNoodles, false, 4.3, "Serves 1"),
  item("wok-and-roll", "chinese", "Veg Manchow Soup", "Peppery soup topped with crunchy fried noodles.", 139, dNoodles, true, 4.0, "300 ml"),
  item("wok-and-roll", "chinese", "Chicken Momos (8 pcs)", "Steamed dumplings with schezwan dip.", 189, dNoodles, false, 4.5, "8 pieces", true),

  // Slice Theory
  item("slice-theory", "pizza", "Margherita Sourdough", "San Marzano sauce, fior di latte and basil.", 379, dPizza, true, 4.6, "10 inch", true),
  item("slice-theory", "pizza", "Tandoori Paneer Pizza", "Smoky paneer, onion and mint mayo drizzle.", 449, dPizza, true, 4.5, "10 inch"),
  item("slice-theory", "pizza", "Pepperoni Classico", "Cupped pepperoni with aged mozzarella.", 529, dPizza, false, 4.7, "10 inch", true, 599),
  item("slice-theory", "pizza", "Truffle Mushroom Pizza", "Wild mushrooms, truffle oil and parmesan.", 569, dPizza, true, 4.4, "10 inch"),
  item("slice-theory", "pizza", "Garlic Cheese Bread", "Sourdough sticks with garlic butter and mozzarella.", 219, dPizza, true, 4.3, "6 pieces"),

  // Burger Baithak
  item("burger-baithak", "burgers", "Double Cheese Smash", "Two smashed patties, cheddar and burger sauce.", 269, dBurger, false, 4.5, "1 burger", true),
  item("burger-baithak", "burgers", "Crispy Paneer Burger", "Golden paneer fillet with slaw and chipotle mayo.", 229, dBurger, true, 4.3, "1 burger"),
  item("burger-baithak", "burgers", "Peri Peri Chicken Burger", "Grilled chicken thigh with peri peri glaze.", 249, dBurger, false, 4.4, "1 burger"),
  item("burger-baithak", "burgers", "Loaded Cheese Fries", "Fries under cheese sauce, jalapeños and herbs.", 179, dBurger, true, 4.2, "Serves 1", true),
  item("burger-baithak", "beverages", "Thick Chocolate Shake", "Cocoa, ice cream and a whipped cream cap.", 169, dDrinks, true, 4.4, "400 ml"),

  // Sweet Karma
  item("sweet-karma", "desserts", "Gulab Jamun (4 pcs)", "Warm khoya dumplings soaked in rose syrup.", 149, dDessert, true, 4.7, "4 pieces", true),
  item("sweet-karma", "desserts", "Belgian Chocolate Pastry", "Dark chocolate ganache on a moist sponge.", 189, dDessert, true, 4.6, "1 slice"),
  item("sweet-karma", "desserts", "Rasmalai (2 pcs)", "Saffron milk soaked cottage cheese discs.", 169, dDessert, true, 4.8, "2 pieces", true),
  item("sweet-karma", "desserts", "Dry Fruit Baklava", "Layered filo with pistachio and honey.", 249, dDessert, true, 4.5, "6 pieces"),
  item("sweet-karma", "desserts", "Motichoor Laddoo Box", "Classic boondi laddoos, freshly rolled.", 299, dDessert, true, 4.4, "Box of 6"),

  // Chai Chowk
  item("chai-chowk", "beverages", "Kulhad Masala Chai", "Ginger-cardamom chai served in a clay cup.", 69, dDrinks, true, 4.6, "200 ml", true),
  item("chai-chowk", "beverages", "Cold Coffee Frappe", "Blended coffee with ice cream and cocoa dust.", 149, dDrinks, true, 4.4, "350 ml"),
  item("chai-chowk", "beverages", "Fresh Lime Soda", "Sweet-salted lime soda with mint.", 89, dDrinks, true, 4.1, "300 ml"),
  item("chai-chowk", "beverages", "Mango Lassi", "Thick yoghurt lassi with alphonso pulp.", 129, dDrinks, true, 4.5, "300 ml", true),
  item("chai-chowk", "beverages", "Masala Buttermilk", "Chaas with curry leaves and roasted cumin.", 59, dDrinks, true, 4.0, "250 ml"),

  // Green Bowl Co.
  item("green-bowl-co", "healthy", "Grilled Paneer Quinoa Bowl", "Quinoa, paneer, avocado and lemon dressing.", 349, dBowl, true, 4.5, "Serves 1", true),
  item("green-bowl-co", "healthy", "Peanut Soba Salad", "Soba noodles, crunchy veg and peanut dressing.", 299, dBowl, true, 4.2, "Serves 1"),
  item("green-bowl-co", "healthy", "High Protein Rajma Bowl", "Brown rice, rajma, greens and hung curd.", 289, dBowl, true, 4.3, "Serves 1"),
  item("green-bowl-co", "healthy", "Mediterranean Falafel Wrap", "Falafel, hummus and pickled veg in a wrap.", 269, dBowl, true, 4.4, "1 wrap", true),
  item("green-bowl-co", "healthy", "Berry Greek Yoghurt Parfait", "Layered yoghurt, granola and mixed berries.", 219, dBowl, true, 4.6, "Serves 1"),
];

export interface Coupon {
  code: string;
  label: string;
  type: "percent" | "flat";
  value: number;
  maxDiscount?: number;
  minOrder: number;
  freeDelivery?: boolean;
}

export const coupons: Coupon[] = [
  { code: "RUSH50", label: "50% off up to ₹100", type: "percent", value: 50, maxDiscount: 100, minOrder: 299 },
  { code: "FLAT125", label: "Flat ₹125 off above ₹499", type: "flat", value: 125, minOrder: 499 },
  { code: "FREESHIP", label: "Free delivery above ₹249", type: "flat", value: 0, minOrder: 249, freeDelivery: true },
];

export const getRestaurant = (id: string) => restaurants.find((r) => r.id === id);
export const getItemsForRestaurant = (id: string) => foodItems.filter((f) => f.restaurantId === id);
export const getFoodItem = (id: string) => foodItems.find((f) => f.id === id);
