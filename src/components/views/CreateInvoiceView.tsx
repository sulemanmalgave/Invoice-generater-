import React, { useState, useEffect, ChangeEvent } from 'react';
import { Invoice, InvoiceItem, UserSettings } from '../../types';
import { getThemeColors } from '../../utils/theme';
import {
  Plus,
  Trash2,
  Save,
  Download,
  Eye,
  Edit,
  Sparkles,
  Image as ImageIcon,
  HelpCircle,
  Undo2,
  Copy,
  Receipt,
  FileCheck,
  Briefcase,
  User,
  Settings,
  Share2,
  X
} from 'lucide-react';
import InvoicePreview from '../InvoicePreview';
import AdUnlockModal from '../AdUnlockModal';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Helper to patch OKLCH colors temporarily during html2canvas generation
const patchOklchStyles = () => {
  const colorCache = new Map<string, string>();

  const oklchToRgb = (oklchStr: string): string => {
    if (colorCache.has(oklchStr)) {
      return colorCache.get(oklchStr)!;
    }
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = oklchStr;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
        const rgbStr = a === 255 
          ? `rgb(${r}, ${g}, ${b})` 
          : `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3).replace(/\.?0+$/, '')})`;
        colorCache.set(oklchStr, rgbStr);
        return rgbStr;
      }
    } catch (e) {
      console.warn('[Oklch Patch] Canvas fill failed for:', oklchStr, e);
    }
    return 'rgb(0, 0, 0)';
  };

  const convertOklchText = (text: string | null | undefined): string | null | undefined => {
    if (!text || typeof text !== 'string') return text;
    if (!text.includes('oklch') && !text.includes('oklab')) return text;
    return text.replace(/(oklch|oklab)\([^)]+\)/g, (match) => {
      return oklchToRgb(match);
    });
  };

  // 1. Monkey-patch window.getComputedStyle to intercept returned values
  const originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = function (elt: Element, pseudoElt?: string) {
    const style = originalGetComputedStyle.call(this, elt, pseudoElt);
    return new Proxy(style, {
      get(target, prop, receiver) {
        if (prop === '__target__') {
          return target;
        }
        if (prop === 'getPropertyValue') {
          return function (propertyName: string) {
            const val = target.getPropertyValue(propertyName);
            return convertOklchText(val);
          };
        }
        // Use target as receiver to avoid native getter "Illegal invocation" (e.g., length, parentRule, etc.)
        const val = Reflect.get(target, prop, target);
        if (typeof val === 'function') {
          return val.bind(target);
        }
        if (typeof prop === 'string') {
          return convertOklchText(val);
        }
        return val;
      }
    }) as any;
  };

  // 2. Monkey-patch CSSStyleDeclaration prototype for inline rules/sheets
  // We unwrap "this" to its __target__ context if "this" is our Proxy, preventing "Illegal invocation" on original method calls.
  const originalGetPropertyValue = CSSStyleDeclaration.prototype.getPropertyValue;
  CSSStyleDeclaration.prototype.getPropertyValue = function (propertyName: string) {
    const context = (this && (this as any).__target__) || this;
    const val = originalGetPropertyValue.call(context, propertyName);
    return convertOklchText(val) as string;
  };

  const colorProperties = [
    'color', 'background', 'backgroundColor', 'borderColor',
    'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
    'border', 'borderTop', 'borderRight', 'borderBottom', 'borderLeft',
    'outline', 'outlineColor', 'boxShadow', 'textShadow', 'fill', 'stroke',
    'columnRuleColor', 'columnRule', 'textDecoration', 'textDecorationColor',
    'caretColor', 'accentColor', 'stopColor', 'floodColor', 'lightingColor'
  ];

  const originalDescriptors: Record<string, PropertyDescriptor> = {};

  colorProperties.forEach(prop => {
    const desc = Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype, prop);
    if (desc && desc.get) {
      originalDescriptors[prop] = desc;
      Object.defineProperty(CSSStyleDeclaration.prototype, prop, {
        get() {
          const context = (this && (this as any).__target__) || this;
          const val = desc.get!.call(context);
          return convertOklchText(val);
        },
        set(val) {
          const context = (this && (this as any).__target__) || this;
          if (desc.set) {
            desc.set.call(context, val);
          }
        },
        configurable: true,
        enumerable: true
      });
    }
  });

  // 3. Monkey-patch cssText on CSSRule prototype
  const originalCssTextDescriptor = Object.getOwnPropertyDescriptor(CSSRule.prototype, 'cssText');
  let restoreCssText = () => {};
  if (originalCssTextDescriptor && originalCssTextDescriptor.get) {
    Object.defineProperty(CSSRule.prototype, 'cssText', {
      get() {
        const context = (this && (this as any).__target__) || this;
        const val = originalCssTextDescriptor.get!.call(context);
        return convertOklchText(val);
      },
      set(val) {
        if (originalCssTextDescriptor.set) {
          const context = (this && (this as any).__target__) || this;
          originalCssTextDescriptor.set.call(context, val);
        }
      },
      configurable: true,
      enumerable: true
    });
    restoreCssText = () => {
      Object.defineProperty(CSSRule.prototype, 'cssText', originalCssTextDescriptor);
    };
  }

  // 4. Monkey-patch cssText on CSSStyleDeclaration prototype
  const originalStyleCssTextDescriptor = Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype, 'cssText');
  let restoreStyleCssText = () => {};
  if (originalStyleCssTextDescriptor && originalStyleCssTextDescriptor.get) {
    Object.defineProperty(CSSStyleDeclaration.prototype, 'cssText', {
      get() {
        const context = (this && (this as any).__target__) || this;
        const val = originalStyleCssTextDescriptor.get!.call(context);
        return convertOklchText(val);
      },
      set(val) {
        if (originalStyleCssTextDescriptor.set) {
          const context = (this && (this as any).__target__) || this;
          originalStyleCssTextDescriptor.set.call(context, val);
        }
      },
      configurable: true,
      enumerable: true
    });
    restoreStyleCssText = () => {
      Object.defineProperty(CSSStyleDeclaration.prototype, 'cssText', originalStyleCssTextDescriptor);
    };
  }

  // 5. Monkey-patch textContent on Node.prototype to handle <style> contents fetched by html2canvas
  const originalTextContentDescriptor = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');
  let restoreTextContent = () => {};
  if (originalTextContentDescriptor && originalTextContentDescriptor.get) {
    Object.defineProperty(Node.prototype, 'textContent', {
      get() {
        const val = originalTextContentDescriptor.get!.call(this);
        if (this instanceof HTMLStyleElement) {
          return convertOklchText(val);
        }
        return val;
      },
      set(val) {
        if (originalTextContentDescriptor.set) {
          originalTextContentDescriptor.set.call(this, val);
        }
      },
      configurable: true,
      enumerable: true
    });
    restoreTextContent = () => {
      Object.defineProperty(Node.prototype, 'textContent', originalTextContentDescriptor);
    };
  }

  // 6. Monkey-patch innerHTML on Element.prototype to handle <style> contents inside elements
  const originalInnerHTMLDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
  let restoreInnerHTML = () => {};
  if (originalInnerHTMLDescriptor && originalInnerHTMLDescriptor.get) {
    Object.defineProperty(Element.prototype, 'innerHTML', {
      get() {
        const val = originalInnerHTMLDescriptor.get!.call(this);
        if (this instanceof HTMLStyleElement) {
          return convertOklchText(val);
        }
        return val;
      },
      set(val) {
        if (originalInnerHTMLDescriptor.set) {
          originalInnerHTMLDescriptor.set.call(this, val);
        }
      },
      configurable: true,
      enumerable: true
    });
    restoreInnerHTML = () => {
      Object.defineProperty(Element.prototype, 'innerHTML', originalInnerHTMLDescriptor);
    };
  }

  return () => {
    window.getComputedStyle = originalGetComputedStyle;
    CSSStyleDeclaration.prototype.getPropertyValue = originalGetPropertyValue;
    Object.keys(originalDescriptors).forEach(prop => {
      Object.defineProperty(CSSStyleDeclaration.prototype, prop, originalDescriptors[prop]);
    });
    restoreCssText();
    restoreStyleCssText();
    restoreTextContent();
    restoreInnerHTML();
  };
};

interface CreateInvoiceViewProps {
  initialInvoice?: Invoice | null;
  savedSettings: UserSettings;
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
  onUpdateSettings?: (settings: UserSettings) => void;
}

export default function CreateInvoiceView({
  initialInvoice,
  savedSettings,
  onSave,
  onCancel,
  onUpdateSettings,
}: CreateInvoiceViewProps) {
  const colors = getThemeColors(savedSettings.colorTheme);
  // Setup local invoice form state
  const [invoice, setInvoice] = useState<Invoice>(() => {
    if (initialInvoice) {
      return { 
        ...initialInvoice,
        logoUnlocked: initialInvoice.logoUnlocked || false,
        watermarkRemoved: initialInvoice.watermarkRemoved || false,
      };
    }

    const defaultId = `inv-${Math.floor(Date.now() / 1000)}`;
    const randomNum = Math.floor(100 + Math.random() * 900);
    const invoiceNum = `INV-${new Date().getFullYear()}-${randomNum}`;
    const today = new Date().toISOString().split('T')[0];
    const targetDue = new Date();
    targetDue.setDate(targetDue.getDate() + 14);
    const dueDateStr = targetDue.toISOString().split('T')[0];

    return {
      id: defaultId,
      invoiceNumber: invoiceNum,
      businessName: savedSettings.businessName || '',
      businessEmail: savedSettings.businessEmail || '',
      businessPhone: savedSettings.businessPhone || '',
      businessAddress: savedSettings.businessAddress || '',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      clientAddress: '',
      issueDate: today,
      dueDate: dueDateStr,
      currency: savedSettings.defaultCurrency || '$',
      taxRate: savedSettings.defaultTaxRate ?? 0,
      discountRate: savedSettings.defaultDiscountRate ?? 0,
      items: [
        { id: 'itm-1', description: 'Consulting Services', quantity: 1, rate: 150, total: 150 }
      ],
      subtotal: 150,
      taxTotal: 0,
      discountTotal: 0,
      grandTotal: 150,
      notes: savedSettings.defaultNotes || '',
      isDraft: true,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      logoUrl: undefined,
      watermarkRemoved: false,
      manualWatermarkOverride: 'auto',
      logoUnlocked: false,
    };
  });

  // Track active mode on mobile screens (edit versus preview)
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadedWithWatermark, setDownloadedWithWatermark] = useState(false);

  // States for interactive Ad mock modal
  const [adModalOpen, setAdModalOpen] = useState(false);
  const [adTriggerIntent, setAdTriggerIntent] = useState<'watermark' | 'logo'>('watermark');

  // Collapsible cards and premium mobile layout state
  const [isCompanyOpen, setIsCompanyOpen] = useState(true);
  const [isClientOpen, setIsClientOpen] = useState(true);
  const [showCompanyAdvanced, setShowCompanyAdvanced] = useState(false);
  const [showClientAdvanced, setShowClientAdvanced] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [shareToastVisible, setShareToastVisible] = useState(false);

  // Load custom settings defaults when initializing if requested
  const handleApplyDefaults = () => {
    setInvoice(prev => ({
      ...prev,
      businessName: savedSettings.businessName,
      businessEmail: savedSettings.businessEmail,
      businessPhone: savedSettings.businessPhone,
      businessAddress: savedSettings.businessAddress,
      currency: savedSettings.defaultCurrency,
      taxRate: savedSettings.defaultTaxRate,
      discountRate: savedSettings.defaultDiscountRate,
      notes: savedSettings.defaultNotes,
      logoUrl: savedSettings.logoUrl || prev.logoUrl, // Fix: preserve logoUrl
    }));
  };

  // Recalculating invoice totals dynamically
  useEffect(() => {
    const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const discountTotal = (subtotal * invoice.discountRate) / 100;
    const subtotalAfterDiscount = subtotal - discountTotal;
    const taxTotal = (subtotalAfterDiscount * invoice.taxRate) / 100;
    const grandTotal = subtotalAfterDiscount + taxTotal;

    const needsItemTotalUpdate = invoice.items.some(it => it.total !== it.quantity * it.rate);

    if (
      subtotal !== invoice.subtotal ||
      discountTotal !== invoice.discountTotal ||
      taxTotal !== invoice.taxTotal ||
      grandTotal !== invoice.grandTotal ||
      needsItemTotalUpdate
    ) {
      setInvoice(prev => {
        const updatedItems = needsItemTotalUpdate
          ? prev.items.map(it => (it.total !== it.quantity * it.rate ? { ...it, total: it.quantity * it.rate } : it))
          : prev.items;

        return {
          ...prev,
          items: updatedItems,
          subtotal,
          discountTotal,
          taxTotal,
          grandTotal,
        };
      });
    }
  }, [
    invoice.items,
    invoice.taxRate,
    invoice.discountRate,
    invoice.subtotal,
    invoice.discountTotal,
    invoice.taxTotal,
    invoice.grandTotal
  ]);

  // Form Field Changers
  const handleMetaChange = (field: keyof Invoice, value: any) => {
    setInvoice(prev => ({ ...prev, [field]: value }));
  };

  // Status toggle handler
  const handleStatusToggle = () => {
    const nextStatus = invoice.status === 'Draft' ? 'Pending' : invoice.status === 'Pending' ? 'Paid' : 'Draft';
    setInvoice(prev => ({
      ...prev,
      status: nextStatus,
      isDraft: nextStatus === 'Draft',
    }));
  };

  // Item List Handlers
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `itm-${Date.now()}`,
      description: '',
      quantity: 1,
      rate: 0,
      total: 0,
    };
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoice(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            const qty = field === 'quantity' ? Number(value) : item.quantity;
            const rt = field === 'rate' ? Number(value) : item.rate;
            updated.total = qty * rt;
          }
          return updated;
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
  };

  const handleDeleteItem = (id: string) => {
    if (invoice.items.length <= 1) {
      alert('Your invoice must contain at least one line item.');
      return;
    }
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  };

  // Ad triggers
  const handleTriggerWatermarkAd = () => {
    setAdTriggerIntent('watermark');
    setAdModalOpen(true);
  };

  const handleTriggerLogoAd = () => {
    setAdTriggerIntent('logo');
    setAdModalOpen(true);
  };

  const handleAdFinishedUnlock = () => {
    setInvoice(prev => ({
      ...prev,
      watermarkRemoved: true,
      logoUnlocked: true,
    }));
    
    // If the trigger was watermark, immediately trigger PDF download as a clean, watermark-free copy
    if (adTriggerIntent === 'watermark') {
      setTimeout(() => {
        handleDownloadPdfFile(false);
      }, 300);
    }
  };

  // Logo file upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError(null);
    if (!invoice.logoUnlocked) {
      setLogoError('Please watch the rewarded ad to unlock the logo upload feature.');
      e.target.value = '';
      return;
    }
    const file = e.target.files?.[0];
    console.log('Logo file selected:', file);
    if (!file) return;

    // Validate size (1 MB limit = 1048576 bytes)
    if (file.size > 1024 * 1024) {
      setLogoError('Image exceeds the 1 MB limit. Please select a smaller logo.');
      e.target.value = '';
      return;
    }

    // Validate format (PNG, JPG, JPEG only)
    const validExtensions = ['png', 'jpg', 'jpeg'];
    const validMimes = ['image/png', 'image/jpeg', 'image/jpg', 'image/pjpeg'];
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    const fileType = file.type?.toLowerCase() || '';

    if (!validExtensions.includes(fileExt) && !validMimes.includes(fileType)) {
      setLogoError('Unsupported format. Please select a PNG or JPG/JPEG image.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      console.log('Logo file read successfully:', typeof reader.result);
      if (typeof reader.result === 'string') {
        const logoData = reader.result;
        setInvoice(prev => ({
          ...prev,
          logoUrl: logoData,
        }));
        onUpdateSettings?.({
          ...savedSettings,
          logoUrl: logoData,
        });
      } else {
        setLogoError('Failed to decode the chosen image file.');
      }
    };
    reader.onerror = () => {
      setLogoError('An error occurred while reading the image.');
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input to allow re-upload
  };

  const handleRemoveUploadedLogo = () => {
    setInvoice(prev => {
      const copy = { ...prev };
      delete copy.logoUrl;
      return copy;
    });
    const updatedSettings = { ...savedSettings };
    delete updatedSettings.logoUrl;
    onUpdateSettings?.(updatedSettings);
  };

  // Core PDF builder
  const handleDownloadPdfFile = async (forcedWatermark: boolean) => {
    setIsGeneratingPdf(true);

    // Save temporary backup value
    const originalWatermarkState = invoice.watermarkRemoved;
    let restoreOklchStyle: (() => void) | null = null;

    try {
      if (forcedWatermark) {
        // Enforce watermark insertion
        setInvoice(prev => ({ ...prev, watermarkRemoved: false }));
        setDownloadedWithWatermark(true);
      } else {
        // Render exactly according to state (unlocked)
        setInvoice(prev => ({ ...prev, watermarkRemoved: originalWatermarkState }));
        if (!originalWatermarkState) {
          setDownloadedWithWatermark(true);
        }
      }

      // Small tick delay to let DOM re-render watermark change
      await new Promise(resolve => setTimeout(resolve, 250));

      const captureElement = document.getElementById('invoice-pdf-capture-view');
      if (!captureElement) {
        throw new Error('Capture component element was not found in page DOM.');
      }

      // Activate OKLCH color translation monkey patches
      restoreOklchStyle = patchOklchStyles();

      // 1. Create a container offscreen
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      container.style.width = '100vw';
      container.style.height = '100vh';
      container.style.overflow = 'hidden';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '-9999';

      // 2. Clone the node to avoid modifying the visual screen element
      const clone = captureElement.cloneNode(true) as HTMLElement;

      // 3. Clean up style/layout properties for raw pixel-perfect A4 ratio capturing
      clone.style.width = '800px';
      clone.style.minHeight = '1130px';
      clone.style.transform = 'none';
      clone.style.scale = 'none';
      clone.style.margin = '0 auto';
      clone.style.boxShadow = 'none';
      clone.style.border = 'none';
      clone.style.borderRadius = '0';
      clone.style.display = 'block';

      container.appendChild(clone);
      document.body.appendChild(container);

      // Wait a frame for layout parsing
      await new Promise(resolve => requestAnimationFrame(resolve));

      // 4. Capture screenshot using html2canvas (allowTaint: false prevents security/DOM dirty taint crash)
      const canvas = await html2canvas(clone, {
        scale: 2, // High resolution Retinal layout output
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // 5. Cleanup offscreen elements
      document.body.removeChild(container);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      });

      // Scale to fit a4 perfectly
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const width = imgWidth * ratio;
      const height = imgHeight * ratio;
      
      // Center on page
      const x = (pdfWidth - width) / 2;
      const y = 8; // small margin from top

      pdf.addImage(imgData, 'PNG', x, y, width, height);
      pdf.save(`Invoice-${invoice.invoiceNumber || 'draft'}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Error rendering PDF. Please try again.');
    } finally {
      // Revert style monkey patches to prevent any runtime overhead
      if (restoreOklchStyle) {
        restoreOklchStyle();
      }
      // Revert display back to user preference
      setInvoice(prev => ({ ...prev, watermarkRemoved: originalWatermarkState }));
      setIsGeneratingPdf(false);
    }
  };

  const handleShareInvoice = () => {
    try {
      const shareText = `Invoice Draft #${invoice.invoiceNumber || 'NEW'} - Total: ${invoice.currency}${invoice.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      const shareUrl = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: `Invoice #${invoice.invoiceNumber || 'NEW'}`,
          text: shareText,
          url: shareUrl,
        }).catch(err => console.debug('Web share aborted', err));
      } else {
        navigator.clipboard.writeText(`${shareText}\nLink: ${shareUrl}`);
        setShareToastVisible(true);
        setTimeout(() => setShareToastVisible(false), 3000);
      }
    } catch (e) {
      console.warn('Share handler failed', e);
    }
  };

  // Core save handler
  const handleSaveInvoice = () => {
    if (!invoice.invoiceNumber) {
      alert('Please fill out an Invoice Number.');
      return;
    }
    if (!invoice.businessName) {
      alert('Please include your Business Name.');
      return;
    }
    if (!invoice.clientName) {
      alert('Please specify the Client Name.');
      return;
    }

    onSave({
      ...invoice,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-4 pb-24 relative select-none">
      {/* Toast Notification for sharing */}
      {shareToastVisible && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-neutral-900/95 dark:bg-neutral-850/95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg border border-neutral-700/50 backdrop-blur-md flex items-center gap-2 animate-bounce">
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span>Draft invoice details copied to clipboard!</span>
        </div>
      )}

      {/* Header controls bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-neutral-200/30 dark:border-neutral-800/40 p-3 rounded-2xl shadow-xs hover:bg-white/70 dark:hover:bg-neutral-900/45 duration-200">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onCancel}
            className="p-1.5 border border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-900/30 rounded-lg hover:bg-white/80 dark:hover:bg-neutral-800/60 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 transition duration-150 cursor-pointer text-xs"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold text-neutral-900 dark:text-white leading-tight">
              {initialInvoice ? `Edit Invoice #${invoice.invoiceNumber}` : 'Create New Invoice'}
            </h1>
            <p className="text-[10px] text-neutral-600 dark:text-neutral-300 mt-0.5">
              Premium UI • Fast Mobile Drafting
            </p>
          </div>
        </div>

        {/* Buttons to change split screens on desktop/mobile */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mobile view selector */}
          <div className="flex md:hidden bg-neutral-200/40 dark:bg-neutral-800/40 p-0.5 rounded-lg backdrop-blur-sm">
            <button
              onClick={() => setMobileTab('edit')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition ${
                mobileTab === 'edit'
                  ? `${colors.primary} text-white font-bold shadow-xs`
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              <Edit className="w-3 h-3" />
              <span>Edit Form</span>
            </button>
            <button
              onClick={() => setMobileTab('preview')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition ${
                mobileTab === 'preview'
                  ? `${colors.primary} text-white font-bold shadow-xs`
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Preview</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleApplyDefaults}
            className="px-2.5 py-1.5 text-[11px] font-bold text-neutral-600 dark:text-neutral-300 bg-white/40 dark:bg-neutral-800/40 hover:bg-white/80 dark:hover:bg-neutral-750 rounded-lg border border-neutral-200/30 dark:border-neutral-700 transition cursor-pointer backdrop-blur-xs"
          >
            Apply Defaults
          </button>

          <button
            type="button"
            onClick={handleSaveInvoice}
            className={`inline-flex items-center gap-1 px-3 py-1.5 ${colors.primary} ${colors.primaryHover} text-white text-[11px] font-bold rounded-lg shadow-sm transition cursor-pointer`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Invoice</span>
          </button>
        </div>
      </div>

      {/* Main split display layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* EDIT SIDE */}
        <div
          className={`lg:col-span-6 space-y-4 ${
            mobileTab === 'edit' ? 'block' : 'hidden lg:block'
          }`}
        >
                  {/* Card 1: Your Business Particulars */}
          <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-neutral-200/30 dark:border-neutral-800/40 rounded-2xl p-4 space-y-4 shadow-xs duration-200">
            <button
              type="button"
              onClick={() => setIsCompanyOpen(!isCompanyOpen)}
              className="w-full flex items-center justify-between font-extrabold text-neutral-800 dark:text-neutral-200 text-xs pb-1"
            >
              <div className="flex items-center gap-2">
                <span className={`p-0.5 px-1.5 rounded ${colors.bgLight} ${colors.bgLightDark} ${colors.primaryText} ${colors.primaryTextDark} font-mono text-[9px]`}>01</span>
                <span>Your Business Particulars</span>
              </div>
              <span className="text-neutral-600 dark:text-neutral-300 font-normal text-[10px] flex items-center gap-1">
                {isCompanyOpen ? 'Collapse' : 'Expand'}
                <svg className={`w-3.5 h-3.5 transform transition-transform duration-200 ${isCompanyOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            {isCompanyOpen && (
              <div className="space-y-3 pt-1 border-t border-neutral-200/10 dark:border-neutral-800/20">
                {/* Logo and business name row */}
                <div className="grid grid-cols-12 gap-3 items-center bg-neutral-50/50 dark:bg-neutral-950/20 p-2.5 rounded-xl border border-neutral-200/10 dark:border-neutral-800/10">
                  <div className="col-span-4 sm:col-span-3 flex flex-col items-center justify-center">
                    <div className="relative w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shrink-0 overflow-hidden group shadow-xs">
                      {invoice.logoUrl ? (
                        <>
                          <img
                            src={invoice.logoUrl}
                            alt="Company Logo Preview"
                            className="w-full h-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveUploadedLogo}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150 cursor-pointer"
                            title="Delete Logo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <label
                          htmlFor={invoice.logoUnlocked ? "logo-upload" : undefined}
                          onClick={(e) => {
                            if (!invoice.logoUnlocked) {
                              e.preventDefault();
                              handleTriggerLogoAd();
                            }
                          }}
                          className="cursor-pointer w-full h-full flex items-center justify-center text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                          title={invoice.logoUnlocked ? "Click to upload business logo" : "Watch Ad to Unlock Logo Upload"}
                        >
                          <ImageIcon className="w-5 h-5 text-neutral-400" />
                        </label>
                      )}
                      
                      {invoice.logoUnlocked && (
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={handleLogoUpload}
                          className="sr-only"
                        />
                      )}
                    </div>
                    <span className="text-[8px] text-neutral-400 dark:text-neutral-500 mt-1 font-medium text-center">
                      Max 1 MB
                    </span>
                  </div>

                  <div className="col-span-8 sm:col-span-9 space-y-1.5">
                    <div>
                      <label className="block text-[9px] font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-0.5">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={invoice.businessName || ''}
                        onChange={e => handleMetaChange('businessName', e.target.value)}
                        placeholder="Apex Digital Studio"
                        className={`w-full px-2.5 py-1.5 border rounded-lg border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} placeholder-neutral-500 dark:placeholder-neutral-500 focus:outline-none`}
                      />
                    </div>
                    
                  {invoice.logoUnlocked || invoice.watermarkRemoved ? (
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250/20 dark:border-emerald-900/40 animate-fade-in">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Premium features unlocked for this invoice.</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleTriggerLogoAd}
                        type="button"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${colors.bgLight} ${colors.bgLightDark} ${colors.primaryText} ${colors.primaryTextDark} hover:bg-neutral-100 dark:hover:bg-neutral-800 font-extrabold text-[10px] rounded-lg border border-neutral-200/50 dark:border-neutral-800/50 transition cursor-pointer shadow-xs`}
                      >
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span>Watch Ad to Unlock Logo Upload</span>
                      </button>
                    )}
                  </div>

                  {logoError && (
                    <div className="col-span-12 text-[10px] text-red-500 dark:text-red-400 font-medium px-1 flex items-center gap-1 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      {logoError}
                    </div>
                  )}
                </div>

                {/* Show Advanced toggle inside card */}
                <div className="pt-0.5 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowCompanyAdvanced(!showCompanyAdvanced)}
                    className="text-[10px] font-bold text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1 py-0.5 px-2 rounded-lg hover:bg-neutral-150 dark:hover:bg-neutral-800 transition"
                  >
                    <span>{showCompanyAdvanced ? 'Hide Business Contact Details' : 'Show Contact & Address defaults'}</span>
                    <svg className={`w-3 h-3 transform transition-transform ${showCompanyAdvanced ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {showCompanyAdvanced && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-neutral-200/10 dark:border-neutral-800/20">
                    <div>
                      <label className="block text-[9px] font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-widest mb-1">
                        Business Email
                      </label>
                      <input
                        type="email"
                        value={invoice.businessEmail || ''}
                        onChange={e => handleMetaChange('businessEmail', e.target.value)}
                        placeholder="hello@apexdigital.com"
                        className={`w-full px-2.5 py-1.5 border rounded-lg border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} focus:outline-none placeholder-neutral-500 dark:placeholder-neutral-500`}
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-widest mb-1">
                        Business Phone
                      </label>
                      <input
                        type="text"
                        value={invoice.businessPhone || ''}
                        onChange={e => handleMetaChange('businessPhone', e.target.value)}
                        placeholder="+1 (555) 342-9980"
                        className={`w-full px-2.5 py-1.5 border rounded-lg border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} focus:outline-none placeholder-neutral-500 dark:placeholder-neutral-500`}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-1">
                        Business Address Details
                      </label>
                      <textarea
                        value={invoice.businessAddress || ''}
                        onChange={e => handleMetaChange('businessAddress', e.target.value)}
                        rows={2}
                        placeholder="Suite 400, 150 Spectrum Rd..."
                        className={`w-full px-2.5 py-1.5 border rounded-lg border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} focus:outline-none placeholder-neutral-400`}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Card 2: Client & Document Particulars */}
          <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-neutral-200/30 dark:border-neutral-800/40 rounded-2xl p-4 space-y-4 shadow-xs duration-200">
            <button
              type="button"
              onClick={() => setIsClientOpen(!isClientOpen)}
              className="w-full flex items-center justify-between font-extrabold text-neutral-800 dark:text-neutral-200 text-xs pb-1"
            >
              <div className="flex items-center gap-2">
                <span className={`p-0.5 px-1.5 rounded ${colors.bgLight} ${colors.bgLightDark} ${colors.primaryText} ${colors.primaryTextDark} font-mono text-[9px]`}>02</span>
                <span>Client & Document Particulars</span>
              </div>
              <span className="text-neutral-600 dark:text-neutral-300 font-normal text-[10px] flex items-center gap-1">
                {isClientOpen ? 'Collapse' : 'Expand'}
                <svg className={`w-3.5 h-3.5 transform transition-transform duration-200 ${isClientOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>

            {isClientOpen && (
              <div className="space-y-3 pt-1 border-t border-neutral-200/10 dark:border-neutral-800/20">
                {/* Single Row: Invoice Number, Invoice Date, Due Date */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-1 text-ellipsis overflow-hidden whitespace-nowrap">
                      Invoice #
                    </label>
                    <input
                      type="text"
                      required
                      value={invoice.invoiceNumber || ''}
                      onChange={e => handleMetaChange('invoiceNumber', e.target.value)}
                      placeholder="INV-001"
                      className={`w-full px-2 py-1.5 border rounded-lg border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} font-mono focus:outline-none`}
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-1 text-ellipsis overflow-hidden whitespace-nowrap">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      value={invoice.issueDate || ''}
                      onChange={e => handleMetaChange('issueDate', e.target.value)}
                      className={`w-full px-1.5 py-1.5 border rounded-lg border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} focus:outline-none`}
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-1 text-ellipsis overflow-hidden whitespace-nowrap">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={invoice.dueDate || ''}
                      onChange={e => handleMetaChange('dueDate', e.target.value)}
                      className={`w-full px-1.5 py-1.5 border rounded-lg border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} focus:outline-none`}
                    />
                  </div>
                </div>

                {/* Client Name */}
                <div>
                  <label className="block text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={invoice.clientName || ''}
                    onChange={e => handleMetaChange('clientName', e.target.value)}
                    placeholder="Acme Corporation Inc."
                    className={`w-full px-2.5 py-1.5 border rounded-lg border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} placeholder-neutral-500 dark:placeholder-neutral-500 focus:outline-none`}
                  />
                </div>

                {/* Show Advanced Client details toggle */}
                <div className="pt-0.5 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowClientAdvanced(!showClientAdvanced)}
                    className="text-[10px] font-bold text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1 py-0.5 px-2 rounded-lg hover:bg-neutral-150 dark:hover:bg-neutral-800 transition"
                  >
                    <span>{showClientAdvanced ? 'Hide Client Location/Settings' : 'Show Advanced Client details'}</span>
                    <svg className={`w-3.5 h-3.5 transform transition-transform ${showClientAdvanced ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {showClientAdvanced && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-neutral-200/10 dark:border-neutral-800/20">
                    <div>
                      <label className="block text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                        Client Email
                      </label>
                      <input
                        type="email"
                        value={invoice.clientEmail || ''}
                        onChange={e => handleMetaChange('clientEmail', e.target.value)}
                        placeholder="billing@acme.com"
                        className={`w-full px-2.5 py-1.5 border rounded-lg border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} focus:outline-none placeholder-neutral-400`}
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                        Client Status
                      </label>
                      <button
                        type="button"
                        onClick={handleStatusToggle}
                        className={`w-full py-1.5 px-2.5 border rounded-lg text-xs font-mono font-bold flex justify-between items-center transition ${
                          invoice.status === 'Paid'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400'
                            : invoice.status === 'Pending'
                            ? `${colors.badge} border-neutral-200 dark:border-neutral-800/60`
                            : 'bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300'
                        }`}
                      >
                        <span>{invoice.status.toUpperCase()}</span>
                        <span className="text-[9px] font-normal text-neutral-400 dark:text-neutral-500">(Toggle)</span>
                      </button>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
                        Client Address Details
                      </label>
                      <textarea
                        value={invoice.clientAddress || ''}
                        onChange={e => handleMetaChange('clientAddress', e.target.value)}
                        rows={2}
                        placeholder="432 Enterprise Way..."
                        className={`w-full px-2.5 py-1 border rounded-lg border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} focus:outline-none placeholder-neutral-400`}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 3: Line items detail list */}
          <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-neutral-200/30 dark:border-neutral-800/40 rounded-2xl p-4 space-y-3.5 shadow-xs duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-200/10 dark:border-neutral-800/20">
              <h3 className="font-extrabold text-neutral-800 dark:text-neutral-200 text-xs flex items-center gap-2">
                <span className={`p-0.5 px-1.5 rounded ${colors.bgLight} ${colors.bgLightDark} ${colors.primaryText} ${colors.primaryTextDark} font-mono text-[9px]`}>03</span>
                <span>Work Itemization Table</span>
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className={`inline-flex items-center gap-1 text-[10px] font-bold ${colors.primaryText} ${colors.primaryTextDark} hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2 py-1 rounded-lg transition cursor-pointer`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item Line</span>
              </button>
            </div>

            {/* Compact invoice items spreadsheet style table */}
            <div className="overflow-x-auto border border-neutral-200/30 dark:border-neutral-800/30 rounded-xl bg-white/10 dark:bg-neutral-950/15">
              <table className="w-full text-left border-collapse table-auto text-xs min-w-[450px]">
                <thead>
                  <tr className="border-b border-neutral-200/20 dark:border-neutral-800/40 bg-neutral-100/45 dark:bg-neutral-950/40 text-neutral-400 font-bold uppercase tracking-wider text-[9px] font-mono select-none">
                    <th className="py-2 px-3 text-left w-5/12">Item Description</th>
                    <th className="py-2 px-3 text-center w-2/12">Qty</th>
                    <th className="py-2 px-3 text-right w-2/12">Price ({invoice.currency})</th>
                    <th className="py-2 px-3 text-right w-2/12">Amount</th>
                    <th className="py-2 px-2 text-center w-1/12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-250/10 dark:divide-neutral-800/20 text-neutral-800 dark:text-neutral-200">
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/10 transition">
                      <td className="py-1 px-2">
                        <input
                          type="text"
                          required
                          value={item.description || ''}
                          onChange={e => handleUpdateItem(item.id, 'description', e.target.value)}
                          placeholder="Consulting Services"
                          className={`w-full px-2 py-1 border rounded border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} focus:outline-none placeholder-neutral-400`}
                        />
                      </td>
                      <td className="py-1 px-2">
                        <input
                          type="number"
                          min="1"
                          step="any"
                          required
                          value={item.quantity}
                          onChange={e => handleUpdateItem(item.id, 'quantity', e.target.value)}
                          className={`w-full px-1.5 py-1 border rounded border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs text-center font-mono focus:ring-1 ${colors.focusRing} focus:outline-none`}
                        />
                      </td>
                      <td className="py-1 px-2">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          required
                          value={item.rate}
                          onChange={e => handleUpdateItem(item.id, 'rate', e.target.value)}
                          className={`w-full px-1.5 py-1 border rounded border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs text-right font-mono focus:ring-1 ${colors.focusRing} focus:outline-none`}
                        />
                      </td>
                      <td className="py-1 px-2 text-right font-mono text-xs pr-4 text-neutral-700 dark:text-neutral-300">
                        {invoice.currency}
                        {(item.quantity * item.rate).toLocaleString('en', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-1 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1 rounded text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition cursor-pointer"
                          title="Delete line item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Always visible Add Item line button */}
            <button
              type="button"
              onClick={handleAddItem}
              className={`w-full py-1.5 border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/15 hover:bg-neutral-100 dark:hover:bg-neutral-900/30 hover:border-neutral-300 dark:hover:border-neutral-750 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Deliverable Line Item</span>
            </button>
          </div>

          {/* Section 4: Collapse Card 4 (Financial inputs & totals) */}
          <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-neutral-200/30 dark:border-neutral-800/40 rounded-2xl p-4 space-y-4 shadow-xs duration-200">
            <div className="flex items-center gap-2 pb-1 border-b border-neutral-200/10 dark:border-neutral-800/40">
              <span className={`p-0.5 px-1.5 rounded ${colors.bgLight} ${colors.bgLightDark} ${colors.primaryText} ${colors.primaryTextDark} font-mono text-[9px]`}>04</span>
              <span className="font-extrabold text-neutral-800 dark:text-neutral-200 text-xs">Financial Adjustments & Notes</span>
            </div>

            {/* Single row for Tax, Discount, and Currency fields */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-tight mb-1 text-ellipsis overflow-hidden whitespace-nowrap">
                  Tax (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={invoice.taxRate}
                  onChange={e => handleMetaChange('taxRate', Number(e.target.value))}
                  placeholder="10"
                  className={`w-full px-2 py-1.5 border rounded-lg border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} font-mono focus:outline-none`}
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-tight mb-1 text-ellipsis overflow-hidden whitespace-nowrap">
                  Discount (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={invoice.discountRate}
                  onChange={e => handleMetaChange('discountRate', Number(e.target.value))}
                  placeholder="0"
                  className={`w-full px-2 py-1.5 border rounded-lg border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} font-mono focus:outline-none`}
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-tight mb-1 text-ellipsis overflow-hidden whitespace-nowrap">
                  Currency
                </label>
                <select
                  value={invoice.currency}
                  onChange={e => handleMetaChange('currency', e.target.value)}
                  className={`w-full px-2 py-1.5 border rounded-lg border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} focus:outline-none cursor-pointer`}
                >
                  <option value="$">($) USD</option>
                  <option value="€">(€) EUR</option>
                  <option value="£">(£) GBP</option>
                  <option value="₹">(₹) INR</option>
                  <option value="¥">(¥) JPY</option>
                  <option value="C$">(C$) CAD</option>
                  <option value="A$">(A$) AUD</option>
                </select>
              </div>
            </div>

            {/* Show Subtotal, Tax, Discount, and Grand Total inside one compact summary card */}
            <div className="p-3 rounded-xl bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-neutral-200/30 dark:border-neutral-800/40 text-[11px] text-neutral-800 dark:text-neutral-300 font-medium space-y-1 shadow-sm font-sans">
              <div className="flex justify-between items-center text-neutral-500 dark:text-neutral-400 text-[9px] font-bold uppercase tracking-wider pb-1.5 border-b border-neutral-200/30 dark:border-neutral-800/60 mb-1">
                <span>Calculation Summary</span>
                <span className="font-mono text-neutral-400 dark:text-neutral-500">Live</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-neutral-500 dark:text-neutral-400">Subtotal</span>
                <span className="font-mono text-neutral-900 dark:text-white font-bold">
                  {invoice.currency}
                  {invoice.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {invoice.discountRate > 0 && (
                <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Discount ({invoice.discountRate}%)</span>
                  <span className="font-mono">
                    -{invoice.currency}
                    {invoice.discountTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              {invoice.taxRate > 0 && (
                <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                  <span>Tax ({invoice.taxRate}%)</span>
                  <span className="font-mono text-neutral-900 dark:text-white font-bold">
                    +{invoice.currency}
                    {invoice.taxTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div className="h-px bg-neutral-200/50 dark:bg-neutral-800/50 my-1.5" />

              <div className="flex justify-between items-center text-xs font-bold text-neutral-900 dark:text-white">
                <span>Grand Total</span>
                <span className={`text-sm font-black font-mono ${colors.primaryText}`}>
                  {invoice.currency}
                  {invoice.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Notes and Terms collapsible & collapsed by default */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => setIsNotesOpen(!isNotesOpen)}
                className="w-full flex items-center justify-between text-[10px] font-extrabold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 py-1 px-2 rounded-lg border border-neutral-200/10 dark:border-neutral-800/20 bg-neutral-50/50 dark:bg-neutral-950/20 transition cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Receipt className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Memo & Terms (Collapsed)</span>
                </span>
                <span className="text-[9px] font-normal text-neutral-400 font-bold">
                  {isNotesOpen ? 'Hide notes' : 'Add details'}
                </span>
              </button>

              {isNotesOpen && (
                <div className="pt-2 animate-fade-in">
                  <textarea
                    value={invoice.notes || ''}
                    onChange={e => handleMetaChange('notes', e.target.value)}
                    rows={2}
                    placeholder="e.g. Bank wire transfer details, payment guidelines..."
                    className={`w-full px-2.5 py-1.5 border rounded-lg border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} focus:outline-none placeholder-neutral-400`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PREVIEW & SUMMARY EXPORT ACTIONS */}
        <div
          className={`lg:col-span-6 space-y-6 ${
            mobileTab === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Visual controls box */}
          <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-neutral-200/30 dark:border-neutral-800/40 rounded-2xl p-6 space-y-5 shadow-sm hover:bg-white/70 dark:hover:bg-neutral-900/45 duration-300">
            <h3 className="font-bold text-neutral-900 dark:text-white text-base">
              Export Center
            </h3>

            {/* Watermark manual setting dropdown */}
            <div className="pt-2">
              <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1.5">
                Watermark Display Setting
              </label>
              <select
                value={invoice.manualWatermarkOverride || 'auto'}
                onChange={e => handleMetaChange('manualWatermarkOverride', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} backdrop-blur-xs focus:outline-none`}
              >
                <option value="auto">Auto (Premium Status)</option>
                <option value="show">Force Show</option>
                <option value="hide">Force Hide</option>
              </select>
            </div>

            {/* Premium removal badge status indicator */}
            {invoice.watermarkRemoved && (
              <div className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-250/20 dark:border-emerald-900 flex flex-col gap-2 backdrop-blur-sm animate-fade-in shadow-xs">
                <div className="flex items-start gap-3 text-xs leading-relaxed text-emerald-800 dark:text-emerald-400">
                  <div className="p-1 px-1.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-850 dark:text-emerald-350 font-mono text-[9px] font-bold shrink-0 mt-0.5">
                    ✓ SUCCESS
                  </div>
                  <div>
                    <span className="font-bold block text-neutral-800 dark:text-neutral-100">
                      Watermark Removed Successfully!
                    </span>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 font-sans">
                      A premium, pristine copy of this invoice is ready with all watermark stamps removed. Thank you for supporting us — ad revenue keeps this professional billing application 100% free!
                    </p>
                  </div>
                </div>
                <div className="h-px bg-emerald-200/40 dark:bg-emerald-800/30 my-1" />
                <div className="flex items-center justify-between text-[11px] text-neutral-600 dark:text-neutral-300">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">Preview below is now clean & pristine.</span>
                  <button
                    type="button"
                    onClick={() => handleDownloadPdfFile(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-605 dark:bg-emerald-700 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Clean PDF</span>
                  </button>
                </div>
              </div>
            )}

            {/* Post-generation ad banner */}
            {downloadedWithWatermark && !invoice.watermarkRemoved && (
              <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-900/30 space-y-2.5 animate-fade-in">
                <div className="flex items-start gap-2.5 text-xs">
                  <div className="p-1 px-1.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 font-mono text-[9px] font-bold shrink-0 mt-0.5">
                    WATERMARKED
                  </div>
                  <div>
                    <span className="font-bold block text-neutral-800 dark:text-neutral-200">
                      Watermarked Invoice Generated
                    </span>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 font-sans">
                      Your watermarked PDF is ready. Click the "Remove Watermark" button below to watch a short ad, remove the watermark, and download a clean copy immediately!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleTriggerWatermarkAd}
                  className={`w-full py-2 px-3 ${colors.primary} ${colors.primaryHover} text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span>Remove Watermark</span>
                </button>
              </div>
            )}

            {/* If watermark is not removed and not showing post-generation banner, show this active watermark prompt */}
            {!invoice.watermarkRemoved && !downloadedWithWatermark && (
              <div className={`p-4 rounded-xl ${colors.bgLight} ${colors.bgLightDark} border border-neutral-250 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 backdrop-blur-sm`}>
                <div className="space-y-1">
                  <span className={`font-semibold block ${colors.primaryText} ${colors.primaryTextDark}`}>
                    Watermark is Currently Active
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px] block leading-normal font-sans">
                    Free PDF downloads contain a centered Malgave Solutions watermark stamp across all pages.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleTriggerWatermarkAd}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 ${colors.primary} ${colors.primaryHover} text-white font-extrabold text-[11px] rounded-lg transition self-start sm:self-auto cursor-pointer shadow-xs`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Remove Watermark</span>
                </button>
              </div>
            )}

            {/* Launchers for high fidelity render PDFs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-1">
              <button
                type="button"
                disabled={isGeneratingPdf}
                onClick={() => handleDownloadPdfFile(true)}
                className="px-4 py-3 border border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 rounded-xl text-xs font-semibold text-neutral-755 dark:text-neutral-300 flex items-center justify-center gap-2 cursor-pointer transition hover:bg-white/70 dark:hover:bg-neutral-850 backdrop-blur-xs"
              >
                {isGeneratingPdf ? (
                  <span className={`animate-spin w-3.5 h-3.5 border-2 ${colors.primaryText} rounded-full border-t-transparent`} />
                ) : (
                  <Download className="w-4 h-4 text-neutral-400" />
                )}
                <span>Download Watermark PDF</span>
              </button>

              <button
                type="button"
                disabled={isGeneratingPdf}
                onClick={
                  invoice.watermarkRemoved
                    ? () => handleDownloadPdfFile(false)
                    : handleTriggerWatermarkAd
                }
                className={`px-4 py-3 ${colors.primary} ${colors.primaryHover} text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md`}
              >
                {isGeneratingPdf ? (
                  <span className="animate-spin w-3.5 h-3.5 border-2 border-white rounded-full border-t-transparent" />
                ) : invoice.watermarkRemoved ? (
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Sparkles className="w-4 h-4 text-white/90 animate-pulse" />
                )}
                <span>
                  {invoice.watermarkRemoved ? 'Download Clean PDF' : 'Remove Watermark'}
                </span>
              </button>
            </div>
          </div>

          {/* Premium preview wrapper block */}
          <div className="relative border border-neutral-200/30 dark:border-neutral-800/40 rounded-2xl overflow-auto select-none bg-white/20 dark:bg-neutral-950/20 backdrop-blur-md p-1 md:p-4 shadow-sm">
            <h4 className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider mb-2 font-mono ml-1">
              Live Preview
            </h4>

            {/* Inner view target container used for layout capturing */}
            <div className="origin-top scale-[0.98]">
              <InvoicePreview invoice={invoice} id="invoice-pdf-capture-view" colorTheme={savedSettings.colorTheme} />
            </div>
          </div>
        </div>
      </div>

      {/* Ad watch simulation modally */}
      <AdUnlockModal
        isOpen={adModalOpen}
        onClose={() => setAdModalOpen(false)}
        onUnlocked={handleAdFinishedUnlock}
        colorTheme={savedSettings.colorTheme}
        title={
          adTriggerIntent === 'logo'
            ? 'Unlock Company Logo Uploads'
            : 'Download Watermark-Free Invoice'
        }
        description={
          adTriggerIntent === 'logo'
            ? 'Watch a short ad to unlock customizable logo upload fields. Ad revenue helps keep our product 100% free and open for freelancers.'
            : 'Watch an ad to download a clean invoice without branding. Ad revenue helps keep this professional utility free for developers and freelancers worldwide.'
        }
      />

      {/* Sticky Bottom Action Bar for Mobile/Tablet hover */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-neutral-900/95 backdrop-blur-md border-t border-neutral-200/50 dark:border-neutral-800/80 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] flex items-center justify-between gap-2 select-none md:px-6">
        <button
          type="button"
          onClick={() => setMobileTab(mobileTab === 'edit' ? 'preview' : 'edit')}
          className={`flex-1 py-2 px-3 border border-neutral-200/60 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 rounded-xl text-[11px] font-bold text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-1.5 transition active:scale-95 duration-100 cursor-pointer`}
        >
          {mobileTab === 'edit' ? (
            <>
              <Eye className="w-3.5 h-3.5 text-neutral-400" />
              <span>Full Preview</span>
            </>
          ) : (
            <>
              <Edit className="w-3.5 h-3.5 text-neutral-400" />
              <span>Edit Details</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleDownloadPdfFile(false)}
          className={`flex-1 py-2 px-3 ${colors.primary} ${colors.primaryHover} text-white rounded-xl text-[11px] font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 duration-100 cursor-pointer`}
        >
          <FileCheck className="w-3.5 h-3.5 text-white" />
          <span>Save PDF</span>
        </button>

        <button
          type="button"
          onClick={handleSaveInvoice}
          className="p-2 border border-neutral-200/60 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950/20 rounded-xl text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-350 transition active:scale-95 duration-100 cursor-pointer"
          title="Save Draft (Keep in Local storage)"
        >
          <Save className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={handleShareInvoice}
          className="p-2 border border-neutral-200/60 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-950/20 rounded-xl text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-350 transition active:scale-95 duration-100 cursor-pointer"
          title="Copy settings link text"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
