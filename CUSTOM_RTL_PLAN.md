# Custom RTL Element Picker — Plan (v2.8.0)

Let the user pick any element on any website; matching elements get RTL
(when their text is Hebrew-dominant) on every later visit to that site.

## Decisions (confirmed with user, 2026-10-04)
| Question | Decision |
|---|---|
| Site access | All sites up front (`<all_urls>` content script) |
| Rule scope | "All similar" — selector generalizes to siblings of the same kind |
| RTL mode | Auto-detect — RTL only when text is Hebrew-dominant |

## Phases
1. **Manifest / content.js guard** — single `<all_urls>` entry loading
   `content.js` then `custom-rules.js` (one entry, because two entries on the
   built-in sites would load the shared globals twice → `let` redeclaration
   error). `content.js` stays idle on unknown sites (no observer, no fonts).
2. **custom-rules.js** — rule storage, selector generator, applier with
   MutationObserver (only when the site has rules), element picker overlay.
3. **Popup** — "Pick element" button, list of rules for the current site with
   delete; toggle/font messages broadcast to all tabs.
4. **Docs** — README, CLAUDE.md, privacy policy (new broad permission).
5. **Verification** — live test of picker + selector + persistence.

## Storage schema (new key, existing keys unchanged)
```json
"customRtlRules": {
  "<hostname>": [ { "id": "lq3k2x", "selector": "main div.msg > p", "createdAt": "ISO-8601" } ]
}
```

## Selector generation ("all similar")
- Segment per element: `tag[data-testid=…]` if present, else `tag.class1.class2.class3`
  (classes with 3+ consecutive digits are dropped as likely build hashes).
- Walk up ≤ 5 levels; stop at an ancestor with a stable id (`#id`, descendant combinator).
- Use the shortest suffix (min 2 segments) that matches ≤ 50 elements.
- No `:nth-child`, so siblings of the same kind match too.

## Known limitations
- Top frame only (no iframes).
- Inside ProseMirror editors, pick the editor itself, not a paragraph —
  ProseMirror discards inline styles on its children.
- Tabs open before install/update must be reloaded once.
- Sites that rebuild class names on deploy may break saved selectors.
