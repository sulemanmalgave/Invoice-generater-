import { useEffect } from 'react';
import { getThemeColors, ColorThemeName } from '../../utils/theme';
import {
  Receipt,
  FileText,
  Image,
  Sparkles,
  Zap,
  Smartphone,
  ShieldAlert,
  Inbox,
  Globe,
  Heart
} from 'lucide-react';

interface AboutUsViewProps {
  colorTheme?: ColorThemeName;
}

export default function AboutUsView({ colorTheme = 'indigo' }: AboutUsViewProps) {
  const colors = getThemeColors(colorTheme);

  // Dynamic SEO Page Title & Meta Description on mount
  useEffect(() => {
    document.title = 'About Us | Freelancer Invoice Generator';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Freelancer Invoice Generator is a free online invoice generation tool designed for freelancers, small businesses, professionals, and independent service providers to create invoices quickly without complicated software.');
    }
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in relative z-10 pb-12">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
          <Globe className={`w-6 h-6 ${colors.primaryText} ${colors.primaryTextDark}`} />
          <span>About Us</span>
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-300 mt-1">
          Learn more about Freelancer Invoice Generator, our mission, and the core features.
        </p>
      </div>

      {/* Hero Intro Banner */}
      <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md border border-neutral-200/30 dark:border-neutral-800/40 rounded-2xl p-6 sm:p-8 space-y-4 hover:bg-white/70 dark:hover:bg-neutral-900/45 duration-300">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white pb-3 border-b border-neutral-200/20 dark:border-neutral-800/60">
          Our Mission
        </h2>
        
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          <strong>Freelancer Invoice Generator</strong> is a free online invoice generation tool designed specifically for freelancers, small businesses, professionals, and independent service providers. 
        </p>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Our core goal is to enable users to create polished, professional invoices quickly and effortlessly on any device—without needing complicated, bloated accounting software or credit card sign-ups. We believe that getting paid for your hard work should be simple, clean, and fast.
        </p>
      </div>

      {/* Grid of Key Features */}
      <div className="space-y-4">
        <h3 className="text-xs uppercase tracking-widest font-extrabold text-neutral-500 dark:text-neutral-400 font-mono pl-1">
          Core Features
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div className="bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md border border-neutral-200/20 dark:border-neutral-800/30 p-5 rounded-2xl flex gap-3.5 hover:border-neutral-300 dark:hover:border-neutral-700 transition">
            <div className={`p-2.5 rounded-xl ${colors.bgLight} ${colors.bgLightDark} h-fit shrink-0`}>
              <Receipt className={`w-5 h-5 ${colors.primaryText} ${colors.primaryTextDark}`} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Professional Invoice Generation
              </h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-normal">
                Easily draft complete itemized receipts, custom item descriptions, and tailored metadata structures on-the-fly.
              </p>
            </div>
          </div>

          <div className="bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md border border-neutral-200/20 dark:border-neutral-800/30 p-5 rounded-2xl flex gap-3.5 hover:border-neutral-300 dark:hover:border-neutral-700 transition">
            <div className={`p-2.5 rounded-xl ${colors.bgLight} ${colors.bgLightDark} h-fit shrink-0`}>
              <FileText className={`w-5 h-5 ${colors.primaryText} ${colors.primaryTextDark}`} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-neutral-900 dark:text-white tracking-tight">
                PDF Invoice Export
              </h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-normal">
                Download fully aligned, high-resolution PDF copies ready to send straight to your client's inbox or accounts team.
              </p>
            </div>
          </div>

          <div className="bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md border border-neutral-200/20 dark:border-neutral-800/30 p-5 rounded-2xl flex gap-3.5 hover:border-neutral-300 dark:hover:border-neutral-700 transition">
            <div className={`p-2.5 rounded-xl ${colors.bgLight} ${colors.bgLightDark} h-fit shrink-0`}>
              <Image className={`w-5 h-5 ${colors.primaryText} ${colors.primaryTextDark}`} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Company Logo Uploads
              </h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-normal">
                Import your firm logo or monogram within seconds. No external storage needed—handles images smoothly via local client processing.
              </p>
            </div>
          </div>

          <div className="bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md border border-neutral-200/20 dark:border-neutral-800/30 p-5 rounded-2xl flex gap-3.5 hover:border-neutral-300 dark:hover:border-neutral-700 transition">
            <div className={`p-2.5 rounded-xl ${colors.bgLight} ${colors.bgLightDark} h-fit shrink-0`}>
              <Sparkles className={`w-5 h-5 ${colors.primaryText} ${colors.primaryTextDark}`} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Custom Invoice Branding
              </h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-normal">
                Modify primary brand color coordinates, toggle watermark presence, and establish saved generic terms/notes configurations.
              </p>
            </div>
          </div>

          <div className="bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md border border-neutral-200/20 dark:border-neutral-800/30 p-5 rounded-2xl flex gap-3.5 hover:border-neutral-300 dark:hover:border-neutral-700 transition">
            <div className={`p-2.5 rounded-xl ${colors.bgLight} ${colors.bgLightDark} h-fit shrink-0`}>
              <Zap className={`w-5 h-5 ${colors.primaryText} ${colors.primaryTextDark}`} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Fast & Easy Creation
              </h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-normal">
                An streamlined workspace layout keeps editing elements accessible with real-time preview outputs updated on every keystroke.
              </p>
            </div>
          </div>

          <div className="bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md border border-neutral-200/20 dark:border-neutral-800/30 p-5 rounded-2xl flex gap-3.5 hover:border-neutral-300 dark:hover:border-neutral-700 transition">
            <div className={`p-2.5 rounded-xl ${colors.bgLight} ${colors.bgLightDark} h-fit shrink-0`}>
              <Smartphone className={`w-5 h-5 ${colors.primaryText} ${colors.primaryTextDark}`} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Mobile-Friendly Experience
              </h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 leading-normal">
                Crafted meticulously for fingers of all shapes and sizes. Handle drafting tasks, status changes, or previews on-the-go.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Ownership & Footer details card */}
      <div className="bg-neutral-900/10 dark:bg-neutral-900/50 border border-neutral-200/20 dark:border-neutral-800/30 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
            OPERATED BY
          </span>
          <span className="block text-sm font-bold text-neutral-900 dark:text-white leading-tight">
            Malgave Solutions
          </span>
          <span className="block text-xs text-neutral-500 dark:text-neutral-400">
            Proudly based in India
          </span>
        </div>

        <a 
          href="mailto:sulemanmalgave1@gmail.com"
          className={`inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-white text-xs font-bold leading-none ${colors.primary} ${colors.primaryHover} shadow-sm transition`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Contact Email Support</span>
        </a>
      </div>
    </div>
  );
}
