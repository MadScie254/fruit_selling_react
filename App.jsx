jsx
import { useState } from 'react';
import './App.css';

// Mock API to generate more fruits using faker
const generateFruits = () => {
  const fakeData = [];
  
  // Create 300+ unique fruits with diverse characteristics
  for (let i = 1; i <= 305; i++) {
    const baseNames = [
      "Apple", "Banana", "Orange", "Grapes", "Strawberry", "Mango", "Pineapple",
      "Blueberry", "Watermelon", "Papaya", "Guava", "Kiwi", "Lemon", "Lime",
      "Cherry", "Apricot", "Plum", "Peach", "Raspberry", "Blackberry", "Cantaloupe",
      "Honeydew", "Lychee", "Dragonfruit", "Passion Fruit", "Fig", "Date", "Cranberry",
      "Gooseberry", "Persimmon", "Tamarind", "Starfruit", "Durian", "Jackfruit", "Custard Apple"
    ];
    
    const name = `${baseNames[i % baseNames.length]} ${i > 20 ? `Variety ${i}` : ""}`;
    const price = Math.floor(Math.random() * 60) + 10;
    const category = ["Fruits", "Citrus", "Berries", "Tropical", "Exotic"][Math.floor(Math.random() * 5)];
    const description = `Fresh and delicious ${name} harvested at peak ripeness. Perfect for snacking, cooking, or adding to your favorite recipes.`;
    
    fakeData.push({
      id: i,
      name,
      category,
      price,
      image: `https://picsum.photos/seed/${i}/300/300`,
      description,
      stock: Math.floor(Math.random() * 50) + 50,
      rating: (Math.random() * 5).toFixed(1),
      reviews: Math.floor(Math.random() * 500) + 100,
      origin: ["Kenya", "Uganda", "Tanzania", "Ethiopia", "Malawi", "Zambia"][Math.floor(Math.random() * 6)],
      seasonality: ["Year-round", "Seasonal - Dry Season", "Seasonal - Wet Season"][Math.floor(Math.random() * 3)],
      nutrition: {
        calories: Math.floor(Math.random() * 100) + 20,
        vitamins: ["Vitamin C", "Vitamin A", "Potassium", "Folate"][Math.floor(Math.random() * 4)],
        fiber: Math.floor(Math.random() * 5) + 2,
        sugar: Math.floor(Math.random() * 15) + 5
      }
    });
  }
  
  return fakeData;
};

const App = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [selectedFruit, setSelectedFruit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [showAboutUs, setShowAboutUs] = useState(false);

  // Generate our extensive fruit catalog
  const fruits = generateFruits();

  // Extract categories from the generated fruits
  const categories = ['all', ...new Set(fruits.map((fruit) => fruit.category))];

  // Add item to cart
  const addToCart = (fruit) => {
    if (fruit.stock > 0) {
      setCart([...cart, { ...fruit, quantity: 1 }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Update quantity in cart
  const updateQuantity = (id, change) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity + change),
              subtotal: (item.price * (item.quantity + change)).toFixed(2)
            }
          : item
      )
    );
  };

  // Calculate total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // Add to wishlist
  const addToWishlist = (fruit) => {
    if (!wishlist.some(item => item.id === fruit.id)) {
      setWishlist([...wishlist, fruit]);
    }
  };

  // Remove from wishlist
  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  // Filter and sort fruits
  const filteredAndSortedFruits = [...fruits]
    .filter((fruit) => {
      if (activeTab !== 'all' && fruit.category !== activeTab) return false;
      if (searchTerm && !fruit.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOption === 'price-low-high') {
        return a.price - b.price;
      } else if (sortOption === 'price-high-low') {
        return b.price - a.price;
      } else if (sortOption === 'name-a-z') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'name-z-a') {
        return b.name.localeCompare(a.name);
      } else if (sortOption === 'rating-desc') {
        return b.rating - a.rating;
      }
      return 0;
    });

  // Open modal with fruit details
  const openModal = (fruit) => {
    setSelectedFruit(fruit);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFruit(null);
  };

  // Format currency to Kenyan Shillings
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
  };

  // Get today's date for freshness guarantee
  const getFreshnessDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toDateString();
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 to-emerald-600 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">FruitMart</h1>
          <nav className="space-x-6 hidden md:flex">
            <a href="#home" className="hover:text-yellow-200 transition-colors">Home</a>
            <a href="#products" className="hover:text-yellow-200 transition-colors">Products</a>
            <a href="#about" onClick={() => setShowAboutUs(true)} className="hover:text-yellow-200 transition-colors">About Us</a>
            <a href="#contact" className="hover:text-yellow-200 transition-colors">Contact</a>
            <button 
              onClick={() => setIsWishlistOpen(!isWishlistOpen)}
              className="relative hover:text-yellow-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative hover:text-yellow-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </nav>
          <button className="md:hidden text-xl">
            ☰
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-green-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to FruitMart</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Fresh, organic, and locally sourced fruits delivered straight to your door. With over 300+ varieties of fruits available, we bring you the finest produce from across East Africa.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a
              href="#products"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full transition-colors"
            >
              Shop Now
            </a>
            <a
              href="#about"
              onClick={() => setShowAboutUs(true)}
              className="inline-block bg-white hover:bg-gray-100 text-green-600 font-semibold py-3 px-6 rounded-full transition-colors border border-green-600"
            >
              About Us
            </a>
          </div>
        </div>
      </section>

      {/* Product Filters */}
      <section id="products" className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-full sm:w-1/2 lg:w-1/4">
              <input
                type="text"
                placeholder="Search fruits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="default">Default Sorting</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A-Z</option>
                <option value="name-z-a">Name: Z-A</option>
                <option value="rating-desc">Rating: Highest First</option>
              </select>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveTab(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeTab === category
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedFruits.length > 0 ? (
              filteredAndSortedFruits.map((fruit) => (
                <div
                  key={fruit.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <div className="relative">
                    <img src={fruit.image} alt={fruit.name} className="w-full h-48 object-cover" />
                    <button 
                      onClick={() => addToWishlist(fruit)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 hover:bg-green-100 transition-colors"
                      aria-label="Add to wishlist"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${wishlist.some(item => item.id === fruit.id) ? 'text-red-500' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{fruit.name}</h3>
                    <div className="flex items-center text-yellow-500 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < parseInt(fruit.rating) ? 'fill-current' : 'stroke-current'}`} 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{fruit.reviews} reviews</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{fruit.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-green-600 font-bold">
                        {formatCurrency(fruit.price)}
                        <span className="text-xs text-gray-500 ml-1">per kg</span>
                      </div>
                      <button
                        onClick={() => openModal(fruit)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">No fruits found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modal for fruit details */}
      {isModalOpen && selectedFruit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <div className="p-6">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 mb-6 md:mb-0">
                  <img src={selectedFruit.image} alt={selectedFruit.name} className="w-full h-auto object-cover rounded-lg" />
                </div>
                <div className="md:w-1/2 md:pl-6">
                  <h2 className="text-2xl font-bold mb-2">{selectedFruit.name}</h2>
                  <div className="flex items-center text-yellow-500 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < parseInt(selectedFruit.rating) ? 'fill-current' : 'stroke-current'}`} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{selectedFruit.reviews} reviews</span>
                  </div>
                  <p className="text-gray-600 mb-4">{selectedFruit.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium">Origin:</h4>
                      <p>{selectedFruit.origin}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Seasonality:</h4>
                      <p>{selectedFruit.seasonality}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Nutrition (100g):</h4>
                      <p>{selectedFruit.nutrition.calories} kcal</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Key Nutrient:</h4>
                      <p>{selectedFruit.nutrition.vitamins}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-green-600 font-bold text-xl">
                      {formatCurrency(selectedFruit.price)}
                      <span className="text-sm text-gray-500 ml-1">per kg</span>
                    </div>
                    <button
                      onClick={() => addToCart(selectedFruit)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md h-full sm:h-auto overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              {cart.length > 0 ? (
                <>
                  <ul className="space-y-4">
                    {cart.map((item) => (
                      <li key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded mr-3"
                          />
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-gray-600 text-sm">{formatCurrency(item.price)} x {item.quantity}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="text-gray-600 hover:text-red-500"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="text-gray-600 hover:text-green-500"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 ml-2"
                          >
                            ×
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center font-bold text-lg mb-4">
                      <span>Total:</span>
                      <span>{formatCurrency(calculateTotal())}</span>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Delivery Options:</h4>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input type="radio" name="delivery" className="mr-2" defaultChecked />
                          <span>Standard Delivery (3-5 days)</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="delivery" className="mr-2" />
                          <span>Express Delivery (1-2 days) (+{formatCurrency(50)})</span>
                        </label>
                      </div>
                    </div>
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Payment Methods:</h4>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input type="radio" name="payment" className="mr-2" defaultChecked />
                          <span>M-Pesa</span>
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="payment" className="mr-2" />
                          <span>Credit Card</span>
                        </label>
                      </div>
                    </div>
                    <button className="w-full mt-4 bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors">
                      Proceed to Checkout
                    </button>
                    <p className="mt-4 text-sm text-gray-600">
                      Your order will be freshly packed and shipped within 24 hours. Estimated delivery by {getFreshnessDate()}.
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Your cart is empty.</p>
                  <button
                    onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                    className="mt-4 text-green-600 hover:text-green-800 font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Modal */}
      {isWishlistOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-t-lg sm:rounded-lg shadow-xl w-full max-w-md h-full sm:h-auto overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Your Wishlist</h2>
                <button 
                  onClick={() => setIsWishlistOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              {wishlist.length > 0 ? (
                <ul className="space-y-4">
                  {wishlist.map((item) => (
                    <li key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded mr-3"
                        />
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-gray-600 text-sm">{formatCurrency(item.price)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition-colors"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Your wishlist is empty.</p>
                  <button
                    onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                    className="mt-4 text-green-600 hover:text-green-800 font-medium"
                  >
                    Browse Products
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* About Us Section */}
      {showAboutUs && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">About FruitMart</h2>
                <button 
                  onClick={() => setShowAboutUs(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              <div className="prose prose-lg max-w-none">
                <p>
                  Welcome to FruitMart, where nature's bounty meets modern convenience. We are a passionate collective of farmers, food enthusiasts, and technology innovators dedicated to bringing you the freshest, most flavorful fruits directly from the heart of East Africa to your doorstep.
                </p>
                
                <h3 className="text-xl font-bold mt-6">Our Story</h3>
                <p>
                  Founded in 2023 by Daniel Mwanjala, an accomplished Data Scientist and IT Manager with a deep-rooted passion for agriculture and sustainable development, FruitMart was born out of a simple yet powerful vision: to bridge the gap between local producers and consumers by offering high-quality, fresh produce while supporting the growth of small-scale farming communities across Kenya and neighboring countries.
                </p>
                
                <h3 className="text-xl font-bold mt-6">What Sets Us Apart</h3>
                <ul>
                  <li><strong>Direct Sourcing:</strong> We work directly with trusted farms and cooperatives to ensure the highest quality standards and fair compensation for our growers.</li>
                  <li><strong>Freshness Guaranteed:</strong> Our state-of-the-art cold chain logistics system ensures that your fruits reach you in perfect condition, just as they were picked.</li>
                  <li><strong>Sustainability Focus:</strong> We are committed to environmentally responsible practices, from packaging to transportation, ensuring minimal carbon footprint.</li>
                  <li><strong>Diverse Selection:</strong> With over 300+ varieties of fruits available, we offer something for every taste and occasion, from classic favorites to exotic finds.</li>
                  <li><strong>Community Impact:</strong> A portion of our profits goes back into supporting agricultural education and infrastructure development in rural farming communities.</li>
                </ul>
                
                <h3 className="text-xl font-bold mt-6">Our Commitment to Quality</h3>
                <p>
                  At FruitMart, quality is not just a standard - it's our promise. Every fruit that passes through our facilities undergoes rigorous inspection and testing to ensure it meets our exacting standards for size, color, flavor, and nutritional value. Our team of experts works closely with farmers to implement best practices in cultivation, harvesting, and post-harvest handling to preserve the natural goodness of each fruit.
                </p>
                
                <h3 className="text-xl font-bold mt-6">Technology Meets Tradition</h3>
                <p>
                  As a data-driven company, we leverage cutting-edge technology to optimize every aspect of our operations. From predictive analytics for inventory management to AI-powered recommendation systems that help you discover new fruits based on your preferences, we're constantly innovating to enhance your shopping experience while respecting traditional farming methods and knowledge.
                </p>
                
                <h3 className="text-xl font-bold mt-6">Join Our Journey</h3>
                <p>
                  Whether you're a health-conscious individual looking for nutritious options, a chef seeking premium ingredients, or a business owner needing bulk supplies, FruitMart is here to serve you. Together, let's savor the flavors of nature and support sustainable agriculture.
                </p>
                
                <div className="mt-6">
                  <h4 className="font-bold">Contact Information:</h4>
                  <ul>
                    <li>Email: <a href="mailto:dmwanjala254@gmail.com" className="text-blue-600 hover:underline">dmwanjala254@gmail.com</a></li>
                    <li>Phone: <a href="tel:+254742007277" className="text-blue-600 hover:underline">+254 742 007 277</a></li>
                    <li>Github: <a href="https://github.com/MadScie254" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://github.com/MadScie254</a></li>
                  </ul>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-bold">Follow Us:</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </a>
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                    <a href="#" className="text-blue-600 hover:text-blue-800">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer id="contact" className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">FruitMart</h3>
              <p className="text-gray-400">
                We bring you the freshest fruits directly from local farms across East Africa.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-green-400">Home</a></li>
                <li><a href="#products" className="hover:text-green-400">Products</a></li>
                <li><a href="#about" onClick={() => setShowAboutUs(true)} className="hover:text-green-400">About Us</a></li>
                <li><a href="#contact" className="hover:text-green-400">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p className="text-gray-400">Email: <a href="mailto:dmwanjala254@gmail.com" className="text-green-400 hover:text-green-300">dmwanjala254@gmail.com</a></p>
              <p className="text-gray-400">Phone: <a href="tel:+254742007277" className="text-green-400 hover:text-green-300">+254 742 007 277</a></p>
              <p className="text-gray-400">Address: Nairobi, Kenya</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-green-400">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; 2025 FruitMart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
// Note: The above code is a complete React component for a fruit e-commerce website. It includes sections for product filtering, product display, modals for product details, cart, and wishlist, as well as an about us section and a footer. The code uses Tailwind CSS for styling and includes functionality for adding/removing items from the cart and wishlist.
// The component is designed to be responsive and user-friendly, with smooth transitions and animations for a better user experience. The code also includes functions for formatting currency, calculating totals, and managing state using React hooks.
// The component is structured to be modular and maintainable, making it easy to extend or modify in the future. The use of Tailwind CSS allows for rapid styling and customization without the need for additional CSS files.