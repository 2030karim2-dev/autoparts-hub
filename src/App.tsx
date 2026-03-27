import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { CompareProvider } from "@/contexts/CompareContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import Index from "./pages/Index.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Orders from "./pages/Orders.tsx";
import Categories from "./pages/Categories.tsx";
import Chat from "./pages/Chat.tsx";
import Profile from "./pages/Profile.tsx";
import Cart from "./pages/Cart.tsx";
import Search from "./pages/Search.tsx";
import VehicleSelect from "./pages/VehicleSelect.tsx";
import Checkout from "./pages/Checkout.tsx";
import Addresses from "./pages/Addresses.tsx";
import OrderConfirmation from "./pages/OrderConfirmation.tsx";
import OrderTracking from "./pages/OrderTracking.tsx";
import Wishlist from "./pages/Wishlist.tsx";
import Notifications from "./pages/Notifications.tsx";
import Auth from "./pages/Auth.tsx";
import QuoteRequest from "./pages/QuoteRequest.tsx";
import Compare from "./pages/Compare.tsx";
import About from "./pages/About.tsx";
import Onboarding from "./pages/Onboarding.tsx";
import Settings from "./pages/Settings.tsx";
import Deals from "./pages/Deals.tsx";
import PaymentMethods from "./pages/PaymentMethods.tsx";
import CustomerRegistration from "./pages/CustomerRegistration.tsx";
import ReturnRequest from "./pages/ReturnRequest.tsx";
import Terms from "./pages/Terms.tsx";
import NotFound from "./pages/NotFound.tsx";

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
