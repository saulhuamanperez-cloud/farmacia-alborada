import { FormEvent, useState } from 'react';
import { CheckCircle2, Minus, Plus, Trash2, X } from 'lucide-react';
import { PHARMACY_INFO, PharmacyProduct } from '../data/pharmacyData';

export interface CartItem {
  product: PharmacyProduct;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (productId: string, delta: number) => void;
  onRemove: (productId: string) => void;
  onClearCart: () => void;
}

interface ConfirmedOrder {
  orderNumber: string;
  customerName: string;
  address: string;
  total: number;
  itemCount: number;
}

export default function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQty,
  onRemove,
  onClearCart,
}: CartDrawerProps) {
  const [step, setStep] = useState<'bag' | 'checkout' | 'confirmed'>('bag');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping =
    subtotal === 0 || subtotal >= PHARMACY_INFO.freeShippingThreshold ? 0 : 4.5;
  const total = subtotal + shipping;
  const remainingForFree = Math.max(
    0,
    PHARMACY_INFO.freeShippingThreshold - subtotal
  );

  const handlePlaceOrder = (e: FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) return;

    const orderNum = `ALB-${Math.floor(1000 + Math.random() * 9000)}`;
    const count = items.reduce((acc, i) => acc + i.quantity, 0);

    setConfirmedOrder({
      orderNumber: orderNum,
      customerName: customerName.trim(),
      address: address.trim(),
      total,
      itemCount: count,
    });
    onClearCart();
    setStep('confirmed');
  };

  const handleClose = () => {
    if (step === 'confirmed') {
      setStep('bag');
      setCustomerName('');
      setPhone('');
      setAddress('');
      setConfirmedOrder(null);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de farmacia"
      onClick={handleClose}
    >
      <div
        className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <h2 className="font-display text-xl font-semibold text-slate-900">
            {step === 'bag' && 'Tu pedido'}
            {step === 'checkout' && 'Datos de entrega'}
            {step === 'confirmed' && 'Pedido confirmado'}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar carrito"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === 'confirmed' && confirmedOrder ? (
            <div className="space-y-5 py-6">
              <CheckCircle2
                className="h-10 w-10 text-[#0D6E52]"
                aria-hidden="true"
              />
              <div>
                <p className="font-mono text-xs text-[#0D6E52]">
                  Orden #{confirmedOrder.orderNumber} · En preparación
                </p>
                <h3 className="mt-1 font-display text-2xl font-semibold text-slate-900">
                  Gracias, {confirmedOrder.customerName}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Nuestro equipo farmacéutico está preparando tu pedido para envío a
                  domicilio con pago contra entrega.
                </p>
              </div>
              <dl className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Artículos</dt>
                  <dd className="font-mono tabular-nums text-slate-900">
                    {confirmedOrder.itemCount}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Dirección</dt>
                  <dd className="max-w-[220px] text-right text-slate-900">
                    {confirmedOrder.address}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-medium">
                  <dt className="text-slate-900">Total a pagar al recibir</dt>
                  <dd className="font-mono tabular-nums text-slate-900">
                    ${confirmedOrder.total.toFixed(2)}
                  </dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={handleClose}
                className="w-full rounded-lg bg-[#0D6E52] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#09543E]"
              >
                Volver a la farmacia
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-display text-lg font-medium text-slate-900">
                Tu carrito está vacío
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Explora nuestro catálogo farmacéutico para agregar productos de cuidado
                diario.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-6 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50"
              >
                Ver catálogo
              </button>
            </div>
          ) : step === 'bag' ? (
            <div className="space-y-5">
              <div className="rounded-lg bg-slate-50 px-4 py-3 text-xs text-slate-600">
                {remainingForFree === 0 ? (
                  <span className="font-medium text-[#0D6E52]">
                    Envío a domicilio gratuito desbloqueado.
                  </span>
                ) : (
                  <span>
                    Agrega{' '}
                    <strong className="font-mono tabular-nums text-slate-900">
                      ${remainingForFree.toFixed(2)}
                    </strong>{' '}
                    más para obtener envío gratuito.
                  </span>
                )}
              </div>

              <ul className="divide-y divide-slate-200">
                {items.map(({ product, quantity }) => (
                  <li key={product.id} className="flex gap-4 py-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="h-16 w-20 shrink-0 rounded-md bg-slate-100 object-cover"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {product.presentation}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemove(product.id)}
                          aria-label={`Eliminar ${product.name}`}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-md border border-slate-200">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(product.id, -1)}
                            aria-label="Restar unidad"
                            className="flex h-7 w-7 items-center justify-center text-slate-600 hover:text-slate-900"
                          >
                            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                          <span className="w-7 text-center font-mono text-xs tabular-nums">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(product.id, 1)}
                            aria-label="Sumar unidad"
                            className="flex h-7 w-7 items-center justify-center text-slate-600 hover:text-slate-900"
                          >
                            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                        <span className="font-mono text-sm font-medium tabular-nums text-slate-900">
                          ${(product.price * quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
              <p className="text-sm text-slate-600">
                Modalidad: <strong className="text-slate-900">Pago contra entrega</strong>{' '}
                (efectivo o tarjeta al recibir tu pedido).
              </p>
              <div>
                <label
                  htmlFor="checkout-name"
                  className="block text-sm font-medium text-slate-900"
                >
                  Nombre completo
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej. María Torres"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0D6E52] focus:ring-2 focus:ring-[#0D6E52]/20 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="checkout-phone"
                  className="block text-sm font-medium text-slate-900"
                >
                  Teléfono de contacto
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+51 999 000 000"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0D6E52] focus:ring-2 focus:ring-[#0D6E52]/20 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="checkout-address"
                  className="block text-sm font-medium text-slate-900"
                >
                  Dirección de entrega
                </label>
                <textarea
                  id="checkout-address"
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle, número, departamento y referencia"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-[#0D6E52] focus:ring-2 focus:ring-[#0D6E52]/20 focus:outline-none"
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer totals */}
        {step !== 'confirmed' && items.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-5">
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <dt>Subtotal</dt>
                <dd className="font-mono tabular-nums">${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between text-slate-600">
                <dt>Envío estimado</dt>
                <dd className="font-mono tabular-nums">
                  {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
                </dd>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-semibold text-slate-900">
                <dt>Total</dt>
                <dd className="font-mono tabular-nums">${total.toFixed(2)}</dd>
              </div>
            </dl>

            {step === 'bag' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="mt-4 w-full rounded-lg bg-[#0D6E52] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#09543E]"
              >
                Continuar con la entrega
              </button>
            ) : (
              <div className="mt-4 flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep('bag')}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="flex-1 rounded-lg bg-[#0D6E52] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#09543E]"
                >
                  Confirmar pedido
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
