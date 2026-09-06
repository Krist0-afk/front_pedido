import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Bike, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  Navigation, 
  AlertCircle 
} from 'lucide-react';
import { CartItem, User, DeliveryAddress } from '../types';

interface DeliveryBillingScreenProps {
  cartItems: CartItem[];
  user: User;
  addresses: DeliveryAddress[];
  onBackToCart: () => void;
  onConfirmOrder: (orderPayload: any) => void;
}

const COURIER_PRESETS = [
  'Dejar en conserjería',
  'Tocar timbre',
  'Llamar al llegar',
  'Entregar sin contacto'
];

export const DeliveryBillingScreen: React.FC<DeliveryBillingScreenProps> = ({
  cartItems,
  user,
  addresses,
  onBackToCart,
  onConfirmOrder
}) => {
  const [rut, setRut] = useState<string>(user.rut || '19.482.301-4');
  const [phone, setPhone] = useState<string>(user.phone || '+56 9 8421 9932');
  const [street, setStreet] = useState<string>('Av. Providencia');
  const [number, setNumber] = useState<string>('1345');
  const [depto, setDepto] = useState<string>('Depto 402');
  const [floor, setFloor] = useState<string>('Piso 4');
  const [commune, setCommune] = useState<string>('Providencia');
  const [city, setCity] = useState<string>('Santiago');
  const [selectedInstruction, setSelectedInstruction] = useState<string>('Dejar en conserjería');
  const [customNotes, setCustomNotes] = useState<string>('Dejar con don Ramón en conserjería central.');
  const [timeLeft, setTimeLeft] = useState<number>(894); // ~14m 54s
  const [courierProgress, setCourierProgress] = useState<number>(45);

  // Reservation countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatMinutes = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shippingFee = cartSubtotal >= 20000 ? 0 : 1990;
  const serviceFee = Math.round(cartSubtotal * 0.03);
  const discount = 3000;
  const tip = 1000;
  const total = Math.max(0, cartSubtotal + shippingFee + serviceFee + tip - discount);

  const handleUseGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCommune('Providencia (GPS)');
          alert('📍 Ubicación GPS detectada con alta precisión (±5m)');
        },
        () => {
          alert('Simulando ubicación en Providencia, Santiago');
        }
      );
    }
  };

  const handleFinish = () => {
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        rut: rut,
        phone: phone
      },
      address: {
        street,
        number,
        depto,
        floor,
        commune,
        city,
        instructions: `${selectedInstruction}. ${customNotes}`
      },
      items: cartItems.map(i => ({
        productId: i.product.id,
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price
      })),
      financial: {
        subtotal: cartSubtotal,
        shippingFee,
        serviceFee,
        discount,
        tip,
        total
      }
    };
    onConfirmOrder(payload);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Back button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBackToCart}
          className="hover:text-emerald-700 flex items-center gap-1.5 text-xs text-gray-600 font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Carrito</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Reserva activa: {formatMinutes(timeLeft)} min</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: User data, Billing & Delivery form */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              ¡Hola, {user.name.split(' ')[0]}! Completa tu entrega
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Confirma los datos para la boleta electrónica y las instrucciones exactas para tu repartidor.
            </p>
          </div>

          {/* Section 1: Personal Data and Invoicing (Image 13) */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <FileText className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base font-bold text-gray-900">
                1. Datos Personales y Facturación
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={user.name}
                  readOnly
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700">RUT / DNI (Boleta Electrónica)</label>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                    Válido
                  </span>
                </div>
                <input
                  type="text"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  placeholder="19.482.301-4"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 focus:border-emerald-600 rounded-xl text-xs font-mono font-bold text-gray-800 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Teléfono de Contacto (Para Repartidor)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+56 9 8421 9932"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 focus:border-emerald-600 rounded-xl text-xs font-medium text-gray-800 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700">Correo Electrónico Registrado</label>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Verificado
                  </span>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Location and Delivery Address (Image 13 & 14) */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-700" />
                <h2 className="text-base font-bold text-gray-900">
                  2. Ubicación y Dirección de Entrega
                </h2>
              </div>
              <button
                onClick={handleUseGps}
                className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Auto GPS</span>
              </button>
            </div>

            {/* Address fields */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
              <div className="sm:col-span-3">
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Calle y Número
                </label>
                <input
                  type="text"
                  value={`${street} ${number}`}
                  onChange={(e) => {
                    const parts = e.target.value.split(' ');
                    setStreet(parts.slice(0, -1).join(' ') || e.target.value);
                    if (parts.length > 1) setNumber(parts[parts.length - 1]);
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 focus:border-emerald-600 rounded-xl text-xs font-medium text-gray-800 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Depto / Casa
                </label>
                <input
                  type="text"
                  value={depto}
                  onChange={(e) => setDepto(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 focus:border-emerald-600 rounded-xl text-xs font-medium text-gray-800 outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Piso
                </label>
                <input
                  type="text"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 focus:border-emerald-600 rounded-xl text-xs font-medium text-gray-800 outline-hidden"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Comuna y Ciudad
                </label>
                <input
                  type="text"
                  value={`${commune}, ${city}`}
                  onChange={(e) => setCommune(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 focus:border-emerald-600 rounded-xl text-xs font-medium text-gray-800 outline-hidden"
                />
              </div>
            </div>

            {/* Interactive Simulated Map with Courier bicycle */}
            <div className="relative h-56 rounded-2xl overflow-hidden border border-emerald-200 bg-emerald-950/5 mb-6">
              {/* Map grid lines simulation */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#05966915_1px,transparent_1px),linear-gradient(to_bottom,#05966915_1px,transparent_1px)] bg-[size:24px_24px]" />

              {/* Distance and ETA pill */}
              <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-emerald-200 shadow-xs flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-emerald-950">A 2.1 km de Dark Store Providencia</span>
                <span className="text-gray-400">•</span>
                <span className="text-emerald-700 font-semibold">25 min</span>
              </div>

              {/* Destination Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  <span className="w-12 h-12 rounded-full bg-emerald-500/25 animate-ping absolute" />
                  <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-lg border-2 border-white">
                    <MapPin className="w-5 h-5 fill-white" />
                  </div>
                </div>
                <div className="mt-1 bg-white text-emerald-950 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md border border-emerald-100">
                  {street} {number}
                </div>
              </div>

              {/* Courier on Bike simulation */}
              <div
                className="absolute z-10 flex flex-col items-center transition-all duration-1000"
                style={{ top: '35%', left: `${courierProgress}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md border border-white">
                  <Bike className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold bg-amber-950 text-amber-200 px-1.5 py-0.2 rounded shadow-2xs mt-0.5">
                  Repartidor 360
                </span>
              </div>
            </div>

            {/* Courier Instructions Chips */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-2">
                Instrucciones para el Repartidor
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {COURIER_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSelectedInstruction(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      selectedInstruction === preset
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-emerald-50'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <textarea
                rows={2}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Indica detalles para conserjería o citófono..."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-emerald-600 rounded-xl text-xs font-medium text-gray-800 outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Right column: Order on Hold summary */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-extrabold text-gray-900 text-base">
                Tu Pedido en Espera
              </h3>
              <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {cartItems.length} ítems
              </span>
            </div>

            {/* Items snippet */}
            <div className="space-y-2.5 max-h-48 overflow-y-auto mb-4">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0">
                      {item.quantity}x
                    </span>
                    <span className="text-gray-800 truncate">{item.product.name}</span>
                  </div>
                  <span className="font-mono font-bold text-gray-900 shrink-0">
                    ${(item.product.price * item.quantity).toLocaleString('es-CL')}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial breakdown */}
            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-mono">${cartSubtotal.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="font-mono">{shippingFee === 0 ? 'GRATIS' : `$${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tarifa servicio</span>
                <span className="font-mono">${serviceFee}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Cupón BIENVENIDO360</span>
                <span className="font-mono">-${discount.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Propina</span>
                <span className="font-mono">+${tip.toLocaleString('es-CL')}</span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-base font-extrabold text-gray-900">
                <span>Total a Pagar</span>
                <span className="text-xl font-mono text-emerald-800">
                  ${total.toLocaleString('es-CL')}
                </span>
              </div>

              <button
                onClick={handleFinish}
                className="w-full mt-4 py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-emerald-900/15 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <span>Confirmar Pedido y Solicitar Entrega</span>
                <Send className="w-4 h-4" />
              </button>

              <div className="text-center pt-3">
                <span className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Garantía de Entrega Pedidos 360 & SSL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
