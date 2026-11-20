import { useMemo, useState } from 'react';
import { ArrowRight, Plus, QrCode, Search, ShoppingBag } from 'lucide-react';
import {
  CLINICAL_SERVICES,
  HERO_IMAGE,
  PHARMACY_INFO,
  PHARMACY_PRODUCTS,
  PRODUCT_CATEGORIES,
  PharmacyProduct,
  ProductCategory,
} from './data/pharmacyData';
import QrCodeStudio from './components/QrCodeStudio';
import ProductModal from './components/ProductModal';
import CartDrawer, { CartItem } from './components/CartDrawer';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProduct, setActiveProduct] = useState<PharmacyProduct | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return PHARMACY_PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'Todos' || product.category === selectedCategory;
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.activeIngredient.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const handleAddToCart = (product: PharmacyProduct, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      {/* Top Bar Contract: 3 zones, single-line controls */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
          <a
            href="#inicio"
            className="font-display text-xl font-semibold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            {PHARMACY_INFO.name}
          </a>

          <nav
            aria-label="Navegación principal"
            className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex"
          >
            <a
              href="#catalogo"
              className="transition-colors hover:text-slate-900 hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              Catálogo
            </a>
            <a
              href="#servicios"
              className="transition-colors hover:text-slate-900 hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              Servicios
            </a>
            <a
              href="#codigo-qr"
              className="transition-colors hover:text-slate-900 hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              Código QR
            </a>
            <a
              href="#contacto"
              className="transition-colors hover:text-slate-900 hover:underline hover:underline-offset-4 whitespace-nowrap shrink-0"
            >
              Contacto
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0D6E52] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#09543E] whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span>Carrito</span>
            {cartCount > 0 && (
              <span className="font-mono text-xs tabular-nums">({cartCount})</span>
            )}
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="inicio" className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-10 px-6 py-14 lg:grid-cols-12 lg:py-20">
            <div className="flex flex-col justify-between lg:col-span-6">
              <div>
                <p className="text-sm font-medium text-[#0D6E52]">
                  Atención farmacéutica · {PHARMACY_INFO.license}
                </p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl [text-wrap:balance]">
                  Cuidado farmacéutico preciso, cercano y siempre disponible
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
                  Medicamentos certificados, dermocosmética clínica y orientación por
                  químicos farmacéuticos. Comparte nuestra página al instante con su
                  código QR oficial.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <a
                    href="#catalogo"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0D6E52] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#09543E] whitespace-nowrap"
                  >
                    <span>Explorar catálogo</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href="#codigo-qr"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50 whitespace-nowrap"
                  >
                    <QrCode className="h-4 w-4 text-[#0D6E52]" aria-hidden="true" />
                    <span>Ver código QR de la web</span>
                  </a>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-200 pt-6 text-xs text-slate-500">
                <span>Atención 24 horas</span>
                <span aria-hidden="true">·</span>
                <span>Envío gratis desde ${PHARMACY_INFO.freeShippingThreshold}</span>
                <span aria-hidden="true">·</span>
                <span>Pago contra entrega</span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="h-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                {heroImgError ? (
                  <div className="flex min-h-[340px] h-full flex-col items-center justify-center bg-slate-100 p-8 text-center">
                    <span className="font-display text-2xl font-medium text-slate-800">
                      {PHARMACY_INFO.name}
                    </span>
                    <span className="mt-2 text-sm text-slate-500">
                      {PHARMACY_INFO.address}
                    </span>
                  </div>
                ) : (
                  <img
                    src={HERO_IMAGE}
                    alt="Interior luminoso y moderno de Farmacia Alborada con mostrador de atención farmacéutica"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgError(true)}
                    className="h-full min-h-[320px] w-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <section id="catalogo" className="py-20 lg:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-medium text-[#0D6E52]">
                  Selección farmacéutica
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  Catálogo de productos
                </h2>
              </div>

              <div className="relative w-full md:w-72">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar medicamento o principio activo"
                  aria-label="Buscar productos"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-3.5 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0D6E52] focus:ring-2 focus:ring-[#0D6E52]/20 focus:outline-none"
                />
              </div>
            </div>

            {/* Category filter tabs */}
            <div
              role="tablist"
              aria-label="Filtrar por categoría"
              className="mt-8 flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-4"
            >
              {PRODUCT_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#0D6E52] text-white'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Product grid */}
            {filteredProducts.length === 0 ? (
              <div className="mt-12 rounded-xl border border-slate-200 bg-white px-6 py-14 text-center">
                <p className="font-display text-lg font-medium text-slate-900">
                  No encontramos coincidencias para "{searchQuery}"
                </p>
                <p className="mt-1.5 text-sm text-slate-500">
                  Prueba con otro término o restablece los filtros de categoría.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Todos');
                  }}
                  className="mt-5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
                >
                  Mostrar todo el catálogo
                </button>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveProduct(product)}
                      className="block aspect-[4/3] w-full overflow-hidden bg-slate-100 text-left focus-visible:outline-2 focus-visible:outline-[#0D6E52]"
                    >
                      {failedImages[product.id] ? (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 p-6 text-center">
                          <span className="font-display text-base font-medium text-slate-700">
                            {product.name}
                          </span>
                          <span className="mt-1 text-xs text-slate-500">
                            {product.presentation}
                          </span>
                        </div>
                      ) : (
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedImages((prev) => ({
                              ...prev,
                              [product.id]: true,
                            }))
                          }
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      )}
                    </button>

                    <div className="flex flex-1 flex-col justify-between p-5">
                      <div>
                        <p className="text-xs text-slate-500">
                          {product.category} · {product.brand}
                        </p>
                        <button
                          type="button"
                          onClick={() => setActiveProduct(product)}
                          className="mt-1.5 block text-left text-base font-semibold text-slate-900 transition-colors hover:text-[#0D6E52]"
                        >
                          {product.name}
                        </button>
                        <p className="mt-1 text-xs text-slate-500">
                          {product.presentation} · {product.stock}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                        <span className="font-mono text-base font-medium tabular-nums text-slate-900">
                          ${product.price.toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product, 1)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 transition-colors hover:border-[#0D6E52] hover:bg-[#0D6E52] hover:text-white whitespace-nowrap"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Agregar</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Clinical Services Section */}
        <section
          id="servicios"
          className="border-t border-slate-200 bg-[#F1F5F9]/60 py-20 lg:py-24"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-[#0D6E52]">
                Atención profesional en tienda
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl [text-wrap:balance]">
                Servicios clínicos respaldados por químicos farmacéuticos
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {CLINICAL_SERVICES.map((service) => (
                <div
                  key={service.number}
                  className="flex flex-col justify-between border-t border-slate-300 pt-6"
                >
                  <div>
                    <p className="font-mono text-xs text-slate-500">
                      {service.number}. {service.schedule}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">
                      {service.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {service.summary}
                    </p>
                  </div>
                  <p className="mt-5 text-xs font-medium text-slate-500">
                    {service.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* QR Code Generator Section */}
        <QrCodeStudio />
      </main>

      {/* Quiet Editorial Footer */}
      <footer
        id="contacto"
        className="border-t border-slate-200 bg-[#F8FAFC] py-14 text-sm text-slate-600"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
          <div>
            <p className="font-display text-lg font-semibold text-slate-900">
              {PHARMACY_INFO.name}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              {PHARMACY_INFO.address}
              <br />
              {PHARMACY_INFO.license}
            </p>
          </div>

          <div>
            <p className="font-medium text-slate-900">Contacto directo</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Teléfono: {PHARMACY_INFO.phone}
              <br />
              Correo: {PHARMACY_INFO.email}
            </p>
          </div>

          <div className="flex flex-col md:items-end">
            <div className="flex flex-wrap gap-5 text-xs font-medium text-slate-600">
              <a href="#catalogo" className="hover:text-slate-900">
                Catálogo
              </a>
              <a href="#servicios" className="hover:text-slate-900">
                Servicios
              </a>
              <a href="#codigo-qr" className="hover:text-slate-900">
                Código QR
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              © {new Date().getFullYear()} {PHARMACY_INFO.name}. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProductModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
