# Chat assistant: Sid

A small website assistant that answers questions about packages, prices, timings, areas and how to start. It never takes payment, books anything or promises anything.

## How a message is handled (`api/chat.ts`)

1. **Gate:** POST only, own-origin check, per-IP rate limit (20 messages per 10 minutes, best effort in memory; add a Vercel Firewall rule for a hard limit), zod validation, last 12 turns, each message cleaned and capped at 500 characters.
2. **Direct answers:** greetings, price, timing, "talk to a person" and "start" questions are answered straight from our own data (`classify` in `api/_lib/chat/retrieve.ts`). The numbers are exact and no model quota is used.
3. **Retrieval:** everything else is ranked against `api/_lib/chat/knowledge.ts` with a small BM25-style scorer (stop words, synonyms, extra weight for curated keywords and titles). The top three documents become the only context the model gets.
4. **Model:** Gemini first, then Grok (`CHAT_PROVIDER_ORDER` to change), 12 second timeout each, short replies, keys held server-side and sent in headers.
5. **Check on the way out (`checkReply`):** any price that is not on our list, any guarantee, response-time promise, award, rating, customer-count or years-in-business claim replaces the whole reply with a safe fallback. Links are limited to our own paths, other URLs and HTML are stripped.
6. **Fail closed:** with no key set, or if every provider fails, the chat says it is offline or unavailable and points to the contact form. Messages are never logged; only the provider and failure reason are.

Prompt injection: the system prompt tells the model to ignore instructions in user text, and an obvious attempt adds an explicit warning to the prompt. The output check is the real safety net.

## Setup

1. Add `GEMINI_API_KEY` (free key from Google AI Studio) and/or `XAI_API_KEY` in Vercel > Settings > Environment Variables. Optional: `GEMINI_MODEL`, `XAI_MODEL`, `CHAT_PROVIDER_ORDER`. Set `SITE_URL` as for the forms.
2. Redeploy. Open the site, click "Ask Sid".
3. Model names and free-tier limits change. If replies stop, check the logs for `chat providers failed` and the provider's current model names.

Be aware: free AI tiers can be rate limited and may let the provider use prompts to improve its products. The privacy page says so and the chat asks people not to share sensitive details. Check xAI's current pricing; their API may need paid credits.

## Keeping it honest

- `tests/api/chat.test.ts` checks the knowledge base prices against `src/data/packages.ts`, so the two cannot drift. If you change a price, change both.
- Add facts to the knowledge base only when the public site already says them.
- The widget is hidden on checkout and onboarding pages and sits above the sticky action bar on /preview and /start on phones.

## Interface

Launcher bottom right (round on phones, "Ask Sid" pill on desktop), panel 390x640 on desktop, a full-height sheet on phones that follows the visual viewport so the input stays above the keyboard. Suggested questions, typing indicator, Enter to send, Escape to close, focus returned to the launcher, conversation kept in the tab (session storage) and clearable.
