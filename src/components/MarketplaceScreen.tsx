import React, { useState } from 'react';
import { 
  Star, 
  Clock, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  Percent, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  Flame,
  Search,
  Copy
} from 'lucide-react';
import { Product, CartItem } from '../types';

interface MarketplaceScreenProps {
  products: Product[];
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onGoToCheckout: () => void;
  onOpenDrawer: () => void;
}

const RESTAURANT_CATEGORIES = [
  'Todas',
  'Hamburguesas',
  'Pizzas',
  'Sushi',
  'Saludable & Bowls',
  'Tacos & Burritos',
  'Pollo & Alitas',
  'Postres & Helados'
];

const SUPERMARKET_CATEGORIES = [
  'Todas',
  'Abarrotes & Fideos',
  'Lácteos & Quesos',
  'Higiene & Confort',
  'Bebidas & Snacks'
];

export const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({
  products,
  cartItems,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onGoToCheckout,
  onOpenDrawer
}) => {
  const [activeMode, setActiveMode] = useState<'restaurantes' | 'supermercado'>('restaurantes');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const categories = activeMode === 'restaurantes' ? RESTAURANT_CATEGORIES : SUPERMARKET_CATEGORIES;

  // Filter products by current mode and selected category
  const filteredProducts = products.filter(p => {
    const matchesMode = p.mode === activeMode;
    const matchesCat = selectedCategory === 'Todas' || p.category === selectedCategory;
    return matchesMode && matchesCat;
  });

  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const freeDeliveryThreshold = 20000;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const shippingFee = cartSubtotal >= freeDeliveryThreshold ? 0 : (cartSubtotal > 0 ? 1990 : 0);
  const serviceFee = cartSubtotal > 0 ? Math.round(cartSubtotal * 0.03) : 0;
  const totalPayable = cartSubtotal + shippingFee + serviceFee;

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Top Segmented Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center w-full sm:w-auto shadow-inner border border-gray-200/70">
          <button
            onClick={() => {
              setActiveMode('restaurantes');
              setSelectedCategory('Todas');
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeMode === 'restaurantes'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/10'
                : 'text-gray-600 hover:text-emerald-800'
            }`}
          >
            <span className="text-base">🍔</span>
            <span>Restaurantes & Comida</span>
          </button>
          <button
            onClick={() => {
              setActiveMode('supermercado');
              setSelectedCategory('Todas');
            }}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeMode === 'supermercado'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-900/10'
                : 'text-gray-600 hover:text-emerald-800'
            }`}
          >
            <span className="text-base">🛒</span>
            <span>Supermercado & Despensa</span>
            <span className="bg-emerald-500 text-emerald-950 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ml-1">
              20 min
            </span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50/80 px-3.5 py-2 rounded-xl border border-emerald-200/60">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>+140 locales en Providencia y Santiago Centro listos para despachar</span>
        </div>
      </div>

      {/* Promotional Bento Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Banner 1: Free delivery supermarket */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 p-6 text-white shadow-sm flex flex-col justify-between min-h-[160px]">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1 bg-emerald-500 text-emerald-950 text-xs font-bold px-2.5 py-0.5 rounded-full mb-2">
              <Sparkles className="w-3 h-3" />
              CUPÓN EXCLUSIVO
            </span>
            <h3 className="text-xl font-extrabold tracking-tight">
              Envío GRATIS en Supermercado 360
            </h3>
            <p className="text-emerald-100 text-xs mt-1 max-w-sm">
              Despacho express en 20 minutos con Shopper dedicado en compras sobre $20.000.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-3 mt-4">
            <div className="bg-emerald-950/40 border border-emerald-400/30 px-3 py-1.5 rounded-lg font-mono font-bold text-xs tracking-wider text-emerald-200">
              SUPER360
            </div>
            <button
              onClick={() => handleCopyCoupon('SUPER360')}
              className="px-3 py-1.5 bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {copiedCoupon === 'SUPER360' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Copiar Cupón</span>
                </>
              )}
            </button>
          </div>
          <div className="absolute right-3 -bottom-4 text-7xl select-none opacity-20 pointer-events-none">
            🛒
          </div>
        </div>

        {/* Banner 2: 2x1 Gourmet Burgers */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-700 via-orange-600 to-amber-900 p-6 text-white shadow-sm flex flex-col justify-between min-h-[160px]">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-950 text-xs font-bold px-2.5 py-0.5 rounded-full mb-2">
              <Flame className="w-3 h-3" />
              PROMO DEL DÍA
            </span>
            <h3 className="text-xl font-extrabold tracking-tight">
              2x1 Gourmet Doble Sabor en Burgers
            </h3>
            <p className="text-amber-100 text-xs mt-1 max-w-sm">
              Pide una Burger 360 Doble Cheddar y te regalamos la segunda para compartir.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-3 mt-4">
            <button
              onClick={() => {
                setActiveMode('restaurantes');
                setSelectedCategory('Hamburguesas');
              }}
              className="px-4 py-1.5 bg-white text-amber-950 hover:bg-amber-50 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Ver Hamburguesas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="absolute right-3 -bottom-4 text-7xl select-none opacity-20 pointer-events-none">
            🍔
          </div>
        </div>
      </div>

      {/* Category Chips Carousel */}
      <div className="mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-sm shadow-emerald-900/20 ring-2 ring-emerald-800/20'
                  : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200/80 hover:border-emerald-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Products (2/3) + Sticky Cart (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Products Column */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              {activeMode === 'restaurantes' ? 'Los Favoritos de la Ciudad' : 'Supermercado Rápido en 20 min'}
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              Mostrando {filteredProducts.length} productos
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredProducts.map((product) => {
              const inCart = cartItems.find(item => item.product.id === product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Image container */}
                  <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                      <div className="absolute top-3 left-3 bg-emerald-700/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                        {product.badge}
                      </div>
                    )}
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-gray-800 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-gray-400 font-normal">({product.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-600" />
                          {product.prepTime}
                        </span>
                        <span>•</span>
                        <span>{product.portionOrCalories || product.packInfo || product.storeName}</span>
                      </div>

                      <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-emerald-800 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Price & Action */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-extrabold text-gray-900 font-mono">
                          ${product.price.toLocaleString('es-CL')}
                        </span>
                        {product.refUsd && (
                          <span className="block text-[10px] text-gray-400">
                            ref {product.refUsd}
                          </span>
                        )}
                      </div>

                      {inCart ? (
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-1">
                          <button
                            onClick={() => onUpdateQuantity(product.id, inCart.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-white text-emerald-800 font-bold flex items-center justify-center hover:bg-emerald-100 transition-colors cursor-pointer shadow-2xs"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-emerald-900 px-1 font-mono">
                            {inCart.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(product.id, inCart.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-bold flex items-center justify-center hover:bg-emerald-800 transition-colors cursor-pointer shadow-2xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onAddToCart(product)}
                          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Añadir</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Shopper helper card for Supermarket */}
          {activeMode === 'supermercado' && (
            <div className="mt-8 bg-emerald-50 border border-emerald-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-xl shrink-0">
                  🛒
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm">
                    ¿No encuentras el producto exacto que buscas?
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Un shopper de Pedidos 360 puede comprarlo especialmente para ti en el supermercado.
                  </p>
                </div>
              </div>
              <button
                onClick={() => alert('¡Función de Shopper Personalizado activada! Puedes indicar notas en tu carrito.')}
                className="px-4 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-900 transition-colors cursor-pointer shrink-0"
              >
                Pedir a un Shopper +
              </button>
            </div>
          )}
        </div>

        {/* Sticky Cart Column (Image 5 & Image 6 right panel) */}
        <div className="lg:col-span-4 sticky top-24">
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-700" />
                <h3 className="font-extrabold text-gray-900 text-base">
                  Tu Canasta 360
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              </div>
              <button
                onClick={onOpenDrawer}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline cursor-pointer"
              >
                Abrir Drawer
              </button>
            </div>

            {/* Free delivery goal progress bar */}
            <div className="my-4 bg-emerald-50/70 border border-emerald-100 rounded-xl p-3">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-950 mb-1.5">
                <span>
                  {remainingForFreeDelivery === 0 ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      ¡Envío GRATIS activado hoy!
                    </span>
                  ) : (
                    <>Faltan <span className="font-bold font-mono">${remainingForFreeDelivery.toLocaleString('es-CL')}</span> para delivery gratis</>
                  )}
                </span>
                <span className="font-mono font-bold text-emerald-700">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-emerald-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Item rows */}
            {cartItems.length === 0 ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-2 text-xl">
                  🛒
                </div>
                <p className="text-sm font-semibold text-gray-700">Tu canasta está vacía</p>
                <p className="text-xs text-gray-400 mt-1">
                  Agrega platos gourmet o abarrotes para comenzar tu pedido.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="py-3 flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                        ${(item.product.price * item.quantity).toLocaleString('es-CL')}
                      </div>
                    </div>
                    {/* Stepper */}
                    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg p-1 shrink-0">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-5 h-5 rounded-md bg-white text-gray-700 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold font-mono px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-5 h-5 rounded-md bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 transition-colors cursor-pointer text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemoveFromCart(item.product.id)}
                      className="text-gray-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Financial Breakdown */}
            {cartItems.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium">${cartSubtotal.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Costo de envío</span>
                  <span className="font-mono font-medium">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold">GRATIS</span>
                    ) : (
                      `$${shippingFee.toLocaleString('es-CL')}`
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Tarifa de servicio (3%)</span>
                  <span className="font-mono font-medium">${serviceFee.toLocaleString('es-CL')}</span>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-sm font-extrabold text-gray-900">
                  <span>Total a Pagar</span>
                  <span className="text-base text-emerald-800 font-mono">
                    ${totalPayable.toLocaleString('es-CL')}
                  </span>
                </div>

                {/* Primary CTA */}
                <button
                  onClick={onGoToCheckout}
                  className="w-full mt-3 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-emerald-900/15 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <span>Ver Carrito y Pagar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center pt-2">
                  <span className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Pago encriptado con WebPay Plus & AWS JWT
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
