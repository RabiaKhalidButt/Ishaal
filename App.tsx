
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { ChatAssistant } from './components/ChatAssistant';
import { CartSidebar } from './components/CartSidebar';
import { RoomVisualizer } from './components/RoomVisualizer';
import { CheckoutModal } from './components/CheckoutModal';
import { Product, CartItem, Category } from './types';
import { PRODUCTS, CATEGORIES } from './constants';
import { ArrowRight, Star, Clock, Truck, Shield, Camera } from 'lucide-react';

const App: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredProducts(PRODUCTS);
    } else {
      setFilteredProducts(PRODUCTS.filter(p => p.category === activeCategory));
    }
  }, [activeCategory]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col font-sans text-brand-900 bg-brand-50">
      <Navbar cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2664&auto=format&fit=crop"
              alt="Luxury Living Room" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-white/90 text-sm mb-6 uppercase tracking-widest backdrop-blur-sm">
                New Collection 2025
            </span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Elevate Your Living Space
            </h1>
            <p className="text-xl text-white/90 mb-10 font-light max-w-2xl mx-auto">
              Discover furniture that blends timeless elegance with modern comfort. Curated by Ishaal Fatima.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-white text-brand-900 px-8 py-4 rounded font-medium hover:bg-brand-100 transition-colors inline-flex items-center gap-2 group w-full sm:w-auto justify-center">
                Shop The Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setIsVisualizerOpen(true)}
                className="bg-brand-900/80 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded font-medium hover:bg-brand-900 transition-colors inline-flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Camera className="w-4 h-4" />
                Visualize in Your Room
              </button>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="bg-white border-b border-brand-100">
           <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="flex items-center justify-center space-x-4">
                    <Truck className="w-8 h-8 text-brand-400" />
                    <div>
                        <h4 className="font-serif font-semibold">Free Shipping</h4>
                        <p className="text-sm text-brand-500">On all orders over Rs. 150,000</p>
                    </div>
               </div>
               <div className="flex items-center justify-center space-x-4 border-l-0 md:border-l border-brand-100">
                    <Shield className="w-8 h-8 text-brand-400" />
                    <div>
                        <h4 className="font-serif font-semibold">5 Year Warranty</h4>
                        <p className="text-sm text-brand-500">Quality checked craftsmanship</p>
                    </div>
               </div>
               <div className="flex items-center justify-center space-x-4 border-l-0 md:border-l border-brand-100">
                    <Clock className="w-8 h-8 text-brand-400" />
                    <div>
                        <h4 className="font-serif font-semibold">30-Day Returns</h4>
                        <p className="text-sm text-brand-500">Hassle-free exchange policy</p>
                    </div>
               </div>
           </div>
        </section>

        {/* Collection Grid */}
        <section id="shop" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-4 text-brand-900">Curated Classics</h2>
            <div className="w-20 h-1 bg-brand-400 mx-auto mb-8"></div>
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-4">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as Category)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat 
                      ? 'bg-brand-900 text-white shadow-lg' 
                      : 'bg-white text-brand-600 hover:bg-brand-100 border border-brand-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-20 text-brand-400">
                <p>No products found in this category.</p>
            </div>
          )}
        </section>

        {/* Promo Section */}
        <section className="bg-brand-900 py-24 relative overflow-hidden">
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-800 rounded-full blur-3xl opacity-50"></div>
             <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-brand-700 rounded-full blur-3xl opacity-50"></div>
             
             <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                 <div className="flex-1 text-white space-y-6">
                     <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight">Expert Design Advice,<br/>Instantly.</h2>
                     <p className="text-brand-200 text-lg max-w-xl">
                        Unsure if that sofa fits your vibe? Our AI Design Assistant, powered by Gemini, is here to help you coordinate colors, styles, and layouts.
                     </p>
                     <button 
                        onClick={() => {
                            window.alert("Click the sparkle icon in the bottom right to start chatting!");
                        }}
                        className="bg-brand-50 text-brand-900 px-8 py-3 rounded font-medium hover:bg-white transition-colors"
                     >
                        Chat with Ishaal
                     </button>
                 </div>
                 <div className="flex-1 w-full max-w-md">
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-2xl">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-900 font-serif font-bold">I</div>
                            <div className="bg-white/90 text-brand-900 p-3 rounded-lg rounded-tl-none text-sm shadow-lg">
                                Based on your cream walls and oak floors, I'd suggest the Chesterfield Sofa in Emerald. It creates a stunning focal point!
                            </div>
                        </div>
                         <div className="flex items-start gap-4 justify-end">
                            <div className="bg-brand-600 text-white p-3 rounded-lg rounded-tr-none text-sm shadow-lg">
                                That sounds perfect. What about a coffee table?
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-sans font-bold">You</div>
                        </div>
                    </div>
                 </div>
             </div>
        </section>

      </main>

      <Footer />
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
        onCheckout={handleCheckout}
      />
      <ChatAssistant />
      {isVisualizerOpen && (
        <RoomVisualizer 
            onClose={() => setIsVisualizerOpen(false)} 
            onAddToCart={handleAddToCart}
        />
      )}
      {isCheckoutOpen && (
        <CheckoutModal
            onClose={() => setIsCheckoutOpen(false)}
            cartItems={cartItems}
            onClearCart={handleClearCart}
        />
      )}
    </div>
  );
};

export default App;
