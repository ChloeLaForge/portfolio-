import type { ElementType, ReactNode } from 'react';
import { useReveal } from '../lib/useReveal';

interface RevealProps {
  children?: ReactNode;
  /** Which element to render. Defaults to a div. */
  as?: ElementType;
  /** Stagger, in milliseconds. */
  delay?: number;
  /** Hairlines draw in from the left instead of fading up. */
  line?: boolean;
  className?: string;
  id?: string;
  /** Data attributes are forwarded to the rendered element. */
  [key: `data-${string}`]: unknown;
}

export function Reveal({ children, as, delay = 0, line = false, className = '', id, ...rest }: RevealProps) {
  const Tag = (as ?? 'div') as ElementType;
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      id={id}
      data-line={line || undefined}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}
