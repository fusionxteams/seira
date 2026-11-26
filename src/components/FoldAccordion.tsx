import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FoldAccordionItem {
  id: string;
  number: string;
  title: string;
  description: string;
}

interface FoldAccordionProps {
  items: FoldAccordionItem[];
}

const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';

/**
 * Hairline Fold-physics accordion: 0fr -> 1fr grid-row expansion with subtle blur settle.
 */
export function FoldAccordion({ items }: FoldAccordionProps) {
  const [openId, setOpenId] = useState<string>(items[0]?.id ?? '');

  return (
    <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? '' : item.id)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-center justify-between gap-4 py-6 text-left transition-colors hover:text-[var(--color-gold)]"
            >
              <div className="flex items-baseline gap-6">
                <span className="text-sm font-medium text-[var(--color-gold)]">{item.number}</span>
                <span className="font-[var(--font-display)] text-xl text-[var(--color-ink)] md:text-2xl">
                  {item.title}
                </span>
              </div>
              <ChevronDown
                className="h-5 w-5 shrink-0 text-[var(--color-gold)]"
                strokeWidth={1.5}
                aria-hidden="true"
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: `transform 420ms ${EASE_OUT}`,
                }}
              />
            </button>

            <div
              className="grid"
              style={{
                gridTemplateRows: isOpen ? '1fr' : '0fr',
                transition: `grid-template-rows 420ms ${EASE_OUT}`,
              }}
            >
              <div className="min-h-0 overflow-hidden">
                <p
                  className="pb-6 pl-10 text-base leading-relaxed text-[var(--color-ink-muted)]"
                  style={{
                    opacity: isOpen ? 1 : 0,
                    filter: isOpen ? 'blur(0px)' : 'blur(4px)',
                    transform: isOpen ? 'translateY(0)' : 'translateY(-6px)',
                    transition: isOpen
                      ? `opacity 300ms ${EASE_OUT} 80ms, filter 300ms ${EASE_OUT} 80ms, transform 420ms ${EASE_OUT}`
                      : `opacity 160ms ${EASE_OUT}, filter 160ms ${EASE_OUT}, transform 240ms ${EASE_OUT}`,
                  }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
