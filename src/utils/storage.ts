import { Invoice, UserSettings, InvoiceItem } from '../types';

const STORAGE_KEYS = {
  INVOICES: 'freelancer_invoices',
  SETTINGS: 'freelancer_settings',
};

export const DEFAULT_SETTINGS: UserSettings = {
  businessName: '',
  businessEmail: '',
  businessPhone: '',
  businessAddress: '',
  defaultCurrency: '₹',
  defaultTaxRate: 0,
  defaultDiscountRate: 0,
  defaultNotes: '',
  watermarkRemoved: false,
  logoUnlocked: false,
  colorTheme: 'indigo',
};

export const storage = {
  getInvoices: (): Invoice[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INVOICES);
      if (!data) {
        return [];
      }
      return JSON.parse(data);
    } catch {
      return [];
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
