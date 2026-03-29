import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { CompareProvider } from "@/contexts/CompareContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

// Feature: Catalog
import Index from "@/features/catalog/pages/Index";
import ProductDetail from "@/features/catalog/pages/ProductDetail";
import Search from "@/features/catalog/pages/Search";
import Categories from "@/features/catalog/pages/Categories";
import Deals from "@/features/catalog/pages/Deals";

// Feature: Cart & Checkout
import Cart from "@/features/cart/pages/Cart";
import Checkout from "@/features/checkout/pages/Checkout";
import OrderConfirmation from "@/features/checkout/pages/OrderConfirmation";

// Feature: Orders
import Orders from "./pages/Orders";
import OrderTracking from "./pages/OrderTracking";
import ReturnRequest from "./pages/ReturnRequest";

// Feature: Auth & Customer
import Auth from "@/features/auth/pages/Auth";
import Profile from "./pages/Profile";
import CustomerRegistration from "./pages/CustomerRegistration";

// Feature: Payment & Shipping
import PaymentMethods from "./pages/PaymentMethods";
import Addresses from "./pages/Addresses";

// Feature: Other
import Compare from "./pages/Compare";
import VehicleSelect from "./pages/VehicleSelect";
import Wishlist from "./pages/Wishlist";
import Notifications from "./pages/Notifications";
import Chat from "./pages/Chat";
import QuoteRequest from "./pages/QuoteRequest";
import About from "./pages/About";
import Onboarding from "./pages/Onboarding";
import Settings from "./pages/Settings";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CurrencyProvider>
        <CartProvider>
          <CompareProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/search" element={<Search />} />
                <Route path="/vehicle-select" element={<VehicleSelect />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/addresses" element={<Addresses />} />
                <Route path="/order-confirmation" element={<OrderConfirmation />} />
                <Route path="/order-tracking/:id" element={<OrderTracking />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/quote-request" element={<QuoteRequest />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/about" element={<About />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/deals" element={<Deals />} />
                <Route path="/payment-methods" element={<PaymentMethods />} />
                <Route path="/customer-registration" element={<CustomerRegistration />} />
                <Route path="/return-request" element={<ReturnRequest />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CompareProvider>
        </CartProvider>
      </CurrencyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;