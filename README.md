# قطع غيار اليمن - Yemen Auto Parts

## Project Structure

```
src/
├── features/                    # Feature-based modules
│   ├── auth/pages/              # Authentication (login/register)
│   ├── cart/pages/              # Shopping cart
│   ├── catalog/pages/           # Products, search, categories, deals
│   └── checkout/pages/          # Checkout flow & order confirmation
│
├── pages/                       # Remaining pages (to be migrated)
│   ├── Orders, OrderTracking    # Order management
│   ├── Profile, CustomerReg     # Customer accounts
│   ├── PaymentMethods, Addresses# Payment & shipping
│   ├── Compare, Wishlist        # Product tools
│   ├── Chat, About, Terms       # Support & info
│   └── Settings, Notifications  # App settings
│
├── components/
│   ├── layout/                  # AppLayout, BottomNav
│   ├── product/                 # ProductSuggestions, SkeletonCard
│   ├── checkout/                # CheckoutProgress
│   ├── shared/                  # ShareButton, NavLink
│   └── ui/                      # shadcn/ui components
│
├── contexts/                    # Global state (Cart, Compare, Currency)
├── data/                        # Static data (products, yemenData)
├── hooks/                       # Custom hooks
├── lib/                         # Utilities
└── assets/                      # Images
```

## Key Patterns

- **Feature modules**: Group related pages under `features/{name}/pages/`
- **Component layers**: `layout/` → `product/` → `checkout/` → `shared/` → `ui/`
- **Shared state**: Contexts in `contexts/` for cross-feature state
- **Data layer**: Static data in `data/`, ready for API migration
- **Semantic tokens**: All colors via CSS variables, no hardcoded values
