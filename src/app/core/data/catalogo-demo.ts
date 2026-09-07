import { Direccion, ProductoVista } from '../models/producto.model';

/**
 * Catálogo de demostración heredado del prototipo original de Pedidos360.
 *
 * Se usa cuando el microservicio de catálogo todavía no está accesible
 * (API Gateway sin configurar, EC2 apagada o error de red), para que la
 * interfaz siga siendo demostrable. Los productos que vienen del backend
 * se marcan con `origen: 'api'`; estos quedan como `'demo'`.
 */
export const CATALOGO_DEMO: ProductoVista[] = [
  // Prepared Food (Restaurantes)
  {
    id: 'prod-1',
    name: 'Burger 360 Doble Cheddar',
    description: 'Carne angus doble (240g), queso cheddar fundido, tocino ahumado crujiente y salsa secreta 360 en pan brioche artesanal.',
    price: 7990,
    refUsd: '$8.50 USD',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    category: 'Hamburguesas',
    mode: 'restaurantes',
    badge: 'Más Vendido',
    badgeType: 'primary',
    rating: 4.9,
    reviewsCount: '1.2k',
    prepTime: '25-35 min',
    portionOrCalories: 'Burger 360 Kitchen',
    storeName: 'Burger 360 Kitchen'
  },
  {
    id: 'prod-2',
    name: 'Pizza Napolitana Familiar 360',
    description: 'Fermentación lenta de 48 horas, mozzarella fresca de búfala, albahaca genovesa y pomodoro italiano San Marzano.',
    price: 11490,
    refUsd: '$12.20 USD',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    category: 'Pizzas',
    mode: 'restaurantes',
    badge: 'Masa Madre',
    badgeType: 'secondary',
    rating: 4.8,
    reviewsCount: '890',
    prepTime: '30-40 min',
    portionOrCalories: '8 porciones',
    storeName: 'Napoli Gourmet 360'
  },
  {
    id: 'prod-3',
    name: 'Sushi Roll Tempura Ebi (12 cortes)',
    description: 'Camarón crocante al panko, palta Hass, queso crema Philadelphia, envuelto en sésamo y bañado en salsa teriyaki artesanal.',
    price: 8990,
    refUsd: '$9.55 USD',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80',
    category: 'Sushi',
    mode: 'restaurantes',
    badge: 'Chef Choice',
    badgeType: 'secondary',
    rating: 4.9,
    reviewsCount: '2.1k',
    prepTime: '20-30 min',
    portionOrCalories: '12 piezas',
    storeName: 'Sushi Zen 360'
  },
  {
    id: 'prod-4',
    name: 'Bowl Salmón & Palta',
    description: 'Base de arroz sushi especiado, salmón fresco premium del sur, edamame tierno, palta, cebollín y dressing ponzu cítrico.',
    price: 9490,
    refUsd: '$10.10 USD',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    category: 'Saludable & Bowls',
    mode: 'restaurantes',
    badge: 'Saludable & Fit',
    badgeType: 'secondary',
    rating: 4.7,
    reviewsCount: '650',
    prepTime: '15-25 min',
    portionOrCalories: '450 kcal',
    storeName: 'Fresh Poke Lab'
  },
  {
    id: 'prod-5',
    name: 'Tacos Al Pastor Artesanales (x3)',
    description: 'Carne de cerdo marinada al achiote con piña asada, cebolla picada fina, cilantro fresco y tortillas de maíz nixtamalizado.',
    price: 6990,
    refUsd: '$7.40 USD',
    image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&auto=format&fit=crop&q=80',
    category: 'Tacos & Burritos',
    mode: 'restaurantes',
    badge: 'Auténtico',
    badgeType: 'warning',
    rating: 4.8,
    reviewsCount: '720',
    prepTime: '20-30 min',
    portionOrCalories: '3 unidades',
    storeName: 'La Taquería 360'
  },
  {
    id: 'prod-6',
    name: 'Crispy Wings BBQ & Honey (8 uds)',
    description: 'Alitas de pollo extra crujientes glaseadas en salsa barbacoa ahumada artesanal con toque de miel y dip de queso azul.',
    price: 7490,
    refUsd: '$7.90 USD',
    image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80',
    category: 'Pollo & Alitas',
    mode: 'restaurantes',
    badge: 'Crujiente',
    badgeType: 'primary',
    rating: 4.9,
    reviewsCount: '950',
    prepTime: '20-30 min',
    portionOrCalories: '8 alitas',
    storeName: 'Wing Station 360'
  },

  // Supermarket Dark Store 360
  {
    id: 'prod-7',
    name: 'Papel Higiénico Confort Doble Hoja',
    description: 'Pack 8 rollos de 30m cada uno. Textura extra suave y resistente.',
    price: 4290,
    image: 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?w=600&auto=format&fit=crop&q=80',
    category: 'Higiene & Confort',
    mode: 'supermercado',
    packInfo: 'Pack x8 rollos',
    rating: 4.9,
    reviewsCount: '3.4k',
    prepTime: 'Envío 20 min',
    storeName: 'Dark Store 360'
  },
  {
    id: 'prod-8',
    name: 'Fideos Spaghetti Carozzi N° 5',
    description: 'Pasta de trigo 100% seleccionada. Elaboración de alta resistencia al dente.',
    price: 1190,
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',
    category: 'Abarrotes & Fideos',
    mode: 'supermercado',
    packInfo: '400g',
    rating: 4.8,
    reviewsCount: '1.8k',
    prepTime: 'Envío 20 min',
    storeName: 'Dark Store 360'
  },
  {
    id: 'prod-9',
    name: 'Queso Gouda Laminado Colun 500g',
    description: 'Laminado fresco, envasado al vacío sellado. Tradicional del sur de Chile.',
    price: 4890,
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&auto=format&fit=crop&q=80',
    category: 'Lácteos & Quesos',
    mode: 'supermercado',
    packInfo: '500g laminado',
    rating: 4.9,
    reviewsCount: '2.5k',
    prepTime: 'Cadena de frío',
    storeName: 'Dark Store 360'
  },
  {
    id: 'prod-10',
    name: 'Leche Entera 1L (Pack x6)',
    description: 'Calcio, Vitamina A + D. Leche natural pura 100% pasteurizada.',
    price: 5490,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80',
    category: 'Lácteos & Quesos',
    mode: 'supermercado',
    packInfo: 'Pack x6 unidades',
    rating: 4.8,
    reviewsCount: '1.1k',
    prepTime: 'Envío 20 min',
    storeName: 'Dark Store 360'
  },
  {
    id: 'prod-11',
    name: 'Aceite Vegetal Maravilla (900ml)',
    description: '100% puro de maravilla prensado en frío. Ideal para cocina ligera y saludable.',
    price: 2490,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
    category: 'Abarrotes & Fideos',
    mode: 'supermercado',
    packInfo: 'Botella 900ml',
    rating: 4.7,
    reviewsCount: '980',
    prepTime: 'Envío 20 min',
    storeName: 'Dark Store 360'
  },

  // Upsell additions (Last minute complements)
  {
    id: 'prod-upsell-1',
    name: 'Bebida Coca-Cola Zero',
    description: 'Lata 350ml fría lista para consumir.',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
    category: 'Bebidas & Snacks',
    mode: 'restaurantes',
    rating: 4.9,
    reviewsCount: '5k',
    prepTime: 'Helada',
    storeName: 'Dark Store 360'
  },
  {
    id: 'prod-upsell-2',
    name: 'Papas Fritas Rústicas',
    description: 'Porción individual 200g crocantes con sal marina y romero fresco.',
    price: 2990,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=80',
    category: 'Hamburguesas',
    mode: 'restaurantes',
    rating: 4.8,
    reviewsCount: '1.3k',
    prepTime: 'Recién fritas',
    storeName: 'Burger 360 Kitchen'
  },
  {
    id: 'prod-upsell-3',
    name: 'Postre Brownie Fudgy',
    description: 'Con nueces tostadas y baño de chocolate belga tibio.',
    price: 2490,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80',
    category: 'Postres & Helados',
    mode: 'restaurantes',
    rating: 4.9,
    reviewsCount: '890',
    prepTime: 'Listo',
    storeName: 'Pastelería 360'
  }
];

/** Direcciones de despacho de ejemplo para la pantalla de entrega. */
export const DIRECCIONES_DEMO: Direccion[] = [
  {
    id: 'addr-1',
    tag: 'home',
    label: 'Casa',
    street: 'Av. Providencia',
    number: '1345',
    depto: 'Depto 402',
    floor: 'Piso 4',
    commune: 'Providencia',
    city: 'Santiago',
    reference: 'Edificio Torres del Parque, Conserjería 24/7',
    isDefault: true,
    courierInstructions: 'Dejar con don Ramón en conserjería central.'
  },
  {
    id: 'addr-2',
    tag: 'work',
    label: 'Oficina / Trabajo',
    street: 'Av. Andrés Bello',
    number: '2711',
    depto: 'Piso 8',
    floor: 'Piso 8',
    commune: 'Las Condes',
    city: 'Santiago',
    reference: 'Recepción edificio Costanera Titanium',
    isDefault: false,
    courierInstructions: 'Llamar al llegar por citófono de recepción.'
  }
];
