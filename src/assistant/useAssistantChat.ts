import { useCallback, useRef, useState } from 'react';
import { MAX_HISTORY_TURNS, MAX_MESSAGE_CHARS, type AssistantPage, type ChatTurn } from '../../shared/assistant';
import type { AssistantErrorKey } from '../content/assistant';
import { ChatRequestError, sendChat } from './chatClient';

export interface ChatMessage extends ChatTurn {
  id: number;
}

/** Random, anonymous, and never stored in the browser: a reload starts a new session. */
function newSessionId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Conversation state for the assistant. It lives in memory only, so a
 * refresh starts fresh and nothing is kept in the browser (no cookies or
 * local storage). Only the most recent turns are sent with each question.
 */
export function useAssistantChat(page: AssistantPage) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<AssistantErrorKey | null>(null);
  const [sessionId] = useState(newSessionId);

  // Refs so a double-click or a fast Enter cannot slip past a stale render.
  const messagesRef = useRef<ChatMessage[]>([]);
  const busyRef = useRef(false);
  const nextId = useRef(1);
  const pageRef = useRef(page);
  pageRef.current = page;

  const commit = (next: ChatMessage[]) => {
    messagesRef.current = next;
    setMessages(next);
  };

  const ask = useCallback(async (message: string, history: ChatMessage[]) => {
    busyRef.current = true;
    setPending(true);
    setError(null);
    try {
      const reply = await sendChat({
        message,
        history: history.slice(-MAX_HISTORY_TURNS).map(({ role, content }) => ({ role, content })),
        currentPage: pageRef.current,
        sessionId,
      });
      commit([...messagesRef.current, { id: nextId.current++, role: 'assistant', content: reply }]);
    } catch (err) {
      setError(err instanceof ChatRequestError ? err.code : 'failed');
    } finally {
      busyRef.current = false;
      setPending(false);
    }
  }, [sessionId]);

  /** Returns true if the message was accepted, so the input knows whether to clear. */
  const send = useCallback(
    (raw: string): boolean => {
      const text = raw.trim();
      if (!text || text.length > MAX_MESSAGE_CHARS || busyRef.current) return false;
      const history = messagesRef.current;
      commit([...history, { id: nextId.current++, role: 'user', content: text }]);
      void ask(text, history);
      return true;
    },
    [ask],
  );

  /** Re-asks the last question after a failure without adding it to the transcript twice. */
  const retry = useCallback(() => {
    const all = messagesRef.current;
    const last = all[all.length - 1];
    if (busyRef.current || last?.role !== 'user') return;
    void ask(last.content, all.slice(0, -1));
  }, [ask]);

  return { messages, pending, error, send, retry };
}
