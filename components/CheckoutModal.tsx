
import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, CreditCard, Truck, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  onClose: () => void;
  cartItems: CartItem[];
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose, cartItems, onClearCart }) => {
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [orderedItems, setOrderedItems] = useState<CartItem[]>([]); // Store items for success view
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 150000 ? 0 : 2500;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setOrderedItems([...cartItems]); // Save current items to display in success
    
    // Simulate API processing
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
      onClearCart();
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white rounded-2xl w-full max-w-2xl p-8 text-center shadow-2xl relative my-auto">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
          
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-brand-900 mb-2">Order Confirmed!</h2>
          <p className="text-brand-600 mb-8">
            Thank you for your purchase, {formData.firstName}.<br/>
            We've sent a confirmation email to {formData.email}.
          </p>

          <div className="bg-brand-50 rounded-lg p-6 mb-8 text-left border border-brand-100">
             <div className="flex justify-between items-center mb-4 border-b border-brand-200 pb-4">
                <div>
                    <p className="text-xs text-brand-500 uppercase tracking-wider">Order Number</p>
                    <p className="font-mono font-bold text-brand-900">#IF-{Math.floor(Math.random() * 100000)}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-brand-500 uppercase tracking-wider">Total Paid</p>
                    <p className="font-serif font-bold text-brand-900">Rs. {total.toLocaleString()}</p>
                </div>
             </div>
             
             <h4 className="font-medium text-brand-900 mb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Items Ordered
             </h4>
             <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {orderedItems.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex justify-between text-sm">
                        <span className="text-brand-700 flex-1 truncate mr-4">{item.quantity}x {item.name}</span>
                        <span className="text-brand-900 font-medium">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                ))}
             </div>
             <div className="mt-4 pt-4 border-t border-brand-200 text-sm text-brand-500 flex justify-between">
                <span>Shipping Address:</span>
                <span className="text-right text-brand-800">{formData.address}, {formData.city}</span>
             </div>
          </div>

          <button
            onClick={onClose}
            className="bg-brand-900 text-white px-8 py-3 rounded-full hover:bg-brand-800 transition-colors font-medium w-full shadow-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col md:flex-row overflow-hidden my-auto min-h-[600px]">
        
        {/* Left: Form */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex justify-between items-center md:hidden mb-6">
             <h2 className="font-serif text-2xl font-bold text-brand-900">Checkout</h2>
             <button onClick={onClose}><X className="w-6 h-6 text-brand-500" /></button>
          </div>
          
          <h2 className="hidden md:block font-serif text-2xl font-bold text-brand-900 mb-6">Shipping Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">First Name</label>
                <input
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  type="text"
                  className="w-full px-4 py-2 border border-brand-200 rounded focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">Last Name</label>
                <input
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  type="text"
                  className="w-full px-4 py-2 border border-brand-200 rounded focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">Email Address</label>
              <input
                required
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email"
                className="w-full px-4 py-2 border border-brand-200 rounded focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">Street Address</label>
              <input
                required
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                type="text"
                className="w-full px-4 py-2 border border-brand-200 rounded focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">City</label>
                <input
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  type="text"
                  className="w-full px-4 py-2 border border-brand-200 rounded focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-1">Postal Code</label>
                <input
                  required
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  type="text"
                  className="w-full px-4 py-2 border border-brand-200 rounded focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-700 mb-1">Phone Number</label>
              <input
                required
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                type="tel"
                className="w-full px-4 py-2 border border-brand-200 rounded focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="pt-6 border-t border-brand-100">
               <h3 className="font-serif text-lg font-bold text-brand-900 mb-4">Payment Method</h3>
               <div className="grid grid-cols-2 gap-4">
                 <div className="border border-brand-500 bg-brand-50 p-4 rounded flex items-center gap-3 cursor-pointer">
                    <Truck className="w-5 h-5 text-brand-900" />
                    <span className="text-sm font-medium text-brand-900">Cash on Delivery</span>
                 </div>
                 <div className="border border-brand-200 p-4 rounded flex items-center gap-3 opacity-50 cursor-not-allowed" title="Coming soon">
                    <CreditCard className="w-5 h-5 text-brand-400" />
                    <span className="text-sm font-medium text-brand-400">Credit Card</span>
                 </div>
               </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-900 text-white py-4 rounded font-bold text-lg hover:bg-brand-800 transition-all shadow-lg mt-4 flex items-center justify-center"
            >
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>Place Order &bull; Rs. {total.toLocaleString()}</>
              )}
            </button>
          </form>
        </div>

        {/* Right: Summary */}
        <div className="bg-brand-50 w-full md:w-96 p-8 border-l border-brand-100 flex flex-col">
          <div className="hidden md:flex justify-between items-center mb-6">
            <h3 className="font-serif text-xl font-bold text-brand-900">Order Summary</h3>
            <button onClick={onClose}><X className="w-6 h-6 text-brand-400 hover:text-brand-900 transition-colors" /></button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-16 h-16 bg-white rounded overflow-hidden border border-brand-200 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-brand-900 line-clamp-1">{item.name}</h4>
                  <p className="text-xs text-brand-500">Qty: {item.quantity}</p>
                  <p className="text-sm font-medium text-brand-900 mt-1">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-6 border-t border-brand-200">
            <div className="flex justify-between text-sm text-brand-600">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-brand-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `Rs. ${shipping.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-brand-200">
              <span className="font-serif text-lg font-bold text-brand-900">Total</span>
              <span className="font-serif text-xl font-bold text-brand-900">Rs. {total.toLocaleString()}</span>
            </div>
          </div>
           
           <div className="mt-6 flex items-center gap-2 text-xs text-brand-400 justify-center">
              <ShieldCheck className="w-4 h-4" />
              Secure Checkout
           </div>
        </div>
      </div>
    </div>
  );
};
