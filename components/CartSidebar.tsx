
import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemoveItem,
  onUpdateQuantity,
  onCheckout
}) => {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`absolute top-0 right-0 max-w-md w-full h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-100 flex justify-between items-center bg-brand-50">
          <h2 className="font-serif text-xl text-brand-900 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Your Cart
          </h2>
          <button onClick={onClose} className="text-brand-500 hover:text-brand-900 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-brand-400">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
              <p>Your cart is empty.</p>
              <button onClick={onClose} className="mt-4 text-brand-700 font-medium hover:underline">Start Shopping</button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="flex gap-4">
                <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-brand-900 line-clamp-1">{item.name}</h3>
                    <button onClick={() => onRemoveItem(item.id)} className="text-brand-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-brand-500 mb-2">Rs. {item.price.toLocaleString()}</p>
                  <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-6 h-6 flex items-center justify-center border border-brand-200 rounded text-brand-600 hover:bg-brand-50"
                        disabled={item.quantity <= 1}
                    >-</button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-6 h-6 flex items-center justify-center border border-brand-200 rounded text-brand-600 hover:bg-brand-50"
                    >+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-brand-100 p-6 bg-brand-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-brand-600">Subtotal</span>
              <span className="font-serif text-xl font-bold text-brand-900">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <button 
                onClick={onCheckout}
                className="w-full bg-brand-900 text-white py-3 rounded hover:bg-brand-800 transition-colors font-medium"
            >
              Checkout
            </button>
            <p className="text-xs text-center text-brand-400 mt-4">Shipping & taxes calculated at checkout</p>
          </div>
        )}
      </div>
    </div>
  );
};
