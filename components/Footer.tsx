import React from 'react';
import { Facebook, Instagram, Twitter, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-900 text-brand-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-brand-50">Ishaal Fatima</h3>
            <p className="text-sm text-brand-300 leading-relaxed">
              Crafting timeless spaces with elegant furniture designed for modern living. Quality, comfort, and style in every piece.
            </p>
            <div className="flex items-start space-x-2 text-sm text-brand-300 pt-4 border-t border-brand-800 mt-4">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
                <p className="leading-relaxed">
                  2BS 32 Saeed Park<br/>
                  Shahdara, Lahore<br/>
                  Pakistan
                </p>
            </div>
          </div>
          
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-brand-50">Shop</h4>
            <ul className="space-y-3 text-sm text-brand-300">
              <li><a href="#shop" className="hover:text-white transition-colors">Living Room</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Bedroom</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">Dining</a></li>
              <li><a href="#shop" className="hover:text-white transition-colors">New Arrivals</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-brand-50">Support</h4>
            <ul className="space-y-3 text-sm text-brand-300">
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-brand-50">Stay Connected</h4>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
            <p className="text-sm text-brand-300">Subscribe for exclusive offers.</p>
            <div className="mt-4 flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-brand-800 text-white px-4 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-brand-500 rounded-l"
              />
              <button className="bg-brand-500 text-white px-4 py-2 text-sm font-medium hover:bg-brand-600 transition-colors rounded-r">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-brand-800 text-center text-sm text-brand-400">
          &copy; {new Date().getFullYear()} Ishaal Fatima Interiors. All rights reserved.
        </div>
      </div>
    </footer>
  );
};