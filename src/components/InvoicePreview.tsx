import { Invoice } from '../types';
import { getThemeColors, ColorThemeName } from '../utils/theme';

interface InvoicePreviewProps {
  invoice: Invoice;
  id?: string;
  colorTheme?: ColorThemeName;
}

export default function InvoicePreview({ invoice, id = 'invoice-pdf-capture', colorTheme }: InvoicePreviewProps) {
  const colors = getThemeColors(colorTheme);
  const {
    invoiceNumber,
    businessName,
    businessEmail,
    businessPhone,
    businessAddress,
    clientName,
    clientEmail,
    clientPhone,
    clientAddress,
    issueDate,
    dueDate,
    currency,
    taxRate,
    discountRate,
    items,
    subtotal,
    taxTotal,
    discountTotal,
    grandTotal,
    notes,
    status,
    logoUrl,
    watermarkRemoved,
    manualWatermarkOverride,
} = invoice;

  const isWatermarkShown = manualWatermarkOverride === 'show' ? true :
                            manualWatermarkOverride === 'hide' ? false :
                            !watermarkRemoved;

  return (
    <div
      id={id}
      className="relative w-full max-w-4xl mx-auto p-8 sm:p-12 bg-white text-neutral-800 shadow-md border border-neutral-100 rounded-lg selection:bg-neutral-100 overflow-hidden text-left"
      style={{ minHeight: '842px', fontFamily: '"Inter", sans-serif' }}
    >
      {/* Decorative premium color accent bar at very top */}
      <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo} z-10`} />

      {/* Styled Centered Watermark if not removed */}
      {isWatermarkShown && (
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 flex flex-col items-center justify-center p-8 opacity-[0.11] print:opacity-[0.14]" id="invoice-watermark">
          <div className="flex flex-col items-center justify-center text-center max-w-sm">
            {/* Elegant SVG for Malgave Solutions Logo */}
            <svg
              width="160"
              height="160"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-40 h-40 drop-shadow-sm select-none"
            >
              <defs>
                <linearGradient id="malgaveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d946ef" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
                <linearGradient id="ribbonGradient" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="60%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#e11d48" />
                </linearGradient>
              </defs>

              {/* Main M Outline */}
              <path
                d="M45 150 C45 80, 55 50, 75 50 C90 50, 95 80, 100 110 C105 80, 110 50, 125 50 C145 50, 155 80, 155 150"
                stroke="url(#malgaveGradient)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Left loop inner support line */}
              <path
                d="M45 150 L70 85"
                stroke="url(#malgaveGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.6"
              />

              {/* Right Capsule Segment representing the capsule with vertical "SOUTIONS" text */}
              <rect
                x="118"
                y="52"
                width="28"
                height="98"
                rx="14"
                stroke="url(#malgaveGradient)"
                strokeWidth="8"
                fill="none"
              />

              {/* Dynamic Curved/Flowing Wave Ribbon through the middle */}
              <path
                d="M35 110 C65 110, 80 140, 105 115 C130 90, 140 60, 158 85"
                stroke="url(#ribbonGradient)"
                strokeWidth="18"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.95"
              />

              {/* "SOUTIONS" styled text inside the right capsule leg */}
              <text
                x="132"
                y="105"
                fill="#ffffff"
                fontSize="11"
                fontWeight="900"
                letterSpacing="1.2"
                fontFamily="system-ui, sans-serif"
                transform="rotate(-90 132 105) translate(-36, 4)"
              >
                SOUTIONS
              </text>
            </svg>

            {/* Premium, business-friendly watermark text block */}
            <div className="mt-4 flex flex-col items-center gap-1.5">
              <span className="text-sm font-black tracking-widest text-neutral-900 font-sans uppercase">
                MALGAVE SOLUTIONS
              </span>
              <p className="text-[9.5px] text-neutral-600 font-mono font-bold tracking-normal uppercase max-w-[280px]">
                Generated with Freelancer Invoice Generator
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header Container */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6 mb-10 pb-6 border-b border-neutral-100">
        <div>
          {/* Logo & Branding Area */}
          <div className="flex items-center gap-4 mb-4">
            {logoUrl && (
              <div className="max-h-[60px] max-w-[60px] overflow-hidden flex items-center shrink-0">
                <img
                  src={logoUrl}
                  alt="Business Logo"
                  className="max-w-full max-h-[60px] object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            <span className={`font-bold uppercase tracking-tight text-neutral-950 ${logoUrl ? 'text-lg' : 'text-3xl'}`}>
              {businessName || 'Business Name'}
            </span>
          </div>

          {/* Supplier Details */}
          <div className="text-xs text-neutral-500 space-y-1 mt-2 font-sans">
            {businessName && <p className="font-semibold text-neutral-800">{businessName}</p>}
            {businessAddress && <p className="whitespace-pre-line leading-relaxed">{businessAddress}</p>}
            {businessEmail && <p>Email: {businessEmail}</p>}
            {businessPhone && <p>Phone: {businessPhone}</p>}
          </div>
        </div>

        {/* Invoice Meta and Numbers */}
        <div className="md:text-right flex flex-col justify-between font-sans">
          <div>
            <span className="inline-block px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded bg-neutral-100 text-neutral-800 font-mono mb-2">
              INVOICE
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              #{invoiceNumber || 'INV-000000'}
            </h1>
          </div>

          <div className="mt-4 grid grid-cols-2 md:block gap-4 text-xs font-medium space-y-1 text-neutral-500">
            <div>
              <span className="text-neutral-400 font-normal">Date Issued:</span>{' '}
              <span className="text-neutral-800">{issueDate || 'YYYY-MM-DD'}</span>
            </div>
            <div>
              <span className="text-neutral-400 font-normal">Due Date:</span>{' '}
              <span className="text-neutral-800 font-bold">{dueDate || 'YYYY-MM-DD'}</span>
            </div>
            <div>
              <span className="text-neutral-400 font-normal">Status:</span>{' '}
              <span
                className={`inline-block px-2 py-0.5 ml-1 rounded font-bold text-[10px] font-mono ${
                  status === 'Paid'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-250/30'
                    : status === 'Draft'
                    ? 'bg-yellow-50 text-yellow-700 border border-yellow-250/30'
                    : `${colors.badge.split('dark:')[0]} border ${colors.borderLight}`
                }`}
              >
                {status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bill To Info */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-4">
        <div>
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 font-mono">
            Billed To
          </h3>
          <div className="text-xs text-neutral-600 space-y-1">
            <p className="font-bold text-sm text-neutral-800">{clientName || 'Client Name'}</p>
            {clientAddress ? (
              <p className="whitespace-pre-line leading-relaxed font-sans">{clientAddress}</p>
            ) : (
              <p className="italic text-neutral-400">No address specified</p>
            )}
            {clientEmail && <p className="font-sans">Email: {clientEmail}</p>}
            {clientPhone && <p className="font-sans">Phone: {clientPhone}</p>}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="relative z-10 mb-8">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="border-b border-neutral-200 text-neutral-400 text-[10px] font-bold uppercase tracking-wider font-mono">
              <th className="py-2.5">Item Description</th>
              <th className="py-2.5 text-center w-16">Qty</th>
              <th className="py-2.5 text-right w-28">Rate</th>
              <th className="py-2.5 text-right w-32">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-xs">
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <tr key={item.id || index} className="text-neutral-700 font-sans">
                  <td className="py-3.5 pr-4 align-top">
                    <p className="font-semibold text-neutral-800">{item.description || 'Custom line item'}</p>
                  </td>
                  <td className="py-3.5 text-center align-top text-neutral-500 font-mono mt-0.5">
                    {item.quantity}
                  </td>
                  <td className="py-3.5 text-right align-top text-neutral-500 font-mono mt-0.5">
                    {currency}
                    {item.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 text-right font-bold align-top text-neutral-800 font-mono mt-0.5">
                    {currency}
                    {item.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-6 text-center text-neutral-400 italic">
                  No line items listed. Please add items above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Financial Summary */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6 pt-6 border-t border-neutral-200">
        {/* Payment Notes */}
        <div className="md:w-1/2">
          {notes ? (
            <div>
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1.5 font-mono">
                Memo & Notes
              </h4>
              <p className="text-xs text-neutral-500 leading-relaxed font-sans whitespace-pre-line">
                {notes}
              </p>
            </div>
          ) : null}
        </div>

        {/* Calculation Totals */}
        <div className="md:w-5/12 ml-auto">
          <div className="space-y-2 text-xs font-semibold text-neutral-600 font-sans">
            <div className="flex justify-between">
              <span className="text-neutral-400 font-normal">Subtotal</span>
              <span className="font-mono text-neutral-800">
                {currency}
                {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {discountRate > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span className="font-normal text-emerald-600">Discount ({discountRate}%)</span>
                <span className="font-mono">
                  -{currency}
                  {discountTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}

            {taxRate > 0 && (
              <div className="flex justify-between">
                <span className="text-neutral-400 font-normal">Tax ({taxRate}%)</span>
                <span className="font-mono text-neutral-800">
                  +{currency}
                  {taxTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}

            <div className="h-px bg-neutral-200 pt-2" />

            <div className="flex justify-between items-center text-sm font-bold text-neutral-900 pt-1">
              <span>Grand Total</span>
              <span className={`text-lg font-black font-mono ${colors.primaryText}`}>
                {currency}
                {grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Small Watermark Line at structural bottom of printed invoices */}
      <div className="absolute bottom-4 left-8 right-8 z-10 flex justify-between items-center text-[9px] text-neutral-400 font-sans">
        <div>
          Page 1 of 1
        </div>
        <div className="text-right">
          {isWatermarkShown ? (
            <span className="italic font-medium">Generated with Freelancer Invoice Generator</span>
          ) : (
            <span className={`font-semibold tracking-wider ${colors.primaryText}`}>Apex Premium Freelancer</span>
          )}
        </div>
      </div>
    </div>
  );
}
