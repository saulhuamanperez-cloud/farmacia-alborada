export type ProductCategory =
  | 'Todos'
  | 'Analgésicos'
  | 'Vitaminas'
  | 'Dermocosmética'
  | 'Cuidado Infantil';

export interface PharmacyProduct {
  id: string;
  name: string;
  brand: string;
  category: Exclude<ProductCategory, 'Todos'>;
  presentation: string;
  price: number;
  image: string;
  stock: 'Disponible' | 'Últimas unidades';
  requiresPrescription: boolean;
  activeIngredient: string;
  dosage: string;
  description: string;
}

export interface ClinicalService {
  number: string;
  title: string;
  schedule: string;
  summary: string;
  detail: string;
}

export const HERO_IMAGE =
  '/src/assets/images/hero_pharmacy_interior_1795135050677.jpg';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Todos',
  'Analgésicos',
  'Vitaminas',
  'Dermocosmética',
  'Cuidado Infantil',
];

export const PHARMACY_PRODUCTS: PharmacyProduct[] = [
  {
    id: 'algomin-500',
    name: 'Algomin 500 mg Acción Rápida',
    brand: 'Euromedica',
    category: 'Analgésicos',
    presentation: 'Caja × 20 comprimidos',
    price: 12.5,
    image: '/src/assets/images/product_analgesic_box_1795135050235.jpg',
    stock: 'Disponible',
    requiresPrescription: false,
    activeIngredient: 'Paracetamol 500 mg + Cafeína 65 mg',
    dosage: '1 comprimido cada 6 a 8 horas. Máximo 4 comprimidos al día.',
    description:
      'Formulado para el alivio eficaz del dolor de cabeza, malestar muscular leve y estados febriles con rápida absorción gástrica.',
  },
  {
    id: 'vitamina-c-1000',
    name: 'Vitamina C 1000 mg Alta Absorción',
    brand: 'Natural Vitality',
    category: 'Vitaminas',
    presentation: 'Frasco × 60 cápsulas',
    price: 24.9,
    image: '/src/assets/images/product_vitamin_c_1795135050311.jpg',
    stock: 'Disponible',
    requiresPrescription: false,
    activeIngredient: 'Ácido ascórbico 1000 mg con bioflavonoides cítricos',
    dosage: '1 cápsula diaria junto con el desayuno.',
    description:
      'Suplemento antioxidante diario que contribuye al funcionamiento normal del sistema inmunitario y a la protección celular.',
  },
  {
    id: 'serum-hialuronico',
    name: 'Sérum Ácido Hialurónico Clínico',
    brand: 'Derma-Science',
    category: 'Dermocosmética',
    presentation: 'Gotero 30 ml',
    price: 38.0,
    image: '/src/assets/images/product_dermo_serum_1795135050620.jpg',
    stock: 'Disponible',
    requiresPrescription: false,
    activeIngredient: 'Ácido hialurónico puro de doble peso molecular 1.5% + B5',
    dosage: 'Aplicar 3 a 4 gotas sobre piel limpia mañana y noche.',
    description:
      'Hidratación profunda sin fragancias, dermatológicamente probado para pieles sensibles y recuperación de la barrera cutánea.',
  },
  {
    id: 'probiotico-diario',
    name: 'Probiótico Digestivo 50B UFC',
    brand: 'Alma Health',
    category: 'Vitaminas',
    presentation: 'Frasco × 60 cápsulas',
    price: 31.5,
    image: '/src/assets/images/product_probiotic_jar_1795135049938.jpg',
    stock: 'Últimas unidades',
    requiresPrescription: false,
    activeIngredient: 'Mezcla de 10 cepas probióticas (Lactobacillus y Bifidobacterium)',
    dosage: '1 cápsula diaria antes de una comida principal.',
    description:
      'Apoya el equilibrio de la flora intestinal y el confort digestivo diario, ideal tras tratamientos con antibióticos.',
  },
  {
    id: 'protector-solar-spf50',
    name: 'Protector Solar Facial Diario SPF 50+',
    brand: 'Derma Studio',
    category: 'Dermocosmética',
    presentation: 'Tubo 50 ml',
    price: 28.4,
    image: '/src/assets/images/product_sunscreen_tube_1795135050774.jpg',
    stock: 'Disponible',
    requiresPrescription: false,
    activeIngredient: 'Filtros fotoestables UVA/UVB + Ácido hialurónico + Vitamina E',
    dosage: 'Aplicar generosamente 15 minutos antes de la exposición solar.',
    description:
      'Textura fluida ultraligera de rápida absorción, sin residuo blanco y no comedogénica, apta para uso clínico diario.',
  },
  {
    id: 'crema-calendula-bebe',
    name: 'Crema Calmante de Caléndula Pediátrica',
    brand: 'Gentle Pediatric',
    category: 'Cuidado Infantil',
    presentation: 'Tarro 50 ml',
    price: 19.8,
    image: '/src/assets/images/product_baby_balm_1795135050106.jpg',
    stock: 'Disponible',
    requiresPrescription: false,
    activeIngredient: 'Extracto orgánico de caléndula + Óxido de zinc suave',
    dosage: 'Aplicar una capa fina sobre la piel limpia y seca según necesidad.',
    description:
      'Fórmula hipoalergénica sin parabenos diseñada para proteger y calmar la piel delicada de bebés desde el primer mes.',
  },
];

export const CLINICAL_SERVICES: ClinicalService[] = [
  {
    number: '01',
    title: 'Dispensación y seguimiento de recetas',
    schedule: 'Todos los días · 24 horas',
    summary:
      'Validación farmacéutica de recetas médicas, control de interacciones y recordatorios de adherencia terapéutica.',
    detail: 'Atención presencial en mostrador y envío refrigerado a domicilio.',
  },
  {
    number: '02',
    title: 'Control de presión arterial y glucosa',
    schedule: 'Lunes a sábado · 08:00 a 20:00',
    summary:
      'Medición rápida en cabina privada con equipos calibrados y registro impreso para compartir con tu médico.',
    detail: 'Sin cita previa · Resultados en 5 minutos.',
  },
  {
    number: '03',
    title: 'Asesoría dermocosmética y pediátrica',
    schedule: 'Lunes a viernes · 09:00 a 19:00',
    summary:
      'Orientación personalizada por químicos farmacéuticos para rutinas dermatológicas y cuidado infantil seguro.',
    detail: 'Evaluación gratuita en tienda o por consulta telefónica.',
  },
];

export const PHARMACY_INFO = {
  name: 'Farmacia Alborada',
  address: 'Av. Primavera 1480, Local 4 · Atención 24 horas',
  phone: '+51 1 482 3910',
  email: 'atencion@farmaciaalborada.com',
  license: 'Registro Sanitario N.° 04821-DM',
  freeShippingThreshold: 45,
};
