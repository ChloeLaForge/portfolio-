import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { MAX_MESSAGE_CHARS, type AssistantPage } from '../../shared/assistant';
import { assistantCopy, assistantErrors } from '../content/assistant';
import { projects } from '../content/projects';
import { RichText } from './RichText';
import { useAssistantChat } from './useAssistantChat';
import './assistant.css';

/** Which portfolio page the visitor is on, in the terms the server understands. */
function pageFor(pathname: string): AssistantPage {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (path === '/') return 'home';
  const id = projects.find((p) => p.route === path)?.id;
  if (id === 'barclay-woods') return 'barclay';
  return id ?? 'other';
}

const COUNTER_FROM = MAX_MESSAGE_CHARS - 100;

/** The warm first-visit glow on the launcher plays once per browser session. */
const GLOW_SEEN_KEY = 'portfolio-assistant-glow-seen';

const glowSeen = (): boolean => {
  try {
    return sessionStorage.getItem(GLOW_SEEN_KEY) === '1';
  } catch {
    return false;
  }
};

const markGlowSeen = () => {
  try {
    sessionStorage.setItem(GLOW_SEEN_KEY, '1');
  } catch {
    /* Storage can be blocked; the glow then simply plays again on the next visit. */
  }
};

/**
 * The portfolio assistant: a small launcher fixed to the bottom-right that
 * opens a chat panel over whatever page is showing. Mounted once in App so
 * the conversation survives route changes.
 */
export function PortfolioAssistant() {
  const { pathname } = useLocation();
  const chat = useAssistantChat(pageFor(pathname));
  const [open, setOpen] = useState(false);
  const [glow, setGlow] = useState(() => !glowSeen());
  const launcherRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // Hand focus back to the launcher when the panel closes.
  useEffect(() => {
    if (wasOpen.current && !open) launcherRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  useEffect(markGlowSeen, []);

  const openPanel = () => {
    setGlow(false);
    setOpen(true);
  };

  return (
    <div className="assistant">
      {open ? (
        <AssistantPanel chat={chat} onClose={() => setOpen(false)} />
      ) : (
        <button
          ref={launcherRef}
          type="button"
          className="assistant__launcher"
          data-glow={glow || undefined}
          onAnimationEnd={() => setGlow(false)}
          aria-label={assistantCopy.launcherLabel}
          aria-expanded="false"
          aria-haspopup="dialog"
          onClick={openPanel}
        >
          <span className="assistant__launcher-label" aria-hidden="true">
            {assistantCopy.launcherLabel}
          </span>
          <ChatIcon />
        </button>
      )}
    </div>
  );
}

function AssistantPanel({ chat, onClose }: { chat: ReturnType<typeof useAssistantChat>; onClose: () => void }) {
  const { messages, pending, error, send, retry } = chat;
  const [draft, setDraft] = useState('');
  const panelRef = useRef<HTMLElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const lastReplyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Open with the cursor ready on desktop; on touch, leave the keyboard down until asked for.
  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    (finePointer ? inputRef.current : panelRef.current)?.focus();
  }, []);

  // Keep the panel above the on-screen keyboard on phones.
  useEffect(() => {
    const viewport = window.visualViewport;
    const panel = panelRef.current;
    if (!viewport || !panel) return;
    const update = () => {
      panel.style.setProperty('--assistant-inset', `${Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)}px`);
      panel.style.setProperty('--assistant-vh', `${viewport.height}px`);
    };
    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);
    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
    };
  }, []);

  // A new reply scrolls to its first line so it reads from the top; anything else follows the bottom.
  const last = messages[messages.length - 1];
  useLayoutEffect(() => {
    const log = logRef.current;
    if (!log) return;
    if (last?.role === 'assistant' && !pending && lastReplyRef.current) {
      log.scrollTop = lastReplyRef.current.offsetTop - 8;
    } else {
      log.scrollTop = log.scrollHeight;
    }
  }, [last, pending, error]);

  const resizeInput = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const submit = (text: string) => {
    if (!send(text)) return;
    setDraft('');
    requestAnimationFrame(resizeInput);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit(draft);
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit(draft);
    }
  };

  const lastReplyIndex = messages.map((m) => m.role).lastIndexOf('assistant');
  const canSend = draft.trim().length > 0 && !pending;

  return (
    <section
      ref={panelRef}
      className="assistant__panel"
      role="dialog"
      aria-label={assistantCopy.title}
      tabIndex={-1}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose();
      }}
    >
      <header className="assistant__header">
        <div>
          <h2 className="assistant__title">{assistantCopy.title}</h2>
          <p className="label assistant__subtitle">{assistantCopy.subtitle}</p>
        </div>
        <button type="button" className="assistant__close" aria-label="Close assistant" onClick={onClose}>
          <CloseIcon />
        </button>
      </header>

      <div className="assistant__log" ref={logRef} role="log" aria-live="polite" aria-relevant="additions">
        <div className="assistant__msg" data-role="assistant">
          <p>{assistantCopy.intro}</p>
        </div>

        {messages.length === 0 && (
          <ul className="assistant__starters" aria-label="Suggested questions">
            {assistantCopy.starters.map((question) => (
              <li key={question}>
                <button type="button" className="assistant__starter" onClick={() => submit(question)} disabled={pending}>
                  {question}
                </button>
              </li>
            ))}
          </ul>
        )}

        {messages.map((message, index) => (
          <div
            key={message.id}
            className="assistant__msg"
            data-role={message.role}
            ref={index === lastReplyIndex ? lastReplyRef : undefined}
          >
            {message.role === 'assistant' ? <RichText text={message.content} /> : <p>{message.content}</p>}
          </div>
        ))}

        {pending && (
          <div className="assistant__msg assistant__msg--thinking" data-role="assistant">
            <span className="assistant__typing" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="label assistant__thinking">{assistantCopy.thinking}</span>
          </div>
        )}

        {error && !pending && (
          <div className="assistant__msg assistant__msg--error" data-role="assistant" role="alert">
            <p>{assistantErrors[error]}</p>
            {error !== 'rate_limited' && (
              <button type="button" className="assistant__retry" onClick={retry}>
                {assistantCopy.retry}
              </button>
            )}
          </div>
        )}
      </div>

      <form className="assistant__form" onSubmit={onSubmit}>
        <div className="assistant__field">
          <textarea
            ref={inputRef}
            className="assistant__input"
            rows={1}
            value={draft}
            maxLength={MAX_MESSAGE_CHARS}
            placeholder={assistantCopy.placeholder}
            aria-label="Message the portfolio assistant"
            enterKeyHint="send"
            onChange={(event) => {
              setDraft(event.target.value);
              resizeInput();
            }}
            onKeyDown={onInputKeyDown}
          />
          <button type="submit" className="assistant__send" aria-label="Send message" disabled={!canSend}>
            <SendIcon />
          </button>
        </div>
        {draft.length >= COUNTER_FROM && (
          <p className="assistant__count" aria-hidden="true">
            {draft.length}/{MAX_MESSAGE_CHARS}
          </p>
        )}
      </form>
    </section>
  );
}

function ChatIcon() {
  return (
    <svg className="assistant__icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 4.5h14A1.5 1.5 0 0 1 20.5 6v9a1.5 1.5 0 0 1-1.5 1.5h-7.2L8 20v-3.5H5A1.5 1.5 0 0 1 3.5 15V6A1.5 1.5 0 0 1 5 4.5Z" />
      <path d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01" strokeWidth="2" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
