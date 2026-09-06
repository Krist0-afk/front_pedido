import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onGoToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveFromCart,
  onGoToCheckout
}) => {
  if (!isOpen) return null;

  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const freeDeliveryThreshold = 20000;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));
  const shippingFee = cartSubtotal >= freeDeliveryThreshold ? 0 : (cartSubtotal > 0 ? 1990 : 0);
  const serviceFee = cartSubtotal > 0 ? Math.round(cartSubtotal * 0.03) : 0;
  const total = cartSubtotal + shippingFee + serviceFee;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-emerald-950/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer content */}
      <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-emerald-100">
        {/* Drawer Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-800" />
            <h3 className="font-extrabold text-gray-900 text-base">
              Tu Canasta 360
            </h3>
            <span className="bg-emerald-700 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {cartItems.reduce((a, b) => a + b.quantity, 0)}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Delivery meter */}
        <div className="px-5 py-3 bg-emerald-50/60 border-b border-emerald-100 text-xs">
          <div className="flex justify-between font-semibold text-emerald-950 mb-1">
            <span>Progreso Envío Gratis</span>
            <span className="font-mono font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-100">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-4xl block mb-2">🛒</span>
              <p className="font-bold text-gray-800 text-sm">Tu canasta está vacía</p>
              <p className="text-xs text-gray-400 mt-1">Explora nuestro catálogo gourmet y súper.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.product.id} className="py-3.5 flex items-center gap-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 truncate">
                    {item.product.name}
                  </h4>
                  <span className="text-[11px] text-emerald-700 font-mono font-bold block mt-0.5">
                    ${(item.product.price * item.quantity).toLocaleString('es-CL')}
                  </span>
                </div>

                {/* Stepper */}
                <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg p-1 shrink-0">
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                    className="w-6 h-6 rounded bg-white text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer text-xs"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold font-mono px-1">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                    className="w-6 h-6 rounded bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 transition-colors cursor-pointer text-xs"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={() => onRemoveFromCart(item.product.id)}
                  className="text-gray-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Breakdown & CTA */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-2.5 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-mono">${cartSubtotal.toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Envío</span>
              <span className="font-mono">{shippingFee === 0 ? 'GRATIS' : `$${shippingFee}`}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tarifa servicio (3%)</span>
              <span className="font-mono">${serviceFee}</span>
            </div>

            <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm font-extrabold text-gray-900">
              <span>Total Estimado</span>
              <span className="text-base font-mono text-emerald-800">
                ${total.toLocaleString('es-CL')}
              </span>
            </div>

            <button
              onClick={() => {
                onClose();
                onGoToCheckout();
              }}
              className="w-full mt-2 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-emerald-900/15 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Ir a Pagar Orden</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
