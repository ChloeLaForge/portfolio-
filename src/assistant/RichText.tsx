import { Fragment, type ReactNode } from 'react';

/**
 * Renders the small slice of Markdown the assistant is told to use:
 * paragraphs, "-" bullets, numbered lists and **bold**. Built from React
 * elements, never raw HTML, so model output cannot inject markup.
 */

const BULLET = /^\s*(?:[-*•])\s+(.*)$/;
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/;

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') && part.length > 4 ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <Fragment key={i}>{part.replace(/\*\*/g, '')}</Fragment>
    ),
  );
}

type Block = { kind: 'p'; text: string } | { kind: 'ul' | 'ol'; items: string[] };

function parse(source: string): Block[] {
  const blocks: Block[] = [];
  for (const line of source.split('\n')) {
    if (!line.trim()) {
      blocks.push({ kind: 'p', text: '' }); // paragraph break marker
      continue;
    }
    const bullet = BULLET.exec(line);
    const numbered = bullet ? null : NUMBERED.exec(line);
    const item = bullet?.[1] ?? numbered?.[1];
    const kind = bullet ? 'ul' : numbered ? 'ol' : 'p';
    const last = blocks[blocks.length - 1];

    if (item !== undefined && (kind === 'ul' || kind === 'ol')) {
      if (last && last.kind === kind) last.items.push(item);
      else blocks.push({ kind, items: [item] });
    } else if (last && last.kind === 'p' && last.text) {
      last.text += ` ${line.trim()}`; // soft-wrapped line continues the paragraph
    } else {
      blocks.push({ kind: 'p', text: line.trim() });
    }
  }
  return blocks.filter((b) => b.kind !== 'p' || b.text);
}

export function RichText({ text }: { text: string }) {
  return (
    <>
      {parse(text).map((block, i) => {
        if (block.kind === 'p') return <p key={i}>{inline(block.text)}</p>;
        const List = block.kind;
        return (
          <List key={i}>
            {block.items.map((item, j) => (
              <li key={j}>{inline(item)}</li>
            ))}
          </List>
        );
      })}
    </>
  );
}
