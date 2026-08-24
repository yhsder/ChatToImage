import { useEffect, useRef, useState } from 'react';

import { useSession } from '@/core/auth/client';
import { useRouter } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';

import { focusGenerator, PROMPT_EVENT, PROMPT_ID } from './home-focus';

type ResultState =
  | 'example'
  | 'creating'
  | 'ready'
  | 'error'
  | 'timeout'
  | 'rejected';
type Ratio = '1:1' | '4:3' | '3:4' | '16:9';
type Style = 'auto' | 'photo' | 'illustration';

const PROMPT_MAX = 3000;
const REFERENCE_MAX = 4;
const DRAFT_KEY = 'cti.home-draft';

// Placeholder artwork reused as the "example" result visual until the real
// generation backend lands (see ADR-0001).
const ASTRONAUT_ART = (
  <svg
    viewBox="0 0 940 680"
    role="img"
    aria-labelledby="moon-title moon-desc"
    preserveAspectRatio="xMidYMid slice"
  >
    <title id="moon-title">Astronaut tending a glowing moon garden</title>
    <desc id="moon-desc">
      A stylized preview composition used to show the intended result layout.
    </desc>
    <defs>
      <radialGradient id="sky" cx="70%" cy="18%" r="90%">
        <stop offset="0" stopColor="#334f69" />
        <stop offset="0.62" stopColor="#14202f" />
        <stop offset="1" stopColor="#090d13" />
      </radialGradient>
      <radialGradient id="glow" cx="50%" cy="50%" r="50%">
        <stop offset="0" stopColor="#fff6a9" stopOpacity=".95" />
        <stop offset="1" stopColor="#ff5a1f" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="940" height="680" fill="url(#sky)" />
    <circle cx="737" cy="126" r="68" fill="#f8e7b0" />
    <circle cx="713" cy="110" r="11" fill="#d5c393" />
    <circle cx="765" cy="143" r="8" fill="#d5c393" />
    <path
      d="M0 505C160 450 278 484 406 516c160 41 344-20 534-78v242H0z"
      fill="#a9a99f"
    />
    <path
      d="M0 575c202-35 302 12 465 26 187 15 306-37 475-86v165H0z"
      fill="#777c78"
    />
    <g opacity=".8">
      <circle cx="204" cy="524" r="92" fill="url(#glow)" />
      <circle cx="370" cy="550" r="76" fill="url(#glow)" />
      <circle cx="643" cy="511" r="90" fill="url(#glow)" />
    </g>
    <g fill="#ffbb48">
      <circle cx="200" cy="514" r="10" />
      <circle cx="223" cy="540" r="8" />
      <circle cx="348" cy="548" r="9" />
      <circle cx="390" cy="525" r="7" />
      <circle cx="624" cy="521" r="10" />
      <circle cx="662" cy="498" r="8" />
    </g>
    <g stroke="#73ad76" strokeWidth="6" strokeLinecap="round">
      <path d="M200 520v48" />
      <path d="M223 545v37" />
      <path d="M348 554v42" />
      <path d="M390 531v54" />
      <path d="M624 527v48" />
      <path d="M662 504v62" />
    </g>
    <g transform="translate(470 328)">
      <ellipse cx="10" cy="252" rx="92" ry="22" fill="#31373b" opacity=".38" />
      <rect x="-42" y="70" width="112" height="142" rx="42" fill="#f3f0e8" />
      <rect x="-25" y="88" width="78" height="78" rx="20" fill="#d8d8cf" />
      <circle cx="14" cy="42" r="66" fill="#f3f0e8" />
      <circle cx="14" cy="42" r="47" fill="#274354" />
      <path
        d="M-20 28c22-20 52-25 77-7"
        fill="none"
        stroke="#89b6c6"
        strokeWidth="8"
        opacity=".6"
      />
      <path
        d="M-36 117l-72 71M67 122l66 47"
        fill="none"
        stroke="#f3f0e8"
        strokeWidth="30"
        strokeLinecap="round"
      />
      <path
        d="M-18 205l-26 74M45 205l30 74"
        fill="none"
        stroke="#f3f0e8"
        strokeWidth="32"
        strokeLinecap="round"
      />
      <rect x="-58" y="122" width="22" height="58" rx="6" fill="#ff5a1f" />
    </g>
    <path
      d="M603 514c-22-54-4-89 54-110"
      fill="none"
      stroke="#ff5a1f"
      strokeWidth="4"
      strokeDasharray="7 8"
    />
  </svg>
);

export function HomeGenerator() {
  const router = useRouter();
  const { data: session } = useSession();

  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState<Ratio>('1:1');
  const [style, setStyle] = useState<Style>('auto');
  const [references, setReferences] = useState(0);
  const [resultState, setResultState] = useState<ResultState>('example');
  const [isDragging, setIsDragging] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const promptRef = useRef<HTMLTextAreaElement>(null);
  const toastTimer = useRef<number | null>(null);

  const examplePrompt = m['home.hero.prompt_placeholder']();

  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }

  // Restore an interrupted draft (auth round-trip) and honor the dev-only
  // result toggle (`?result=error|timeout|rejected`).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forced = params.get('result');
    if (forced === 'error' || forced === 'timeout' || forced === 'rejected') {
      setResultState(forced);
    }
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as {
          prompt?: string;
          ratio?: Ratio;
          style?: Style;
        };
        setPrompt(draft.prompt ?? '');
        setRatio(draft.ratio ?? '1:1');
        setStyle(draft.style ?? 'auto');
        window.localStorage.removeItem(DRAFT_KEY);
        window.setTimeout(() => promptRef.current?.focus(), 100);
      }
    } catch {
      /* ignore malformed drafts */
    }
  }, []);

  // Let sibling blocks (the examples grid) push a prompt in.
  useEffect(() => {
    const onPrompt = (event: Event) => {
      setPrompt((event as CustomEvent<string>).detail);
    };
    window.addEventListener(PROMPT_EVENT, onPrompt);
    return () => window.removeEventListener(PROMPT_EVENT, onPrompt);
  }, []);

  function runGeneration() {
    setResultState('creating');
    window.setTimeout(() => setResultState('ready'), 1300);
  }

  function handleGenerate() {
    if (!prompt.trim() || resultState === 'creating') return;
    if (!session?.user) {
      try {
        window.localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ prompt, ratio, style })
        );
      } catch {
        /* storage unavailable */
      }
      router.push('/sign-in?redirect=/');
      return;
    }
    runGeneration();
  }

  function addReference() {
    if (references >= REFERENCE_MAX) {
      showToast(m['home.generator.reference_limit']());
      return;
    }
    setReferences((count) => count + 1);
  }

  function removeReference() {
    setReferences((count) => Math.max(0, count - 1));
  }

  const result = (() => {
    switch (resultState) {
      case 'example':
        return {
          status: m['home.result.example_label'](),
          title: m['home.result.example_title'](),
          description: `${m['home.result.prompt_used']()}: “${examplePrompt}”`,
          code: 'EXAMPLE',
        };
      case 'creating':
        return {
          status: m['home.result.loading_title'](),
          title: m['home.result.loading_title'](),
          description: m['home.result.loading_msg'](),
          code: 'CREATING',
        };
      case 'ready':
        return {
          status: m['home.result.success_title'](),
          title: m['home.result.success_title'](),
          description: `${m['home.result.prompt_used']()}: “${prompt}”`,
          code: 'SUCCESS',
        };
      case 'error':
        return {
          status: m['home.result.error_title'](),
          title: m['home.result.error_title'](),
          description: m['home.result.error_msg'](),
          code: 'ERROR',
        };
      case 'timeout':
        return {
          status: m['home.result.timeout_title'](),
          title: m['home.result.timeout_title'](),
          description: m['home.result.timeout_msg'](),
          code: 'TIMEOUT',
        };
      case 'rejected':
        return {
          status: m['home.result.reject_title'](),
          title: m['home.result.reject_title'](),
          description: m['home.result.reject_msg'](),
          code: 'REJECTED',
        };
    }
  })();

  const isFailed =
    resultState === 'error' ||
    resultState === 'timeout' ||
    resultState === 'rejected';

  return (
    <>
      <div className="generator" id="generator">
        <div
          className={`generator-main${isDragging ? 'is-dragging' : ''}`}
          onDragEnter={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            addReference();
          }}
        >
          <div className="prompt-field">
            <label className="field-label" htmlFor={PROMPT_ID}>
              {m['home.hero.prompt_label']()}
            </label>
            <div
              className={`prompt-compose${references > 0 ? 'has-references' : ''}`}
            >
              <div className="reference-strip" aria-label="Reference pictures">
                {Array.from({ length: references }).map((_, index) => (
                  <div
                    key={index}
                    className="reference-thumbnail"
                    role="img"
                    aria-label={`Reference picture ${index + 1}`}
                  >
                    <button
                      className="reference-remove"
                      type="button"
                      aria-label={`Remove reference picture ${index + 1}`}
                      onClick={removeReference}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  className="reference-button"
                  type="button"
                  aria-label="Add reference picture"
                  onClick={addReference}
                  disabled={references >= REFERENCE_MAX}
                >
                  <span className="meta">
                    {references} / {REFERENCE_MAX}
                  </span>
                  <span className="reference-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <rect
                        x="3"
                        y="4"
                        width="14"
                        height="14"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      />
                      <path
                        d="m4 15 4-4 3 3 2-2 4 4"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19 3v6M16 6h6"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>
              </div>
              <textarea
                ref={promptRef}
                id={PROMPT_ID}
                className="prompt-input"
                maxLength={PROMPT_MAX}
                placeholder={examplePrompt}
                value={prompt}
                onChange={(e) => {
                  const el = e.currentTarget;
                  setPrompt(el.value);
                  el.style.height = 'auto';
                  el.style.height = `${Math.max(88, el.scrollHeight)}px`;
                }}
              />
            </div>
            <p className="prompt-helper">{m['home.hero.prompt_helper']()}</p>
          </div>
        </div>

        <div className="generator-controls">
          <label className="control-field">
            <span className="field-label">
              {m['home.generator.ratio_label']()}
            </span>
            <select
              className="ratio-select"
              aria-label="Aspect ratio"
              value={ratio}
              onChange={(e) => setRatio(e.target.value as Ratio)}
            >
              <option value="1:1">{m['home.generator.ratio_square']()}</option>
              <option value="4:3">
                {m['home.generator.ratio_landscape']()}
              </option>
              <option value="3:4">
                {m['home.generator.ratio_portrait']()}
              </option>
              <option value="16:9">{m['home.generator.ratio_wide']()}</option>
            </select>
          </label>
          <div className="control-field">
            <span className="field-label">
              {m['home.generator.settings_label']()}
            </span>
            <button
              className="control-button"
              type="button"
              onClick={() => showToast(m['home.generator.settings_stub']())}
            >
              <span className="control-value">
                {m['home.generator.settings_value']()}
              </span>
              <span aria-hidden="true">⌄</span>
            </button>
          </div>
          <div className="control-field style-field">
            <span className="field-label">
              {m['home.generator.style_label']()}
            </span>
            <div className="style-shortcuts" aria-label="Style shortcuts">
              {(
                [
                  ['auto', m['home.generator.style_auto']()],
                  ['photo', m['home.generator.style_photo']()],
                  ['illustration', m['home.generator.style_illustration']()],
                ] as [Style, string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={`style-shortcut${style === value ? 'is-active' : ''}`}
                  onClick={() => setStyle(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <span className="prompt-counter">
            {prompt.length} / {PROMPT_MAX}
          </span>
          <button
            className="generate-button"
            type="button"
            onClick={handleGenerate}
            disabled={!prompt.trim() || resultState === 'creating'}
          >
            {resultState === 'creating'
              ? m['home.generator.creating']()
              : m['home.generator.generate']()}
          </button>
        </div>
      </div>

      <p className="generator-note">
        <span>{m['home.hero.cta_support']()}</span>
        <strong>{m['home.hero.failed_free']()}</strong>
      </p>

      <section
        className="result-stage"
        data-state={resultState}
        aria-live="polite"
        aria-labelledby="home-result-title"
      >
        <aside className="result-copy">
          <span className="status-chip">
            <span className="status-dot"></span>
            <span>{result.status}</span>
          </span>
          <div className="result-summary">
            <h2 id="home-result-title">{result.title}</h2>
            <p>{result.description}</p>
            {resultState === 'example' && (
              <button
                className="text-button"
                type="button"
                onClick={() => {
                  setPrompt(examplePrompt);
                  focusGenerator();
                }}
              >
                {m['home.result.try_this']()} ↑
              </button>
            )}
            {resultState === 'ready' && (
              <div className="result-actions">
                <button className="text-button" type="button">
                  {m['home.result.download']()}
                </button>
                <button
                  className="text-button"
                  type="button"
                  onClick={handleGenerate}
                >
                  {m['home.result.generate_another']()}
                </button>
              </div>
            )}
            {isFailed && (
              <div className="result-actions">
                <button
                  className="text-button"
                  type="button"
                  onClick={handleGenerate}
                >
                  {m['home.result.try_again']()}
                </button>
                <button
                  className="text-button"
                  type="button"
                  onClick={() => promptRef.current?.focus()}
                >
                  {m['home.result.edit_prompt']()}
                </button>
              </div>
            )}
          </div>
          <div className="result-facts">
            <div>
              <span>SHAPE</span>
              <strong>{ratio}</strong>
            </div>
            <div>
              <span>STATE</span>
              <strong>{result.code}</strong>
            </div>
            <div>
              <span>PROOF</span>
              <strong>REPLACE BEFORE LAUNCH</strong>
            </div>
          </div>
        </aside>
        <figure
          className="result-visual"
          aria-label="Preview artwork showing a small astronaut in a glowing lunar garden"
        >
          <span className="image-tag">
            Preview artwork · verify with production model
          </span>
          {ASTRONAUT_ART}
          <div className="creating-overlay" aria-hidden="true">
            <div className="creating-panel">
              <span className="meta">{m['home.generator.creating']()}</span>
              <strong>{m['home.result.loading_title']()}</strong>
              <p>{m['home.result.loading_msg']()}</p>
              <div className="progress-track">
                <div className="progress-bar"></div>
              </div>
            </div>
          </div>
        </figure>
      </section>

      <div
        className={`toast${toast ? 'is-visible' : ''}`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </>
  );
}
