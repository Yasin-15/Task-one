# 🌐 HamiSkills Internship – Web Development Track Week 2 Task: Product Catalog with Search & Filter for Hami MiniMarket

A responsive e-commerce website for HamiSkills' community shop specializing in fresh fruits and vegetables. This project showcases modern web development practices with vanilla HTML5, CSS3, and JavaScript, featuring a dynamic product catalog with search and filter functionality.

## 🎯 Project Purpose

The Hami MiniMarket website serves as a complete e-commerce solution for potential customers, featuring:
- **Landing Page**: Company information, values, and product showcase
- **Product Catalog**: Dynamic product listing with search and filter functionality
- **Search & Filter Features**: Real-time product filtering by name, category, and price
- **Shopping Cart**: Add to cart functionality with persistent storage
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Interactive Features**: Enhanced user experience with animations and feedback

## �  Key Features Implementation

### Search Functionality
- **Real-time Search**: Debounced input for performance
- **Multi-field Search**: Searches both product name and description
- **Clear Search**: Easy reset with visual feedback

### Filter System
- **Category Filter**: Separate fruits and vegetables
- **Price Range Filter**: Multiple price thresholds
- **Combined Filters**: All filters work together seamlessly

### Shopping Cart System
- **Modular Architecture**: Separated into Product, Cart, and Storage modules for maintainability
- **Add to Cart**: One-click product addition with visual feedback and animations
- **Cart Management**: Full CRUD operations - add, remove, update quantities
- **Cart Counter**: Real-time badge updates showing total item count
- **Persistent Storage**: Cart data saved to localStorage, survives browser sessions
- **Cart Modal**: Slide-in sidebar with backdrop for reviewing cart contents
- **Price Calculations**: Automatic subtotal, tax (5%), and discount (10% off orders over $50)
- **Order Summary**: Dedicated page for reviewing complete order before checkout
- **Toast Notifications**: Success messages for cart operations
- **Animations**: Smooth transitions for cart updates, item removal, and quantity changes
- **Error Handling**: Graceful fallback to in-memory storage when localStorage unavailable

### Responsive Design
- **Mobile-First**: Optimized for touch devices
- **Flexible Grid**: Adapts from 1 to 4 columns
- **Touch-Friendly**: Minimum 44px touch targets
- **Performance**: Optimized animations and transitions

## 📁 Project Structure

```
/
├── index.html              # Landing page with hero section
├── products.html           # Product catalog page with search/filter
├── order-summary.html      # Order summary and checkout page
├── css/
│   ├── styles.css         # Main stylesheet with responsive design
│   └── products.css       # Product catalog and cart specific styles
├── js/
│   ├── main.js           # Core JavaScript functionality for landing page
│   ├── products.js       # Product catalog with search/filter functionality
│   ├── product.js        # Product Module - handles product rendering and display
│   ├── cart.js           # Cart Module - manages cart state and operations
│   ├── storage.js        # Storage Module - handles localStorage persistence
│   └── toast.js          # Toast notification system for user feedback
├── images/
│   ├── logo.jpg          # Hami MiniMarket logo
│   ├── hero-banner.jpg   # Hero section background
│   └── products/         # Product images directory
│       ├── apples.jpg
│       ├── bananas.jpg
│       ├── broccoli.jpg
│       ├── carrots.jpg
│       ├── lettuce.jpg
│       ├── oranges.jpg
│       ├── strawberries.jpg
│       └── tomatoes.jpg
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions deployment workflow
├── .kiro/
│   └── specs/
│       └── shopping-cart-system/  # Feature specification documents
│           ├── requirements.md    # EARS-compliant requirements
│           ├── design.md          # Detailed design document
│           └── tasks.md           # Implementation task list
├── README.md             # This file
└── .gitignore           # Git ignore file
```

## ✅ Completed Features

### 1. Product Catalog Page ✅
- ✅ Display 10+ products (fruits and vegetables)
- ✅ Product information: name, image, price, category, description, badge
- ✅ Responsive CSS Grid layout (1-4 columns based on screen size)
- ✅ Mobile, tablet, and desktop responsive design
- ✅ Lazy loading for product images
- ✅ Smooth animations on product card display

### 2. Search & Filter Features ✅
- ✅ **Search Bar**: Real-time filtering by product name and description
- ✅ **Category Filter**: Dropdown to filter by Fruits/Vegetables/All
- ✅ **Price Filter**: Filter products by maximum price range
- ✅ **Sort Options**: Sort by name and price (ascending/descending)
- ✅ **Reset Filters**: Clear all filters with one click
- ✅ **Debounced Search**: Optimized performance with 300ms delay

### 3. Shopping Cart System ✅
- ✅ **Modular Architecture**: Separated Product, Cart, and Storage modules
- ✅ **Add to Cart**: One-click addition with visual feedback
- ✅ **Cart Management**: Add, remove, update quantity operations
- ✅ **Cart Counter**: Real-time badge showing total item count
- ✅ **Cart Modal**: Slide-in sidebar with smooth animations
- ✅ **Cart Persistence**: localStorage with automatic save/restore
- ✅ **Price Calculations**: Subtotal, tax (5%), discount (10% off $50+)
- ✅ **Order Summary Page**: Complete order review before checkout
- ✅ **Toast Notifications**: Success messages for all cart operations
- ✅ **Error Handling**: Graceful fallback when localStorage unavailable
- ✅ **Animations**: Smooth transitions for all cart interactions

### 4. Accessibility & UX ✅
- ✅ **Keyboard Navigation**: Full keyboard support for all interactions
- ✅ **ARIA Labels**: Screen reader friendly
- ✅ **Focus Indicators**: Clear visual focus states
- ✅ **Touch Targets**: Minimum 44px for mobile usability
- ✅ **Haptic Feedback**: Vibration on mobile for cart actions
- ✅ **Loading States**: Visual feedback during operations

## 🏗️ Modular Architecture

The shopping cart system follows a clean, modular architecture with clear separation of concerns:

### Module Overview

**Product Module (`js/product.js`)**
- Renders product displays with images, prices, and descriptions
- Handles "Add to Cart" button interactions
- Manages product data and state
- Updates button states based on cart contents
- Provides visual feedback for user actions

**Cart Module (`js/cart.js`)**
- Manages cart state and all cart operations (add, remove, update)
- Calculates subtotals, tax (5%), discounts (10% off $50+), and totals
- Renders cart UI (modal/sidebar) with animations
- Updates cart counter badge in real-time
- Coordinates with Storage Module for persistence

**Storage Module (`js/storage.js`)**
- Abstracts all localStorage interactions
- Handles serialization/deserialization of cart data
- Provides comprehensive error handling
- Implements fallback to in-memory storage when localStorage unavailable
- Manages storage quota and data corruption scenarios

**Toast Module (`js/toast.js`)**
- Displays temporary notification messages
- Provides visual feedback for cart operations
- Supports success, info, and error message types
- Auto-dismisses after 3 seconds with smooth animations

### Module Communication

```
User Action → Product Module → Cart Module → Storage Module → localStorage
                                    ↓
                              Toast Module (feedback)
                                    ↓
                              UI Updates (counter, modal)
```

### localStorage Implementation

**Data Structure:**
```javascript
{
  items: [
    {
      id: 1,
      name: "Fresh Red Apples",
      price: 2.99,
      image: "images/products/apples.jpg",
      quantity: 2
    }
  ],
  version: "1.0",
  timestamp: "2024-11-11T10:30:00.000Z"
}
```

**Key Features:**
- **Automatic Persistence**: Cart saves automatically after every modification
- **Session Recovery**: Cart data restored on page load
- **Error Handling**: Graceful fallback to in-memory storage if localStorage fails
- **Data Validation**: Checks for corrupted data and version compatibility
- **Quota Management**: Handles storage quota exceeded scenarios

**Storage Key:** `hamiCart`

## 🚀 Setup Instructions

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for development)

### Local Development

1. **Clone or download the repository**
   ```bash
   git clone <repository-url>
   cd hami-minimarket
   ```

2. **Open the project**
   - Simply open `index.html` or `products.html` in your web browser, or
   - Use a local server for better development experience:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve .
     
     # Using PHP
     php -S localhost:8000
     ```

3. **Navigate the site**
   - **Home Page**: `index.html` - Landing page with company info
   - **Products**: `products.html` - Full product catalog with search/filter
   - **Order Summary**: `order-summary.html` - Review cart and complete order

### Testing the Shopping Cart

1. **Add Products to Cart**
   - Navigate to the products page
   - Click "Add to Cart" on any product
   - Watch the cart counter update in the navigation bar

2. **View Cart**
   - Click the cart icon in the navigation
   - Cart modal slides in showing all items
   - Adjust quantities using +/- buttons
   - Remove items using the trash icon

3. **Test Persistence**
   - Add items to cart
   - Refresh the page or close the browser
   - Reopen the page - cart items are restored

4. **Test Discount**
   - Add products totaling over $50
   - View cart to see 10% discount applied
   - Tax calculated on discounted amount

5. **Complete Order**
   - Click "Checkout" in cart modal
   - Review order summary page
   - See complete breakdown of prices
 
## 🌟 Features

### Landing Page (index.html)
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive Navigation**: Smooth scrolling to page sections
- **Product Showcase**: Grid layout with hover effects
- **Contact Form**: Real-time validation and user feedback
- **Image Slider**: Interactive about section with multiple images
- **Accessibility**: Semantic HTML and keyboard navigation support

### Product Catalog (products.html)
- **Dynamic Product Display**: 10+ fresh fruits and vegetables
- **Real-time Search**: Filter products by name with instant results
- **Category Filter**: Separate fruits and vegetables
- **Price Filter**: Filter by maximum price range
- **Sorting Options**: Sort by name (A-Z, Z-A) and price (low-high, high-low)
- **Add to Cart**: Functional shopping cart with item counter
- **Responsive Grid**: Adaptive layout for all screen sizes
- **Loading States**: Smooth animations and user feedback
- **Persistent Cart**: Cart data saved in localStorage
- **Keyboard Navigation**: Full accessibility support

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🛠️ Technologies Used

- **HTML5**: Semantic markup for accessibility and SEO
- **CSS3**: Modern styling with Flexbox/Grid layouts, custom properties, animations
- **Vanilla JavaScript**: Modular ES5 architecture with IIFE pattern
- **localStorage API**: Client-side data persistence for shopping cart
- **Responsive Design**: Mobile-first approach with CSS media queries
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Performance**: Lazy loading, debounced search, optimized animations

## 🔧 Technical Details

### Cart Calculations

The cart system performs calculations in the following order:

1. **Subtotal**: Sum of all item line totals (price × quantity)
2. **Discount**: 10% off if subtotal ≥ $50
3. **Tax**: 5% applied to (subtotal - discount)
4. **Total**: (subtotal - discount) + tax

**Example:**
```
Subtotal:              $55.00
Discount (10%):        -$5.50
Subtotal after disc:   $49.50
Tax (5%):              +$2.48
Total:                 $51.98
```

### Error Handling

**localStorage Scenarios:**
- **Unavailable** (private browsing): Falls back to in-memory storage with user warning
- **Quota Exceeded**: Clears old data and retries, then falls back to memory
- **Corrupted Data**: Clears invalid data and starts fresh
- **JSON Parse Errors**: Handles gracefully and resets cart

### Browser Compatibility

**Minimum Requirements:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

**Required APIs:**
- localStorage
- JSON (parse/stringify)
- ES5 JavaScript
- CSS Grid and Flexbox

### Performance Optimizations

- **Debounced Search**: 300ms delay to reduce unnecessary filtering
- **Lazy Image Loading**: Images load as they enter viewport
- **Efficient DOM Updates**: Minimal reflows and repaints
- **Event Delegation**: Optimized event handling for dynamic content
- **CSS Animations**: Hardware-accelerated transforms
- **In-Memory Caching**: Product data cached to avoid repeated parsing

## 🎨 Customization

### Brand Colors
The site uses CSS custom properties for easy color customization. Update the values in `css/styles.css`:

```css
:root {
  --color-primary: #2E7D32;        /* Fresh Green */
  --color-secondary: #FF8F00;      /* Orange Accent */
  --color-primary-light: #4CAF50;  /* Light Green */
}
```

### Content Updates
- **Products**: Update the product data in `js/products.js`
- **Images**: Replace images in the `images/products/` directory
- **Text Content**: Modify content directly in HTML files
- **Styling**: Customize appearance in CSS files

## 🚀 Deployment

This project is configured for automatic deployment using GitHub Actions.

### GitHub Pages Deployment (Automated)

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys to GitHub Pages on every push to the main branch.

**Setup Steps:**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy shopping cart system"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (created automatically by workflow)
   - Click Save

3. **Access Your Site**
   - Site will be available at: `https://username.github.io/repository-name`
   - Deployment typically takes 1-2 minutes

**Workflow Features:**
- Automatic deployment on push to main branch
- Builds and deploys all static assets
- Preserves cart functionality with localStorage
- No build step required (pure static files)

### Manual Deployment Options

**Netlify**
1. Drag and drop project folder to [netlify.com](https://netlify.com)
2. Or connect GitHub repository for automatic deployments
3. No configuration needed - works out of the box

**Vercel**
1. Import project from GitHub
2. Framework Preset: Other
3. Deploy - automatic deployments on push

**Other Platforms**
- Firebase Hosting
- Surge.sh
- Cloudflare Pages
- Any static hosting service

### Deployment Requirements
- All files are static (HTML, CSS, JS, images)
- No server-side processing required
- No build step needed
- Compatible with CDN and edge deployment
- localStorage works on all HTTPS domains

### Post-Deployment Verification

After deployment, verify:
- ✅ All pages load correctly (index, products, order-summary)
- ✅ Product images display properly
- ✅ Add to cart functionality works
- ✅ Cart persists after page refresh
- ✅ Cart modal opens and closes
- ✅ Calculations are correct (subtotal, tax, discount)
- ✅ Responsive design works on mobile
- ✅ Toast notifications appear

## 📄 License

This project is created for educational purposes as part of the HamiSkills program.

## 🤝 Contributing

This is a learning project. For suggestions or improvements, please create an issue or submit a pull request.

## 📞 Contact

For questions about this project, please use the contact form on the website or reach out through the HamiSkills program.

## 🐛 Troubleshooting

### Cart Not Persisting
**Issue**: Cart items disappear after page refresh

**Solutions**:
- Check if localStorage is enabled in browser settings
- Disable private/incognito browsing mode
- Check browser console for storage errors
- Clear browser cache and try again

### Images Not Loading
**Issue**: Product images show broken image icons

**Solutions**:
- Verify images exist in `images/products/` directory
- Check image file names match exactly (case-sensitive)
- Use a local server instead of opening HTML files directly
- Check browser console for 404 errors

### Cart Modal Not Opening
**Issue**: Clicking cart icon doesn't show modal

**Solutions**:
- Check browser console for JavaScript errors
- Verify all script files are loaded in correct order
- Clear browser cache and reload
- Ensure JavaScript is enabled in browser

### Calculations Incorrect
**Issue**: Cart totals don't match expected values

**Solutions**:
- Verify discount threshold is $50 (10% off)
- Check tax rate is 5%
- Ensure calculations follow order: subtotal → discount → tax → total
- Check browser console for calculation errors

## 📋 Project Highlights

### Features Implemented ✅
- ✅ **Product Catalog**: 10+ products with complete information and badges
- ✅ **Search & Filter**: Real-time search with category and price filters
- ✅ **Shopping Cart**: Full-featured cart with persistence and calculations
- ✅ **Modular Architecture**: Clean separation of concerns across modules
- ✅ **Responsive Design**: Mobile-first approach for all screen sizes
- ✅ **Animations**: Smooth transitions and visual feedback
- ✅ **Error Handling**: Graceful degradation and fallback strategies
- ✅ **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation

### Technologies Used 💻
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Grid/Flexbox layouts, animations, custom properties
- **JavaScript**: Modular ES5 with IIFE pattern, no frameworks
- **localStorage API**: Client-side data persistence
- **Responsive Design**: Mobile-first CSS with media queries
- **GitHub Actions**: Automated deployment workflow

### Architecture Highlights 🏗️
- **Modular Design**: Product, Cart, Storage, and Toast modules
- **Separation of Concerns**: Each module has single responsibility
- **Error Resilience**: Comprehensive error handling and fallbacks
- **Performance**: Optimized with lazy loading and debouncing
- **Maintainability**: Clean code with clear interfaces between modules

### Key Learning Outcomes 📚
- **Modular JavaScript**: Building scalable applications with IIFE pattern
- **State Management**: Managing cart state across page loads
- **localStorage**: Implementing persistent client-side storage
- **DOM Manipulation**: Dynamic content rendering and updates
- **Event Handling**: Complex user interactions and event delegation
- **Responsive Design**: Mobile-first CSS Grid and Flexbox
- **User Experience**: Animations, feedback, and error handling
- **Accessibility**: Keyboard navigation and screen reader support
- **Deployment**: Automated CI/CD with GitHub Actions

---

**Live Site**: [https://yasin-15.github.io/Task-one/]

**Product Catalog**: [https://yasin-15.github.io/Task-one/products.html]

Built with ❤️ for the HamiSkills Web Development Track - Week 2