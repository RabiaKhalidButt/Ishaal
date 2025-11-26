
import React, { useState } from 'react';
import { Plus, Star, ImageOff } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
        {imgError ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-brand-300">
            <ImageOff className="w-12 h-12 mb-2" />
            <span className="text-xs">Image not found</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <button
          onClick={() => onAddToCart(product)}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur text-brand-900 p-3 rounded-full shadow-lg hover:bg-brand-900 hover:text-white transition-all transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-10"
          aria-label="Add to cart"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-serif text-lg font-medium text-brand-900 line-clamp-1">{product.name}</h3>
            <p className="font-medium text-brand-700">Rs. {product.price.toLocaleString()}</p>
        </div>
        <p className="text-sm text-brand-400 mb-2">{product.category}</p>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{product.description}</p>
        <div className="flex items-center text-sm text-brand-500 mt-auto pt-4 border-t border-brand-100">
            <Star className="w-4 h-4 fill-current mr-1" />
            <span>{product.rating}</span>
        </div>
      </div>
    </div>
  );
};
