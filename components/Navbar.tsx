import React from 'react';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-brand-50/90 backdrop-blur-md border-b border-brand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.location.hash = ''}>
            <span className="font-serif text-2xl font-bold tracking-tight text-brand-900">
              Ishaal Fatima
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#" className="text-brand-800 hover:text-brand-600 font-medium transition-colors">Home</a>
            <a href="#shop" className="text-brand-800 hover:text-brand-600 font-medium transition-colors">Collection</a>
            <a href="#about" className="text-brand-800 hover:text-brand-600 font-medium transition-colors">Our Story</a>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <button className="text-brand-800 hover:text-brand-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button 
              className="relative text-brand-800 hover:text-brand-600 transition-colors"
              onClick={onCartClick}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-700 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              className="md:hidden text-brand-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-50 border-t border-brand-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#" className="block px-3 py-2 text-brand-900 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
            <a href="#shop" className="block px-3 py-2 text-brand-900 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Collection</a>
            <a href="#about" className="block px-3 py-2 text-brand-900 font-medium" onClick={() => setIsMobileMenuOpen(false)}>Our Story</a>
          </div>
        </div>
      )}
    </nav>
  );
};
