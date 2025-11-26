
import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2, Camera, Move, Check, Plus } from 'lucide-react';
import { analyzeRoomAndSuggestProducts } from '../services/geminiService';
import { Product } from '../types';
import { PRODUCTS } from '../constants';

interface RoomVisualizerProps {
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const RoomVisualizer: React.FC<RoomVisualizerProps> = ({ onClose, onAddToCart }) => {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'results' | 'visualize'>('upload');
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [reasoning, setReasoning] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Dragging state
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Percentage
  const [scale, setScale] = useState(1);
  const isDragging = useRef(false);
  const visualizerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRoomImage(reader.result as string);
        analyzeRoom(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeRoom = async (base64Image: string) => {
    setStep('analyzing');
    const result = await analyzeRoomAndSuggestProducts(base64Image);
    
    const recProducts = PRODUCTS.filter(p => result.recommendedIds.includes(p.id));
    setRecommendations(recProducts);
    setReasoning(result.reasoning);
    setStep('results');
  };

  const startVisualizing = (product: Product) => {
    setSelectedProduct(product);
    setStep('visualize');
    setPosition({ x: 50, y: 50 });
    setScale(1);
  };

  // Drag handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current || !visualizerRef.current) return;
    
    const rect = visualizerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    setPosition({ 
      x: Math.max(0, Math.min(100, x)), 
      y: Math.max(0, Math.min(100, y)) 
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-brand-100 flex justify-between items-center bg-brand-50">
          <h2 className="font-serif text-xl text-brand-900 flex items-center gap-2">
            <Camera className="w-5 h-5" />
            AI Room Designer
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-brand-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-brand-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {step === 'upload' && (
            <div className="h-full flex flex-col items-center justify-center space-y-6 py-12">
              <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center">
                <Camera className="w-10 h-10 text-brand-600" />
              </div>
              <div className="text-center max-w-md">
                <h3 className="text-xl font-bold text-brand-900 mb-2">Upload your room photo</h3>
                <p className="text-brand-500">Ishaal will analyze your space and suggest the perfect furniture to match your style.</p>
              </div>
              <label className="cursor-pointer bg-brand-900 text-white px-8 py-4 rounded-full font-medium hover:bg-brand-800 transition-transform hover:scale-105 active:scale-95 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Select Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          )}

          {step === 'analyzing' && (
            <div className="h-full flex flex-col items-center justify-center space-y-6 py-12">
                <div className="relative">
                    <img src={roomImage || ''} alt="Room" className="w-32 h-32 object-cover rounded-lg opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-brand-900 animate-spin" />
                    </div>
                </div>
              <h3 className="text-lg font-medium text-brand-900 animate-pulse">Analyzing your space...</h3>
            </div>
          )}

          {step === 'results' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              <div className="space-y-4">
                <img src={roomImage || ''} alt="Your Room" className="w-full rounded-lg shadow-md" />
                <div className="bg-brand-50 p-4 rounded-lg border border-brand-100">
                    <h4 className="font-serif font-bold text-brand-900 mb-2">Ishaal's Analysis</h4>
                    <p className="text-sm text-brand-700 leading-relaxed">{reasoning}</p>
                </div>
              </div>
              
              <div className="space-y-4 overflow-y-auto">
                <h3 className="font-serif text-lg font-bold text-brand-900">Recommended for you</h3>
                {recommendations.length === 0 ? (
                    <p>No specific matches found, but feel free to browse our full collection!</p>
                ) : (
                    recommendations.map(product => (
                        <div key={product.id} className="flex gap-4 p-3 border border-brand-100 rounded-lg hover:bg-brand-50 transition-colors">
                            <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded" />
                            <div className="flex-1">
                                <h4 className="font-medium text-brand-900">{product.name}</h4>
                                <p className="text-sm text-brand-500 mb-2">Rs. {product.price.toLocaleString()}</p>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => startVisualizing(product)}
                                        className="text-xs bg-brand-200 text-brand-900 px-3 py-1.5 rounded hover:bg-brand-300 transition-colors flex items-center gap-1"
                                    >
                                        <Move className="w-3 h-3" /> Try in Room
                                    </button>
                                    <button 
                                        onClick={() => onAddToCart(product)}
                                        className="text-xs bg-brand-900 text-white px-3 py-1.5 rounded hover:bg-brand-800 transition-colors flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> Add Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <button onClick={() => setStep('upload')} className="text-sm text-brand-500 underline mt-4">Upload different photo</button>
              </div>
            </div>
          )}

          {step === 'visualize' && selectedProduct && (
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                     <button onClick={() => setStep('results')} className="text-sm text-brand-600 hover:text-brand-900">← Back to Results</button>
                     <div className="flex items-center gap-4">
                        <span className="text-xs text-brand-400">Drag to move • Slider to scale</span>
                        <input 
                            type="range" 
                            min="0.5" 
                            max="2" 
                            step="0.1" 
                            value={scale} 
                            onChange={(e) => setScale(parseFloat(e.target.value))}
                            className="w-24 accent-brand-900"
                        />
                     </div>
                </div>
                
                <div 
                    ref={visualizerRef}
                    className="relative flex-1 bg-gray-100 rounded-lg overflow-hidden cursor-crosshair touch-none select-none"
                    onMouseMove={handleDrag}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchMove={handleDrag}
                    onTouchEnd={handleDragEnd}
                >
                    <img 
                        src={roomImage || ''} 
                        alt="Room Background" 
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none" 
                    />
                    
                    {/* Furniture Overlay */}
                    <div 
                        onMouseDown={handleDragStart}
                        onTouchStart={handleDragStart}
                        style={{
                            position: 'absolute',
                            left: `${position.x}%`,
                            top: `${position.y}%`,
                            transform: `translate(-50%, -50%) scale(${scale})`,
                            cursor: 'grab',
                        }}
                        className="active:cursor-grabbing"
                    >
                         <img 
                            src={selectedProduct.image} 
                            alt={selectedProduct.name} 
                            className="w-48 h-auto shadow-2xl rounded-sm"
                            draggable={false}
                         />
                         {/* Selection Border */}
                         <div className="absolute inset-0 border-2 border-brand-500 border-dashed rounded-sm pointer-events-none opacity-50"></div>
                    </div>
                </div>

                <div className="mt-4 flex justify-between items-center bg-brand-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                         <img src={selectedProduct.image} className="w-10 h-10 object-cover rounded" />
                         <div>
                             <h4 className="font-medium text-sm text-brand-900">{selectedProduct.name}</h4>
                             <p className="text-xs text-brand-500">Rs. {selectedProduct.price.toLocaleString()}</p>
                         </div>
                    </div>
                    <button 
                        onClick={() => {
                            onAddToCart(selectedProduct);
                            onClose();
                        }}
                        className="bg-brand-900 text-white px-6 py-2 rounded text-sm hover:bg-brand-800 transition-colors"
                    >
                        Buy This Look
                    </button>
                </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
