import { motion } from 'motion/react';

export interface TabOption {
  value: string;
  label: string;
}

interface LiquidTabsProps {
  tabs: TabOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  layoutGroup?: string;
}

/**
 * Fluid glassmorphic segmented tab bar with spring-driven shared-layout highlight.
 */
export function LiquidTabs({
  tabs,
  value,
  onChange,
  ariaLabel,
  layoutGroup = 'liquid-tab-pill',
}: LiquidTabsProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex max-w-full flex-nowrap items-center gap-1 overflow-x-auto rounded-full border border-[var(--color-gold-light)]/40 bg-[var(--color-bg)]/75 p-1.5 backdrop-blur-md [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {tabs.map((tab) => {
        const isSelected = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(tab.value)}
            className={`relative cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              isSelected
                ? 'text-[var(--color-cream)]'
                : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
            }`}
          >
            {isSelected && (
              <motion.span
                layoutId={layoutGroup}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className="absolute inset-0 rounded-full bg-[var(--color-espresso)]"
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
