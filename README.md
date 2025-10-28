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

### Shopping Cart
- **Add to Cart**: Visual feedback and animations
- **Cart Counter**: Real-time updates in navigation
- **Persistent Storage**: Cart survives browser refresh
- **Item Management**: Quantity tracking and updates

### Responsive Design
- **Mobile-First**: Optimized for touch devices
- **Flexible Grid**: Adapts from 1 to 4 columns
- **Touch-Friendly**: Minimum 44px touch targets
- **Performance**: Optimized animations and transitions

## 📁 Project Structure

```
/
├── index.html              # Landing page
├── products.html           # Product catalog page
├── css/
│   ├── styles.css         # Main stylesheet with responsive design
│   └── products.css       # Product catalog specific styles
├── js/
│   ├── main.js           # Core JavaScript functionality
│   └── products.js       # Product catalog functionality
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
│       ├── deploy.yml    # GitHub Actions deployment workflow
│       └── static.yml    # Static site deployment
├── README.md             # This file
└── .gitignore           # Git ignore file
```

## ✅ Week 2 Deliverables Completed

### 1. Product Catalog Page ✅
- ✅ Display 10+ products (fruits and vegetables)
- ✅ Product information: name, image, price, category, description
- ✅ Responsive CSS Grid/Flexbox layout
- ✅ Mobile and desktop responsive design

### 2. Search & Filter Features ✅
- ✅ **Search Bar**: Real-time filtering by product name
- ✅ **Category Filter**: Dropdown to filter by Fruits/Vegetables
- ✅ **Price Filter**: Filter products by maximum price range
- ✅ **Sort Options**: Sort by name and price (ascending/descending)
- ✅ **Reset Filters**: Clear all filters with one click

### 3. Bonus Features ✅
- ✅ **Add to Cart**: Functional shopping cart with item counter
- ✅ **Cart Persistence**: Cart data saved in browser localStorage
- ✅ **Visual Feedback**: Button animations and success states
- ✅ **Keyboard Navigation**: Full accessibility support

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
- **Vanilla JavaScript**: DOM manipulation, event handling, local storage
- **Responsive Design**: Mobile-first approach with CSS media queries
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Performance**: Lazy loading, debounced search, optimized animations

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

This project is ready for deployment to any static hosting platform. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deployment Options

**GitHub Pages** (Recommended)
1. Push code to GitHub repository
2. Enable GitHub Pages in repository settings
3. Site available at `https://username.github.io/repository-name`

**Netlify**
1. Drag and drop project folder to [netlify.com](https://netlify.com)
2. Or connect GitHub repository for automatic deployments

**Other Platforms**
- Vercel
- Firebase Hosting
- Surge.sh
- Any static hosting service

### Deployment Requirements
- All files are static (HTML, CSS, JS, images)
- No server-side processing required
- Compatible with CDN and edge deployment

## 📄 License

This project is created for educational purposes as part of the HamiSkills program.

## 🤝 Contributing

This is a learning project. For suggestions or improvements, please create an issue or submit a pull request.

## 📞 Contact

For questions about this project, please use the contact form on the website or reach out through the HamiSkills program.

## 📋 Professional Practice - Week 2 Submission

### Features Implemented ✅
- ✅ **Product Catalog Page**: 10+ products with complete information
- ✅ **Search Functionality**: Real-time product search by name
- ✅ **Category Filter**: Fruits and Vegetables dropdown filter
- ✅ **Price Filter**: Multiple price range options
- ✅ **Responsive Design**: Mobile, tablet, and desktop optimized
- ✅ **Add to Cart**: Functional shopping cart with counter
- ✅ **Sort Options**: Multiple sorting criteria
- ✅ **Visual Feedback**: Animations and user interaction feedback

### Technologies Used 💻
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Grid/Flexbox layouts, animations, responsive design
- **JavaScript**: DOM manipulation, event handling, localStorage
- **Responsive Design**: Mobile-first approach

### How to Run the Project 🚀
1. Clone the repository
2. Open `index.html` for the landing page
3. Navigate to `products.html` for the product catalog
4. Or use a local server for best experience

### Key Learning Outcomes 📚
- **DOM Manipulation**: Dynamic content rendering and filtering
- **Event Handling**: Search, filter, and cart interactions
- **Responsive Design**: Mobile-first CSS Grid and Flexbox
- **User Experience**: Smooth animations and visual feedback
- **Data Management**: JavaScript arrays and localStorage
- **Accessibility**: Keyboard navigation and screen reader support

---

**Live Site**: [https://yasin-15.github.io/Task-one/]

**Product Catalog**: [https://yasin-15.github.io/Task-one/products.html]

Built with ❤️ for the HamiSkills Web Development Track - Week 2