import { useState } from 'react';
import { UserSettings } from '../../types';
import { getThemeColors, THEMES, ColorThemeName } from '../../utils/theme';
import {
  Save,
  CheckCircle,
  Building,
  Mail,
  Phone,
  FileText,
  DollarSign,
  Percent,
  Sparkles,
  Shield,
  ShieldCheck,
  Moon,
  Sun,
  Layout,
  RefreshCw
} from 'lucide-react';

interface SettingsViewProps {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function SettingsView({
  settings,
  onSave,
  theme,
  onToggleTheme,
}: SettingsViewProps) {
  const [form, setForm] = useState<UserSettings>({ ...settings });
  const colors = getThemeColors(form.colorTheme);
  const [isSuccessTip, setIsSuccessTip] = useState(false);

  // Field change handle
  const handleChange = (field: keyof UserSettings, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = () => {
    onSave(form);
    setIsSuccessTip(true);
    setTimeout(() => {
      setIsSuccessTip(false);
    }, 4000);
  };

  const handleResetDefaults = () => {
    if (confirm('Are you sure you want to reset all configurations to sample defaults?')) {
      const reset: UserSettings = {
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
      setForm(reset);
      onSave(reset);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          System Preferences
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Customize currency symbols, default billing notes, themes, and unlock business branding.
        </p>
      </div>

      {/* Success Banner */}
      {isSuccessTip && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Your defaults have been updated and stored in Local Storage. New invoice drafts will load these immediately!</span>
        </div>
      )}

      {/* Informational ad system banner within settings */}
      <div className={`bg-gradient-to-r ${colors.gradientFrom} via-neutral-900 to-neutral-950 text-white rounded-2xl p-6 border border-neutral-200/10 shadow relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6`}>
        <div className="absolute top-0 right-0 p-4 drop-shadow-lg opacity-10">
          <Sparkles className="w-48 h-48" />
        </div>

        <div className="space-y-2 relative z-10 text-center md:text-left">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase ${colors.primary} rounded-full font-mono`}>
            FREE PREMIUM LEVEL
          </span>
          <h2 className="text-xl font-bold tracking-tight text-white mt-1">
            Invoice-by-Invoice Premium Features
          </h2>
          <p className="text-xs text-neutral-350 max-w-xl">
            You can remove watermarks and upload professional business logos on any invoice! To keep our app free, unlocks are applied per individual invoice after watching a short rewarded ad.
          </p>
        </div>

        <div className="text-[10px] bg-white/10 text-white border border-white/20 px-3.5 py-2 rounded-xl text-center font-bold relative z-10 font-mono shrink-0">
          ✓ Real-Time Ad Supported
        </div>
      </div>

      {/* Grid of details edit */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left column: Defaults configuration Edit */}
        <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-neutral-200/30 dark:border-neutral-800/40 rounded-2xl p-6 space-y-5 md:col-span-8 shadow-sm hover:bg-white/70 dark:hover:bg-neutral-900/45 duration-300">
          <h3 className="font-bold text-neutral-800 dark:text-neutral-200 text-sm pb-3 border-b border-neutral-200/20 dark:border-neutral-800/60">
            Freelancer Default Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                <span>Freelance Business Name</span>
              </label>
              <input
                type="text"
                value={form.businessName}
                onChange={e => handleChange('businessName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} backdrop-blur-xs placeholder-neutral-500 dark:placeholder-neutral-500`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                <span>Business Contact Email</span>
              </label>
              <input
                type="email"
                value={form.businessEmail}
                onChange={e => handleChange('businessEmail', e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} backdrop-blur-xs placeholder-neutral-500 dark:placeholder-neutral-500`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                <span>Contact Telephone Code</span>
              </label>
              <input
                type="text"
                value={form.businessPhone}
                onChange={e => handleChange('businessPhone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} backdrop-blur-xs placeholder-neutral-500 dark:placeholder-neutral-500`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                <span>Default Currency Symbol</span>
              </label>
              <select
                value={form.defaultCurrency}
                onChange={e => handleChange('defaultCurrency', e.target.value)}
                className={`w-full px-3 py-2 border rounded-xl border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-905 dark:text-white text-xs focus:ring-1 ${colors.focusRing} backdrop-blur-xs`}
              >
                <option value="$">USD ($)</option>
                <option value="€">EUR (€)</option>
                <option value="£">GBP (£)</option>
                <option value="₹">INR (₹)</option>
                <option value="¥">JPY (¥)</option>
                <option value="C$">CAD (C$)</option>
                <option value="A$">AUD (A$)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-1.5 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-neutral-400" />
                <span>Default Tax Rate (%)</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.defaultTaxRate}
                onChange={e => handleChange('defaultTaxRate', Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-xl border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} font-mono backdrop-blur-xs focus:outline-none`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-1.5 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-neutral-400" />
                <span>Default Discount Rate (%)</span>
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.defaultDiscountRate}
                onChange={e => handleChange('defaultDiscountRate', Number(e.target.value))}
                className={`w-full px-3 py-2 border rounded-xl border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} font-mono backdrop-blur-xs focus:outline-none`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-1.5">
                Default Business Location / Address Details
              </label>
              <textarea
                value={form.businessAddress}
                onChange={e => handleChange('businessAddress', e.target.value)}
                rows={2}
                className={`w-full px-3 py-2 border rounded-xl border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} backdrop-blur-xs focus:outline-none`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-1.5">
                Default Notes & Terms preset
              </label>
              <textarea
                value={form.defaultNotes}
                onChange={e => handleChange('defaultNotes', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-xl border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 text-neutral-900 dark:text-white text-xs focus:ring-1 ${colors.focusRing} backdrop-blur-xs focus:outline-none`}
              />
            </div>
          </div>

          {/* Action buttons list */}
          <div className="flex justify-between items-center pt-4 border-t border-neutral-200/20 dark:border-neutral-800/60">
            <button
              onClick={handleResetDefaults}
              className="text-xs text-red-500 dark:text-red-400 font-bold hover:underline inline-flex items-center gap-1 hover:bg-red-50/20 dark:hover:bg-red-950/25 p-2 rounded-xl transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Reset Sample Defaults</span>
            </button>

            <button
              onClick={handleUpdate}
              className={`inline-flex items-center gap-2 px-5 py-2.5 ${colors.primary} ${colors.primaryHover} text-white font-bold text-xs rounded-xl shadow transition cursor-pointer`}
            >
              <Save className="w-4 h-4" />
              <span>Apply Configurations</span>
            </button>
          </div>
        </div>

        {/* Right column: UI preference management */}
        <div className="space-y-6 md:col-span-4">
          <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-neutral-200/30 dark:border-neutral-800/40 rounded-2xl p-6 shadow-sm hover:bg-white/70 dark:hover:bg-neutral-900/45 duration-300">
            <h3 className="font-bold text-neutral-850 dark:text-neutral-200 text-sm pb-3 border-b border-neutral-200/20 dark:border-neutral-800/60 mb-4">
              Aesthetics & Theme
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-755 dark:text-neutral-300">
                    Application Appearance
                  </span>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                    Toggle eye-friendly dark layouts.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="p-2.5 border border-neutral-250/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-950/20 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-white/70 dark:hover:bg-neutral-850 transition cursor-pointer shadow-sm backdrop-blur-sm"
                >
                  {theme === 'light' ? (
                    <Moon className={`w-4 h-4 ${colors.primaryText}`} />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-500" />
                  )}
                </button>
              </div>

              <div className="border-t border-neutral-200/20 dark:border-neutral-800/45 pt-4">
                <span className="text-xs font-bold text-neutral-755 dark:text-neutral-300 block mb-1">
                  Brand Color Palette
                </span>
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mb-3 leading-relaxed">
                  Select a tailored accent palette to reflect your freelance brand across dashboards, metrics, and navigation rails.
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(THEMES) as ColorThemeName[]).map(themeName => {
                    const themeObj = THEMES[themeName];
                    const isActive = form.colorTheme === themeName || (!form.colorTheme && themeName === 'indigo');
                    return (
                      <button
                        key={themeName}
                        type="button"
                        onClick={() => handleChange('colorTheme', themeName)}
                        className={`flex items-center gap-2 p-2 px-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition duration-150 cursor-pointer ${
                          isActive
                            ? `${themeObj.primary} text-white border-transparent shadow-sm`
                            : 'border-neutral-200/20 dark:border-neutral-800/40 bg-neutral-150/10 dark:bg-neutral-950/25 hover:bg-neutral-100 dark:hover:bg-neutral-950 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-white' : themeObj.primary}`} />
                        <span className="truncate">{themeName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-neutral-100/30 dark:bg-neutral-950/20 border border-neutral-200/20 dark:border-neutral-850 rounded-xl">
                <span className="inline-block text-[8px] font-mono font-bold bg-neutral-200/60 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 px-1.5 py-0.5 rounded uppercase tracking-wider mb-1.5">
                  SYSTEM CHECK
                </span>
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 leading-normal">
                  Invoice forms utilize standard light background layouts for PDF export compatibility. Dark theme is beautifully applied to dashboards, invoices tracking views, settings panel, and sidebar navigation guides.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
