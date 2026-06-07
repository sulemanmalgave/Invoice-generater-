import { useState, useEffect } from 'react';
import { Invoice, UserSettings } from './types';
import { storage } from './utils/storage';
import { getThemeColors } from './utils/theme';
import {
  Layout as DashboardIcon,
  Plus as CreateIcon,
  Receipt as ManageIcon,
  Settings as SettingsIcon,
  Menu,
  X,
  Sparkles,
  Layers,
  Moon,
  Sun
} from 'lucide-react';
import DashboardView from './components/views/DashboardView';
import CreateInvoiceView from './components/views/CreateInvoiceView';
import RecentInvoicesView from './components/views/RecentInvoicesView';
import SettingsView from './components/views/SettingsView';
import AboutUsView from './components/views/AboutUsView';
import PrivacyPolicyView from './components/views/PrivacyPolicyView';
import TermsOfServiceView from './components/views/TermsOfServiceView';

export default function App() {
  // Load primary assets from storage
  const [invoices, setInvoices] = useState<Invoice[]>(() => storage.getInvoices());
  const [settings, setSettings] = useState<UserSettings>(() => storage.getSettings());
  const colors = getThemeColors(settings.colorTheme);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem('invoice_app_theme');
      if (stored === 'light' || stored === 'dark') return stored;
    } catch {}
    return 'light';
  });

  const [currentView, setCurrentView] = useState<'dashboard' | 'create' | 'invoices' | 'settings' | 'about' | 'privacy' | 'terms'>('dashboard');
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic SEO Page Title & Description based on currentView
  useEffect(() => {
    let title = 'Free Invoice Generator Online | Create & Download Professional PDF Invoices';
    let description = 'Create professional invoices online in seconds. Add your logo, client details, taxes, and download PDF invoices instantly. Perfect for freelancers and businesses worldwide.';
    
    switch (currentView) {
      case 'dashboard':
        title = 'Free Invoice Generator Online | Create & Download Professional PDF Invoices';
        description = 'Create professional invoices online in seconds. Add your logo, client details, taxes, and download PDF invoices instantly. Perfect for freelancers and businesses worldwide.';
        break;
      case 'create':
        title = 'Create Professional Invoice | Free Invoice Generator Online';
        description = 'Generate a high-quality PDF invoice instantly. Add customizable logo fields, item hours, rate descriptions, and taxation structures.';
        break;
      case 'invoices':
        title = 'Manage Your Invoices | Free Invoice Generator';
        description = 'Track billing analytics, outstanding metrics, paid statements, and list histories for your business invoices.';
        break;
      case 'settings':
        title = 'Configure Invoice Preferences | Free Invoice Generator';
        description = 'Set default currency, enterprise business identifiers, standard tax, discounts, and visual colors for your PDF templates.';
        break;
      case 'about':
        title = 'About Us | Free Invoice Generator';
        description = 'Learn more about the team behind our secure, 100% free, and fast PDF invoice generation service.';
        break;
      case 'privacy':
        title = 'Privacy Policy | Free Invoice Generator';
        description = 'Transparency practices, security guidelines, and how we handle local client-side storage for absolute confidentiality.';
        break;
      case 'terms':
        title = 'Terms of Service | Free Invoice Generator';
        description = 'Read our conditions regarding freelance billing systems, legal invoice accuracies, and our fair watermark regulations.';
        break;
    }

    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
  }, [currentView]);

  // Sync theme changes to the outer wrapper
  useEffect(() => {
    try {
      localStorage.setItem('invoice_app_theme', theme);
    } catch {}
  }, [theme]);

  // Handle invoice saving
  const handleSaveInvoice = (saved: Invoice) => {
    let updatedList: Invoice[];
    const exists = invoices.some(inv => inv.id === saved.id);

    if (exists) {
      updatedList = invoices.map(inv => (inv.id === saved.id ? saved : inv));
    } else {
      updatedList = [saved, ...invoices];
    }

    setInvoices(updatedList);
    storage.saveInvoices(updatedList);
    setEditingInvoice(null);
    setCurrentView('invoices');
  };

  const handleDuplicateInvoice = (id: string) => {
    const original = invoices.find(inv => inv.id === id);
    if (!original) return;

    const randomNum = Math.floor(100 + Math.random() * 900);
    const today = new Date().toISOString().split('T')[0];
    const targetDue = new Date();
    targetDue.setDate(targetDue.getDate() + 14);

    const duplicated: Invoice = {
      ...original,
      id: `inv-${Date.now()}`,
      invoiceNumber: `${original.invoiceNumber}-COPY-${randomNum}`,
      status: 'Draft',
      isDraft: true,
      issueDate: today,
      dueDate: targetDue.toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      watermarkRemoved: false,
      logoUnlocked: false,
      logoUrl: undefined,
    };

    const nextList = [duplicated, ...invoices];
    setInvoices(nextList);
    storage.saveInvoices(nextList);
  };

  const handleDeleteInvoice = (id: string) => {
    const nextList = invoices.filter(inv => inv.id !== id);
    setInvoices(nextList);
    storage.saveInvoices(nextList);
  };

  const handleStartEditingInvoice = (id: string) => {
    const target = invoices.find(inv => inv.id === id);
    if (target) {
      setEditingInvoice(target);
      setCurrentView('create');
    }
  };

  const handleCreateNewTrigger = () => {
    setEditingInvoice(null);
    setCurrentView('create');
  };

  const handleSaveSettings = (updatedSettings: UserSettings) => {
    setSettings(updatedSettings);
    storage.saveSettings(updatedSettings);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-neutral-50/50 dark:bg-neutral-950/40 text-neutral-800 dark:text-neutral-200 duration-200 transition-colors flex font-sans relative overflow-x-hidden">
        
        {/* FROSTED GLASS BACKGROUND BUBBLE SHAPES */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className={`absolute -top-[15%] -left-[10%] w-[55%] h-[55%] rounded-full ${colors.radialGlow} blur-[120px] animate-pulse duration-[8000ms]`} />
          <div className="absolute -bottom-[15%] -right-[15%] w-[65%] h-[65%] rounded-full bg-purple-300/30 dark:bg-purple-900/15 blur-[140px] animate-pulse duration-[12000ms]" />
          <div className="absolute top-[35%] right-[15%] w-[40%] h-[40%] rounded-full bg-teal-200/20 dark:bg-emerald-950/10 blur-[130px]" />
          <div className="absolute top-[25%] left-[25%] w-[30%] h-[30%] rounded-full bg-pink-200/10 dark:bg-pink-950/5 blur-[100px]" />
        </div>

        {/* DESKTOP SIDEBAR NAVIGATION */}
        <aside className="w-64 bg-white/75 dark:bg-neutral-900/65 backdrop-blur-lg border-r border-neutral-200/20 dark:border-neutral-800/40 hidden md:flex flex-col justify-between shrink-0 select-none z-10 shadow-lg shadow-black/5">
          <div>
            {/* Logo details */}
            <div className="p-6 border-b border-neutral-200/20 dark:border-neutral-800/40">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg ${colors.primary} flex items-center justify-center text-white shadow-md ${colors.shadow}`}>
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-neutral-900 dark:text-white tracking-tight text-sm uppercase">Smart Invoice</span>
                  <span className="block text-[8px] text-neutral-400 font-bold uppercase tracking-widest font-mono">Freelance Client</span>
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="p-4 space-y-1.5 mt-4">
              <button
                onClick={() => {
                  setEditingInvoice(null);
                  setCurrentView('dashboard');
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer ${
                  currentView === 'dashboard'
                    ? `${colors.primary} text-white font-bold shadow-md ${colors.shadow}`
                    : 'text-neutral-500 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <DashboardIcon className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={handleCreateNewTrigger}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer ${
                  currentView === 'create'
                    ? `${colors.primary} text-white font-bold shadow-md ${colors.shadow}`
                    : 'text-neutral-500 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <CreateIcon className="w-4 h-4" />
                <span>Create Invoice</span>
              </button>

              <button
                onClick={() => {
                  setEditingInvoice(null);
                  setCurrentView('invoices');
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer ${
                  currentView === 'invoices'
                    ? `${colors.primary} text-white font-bold shadow-md ${colors.shadow}`
                    : 'text-neutral-500 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <ManageIcon className="w-4 h-4" />
                <span>Manage Invoices</span>
              </button>

              <button
                onClick={() => {
                  setEditingInvoice(null);
                  setCurrentView('settings');
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer ${
                  currentView === 'settings'
                    ? `${colors.primary} text-white font-bold shadow-md ${colors.shadow}`
                    : 'text-neutral-500 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <SettingsIcon className="w-4 h-4" />
                <span>Preferences</span>
              </button>
            </nav>
          </div>

          {/* Bottom user meta details */}
          <div className="p-4 border-t border-neutral-100 dark:border-neutral-800/40 space-y-4">
            {/* Mini billing upgrade info */}
            <div className={`p-3.5 ${colors.bgLight} ${colors.bgLightDark} border ${colors.borderLight} rounded-xl space-y-1.5`}>
              <p className={`text-[10px] font-bold ${colors.bulletText}`}>
                AD-SUPPORTED FREE LEVEL
              </p>
              <p className="text-[9px] text-neutral-500 leading-normal">
                Watch a short rewarded ad while editing any invoice to upload logos and remove watermarks for free!
              </p>
            </div>

            {/* Quick user name tag */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs uppercase font-mono text-neutral-700 dark:text-neutral-300">
                  U
                </div>
                <div>
                  <span className="block text-[11px] font-bold max-w-[130px] truncate">{settings.businessName || 'Anonymous Owner'}</span>
                  <span className="block text-[8px] text-neutral-400 dark:text-neutral-500 uppercase font-bold font-mono tracking-wider">Freelancer</span>
                </div>
              </div>

              {/* Quick light toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </aside>

        {/* APP BODY CONTAINER */}
        <div className="flex-1 min-w-0 flex flex-col">
          
          {/* RESPONSIVE TOP BAR MENU FOR MOBILE */}
          <header className="bg-white/75 dark:bg-neutral-900/65 backdrop-blur-lg border-b border-neutral-200/20 dark:border-neutral-800/40 p-3 flex md:hidden items-center justify-between select-none z-10">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded ${colors.primary} flex items-center justify-center text-white font-bold text-sm shadow-md ${colors.shadow}`}>
                A
              </div>
              <span className="font-extrabold text-sm uppercase text-neutral-900 dark:text-white tracking-wider">
                Invoice
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                {theme === 'light' ? <Moon className="w-4 h-4 animate-pulse" /> : <Sun className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="p-2 border border-neutral-200/40 dark:border-neutral-800/40 rounded-xl text-neutral-500 dark:text-neutral-300 hover:bg-neutral-100/30 dark:hover:bg-neutral-800/30 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </header>

          {/* MOBILE MOBILE NAV MODAL SHEET */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-45 bg-neutral-950/40 backdrop-blur-md md:hidden flex justify-end">
              <div className="w-64 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-l border-neutral-200/20 dark:border-neutral-800/40 h-full p-4 flex flex-col justify-between shadow-2xl">
                <div>
                  <div className="pt-2 pb-4 flex justify-between items-center border-b border-neutral-200/20 dark:border-neutral-800/40">
                    <span className={`font-extrabold text-xs uppercase ${colors.primaryText} ${colors.primaryTextDark} font-mono tracking-widest`}>
                      NAVIGATE CODES
                    </span>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-1 rounded text-neutral-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <nav className="space-y-1 mt-4">
                    <button
                      onClick={() => {
                        setEditingInvoice(null);
                        setCurrentView('dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold ${
                        currentView === 'dashboard'
                          ? `${colors.primary} text-white`
                          : 'text-neutral-500'
                      }`}
                    >
                      <DashboardIcon className="w-4 h-4" />
                      <span>Dashboard</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingInvoice(null);
                        setCurrentView('create');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold ${
                        currentView === 'create'
                          ? `${colors.primary} text-white`
                          : 'text-neutral-500'
                      }`}
                    >
                      <CreateIcon className="w-4 h-4" />
                      <span>Create Invoice</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingInvoice(null);
                        setCurrentView('invoices');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold ${
                        currentView === 'invoices'
                          ? `${colors.primary} text-white`
                          : 'text-neutral-500'
                      }`}
                    >
                      <ManageIcon className="w-4 h-4" />
                      <span>Manage Invoices</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingInvoice(null);
                        setCurrentView('settings');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold ${
                        currentView === 'settings'
                          ? `${colors.primary} text-white`
                          : 'text-neutral-500'
                      }`}
                    >
                      <SettingsIcon className="w-4 h-4" />
                      <span>Preferences</span>
                    </button>
                  </nav>
                </div>

                <div className="p-3 bg-neutral-100/40 dark:bg-neutral-900/40 border border-neutral-200/20 dark:border-neutral-800/40 text-center rounded-xl backdrop-blur-sm">
                  <span className="text-[10px] block font-bold text-neutral-800 dark:text-neutral-200">
                    {settings.businessName || 'Anonymous Owner'}
                  </span>
                  <span className="text-[8px] uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mt-0.5 block font-mono font-bold">
                    FREE TRIAL ACTIVE
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* MAIN PAGE WRAPPER SCROLL AREA */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20">
            {currentView === 'dashboard' && (
              <DashboardView
                invoices={invoices}
                onCreateNew={handleCreateNewTrigger}
                onEdit={handleStartEditingInvoice}
                onViewAll={() => setCurrentView('invoices')}
                colorTheme={settings.colorTheme}
                defaultCurrency={settings.defaultCurrency}
              />
            )}

            {currentView === 'create' && (
              <CreateInvoiceView
                initialInvoice={editingInvoice}
                savedSettings={settings}
                onSave={handleSaveInvoice}
                onCancel={() => {
                  setEditingInvoice(null);
                  setCurrentView('dashboard');
                }}
                onUpdateSettings={handleSaveSettings}
              />
            )}

            {currentView === 'invoices' && (
              <RecentInvoicesView
                invoices={invoices}
                onEdit={handleStartEditingInvoice}
                onDelete={handleDeleteInvoice}
                onDuplicate={handleDuplicateInvoice}
                onCreateNew={handleCreateNewTrigger}
                colorTheme={settings.colorTheme}
              />
            )}

            {currentView === 'settings' && (
              <SettingsView
                settings={settings}
                onSave={handleSaveSettings}
                theme={theme}
                onToggleTheme={toggleTheme}
              />
            )}

            {currentView === 'about' && (
              <AboutUsView colorTheme={settings.colorTheme} />
            )}

            {currentView === 'privacy' && (
              <PrivacyPolicyView colorTheme={settings.colorTheme} />
            )}

            {currentView === 'terms' && (
              <TermsOfServiceView colorTheme={settings.colorTheme} />
            )}

            {/* PROFESSIONAL LEGAL & INFORMATIONAL FOOTER */}
            <footer className="mt-16 pt-8 border-t border-neutral-200/20 dark:border-neutral-850 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 font-medium">
                © 2026 Malgave Solutions. All rights reserved.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-bold tracking-wide">
                <button
                  type="button"
                  onClick={() => {
                    setEditingInvoice(null);
                    setCurrentView('about');
                    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`transition rounded-lg px-2 py-1 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 cursor-pointer ${
                    currentView === 'about'
                      ? `${colors.primaryText} bg-neutral-200/50 dark:bg-neutral-800 font-bold`
                      : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  About Us
                </button>
                <span className="text-neutral-300 dark:text-neutral-700">•</span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingInvoice(null);
                    setCurrentView('privacy');
                    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`transition rounded-lg px-2 py-1 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 cursor-pointer ${
                    currentView === 'privacy'
                      ? `${colors.primaryText} bg-neutral-200/50 dark:bg-neutral-800 font-bold`
                      : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  Privacy Policy
                </button>
                <span className="text-neutral-300 dark:text-neutral-700">•</span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingInvoice(null);
                    setCurrentView('terms');
                    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`transition rounded-lg px-2 py-1 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 cursor-pointer ${
                    currentView === 'terms'
                      ? `${colors.primaryText} bg-neutral-200/50 dark:bg-neutral-800 font-bold`
                      : 'text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  Terms of Service
                </button>
              </div>
            </footer>
          </main>

        </div>
      </div>
    </div>
  );
}
