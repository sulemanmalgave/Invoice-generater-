import { useEffect } from 'react';
import { getThemeColors, ColorThemeName } from '../../utils/theme';
import { FileText, Calendar, CheckSquare, Coins, UserCheck, ShieldAlert, Scale, Sliders, Mail } from 'lucide-react';

interface TermsOfServiceViewProps {
  colorTheme?: ColorThemeName;
}

export default function TermsOfServiceView({ colorTheme = 'indigo' }: TermsOfServiceViewProps) {
  const colors = getThemeColors(colorTheme);

  // Dynamic SEO Page Title & Meta Description on mount
  useEffect(() => {
    document.title = 'Terms of Service | Freelancer Invoice Generator';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Terms of Service for Freelancer Invoice Generator by Malgave Solutions. Professional guidelines on free usage, limitations of liability, and advertising policies.');
    }
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in relative z-10 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
          <FileText className={`w-6 h-6 ${colors.primaryText} ${colors.primaryTextDark}`} />
          <span>Terms of Service</span>
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Effective Date: June 6, 2026 • Malgave Solutions</span>
        </p>
      </div>

      {/* Main Content Container */}
      <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-neutral-200/30 dark:border-neutral-800/40 rounded-2xl p-6 sm:p-8 space-y-6 hover:bg-white/70 dark:hover:bg-neutral-900/45 duration-300">
        
        {/* Intro */}
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed italic border-l-2 pl-3 border-neutral-300 dark:border-neutral-700">
          Welcome to Freelancer Invoice Generator. These Terms of Service ("Terms") govern your access to and use of our website and services operated by Malgave Solutions. Please read them carefully.
        </p>

        {/* 1. Acceptance of Terms */}
        <section className="space-y-2.5 pt-4 border-t border-neutral-200/10 dark:border-neutral-800/60">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <UserCheck className={`w-4 h-4 ${colors.primaryText} ${colors.primaryTextDark}`} />
            <span>1. Acceptance of Terms</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            By accessing or using our website and invoice generation utilities, you signify that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these Terms, you may not access or use the service.
          </p>
        </section>

        {/* 2. Free Service */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Coins className={`w-4 h-4 ${colors.primaryText} ${colors.primaryTextDark}`} />
            <span>2. Free Service</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            The Freelancer Invoice Generator is provided free of charge and is supported by advertising. Users are granted access to generate invoices, download PDFs, and recover offline drafts without incurring subscription payments or setup costs.
          </p>
        </section>

        {/* 3. User Responsibility */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <CheckSquare className={`w-4 h-4 ${colors.primaryText} ${colors.primaryTextDark}`} />
            <span>3. User Responsibility</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            You are fully and exclusively responsible for the accuracy, completeness, and legality of all invoice information you create, enter, transmit, or distribute using the tool. You warrant that all billed clients, item hours, rate figures, tax values, and contact records are true and accurate.
          </p>
        </section>

        {/* 4. No Legal or Tax Advice */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Scale className={`w-4 h-4 ${colors.primaryText} ${colors.primaryTextDark}`} />
            <span>4. No Legal or Tax Advice</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            The calculations, invoice templates, data guidelines, and suggestions provided on this website are structured purely as general guidance helper tools. This website does not provide legal, accounting, tax, financial, or custom regulatory advice. Please consult with certified accounting experts or legal counsel for complex corporate tax, state, or federal compliance questions.
          </p>
        </section>

        {/* 5. Limitation of Liability */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>5. Limitation of Liability</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Malgave Solutions, including its team, stakeholders, and partners, shall not be liable for any direct, indirect, incidental, special, exemplary, or consequential losses, damages, tax penalties, audit issues, accounting errors, collection failures, or business decisions resulting from the use of or inability to use generated invoices, documents, or template outputs.
          </p>
        </section>

        {/* 6. Availability */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Sliders className={`w-4 h-4 ${colors.primaryText} ${colors.primaryTextDark}`} />
            <span>6. Availability</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            We reserve the right to modify, suspend, update, or discontinue any features, layout behaviors, data systems, or the entire website program at any time and without prior notification or liability.
          </p>
        </section>

        {/* 7. Advertising */}
        <section className="space-y-2.5 bg-neutral-100/40 dark:bg-neutral-950/20 p-4 border border-neutral-200/20 dark:border-neutral-850 rounded-xl">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Coins className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>7. Advertising & Monetization</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            The website may display advertisements provided by third-party advertising networks, such as Google AdSense. In return for offering high-grade responsive features free of charge, the application relies on non-intrusive banner integrations and rewarded action modalities.
          </p>
        </section>

        {/* 8. Contact */}
        <section className="space-y-2.5 pt-4 border-t border-neutral-200/10 dark:border-neutral-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Mail className={`w-4 h-4 ${colors.primaryText} ${colors.primaryTextDark}`} />
              <span>8. Legal Contact Details</span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              For any questions regarding these terms, please contact:
            </p>
          </div>
          <a
            href="mailto:sulemanmalgave1@gmail.com"
            className="text-xs text-neutral-900 dark:text-white hover:underline bg-neutral-100/50 dark:bg-neutral-800/40 hover:bg-neutral-200/50 p-2 px-3 rounded-lg border border-neutral-200/20 dark:border-neutral-200/20 text-center font-bold font-mono inline-block shrink-0"
          >
            sulemanmalgave1@gmail.com
          </a>
        </section>

      </div>
    </div>
  );
}
