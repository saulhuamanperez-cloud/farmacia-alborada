import { useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Check, Copy, Download, Printer, RotateCcw } from 'lucide-react';
import { PHARMACY_INFO } from '../data/pharmacyData';

type PresetKey = 'home' | 'catalog' | 'services' | 'custom';
type ErrorCorrectionLevel = 'M' | 'Q' | 'H';

interface QrColorOption {
  id: string;
  label: string;
  hex: string;
}

const COLOR_OPTIONS: QrColorOption[] = [
  { id: 'emerald', label: 'Verde Farmacia', hex: '#0D6E52' },
  { id: 'ink', label: 'Negro Clínico', hex: '#0F172A' },
  { id: 'navy', label: 'Azul Marino', hex: '#1E3A5F' },
];

const CORRECTION_OPTIONS: { value: ErrorCorrectionLevel; label: string }[] = [
  { value: 'M', label: 'Estándar (M)' },
  { value: 'Q', label: 'Alta (Q)' },
  { value: 'H', label: 'Máxima (H)' },
];

export default function QrCodeStudio() {
  const baseUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return 'https://farmaciaalborada.com';
    }
    return `${window.location.origin}${window.location.pathname}`.replace(/\/$/, '');
  }, []);

  const [preset, setPreset] = useState<PresetKey>('home');
  const [customUrl, setCustomUrl] = useState<string>(baseUrl);
  const [caption, setCaption] = useState<string>('Escanea para visitar nuestra farmacia online');
  const [fgColor, setFgColor] = useState<string>('#0D6E52');
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>('Q');
  const [copied, setCopied] = useState<boolean>(false);
  const [qrError, setQrError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const targetUrl = useMemo(() => {
    if (preset === 'home') return baseUrl;
    if (preset === 'catalog') return `${baseUrl}#catalogo`;
    if (preset === 'services') return `${baseUrl}#servicios`;
    return customUrl.trim();
  }, [preset, baseUrl, customUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!targetUrl) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setQrError('Ingresa una URL válida para generar el código QR.');
      return;
    }

    let cancelled = false;
    QRCode.toCanvas(
      canvas,
      targetUrl,
      {
        width: 260,
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: fgColor,
          light: '#FFFFFF',
        },
      },
      (err) => {
        if (cancelled) return;
        if (err) {
          setQrError('No se pudo generar el código QR para esta dirección.');
        } else {
          setQrError(null);
        }
      }
    );

    return () => {
      cancelled = true;
    };
  }, [targetUrl, fgColor, errorLevel]);

  const handleCopyUrl = async () => {
    if (!targetUrl) return;
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = targetUrl;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPng = async () => {
    if (!targetUrl) return;
    try {
      const qrDataUrl = await QRCode.toDataURL(targetUrl, {
        width: 720,
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: fgColor,
          light: '#FFFFFF',
        },
      });

      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 960;
      exportCanvas.height = 1160;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 4;
      ctx.strokeRect(24, 24, exportCanvas.width - 48, exportCanvas.height - 48);

      ctx.fillStyle = '#0F172A';
      ctx.font = '600 42px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(PHARMACY_INFO.name, exportCanvas.width / 2, 118);

      ctx.fillStyle = '#475569';
      ctx.font = '400 24px sans-serif';
      ctx.fillText(
        caption.trim() || 'Escanea para visitar nuestra farmacia online',
        exportCanvas.width / 2,
        166
      );

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 120, 210, 720, 720);

        ctx.fillStyle = '#64748B';
        ctx.font = '400 20px monospace';
        const displayUrl =
          targetUrl.length > 56 ? `${targetUrl.slice(0, 53)}...` : targetUrl;
        ctx.fillText(displayUrl, exportCanvas.width / 2, 1005);

        ctx.fillStyle = '#0D6E52';
        ctx.font = '500 20px sans-serif';
        ctx.fillText(PHARMACY_INFO.address, exportCanvas.width / 2, 1060);

        const link = document.createElement('a');
        link.download = `qr-farmacia-alborada-${preset}.png`;
        link.href = exportCanvas.toDataURL('image/png');
        link.click();
      };
      img.src = qrDataUrl;
    } catch {
      setQrError('Error al exportar la imagen PNG.');
    }
  };

  const handleDownloadSvg = async () => {
    if (!targetUrl) return;
    try {
      const svgString = await QRCode.toString(targetUrl, {
        type: 'svg',
        margin: 2,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: fgColor,
          light: '#FFFFFF',
        },
      });
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `qr-farmacia-alborada-${preset}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setQrError('Error al exportar el archivo SVG.');
    }
  };

  const handleReset = () => {
    setPreset('home');
    setCustomUrl(baseUrl);
    setCaption('Escanea para visitar nuestra farmacia online');
    setFgColor('#0D6E52');
    setErrorLevel('Q');
  };

  return (
    <section
      id="codigo-qr"
      className="border-t border-slate-200 bg-white py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-medium text-[#0D6E52]">
            Acceso directo por cámara
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl [text-wrap:balance]">
            Convierte la URL de la farmacia en un código QR listo para compartir
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Genera al instante el código QR oficial de esta página web o de cualquier
            sección específica para imprimirlo en mostradores, recetas, bolsas de
            entrega o enviarlo por mensajería.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
          {/* Left column: Configuration controls */}
          <div className="flex flex-col justify-between space-y-6 rounded-xl border border-slate-200 bg-[#F8FAFC] p-6 sm:p-8 lg:col-span-7">
            <div className="space-y-6">
              {/* Destination selector */}
              <div>
                <label className="block text-sm font-medium text-slate-900">
                  Destino del enlace
                </label>
                <div
                  role="tablist"
                  aria-label="Seleccionar destino de la URL"
                  className="mt-2.5 grid grid-cols-2 gap-1.5 rounded-lg bg-slate-200/70 p-1 sm:grid-cols-4"
                >
                  {(
                    [
                      { id: 'home', label: 'Página principal' },
                      { id: 'catalog', label: 'Catálogo' },
                      { id: 'services', label: 'Servicios' },
                      { id: 'custom', label: 'URL personalizada' },
                    ] as { id: PresetKey; label: string }[]
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={preset === item.id}
                      onClick={() => setPreset(item.id)}
                      className={`rounded-md px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D6E52] ${
                        preset === item.id
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* URL field */}
              <div>
                <div className="flex items-center justify-between gap-4">
                  <label
                    htmlFor="pharmacy-qr-url"
                    className="block text-sm font-medium text-slate-900"
                  >
                    URL codificada en el QR
                  </label>
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    disabled={!targetUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0D6E52] transition-colors hover:text-[#09543E] disabled:opacity-40 whitespace-nowrap shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>URL copiada</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Copiar URL</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  id="pharmacy-qr-url"
                  type="url"
                  value={preset === 'custom' ? customUrl : targetUrl}
                  onChange={(e) => {
                    setPreset('custom');
                    setCustomUrl(e.target.value);
                  }}
                  placeholder="https://tu-farmacia.com"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0D6E52] focus:ring-2 focus:ring-[#0D6E52]/20 focus:outline-none"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Puedes editar esta dirección directamente para convertir cualquier URL
                  en un código QR escaneable.
                </p>
              </div>

              {/* Caption input */}
              <div>
                <label
                  htmlFor="pharmacy-qr-caption"
                  className="block text-sm font-medium text-slate-900"
                >
                  Texto de la tarjeta imprimible
                </label>
                <input
                  id="pharmacy-qr-caption"
                  type="text"
                  maxLength={70}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0D6E52] focus:ring-2 focus:ring-[#0D6E52]/20 focus:outline-none"
                />
              </div>

              {/* Color & Error correction */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <span className="block text-sm font-medium text-slate-900">
                    Color del código
                  </span>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {COLOR_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFgColor(opt.hex)}
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                          fgColor === opt.hex
                            ? 'border-[#0D6E52] bg-white text-slate-900'
                            : 'border-slate-200 bg-white/60 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span
                          className="h-3 w-3 rounded-xs border border-black/10"
                          style={{ backgroundColor: opt.hex }}
                          aria-hidden="true"
                        />
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-sm font-medium text-slate-900">
                    Corrección de errores
                  </span>
                  <div className="mt-2.5 flex gap-1.5 rounded-lg bg-slate-200/70 p-1">
                    {CORRECTION_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setErrorLevel(opt.value)}
                        className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                          errorLevel === opt.value
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-5">
              <span className="text-xs text-slate-500">
                Compatible con cámaras iOS y Android
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 transition-colors hover:text-slate-900 whitespace-nowrap shrink-0"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Restablecer</span>
              </button>
            </div>
          </div>

          {/* Right column: Printable QR Card & Export Actions */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-5">
            <div
              id="qr-printable-card"
              className="flex flex-col items-center rounded-lg border border-slate-200 bg-white px-6 py-8 text-center"
            >
              <p className="font-display text-xl font-semibold text-slate-900">
                {PHARMACY_INFO.name}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {caption.trim() || 'Escanea para visitar nuestra farmacia online'}
              </p>

              <div className="my-6 flex min-h-[260px] min-w-[260px] items-center justify-center rounded-lg bg-white p-2">
                {qrError ? (
                  <p className="max-w-[220px] text-sm text-red-700">{qrError}</p>
                ) : (
                  <canvas
                    ref={canvasRef}
                    aria-label={`Código QR para ${targetUrl}`}
                    className="h-[260px] w-[260px]"
                  />
                )}
              </div>

              <p className="max-w-full truncate font-mono text-xs text-slate-500">
                {targetUrl || 'Sin URL definida'}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {PHARMACY_INFO.phone} · {PHARMACY_INFO.license}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <button
                type="button"
                onClick={handleDownloadPng}
                disabled={Boolean(qrError) || !targetUrl}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0D6E52] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#09543E] disabled:opacity-40 whitespace-nowrap"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>Descargar PNG</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadSvg}
                disabled={Boolean(qrError) || !targetUrl}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50 disabled:opacity-40 whitespace-nowrap"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>SVG</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                disabled={Boolean(qrError) || !targetUrl}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50 disabled:opacity-40 whitespace-nowrap"
              >
                <Printer className="h-4 w-4" aria-hidden="true" />
                <span>Imprimir</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
