import { useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { PharmacyProduct } from '../data/pharmacyData';

interface ProductModalProps {
  product: PharmacyProduct | null;
  onClose: () => void;
  onAddToCart: (product: PharmacyProduct, quantity: number) => void;
}

export default function ProductModal({
  product,
  onClose,
  onAddToCart,
}: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const handleConfirm = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
      onClick={onClose}
    >
      <div
        className="relative grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar detalle del producto"
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-lg bg-white/90 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Product image */}
        <div className="bg-slate-100">
          {imgError ? (
            <div className="flex h-full min-h-[280px] flex-col items-center justify-center bg-slate-100 p-8 text-center">
              <span className="font-display text-lg font-medium text-slate-700">
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
              onError={() => setImgError(true)}
              className="h-full min-h-[280px] w-full object-cover"
            />
          )}
        </div>

        {/* Contiguous purchase module */}
        <div className="flex flex-col justify-between p-6 sm:p-8">
          <div>
            <p className="text-xs text-slate-500">
              {product.brand} · {product.category} · {product.stock}
            </p>
            <h3
              id="pdp-title"
              className="mt-2 text-2xl font-semibold text-slate-900 [text-wrap:balance]"
            >
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{product.presentation}</p>

            <p className="mt-4 font-mono text-2xl font-medium tabular-nums text-slate-900">
              ${product.price.toFixed(2)}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              {product.description}
            </p>

            <dl className="mt-5 space-y-2.5 border-t border-slate-200 pt-4 text-xs">
              <div>
                <dt className="font-medium text-slate-900">Principio activo</dt>
                <dd className="mt-0.5 text-slate-600">{product.activeIngredient}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Modo de uso sugerido</dt>
                <dd className="mt-0.5 text-slate-600">{product.dosage}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-5">
            <div className="flex items-center rounded-lg border border-slate-300">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Reducir cantidad"
                className="flex h-10 w-10 items-center justify-center text-slate-600 hover:text-slate-900"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="w-8 text-center font-mono text-sm tabular-nums text-slate-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                aria-label="Aumentar cantidad"
                className="flex h-10 w-10 items-center justify-center text-slate-600 hover:text-slate-900"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 rounded-lg bg-[#0D6E52] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#09543E] whitespace-nowrap"
            >
              Agregar · ${(product.price * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
