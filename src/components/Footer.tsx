import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FoodHub
            </h3>
            <p className="text-muted-foreground text-sm">
              Delicious food delivered to your doorstep in minutes.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-sm text-muted-foreground">
              Email: support@foodhub.com<br />
              Phone: +1 234 567 8900
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © 2025 FoodHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
