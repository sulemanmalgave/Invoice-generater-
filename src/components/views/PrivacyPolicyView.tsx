import { useEffect } from 'react';
import { getThemeColors, ColorThemeName } from '../../utils/theme';
import { ShieldCheck, Calendar, Lock, Database, Trash2, EyeOff, Cookie, ShieldAlert, Mail } from 'lucide-react';

interface PrivacyPolicyViewProps {
  colorTheme?: ColorThemeName;
}

export default function PrivacyPolicyView({ colorTheme = 'indigo' }: PrivacyPolicyViewProps) {
  const colors = getThemeColors(colorTheme);

  // Dynamic SEO Page Title & Meta Description on mount
  useEffect(() => {
    document.title = 'Privacy Policy | Freelancer Invoice Generator';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Privacy Policy for Freelancer Invoice Generator by Malgave Solutions. Learn about how we value your privacy, process invoices entirely on your device, and handle ad cookies.');
    }
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in relative z-10 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className={`w-6 h-6 ${colors.primaryText} ${colors.primaryTextDark}`} />
          <span>Privacy Policy</span>
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-300 mt-1 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>Effective Date: June 6, 2026 • Malgave Solutions</span>
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-neutral-200/30 dark:border-neutral-800/40 rounded-2xl p-6 sm:p-8 space-y-6 hover:bg-white/70 dark:hover:bg-neutral-900/45 duration-300">
        
        {/* Intro */}
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed italic border-l-2 pl-3 border-neutral-300 dark:border-neutral-700">
          At Freelancer Invoice Generator, operated by Malgave Solutions (India), the privacy of our visitors is extremely important to us. This Privacy Policy document outlines the types of information handled by this website and how we ensure a zero-server data leakage policy.
        </p>

        {/* 1. Invoice Generation */}
        <section className="space-y-2.5 pt-4 border-t border-neutral-200/10 dark:border-neutral-800/60">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Lock className={`w-4 h-4 ${colors.primaryText} ${colors.primaryTextDark}`} />
            <span>1. Invoice Generation</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            "Invoice generation occurs entirely on the user's device and no personal invoice data is transmitted to or stored on our servers." All processing, calculation, mathematical summation, and PDF rendering operations are executed locally within your client-side browser.
          </p>
        </section>

        {/* 2. Data Collection */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Database className={`w-4 h-4 ${colors.primaryText} ${colors.primaryTextDark}`} />
            <span>2. Data Collection</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            "We do not collect, store, sell, or share invoice information entered by users." Any client details, itemizations, rate structures, tax valuations, or final summaries are yours and yours alone.
          </p>
        </section>

        {/* 3. Logo Uploads */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Trash2 className={`w-4 h-4 ${colors.primaryText} ${colors.primaryTextDark}`} />
            <span>3. Logo Uploads</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            "Uploaded logos and images are processed locally within the user's browser and are not stored on our servers." The tool leverages base64 URL compression models to store drafts strictly inside your browser's private Sandboxed LocalStorage. No graphic assets are ever uploaded to cloud buckets or database nodes.
          </p>
        </section>

        {/* 4. Analytics */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <EyeOff className={`w-4 h-4 ${colors.primaryText} ${colors.primaryTextDark}`} />
            <span>4. Analytics</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            "The application does not use third-party analytics trackers to collect user behavior data." We believe in offering an ad-supported premium drafting pipeline without imposing telemetry overhead or tracker profiling.
          </p>
        </section>

        {/* 5. Cookies and Advertising */}
        <section className="space-y-2.5 bg-neutral-100/40 dark:bg-neutral-950/20 p-4 border border-neutral-200/20 dark:border-neutral-850 rounded-xl">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <Cookie className="w-4 h-4 text-amber-500" />
            <span>5. Cookies and Advertising</span>
          </h2>
          <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 space-y-3 leading-relaxed">
            <p>
              "Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website and other websites."
            </p>
            <p>
              "Google's advertising cookies enable Google and its partners to serve ads based on users' visits to this website."
            </p>
            <p className="font-medium bg-white/50 dark:bg-neutral-900/30 p-2 border border-neutral-250/25 dark:border-neutral-800 rounded-lg">
              "Users may opt out of personalized advertising by visiting Google's Ads Settings." Alternatively, visitors can opt out of some third-party vendor's use of cookies for personalized advertising by visiting{' '}
              <a 
                href="https://optout.aboutads.info" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`underline hover:text-neutral-900 dark:hover:text-white`}
              >
                aboutads.info
              </a>.
            </p>
          </div>
        </section>

        {/* 6. Security */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>6. Security</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
            "We take reasonable measures to provide a secure experience, but users are responsible for protecting their own devices and information." Ensure you secure your system, passwords, or backups, as all data persistence relies directly on your private local device storage.
          </p>
        </section>

        {/* 7. Contact */}
        <section className="space-y-2.5 pt-4 border-t border-neutral-200/10 dark:border-neutral-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Mail className={`w-4 h-4 ${colors.primaryText} ${colors.primaryTextDark}`} />
              <span>7. Privacy Questions Contact</span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              For any questions or feedback regarding this policy statement, reach out to us at:
            </p>
          </div>
          <a
            href="mailto:sulemanmalgave1@gmail.com"
            className="text-xs text-neutral-900 dark:text-white hover:underline bg-neutral-100/50 dark:bg-neutral-800/40 hover:bg-neutral-200/50 p-2 px-3 rounded-lg border border-neutral-200/20 dark:border-neutral-800/20 text-center font-bold font-mono inline-block shrink-0"
          >
            sulemanmalgave1@gmail.com
          </a>
        </section>

      </div>
    </div>
  );
}
