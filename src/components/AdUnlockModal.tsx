import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, ShieldAlert, CheckCircle, Sparkles, Tv, Clock } from 'lucide-react';
import { getThemeColors, ColorThemeName } from '../utils/theme';

interface AdUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlocked: () => void;
  title: string;
  description?: string;
  colorTheme?: ColorThemeName;
}

export default function AdUnlockModal({ isOpen, onClose, onUnlocked, title, description, colorTheme }: AdUnlockModalProps) {
  const colors = getThemeColors(colorTheme);
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [isFinished, setIsFinished] = useState(false);
  const [adSelected, setAdSelected] = useState(0);

  const mockAds = [
    {
      title: 'DevSpaces: Code Anywhere, Instantly',
      tagline: 'Zero configuration cloud developer environments with automated HMR, multi-player pair programming, and git integrations in a single click.',
      banner: 'bg-gradient-to-r from-blue-600 to-indigo-700',
      cta: 'Claim Your 100 Hours Free',
    },
    {
      title: 'Mocha Latte - Fuel for Freelancers',
      tagline: 'The subscription coffee delivery service crafted explicitly for developers. Ground, roasted daily, and delivered to your home workstation based on your commit activity.',
      banner: 'bg-gradient-to-r from-amber-700 to-amber-950',
      cta: 'Subscribe & Get FREE Mug',
    },
    {
      title: 'SaaSify: Launch in 5 Minutes',
      tagline: 'Bootstrapping your landing page, authentication, Stripe billing, and database in under 300 seconds. Save 50 hours of setup on your next web project.',
      banner: 'bg-gradient-to-r from-emerald-600 to-teal-800',
      cta: 'Join Beta Program',
    },
  ];

  useEffect(() => {
    if (isOpen) {
      setSecondsLeft(5);
      setIsFinished(false);
      setAdSelected(Math.floor(Math.random() * mockAds.length));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (secondsLeft <= 0) {
      setIsFinished(true);
      return;
    }

    const timer = setTimeout(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsLeft, isOpen]);

  const handleClaim = () => {
    onUnlocked();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-neutral-900/80 backdrop-blur-sm"
          onClick={() => {
            if (isFinished) onClose();
          }}
        />

        {/* Modal content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative max-w-md w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden z-10 border border-white/20 dark:border-neutral-800/40"
        >
          {/* Header */}
          <div className="p-4 border-b border-neutral-200/20 dark:border-neutral-800/60 flex justify-between items-center bg-white/40 dark:bg-neutral-950/20 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <Tv className={`w-5 h-5 ${colors.primaryText} ${colors.primaryTextDark}`} />
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm">
                SPONSORED ANNOUNCEMENT
              </span>
            </div>
            {isFinished ? (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl ${colors.bgLight} ${colors.bgLightDark} ${colors.bulletText} font-mono text-xs font-semibold`}>
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>Ad: {secondsLeft}s</span>
              </div>
            )}
          </div>

          {/* Ad Body */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 font-sans">
              {description || 'Watch this brief promotional clip to unlock premium features forever in this session.'}
            </p>

            {/* Video container representation */}
            <div className={`aspect-[16/9] w-full rounded-xl ${mockAds[adSelected].banner} p-6 flex flex-col justify-between text-white relative shadow-inner overflow-hidden mb-6`}>
              <div className="absolute top-0 right-0 p-3 opacity-20">
                <Sparkles className="w-20 h-20" />
              </div>

              <div className="flex justify-between items-start">
                <span className="text-xs font-mono px-2 py-0.5 bg-white/20 rounded-full font-bold uppercase tracking-wider backdrop-blur">
                  ADVERTISER
                </span>
                <span className="text-xs font-mono text-white/75">
                  Powered by AdServer
                </span>
              </div>

              <div>
                <h4 className="text-lg font-extrabold leading-tight mb-1 text-white drop-shadow">
                  {mockAds[adSelected].title}
                </h4>
                <p className="text-xs text-white/90 drop-shadow line-clamp-2">
                  {mockAds[adSelected].tagline}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/60">
                  {isFinished ? '✓ Completed' : 'Streaming...'}
                </span>
                <span className="text-xs font-bold underline cursor-pointer bg-white/10 hover:bg-white/20 transition px-2.5 py-1 rounded-md">
                  {mockAds[adSelected].cta}
                </span>
              </div>
            </div>

            {/* Status / Activation controls */}
            {isFinished ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/30 dark:border-emerald-900/50 flex items-start gap-3 backdrop-blur-sm"
              >
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-250">
                    Premium Feature Unlocked!
                  </h4>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                    You can now generate high-fidelity PDFs. Thank you for supporting us!
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="p-4 rounded-xl bg-neutral-200/20 dark:bg-neutral-800/20 backdrop-blur-sm border border-neutral-200/20 dark:border-neutral-800/40 flex items-center justify-center gap-2">
                <Play className={`w-4 h-4 ${colors.primaryText} ${colors.primaryTextDark} animate-pulse`} />
                <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  Reward unlocks in {secondsLeft} seconds...
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-white/40 dark:bg-neutral-950/20 border-t border-neutral-200/20 dark:border-neutral-800/60 flex justify-end gap-3 backdrop-blur-xs">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-neutral-200/30 dark:border-neutral-700 bg-white/40 dark:bg-neutral-900/30 hover:bg-white/70 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-semibold rounded-xl transition cursor-pointer backdrop-blur-xs shadow-sm"
            >
              {isFinished ? 'Close' : 'Skip Ad'}
            </button>
            <button
              onClick={handleClaim}
              disabled={!isFinished}
              className={`px-5 py-2 text-white text-sm font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                isFinished
                  ? `${colors.primary} ${colors.primaryHover} shadow-md`
                  : 'bg-neutral-300/40 dark:bg-neutral-800/40 text-neutral-400 dark:text-neutral-500 cursor-not-allowed border border-neutral-200/10'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Claim Unlock</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
