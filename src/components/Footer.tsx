import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, Clock, Headphones } from 'lucide-react';

interface FooterProps {
  onGoToAuth?: () => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-white border-t border-emerald-100 text-gray-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                360°
              </div>
              <span className="font-extrabold text-base text-gray-900">
                Pedidos<span className="text-emerald-700">360</span>
              </span>
            </div>
            <p className="text-gray-500 leading-relaxed text-[11px]">
              La plataforma de delivery y supermercado dark store más rápida de Chile. Entregas promedio en 25 minutos con repartidores certificados.
            </p>
            <div className="flex items-center gap-2 text-emerald-800 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Garantía de Satisfacción 360°</span>
            </div>
          </div>

          {/* Col 2: Comunas de Cobertura */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider">
              Cobertura en Santiago
            </h4>
            <ul className="space-y-1.5 text-gray-500 text-[11px]">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-600" /> Providencia
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-600" /> Las Condes
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-600" /> Santiago Centro
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-600" /> Ñuñoa
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-600" /> Vitacura / Lo Barnechea
              </li>
            </ul>
          </div>

          {/* Col 3: Métodos de Pago y Seguridad */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider">
              Medios de Pago
            </h4>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-2.5 py-1 bg-gray-100 rounded-md font-semibold text-gray-700 text-[10px]">
                WebPay Plus
              </span>
              <span className="px-2.5 py-1 bg-gray-100 rounded-md font-semibold text-gray-700 text-[10px]">
                Redcompra
              </span>
              <span className="px-2.5 py-1 bg-gray-100 rounded-md font-semibold text-gray-700 text-[10px]">
                Mach
              </span>
              <span className="px-2.5 py-1 bg-gray-100 rounded-md font-semibold text-gray-700 text-[10px]">
                Mercado Pago
              </span>
              <span className="px-2.5 py-1 bg-gray-100 rounded-md font-semibold text-gray-700 text-[10px]">
                Efectivo
              </span>
            </div>
            <p className="text-gray-400 text-[10px]">
              Transacciones seguras y encriptadas con boleta electrónica SII automática.
            </p>
          </div>

          {/* Col 4: Atención al Cliente & Contacto */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider">
              Atención al Cliente 24/7
            </h4>
            <p className="text-[11px] text-gray-500">
              ¿Tienes dudas con tu pedido o entrega? Nuestro equipo de soporte está disponible.
            </p>
            <div className="space-y-2 text-[11px] text-gray-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span className="font-semibold">+56 2 2840 3600</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-700" />
                <span>contacto@pedidos360.cl</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Lunes a Domingo: 08:00 - 02:00 hrs</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400 text-[11px]">
          <div>
            © {new Date().getFullYear()} Pedidos 360 SpA. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-emerald-700 transition-colors">Términos y Condiciones</a>
            <span>•</span>
            <a href="#" className="hover:text-emerald-700 transition-colors">Política de Privacidad</a>
            <span>•</span>
            <a href="#" className="hover:text-emerald-700 transition-colors">Boleta Electrónica SII</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
