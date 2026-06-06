import { Invoice, UserSettings, InvoiceItem } from '../types';

const STORAGE_KEYS = {
  INVOICES: 'freelancer_invoices',
  SETTINGS: 'freelancer_settings',
};

export const DEFAULT_SETTINGS: UserSettings = {
  businessName: 'Apex Digital Studio',
  businessEmail: 'hello@apexdigital.com',
  businessPhone: '+1 (555) 342-9980',
  businessAddress: '150 Spectrum Rd, Suite 400\nSan Francisco, CA 94107',
  defaultCurrency: '$',
  defaultTaxRate: 10,
  defaultDiscountRate: 0,
  defaultNotes: 'Thank you for choosing Apex Digital Studio. Payment is appreciated within 14 days of invoice receipt.',
  watermarkRemoved: false,
  logoUnlocked: false,
  colorTheme: 'indigo',
};

// Create a helper to generate structured mock invoices to populate immediately if empty
const generateMockInvoices = (): Invoice[] => {
  const dateOffset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const invoice1: Invoice = {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-001',
    businessName: 'Apex Digital Studio',
    businessEmail: 'hello@apexdigital.com',
    businessPhone: '+1 (555) 342-9980',
    businessAddress: '150 Spectrum Rd, Suite 400\nSan Francisco, CA 94107',
    clientName: 'Acme Corporation Inc.',
    clientEmail: 'billing@acme.com',
    clientPhone: '+1 (415) 888-2993',
    clientAddress: '432 Enterprise Way\nSuite 12, Oakland, CA 94612',
    issueDate: dateOffset(-10),
    dueDate: dateOffset(4),
    currency: '$',
    taxRate: 10,
    discountRate: 5,
    items: [
      { id: 'item-1', description: 'Full-stack React & Node.js Dashboard Development', quantity: 1, rate: 4500, total: 4500 },
      { id: 'item-2', description: 'UI/UX Design Wireframing and Prototyping', quantity: 24, rate: 85, total: 2040 },
      { id: 'item-3', description: 'API Integration with Stripe & Segment Analytics', quantity: 1, rate: 1200, total: 1200 },
    ],
    subtotal: 7740,
    taxTotal: 774,
    discountTotal: 387,
    grandTotal: 8127,
    notes: 'Please remit payment to the bank coordinates listed in the attachments or send via ACH transfer.',
    isDraft: false,
    status: 'Pending',
    createdAt: new Date(dateOffset(-10)).toISOString(),
    updatedAt: new Date(dateOffset(-10)).toISOString(),
    watermarkRemoved: false,
    logoUnlocked: false,
  };

  const invoice2: Invoice = {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-002',
    businessName: 'Apex Digital Studio',
    businessEmail: 'hello@apexdigital.com',
    businessPhone: '+1 (555) 342-9980',
    businessAddress: '150 Spectrum Rd, Suite 400\nSan Francisco, CA 94107',
    clientName: 'Nova Retail Group',
    clientEmail: 'accounts@nova.io',
    clientPhone: '+44 20 7946 0958',
    clientAddress: '10-12 Gt Portland St\nLondon, W1W 8AL, UK',
    issueDate: dateOffset(-25),
    dueDate: dateOffset(-11),
    currency: '£',
    taxRate: 20,
    discountRate: 0,
    items: [
      { id: 'item-4', description: 'E-commerce Custom Shopify Theme Design & Rollout', quantity: 1, rate: 3200, total: 3200 },
      { id: 'item-5', description: 'Speed Optimization & Content Delivery Network Setup', quantity: 8, rate: 90, total: 720 },
    ],
    subtotal: 3920,
    taxTotal: 784,
    discountTotal: 0,
    grandTotal: 4704,
    notes: 'Thank you for your business! This invoice has been marked as fully PAID.',
    isDraft: false,
    status: 'Paid',
    createdAt: new Date(dateOffset(-25)).toISOString(),
    updatedAt: new Date(dateOffset(-25)).toISOString(),
    watermarkRemoved: true,
    logoUnlocked: true,
  };

  const invoice3: Invoice = {
    id: 'inv-3',
    invoiceNumber: 'INV-2026-003',
    businessName: 'Apex Digital Studio',
    businessEmail: 'hello@apexdigital.com',
    businessPhone: '+1 (555) 342-9980',
    businessAddress: '150 Spectrum Rd, Suite 400\nSan Francisco, CA 94107',
    clientName: 'Zenith SaaS Inc',
    clientEmail: 'procure@zenith.sh',
    clientPhone: '',
    clientAddress: '78 Cloud Boulevard, Vancouver, BC',
    issueDate: dateOffset(-1),
    dueDate: dateOffset(13),
    currency: '$',
    taxRate: 5,
    discountRate: 10,
    items: [
      { id: 'item-6', description: 'Technical Writing - Product API Docs & Guides', quantity: 3, rate: 800, total: 2400 },
    ],
    subtotal: 2400,
    taxTotal: 120,
    discountTotal: 240,
    grandTotal: 2280,
    notes: 'Draft progress. Client needs to approve the technical scope before dispatching final.',
    isDraft: true,
    status: 'Draft',
    createdAt: new Date(dateOffset(-1)).toISOString(),
    updatedAt: new Date(dateOffset(-1)).toISOString(),
    watermarkRemoved: false,
    logoUnlocked: false,
  };

  return [invoice1, invoice2, invoice3];
};

export const storage = {
  getInvoices: (): Invoice[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
      if (!data) {
        const mock = generateMockInvoices();
        localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(mock));
        return mock;
      }
      return JSON.parse(data);
    } catch {
      return generateMockInvoices();
    }
  },

  saveInvoices: (invoices: Invoice[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    } catch (e) {
      console.error('Error writing to localStorage', e);
    }
  },

  getSettings: (): UserSettings => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) {
        return DEFAULT_SETTINGS;
      }
      const loaded = JSON.parse(data);
      // Merge keys to ensure defaults exist
      return { ...DEFAULT_SETTINGS, ...loaded };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: (settings: UserSettings): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error writing settings to localStorage', e);
    }
  },
};
