import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  MapPin, 
  Clock, 
  CreditCard, 
  Wallet, 
  Banknote, 
  Sparkles, 
  ShieldCheck, 
  ChevronRight, 
  Check, 
  Tag, 
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { Product, CartItem, PaymentMethodType, DeliveryAddress } from '../types';

interface CartCheckoutScreenProps {
  cartItems: CartItem[];
  upsellProducts: Product[];
  addresses: DeliveryAddress[];
  selectedAddressId: string;
  onSelectAddress: (id: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onBackToCatalog: () => void;
  onProceedToDelivery: () => void;
  onOpenDrawer: () => void;
}

export const CartCheckoutScreen: React.FC<CartCheckoutScreenProps> = ({
  cartItems,
  upsellProducts,
  addresses,
  selectedAddressId,
  onSelectAddress,
  onUpdateQuantity,
  onRemoveFromCart,
  onAddToCart,
  onBackToCatalog,
  onProceedToDelivery,
  onOpenDrawer
}) => {
  const [couponCode, setCouponCode] = useState<string>('BIENVENIDO360');
  const [couponApplied, setCouponApplied] = useState<boolean>(true);
  const [discountAmount, setDiscountAmount] = useState<number>(3000);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType>('webpay');
  const [cashBill, setCashBill] = useState<string>('20000');
  const [tip, setTip] = useState<number>(1000);
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({
    'prod-1': 'Sin cebolla cruda, por favor'
  });

  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const freeDeliveryThreshold = 20000;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));
  const shippingFee = cartSubtotal >= freeDeliveryThreshold ? 0 : 1990;
  const serviceFee = Math.round(cartSubtotal * 0.03);
  const appliedDiscount = couponApplied ? Math.min(cartSubtotal, discountAmount) : 0;
  const total = Math.max(0, cartSubtotal + shippingFee + serviceFee + tip - appliedDiscount);

  const activeAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'BIENVENIDO360') {
      setCouponApplied(true);
      setDiscountAmount(3000);
    } else if (couponCode.trim().toUpperCase() === 'SUPER360') {
      setCouponApplied(true);
      setDiscountAmount(1990);
    } else {
      alert('Código no válido. Prueba con BIENVENIDO360 o SUPER360');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
        <button 
          onClick={onBackToCatalog} 
          className="hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Catálogo</span>
        </button>
        <span>/</span>
        <span className="text-gray-900 font-semibold">Mi Carrito ({cartItems.length} productos)</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left main area: Cart items, Upsells, Address, Payment */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Tu Carrito de Compras
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                  {cartItems.length} productos
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Revisa los productos, añade notas de preparación o complementos antes de pagar.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60 text-emerald-900 text-xs font-semibold">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>Entrega Express (25-35 min)</span>
            </div>
          </div>

          {/* Items List */}
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs divide-y divide-gray-100 overflow-hidden">
            {cartItems.map((item) => (
              <div key={item.product.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-100 shadow-2xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
                        {item.product.storeName || 'Dark Store 360'}
                      </span>
                      {item.product.badge && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                          {item.product.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mt-0.5">
                      {item.product.name}
                    </h3>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                        Sin cebolla
                      </span>
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                        Envase biodegradable
                      </span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-medium">
                        Cadena de frío asegurada
                      </span>
                    </div>

                    {/* Note input */}
                    <div className="mt-2.5">
                      <input
                        type="text"
                        placeholder="Nota para el local (ej: salsa aparte, aderezo extra...)"
                        value={itemNotes[item.product.id] || ''}
                        onChange={(e) => setItemNotes(prev => ({ ...prev, [item.product.id]: e.target.value }))}
                        className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-gray-700 w-full sm:w-72 focus:bg-white focus:border-emerald-600 outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Right controls: Stepper, Price, Delete */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1.5">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-white text-gray-700 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer shadow-2xs font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold font-mono px-2 text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center hover:bg-emerald-800 transition-colors cursor-pointer shadow-2xs font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-extrabold text-gray-900 font-mono">
                      ${(item.product.price * item.quantity).toLocaleString('es-CL')}
                    </div>
                    <div className="text-[11px] text-gray-400 font-mono">
                      ${item.product.price.toLocaleString('es-CL')} c/u
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveFromCart(item.product.id)}
                    className="text-gray-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer"
                    title="Eliminar producto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Upsells: ¿Quieres agregar algo más de última hora? (Image 7) */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  ¿Quieres agregar algo más de última hora?
                </h3>
                <p className="text-xs text-gray-500">
                  Complementa tu pedido con bebidas frías o postres sin costo de envío adicional.
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                Sugerencias Express
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {upsellProducts.map((up) => {
                const inCart = cartItems.some(i => i.product.id === up.id);

                return (
                  <div
                    key={up.id}
                    className="border border-gray-200 rounded-xl p-3 flex flex-col justify-between hover:border-emerald-300 transition-all bg-gray-50/50"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={up.image}
                        alt={up.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-lg object-cover bg-gray-100 shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{up.name}</h4>
                        <span className="text-xs font-mono font-bold text-emerald-800 block mt-1">
                          ${up.price.toLocaleString('es-CL')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onAddToCart(up)}
                      disabled={inCart}
                      className={`mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                        inCart
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs'
                      }`}
                    >
                      {inCart ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Agregado</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3" />
                          <span>Agregar (+${up.price.toLocaleString('es-CL')})</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Address Card with Mini-Map */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-gray-900">Dirección de Entrega</h3>
              </div>
              <button
                onClick={onProceedToDelivery}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                Cambiar o Editar Datos →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Mini visual map */}
              <div className="relative h-28 bg-emerald-950/5 rounded-xl overflow-hidden border border-emerald-200 flex items-center justify-center p-2">
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:12px_12px]" />
                {/* Visual pin with radar ring */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative flex items-center justify-center">
                    <span className="w-8 h-8 rounded-full bg-emerald-500/30 animate-ping absolute" />
                    <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-md">
                      <MapPin className="w-4 h-4 fill-white" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-white text-emerald-950 px-2 py-0.5 rounded shadow-xs mt-1">
                    Destino 360°
                  </span>
                </div>
              </div>

              {/* Address details */}
              <div className="md:col-span-2 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                    {activeAddress.label}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {activeAddress.street} {activeAddress.number}, {activeAddress.depto}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {activeAddress.commune}, {activeAddress.city} • {activeAddress.reference}
                </p>
                <p className="text-xs text-emerald-800 font-medium pt-1">
                  Nota al repartidor: "{activeAddress.courierInstructions || 'Dejar en conserjería central'}"
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method Selector Cards */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Método de Pago
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Selecciona tu medio preferido para liquidar esta orden.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: WebPay Plus */}
              <div
                onClick={() => setSelectedPayment('webpay')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPayment === 'webpay'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPayment === 'webpay'}
                    onChange={() => setSelectedPayment('webpay')}
                    className="text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">WebPay Plus</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Débito, Crédito y Redcompra
                  </p>
                </div>
              </div>

              {/* Option 2: Mach / Mercado Pago */}
              <div
                onClick={() => setSelectedPayment('wallets')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPayment === 'wallets'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPayment === 'wallets'}
                    onChange={() => setSelectedPayment('wallets')}
                    className="text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Mach / Mercado Pago</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Billeteras digitales sin recargo
                  </p>
                </div>
              </div>

              {/* Option 3: Efectivo contra entrega */}
              <div
                onClick={() => setSelectedPayment('cash')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPayment === 'cash'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPayment === 'cash'}
                    onChange={() => setSelectedPayment('cash')}
                    className="text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Efectivo al Entregar</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Pagas al repartidor en tu puerta
                  </p>
                </div>
              </div>
            </div>

            {/* Cash note if selected */}
            {selectedPayment === 'cash' && (
              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-4">
                <span>¿Con qué billete vas a pagar para que el repartidor lleve vuelto?</span>
                <div className="flex items-center gap-2">
                  <span>$</span>
                  <input
                    type="number"
                    value={cashBill}
                    onChange={(e) => setCashBill(e.target.value)}
                    className="w-24 bg-white border border-amber-300 rounded-lg px-2 py-1 font-mono font-bold"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right sticky checkout summary */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
            <h3 className="font-extrabold text-gray-900 text-lg mb-3">
              Resumen de la Orden
            </h3>

            {/* Free delivery goal */}
            <div className="mb-4 bg-emerald-50 border border-emerald-200/80 rounded-xl p-3">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-950 mb-1">
                <span>Delivery Express 360</span>
                <span className="font-mono text-emerald-800 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] text-emerald-800 block mt-1">
                {shippingFee === 0 ? '¡Genial! Calificas para envío gratis.' : 'Agrega más productos para envío gratis.'}
              </span>
            </div>

            {/* Coupon input */}
            <div className="mb-4">
              <label className="text-xs font-bold text-gray-700 block mb-1.5">
                Cupón Promocional
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Ej: BIENVENIDO360"
                  className="flex-1 bg-gray-50 uppercase text-xs font-mono font-bold px-3 py-2 rounded-xl border border-gray-200 focus:bg-white focus:border-emerald-600 outline-hidden"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-3.5 py-2 bg-emerald-800 text-white text-xs font-bold rounded-xl hover:bg-emerald-900 transition-colors cursor-pointer shrink-0"
                >
                  Aplicar
                </button>
              </div>
              {couponApplied && (
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium mt-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Cupón aplicado con éxito: -$3.000 de bienvenida</span>
                </div>
              )}
            </div>

            {/* Courier tip selector */}
            <div className="mb-4 pt-3 border-t border-gray-100">
              <label className="text-xs font-bold text-gray-700 block mb-1.5">
                Propina al Repartidor (100% directa)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 500, 1000, 1500].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTip(t)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      tip === t
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs font-bold'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {t === 0 ? 'Sin' : `$${t}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Financial breakdown */}
            <div className="space-y-2 pt-3 border-t border-gray-100 text-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span>Subtotal ({cartItems.length} ítems)</span>
                <span className="font-mono font-semibold">${cartSubtotal.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Costo de envío estándar</span>
                <span className="font-mono font-semibold">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold">GRATIS</span>
                  ) : (
                    `$${shippingFee.toLocaleString('es-CL')}`
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Tarifa de servicio (3%)</span>
                <span className="font-mono font-semibold">${serviceFee.toLocaleString('es-CL')}</span>
              </div>
              {couponApplied && (
                <div className="flex items-center justify-between text-emerald-700 font-semibold">
                  <span>Descuento BIENVENIDO360</span>
                  <span className="font-mono">-${appliedDiscount.toLocaleString('es-CL')}</span>
                </div>
              )}
              {tip > 0 && (
                <div className="flex items-center justify-between text-gray-600">
                  <span>Propina</span>
                  <span className="font-mono font-semibold">+${tip.toLocaleString('es-CL')}</span>
                </div>
              )}

              <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-base font-extrabold text-gray-900">
                <span>Total a Pagar</span>
                <span className="text-xl font-mono text-emerald-800">
                  ${total.toLocaleString('es-CL')}
                </span>
              </div>

              {/* Confirm & Pay Button */}
              <button
                onClick={onProceedToDelivery}
                className="w-full mt-4 py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-emerald-900/15 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <span>Confirmar y Continuar a Entrega</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Drawer test trigger button */}
              <button
                onClick={onOpenDrawer}
                className="w-full mt-2 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
                <span>Probar Drawer Lateral</span>
              </button>

              <div className="text-center pt-3">
                <span className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Transacción protegida por AWS Gateway JWT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
