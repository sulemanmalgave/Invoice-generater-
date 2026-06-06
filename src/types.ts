export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  issueDate: string;
  dueDate: string;
  currency: string;             // Currency symbol or code, e.g. "$", "€"
  taxRate: number;              // Percentage
  discountRate: number;         // Percentage
  items: InvoiceItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  grandTotal: number;
  notes: string;
  isDraft: boolean;
  status: 'Paid' | 'Pending' | 'Draft';
  createdAt: string;
  updatedAt: string;
  logoUrl?: string;             // Base64 or ObjectURL string for logo
  watermarkRemoved: boolean;
  manualWatermarkOverride?: 'auto' | 'show' | 'hide';
  logoUnlocked: boolean;
}

export interface UserSettings {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  defaultCurrency: string;
  defaultTaxRate: number;
  defaultDiscountRate: number;
  defaultNotes: string;
  logoUrl?: string;
  watermarkRemoved: boolean;
  logoUnlocked: boolean;
  colorTheme?: 'indigo' | 'emerald' | 'violet' | 'rose' | 'amber' | 'blue';
}
