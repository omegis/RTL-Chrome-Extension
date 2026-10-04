/**
 * Rotem Daily RTL - Custom RTL Rules & Element Picker
 * Version 2.8.1
 * Last update: 2026-10-04
 * Lets the user pick any element on any website. Elements matching the saved
 * selector get RTL whenever their text is Hebrew-dominant, on every visit.
 *
 * Loaded right after content.js in the same isolated world and reuses its
 * globals: isHebrewDominant, throttle, applyFont, injectGoogleFonts,
 * setInlineDirection, fontEnabled. Storage key "customRtlRules" maps
 * hostname -> [{ id, selector, createdAt }].
 */

const CUSTOM_RULES_KEY = 'customRtlRules';
const CUSTOM_FLAG = 'rtlCustom'; // dataset flag -> data-rtl-custom
const PICKER_Z_INDEX = '2147483647';
const MAX_SIMILAR_MATCHES = 50;
const MAX_SELECTOR_DEPTH = 5;
const SIMILARITY_ATTRIBUTES = ['data-testid', 'data-test-id', 'data-qa'];
// Rich-text editors that own their DOM and may re-render restyled children:
// ProseMirror/tiptap, Lexical, Slate, Draft.js, Quill
const RICH_TEXT_EDITOR_ROOTS = [
  '.ProseMirror',
  '[data-lexical-editor="true"]',
  '[data-slate-editor="true"]',
  '.public-DraftEditor-content',
  '.ql-editor'
].join(', ');

let customRules = [];          // Rules for the current hostname
let customEnabled = true;      // Mirrors rtlHelperEnabled
let customObserver = null;
let customTrailingTimer = null;
let customInputListener = null;
let pickerState = null;        // Non-null while the picker is active

/**
 * Storage key for this site's rules. file:// pages have no hostname — must
 * match getPickableHostname() in popup.js so the popup can list/remove them.
 * @returns {string}
 */
function getRulesHostKey() {
  return window.location.hostname || 'file';
}

// ---------------------------------------------------------------------------
// Rule application
// ---------------------------------------------------------------------------

/**
 * Returns all elements matching the current rules. Invalid selectors
 * (e.g. from a corrupted store) are skipped instead of breaking every rule.
 * @returns {HTMLElement[]}
 */
function getCustomRuleElements() {
  const elements = new Set();
  customRules.forEach(rule => {
    try {
      document.querySelectorAll(rule.selector).forEach(el => elements.add(el));
    } catch (error) {
      console.warn(`RTL Helper: Skipping invalid custom selector "${rule.selector}"`, error);
    }
  });
  return Array.from(elements);
}

/**
 * Reads an element's text; form fields hold their text in .value.
 * @param {HTMLElement} element
 * @returns {string}
 */
function getElementText(element) {
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    return element.value || '';
  }
  return element.textContent || '';
}

/**
 * Returns the rich-text editor root if the element is inside one (not the
 * root itself). Editors re-render children whose attributes change, so
 * styling them would loop: style -> re-render -> observer -> style.
 * The root itself keeps inline styles (verified on ChatGPT's ProseMirror).
 * @param {HTMLElement} element
 * @returns {HTMLElement|null}
 */
function getEnclosingEditorRoot(element) {
  const root = element.closest(RICH_TEXT_EDITOR_ROOTS);
  return root && root !== element ? root : null;
}

/**
 * Reads the rules map from a storage result, tolerating a corrupted value.
 * @param {Object} result chrome.storage.local.get result
 * @returns {Object} hostname -> rules array
 */
function readRulesMap(result) {
  const stored = result[CUSTOM_RULES_KEY];
  return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
}

function applyCustomRule(element) {
  if (getEnclosingEditorRoot(element)) return;
  setInlineDirection(element, isHebrewDominant(getElementText(element)), CUSTOM_FLAG);
}

function applyCustomRules() {
  if (!customEnabled || customRules.length === 0) return;
  getCustomRuleElements().forEach(applyCustomRule);
}

function clearCustomStyling() {
  document.querySelectorAll('[data-rtl-custom]').forEach(element => {
    setInlineDirection(element, false, CUSTOM_FLAG);
  });
}

function startCustomObserver() {
  stopCustomObserver();
  if (!customEnabled || customRules.length === 0) return;

  const throttledApply = throttle(applyCustomRules, 200);
  customObserver = new MutationObserver(() => {
    throttledApply();
    // The throttle is leading-only — a trailing pass catches the last burst
    clearTimeout(customTrailingTimer);
    customTrailingTimer = setTimeout(applyCustomRules, 250);
  });
  customObserver.observe(document.body, { childList: true, subtree: true, characterData: true });

  // Typing into inputs/textareas changes .value without any DOM mutation
  customInputListener = (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const matches = customRules.some(rule => {
      try {
        return target.matches(rule.selector);
      } catch (error) {
        return false;
      }
    });
    if (matches) applyCustomRule(target);
  };
  document.addEventListener('input', customInputListener, true);
}

function stopCustomObserver() {
  clearTimeout(customTrailingTimer);
  if (customObserver) {
    customObserver.disconnect();
    customObserver = null;
  }
  if (customInputListener) {
    document.removeEventListener('input', customInputListener, true);
    customInputListener = null;
  }
}

/**
 * Clears and re-applies everything — used after rules, toggle, or font change,
 * so removed rules leave no styling behind.
 */
function refreshCustomRules() {
  clearCustomStyling();
  if (customEnabled && customRules.length > 0) {
    if (fontEnabled) injectGoogleFonts();
    applyCustomRules();
    startCustomObserver();
  } else {
    stopCustomObserver();
  }
}

/**
 * Loads this site's rules and the enabled state, then refreshes.
 */
function loadCustomRules() {
  chrome.storage.local.get([CUSTOM_RULES_KEY, 'rtlHelperEnabled'], (result) => {
    const allRules = readRulesMap(result);
    const siteRules = allRules[getRulesHostKey()];
    customRules = Array.isArray(siteRules) ? siteRules.filter(r => r && typeof r.selector === 'string') : [];
    customEnabled = result.rtlHelperEnabled !== false;
    refreshCustomRules();
  });
}

/**
 * Saves a selector as a rule for this site (no-op if it already exists).
 * @param {string} selector
 * @param {Function} callback Called with true if a new rule was added
 */
function saveCustomRule(selector, callback) {
  chrome.storage.local.get([CUSTOM_RULES_KEY], (result) => {
    const allRules = readRulesMap(result);
    const hostname = getRulesHostKey();
    const siteRules = Array.isArray(allRules[hostname]) ? allRules[hostname] : [];

    if (siteRules.some(rule => rule.selector === selector)) {
      callback(false);
      return;
    }

    siteRules.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      selector,
      createdAt: new Date().toISOString()
    });
    allRules[hostname] = siteRules;
    // storage.onChanged reloads the rules in every tab of this site
    chrome.storage.local.set({ [CUSTOM_RULES_KEY]: allRules }, () => callback(true));
  });
}

// ---------------------------------------------------------------------------
// Selector generation ("all similar elements")
// ---------------------------------------------------------------------------

/**
 * Builds a selector segment for one element without positional pseudo-classes,
 * so siblings of the same kind match too. Classes with 3+ consecutive digits
 * are treated as build hashes and dropped.
 * @param {HTMLElement} element
 * @returns {string}
 */
function buildSelectorSegment(element) {
  const tag = element.tagName.toLowerCase();

  for (const attribute of SIMILARITY_ATTRIBUTES) {
    const value = element.getAttribute(attribute);
    if (value) return `${tag}[${attribute}="${CSS.escape(value)}"]`;
  }

  const classes = Array.from(element.classList)
    .filter(c => !/\d{3,}/.test(c))
    .slice(0, 3)
    .map(c => `.${CSS.escape(c)}`)
    .join('');
  return tag + classes;
}

/**
 * True for ids that look hand-written rather than generated (React useId,
 * numeric suffixes), so they are safe to anchor a selector across reloads.
 * @param {string} id
 * @returns {boolean}
 */
function isStableId(id) {
  return Boolean(id) && !/\d{3,}|^:|^_r_|^radix-/.test(id);
}

/**
 * Generates a selector that matches the picked element and similar ones.
 * Uses the shortest ancestor chain (at least 2 segments) that matches no more
 * than MAX_SIMILAR_MATCHES elements.
 * @param {HTMLElement} element
 * @returns {string}
 */
function generateSimilarSelector(element) {
  const segments = [];
  let anchor = null;
  let node = element;

  while (node && node !== document.body && node !== document.documentElement && segments.length < MAX_SELECTOR_DEPTH) {
    if (node !== element && isStableId(node.id)) {
      anchor = `#${CSS.escape(node.id)}`;
      break;
    }
    segments.unshift(buildSelectorSegment(node));
    node = node.parentElement;
  }

  let best = null;
  for (let length = Math.min(2, segments.length); length <= segments.length; length++) {
    const chain = segments.slice(-length).join(' > ');
    const candidates = anchor ? [`${anchor} ${chain}`, chain] : [chain];
    for (const selector of candidates) {
      let matches;
      try {
        matches = document.querySelectorAll(selector);
      } catch (error) {
        continue;
      }
      if (!Array.from(matches).includes(element)) continue;
      best = selector;
      if (matches.length <= MAX_SIMILAR_MATCHES) return selector;
    }
  }
  // Even the longest chain is broad — still better than nothing
  return best || segments.join(' > ');
}

// ---------------------------------------------------------------------------
// Element picker
// ---------------------------------------------------------------------------

function createPickerElement(styles) {
  const el = document.createElement('div');
  el.setAttribute('data-rtl-picker', 'true');
  Object.assign(el.style, {
    position: 'fixed',
    zIndex: PICKER_Z_INDEX,
    pointerEvents: 'none',
    boxSizing: 'border-box'
  }, styles);
  document.documentElement.appendChild(el);
  return el;
}

function showPickerToast(message) {
  const toast = createPickerElement({
    top: '16px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '8px 14px',
    borderRadius: '8px',
    background: '#111827',
    color: '#fff',
    font: '13px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    boxShadow: '0 4px 12px rgba(0,0,0,.25)'
  });
  toast.textContent = message;
  setTimeout(() => toast.remove(), 2500);
}

/**
 * Moves the highlight box and label onto the target's current position.
 * Cheap — no DOM queries — so it can run on every scroll.
 * @param {HTMLElement} target
 */
function positionPickerHighlight(target) {
  const { highlight, label } = pickerState;
  const rect = target.getBoundingClientRect();
  Object.assign(highlight.style, {
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    display: 'block'
  });
  label.style.top = `${Math.max(0, rect.top - 26)}px`;
  label.style.left = `${Math.max(0, rect.left)}px`;
  label.style.display = 'block';
}

function updatePickerHighlight(target) {
  const similar = (() => {
    try {
      return document.querySelectorAll(generateSimilarSelector(target)).length;
    } catch (error) {
      return 1;
    }
  })();
  pickerState.label.textContent = `${target.tagName.toLowerCase()} · ${similar} similar · click to fix RTL · Esc to cancel`;
  positionPickerHighlight(target);
}

function stopPicker() {
  if (!pickerState) return;
  const { highlight, label, handlers } = pickerState;
  Object.entries(handlers).forEach(([type, handler]) => {
    window.removeEventListener(type, handler, true);
  });
  highlight.remove();
  label.remove();
  pickerState = null;
}

function finishPicker(target) {
  // Inside a rich-text editor only the editor root can be styled safely
  const selector = generateSimilarSelector(getEnclosingEditorRoot(target) || target);
  stopPicker();

  saveCustomRule(selector, (added) => {
    if (!added) {
      showPickerToast('This element already has an RTL rule');
    } else if (!customEnabled) {
      showPickerToast('Rule saved — enable RTL Helper to apply it');
    } else {
      let count = 0;
      try {
        count = document.querySelectorAll(selector).length;
      } catch (error) {
        count = 1;
      }
      showPickerToast(`RTL fixed for ${count} element${count === 1 ? '' : 's'}`);
    }
  });
}

function startPicker() {
  if (pickerState) return;

  const highlight = createPickerElement({
    display: 'none',
    border: '2px solid #10b981',
    background: 'rgba(16, 185, 129, 0.12)',
    borderRadius: '3px'
  });
  const label = createPickerElement({
    display: 'none',
    padding: '3px 8px',
    borderRadius: '4px',
    background: '#10b981',
    color: '#fff',
    font: '12px -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    whiteSpace: 'nowrap'
  });

  const isPickable = (target) => target instanceof HTMLElement &&
    target !== document.body && target !== document.documentElement &&
    !target.hasAttribute('data-rtl-picker');

  // Swallow pointer events so picking never triggers the page's own actions
  const block = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  };

  const handlers = {
    mousemove: (event) => {
      // Selector generation queries the DOM — only redo it on a new target
      if (!isPickable(event.target)) return;
      // Highlight what will actually be saved (editor root inside rich-text editors)
      const target = getEnclosingEditorRoot(event.target) || event.target;
      if (target !== pickerState.lastTarget) {
        pickerState.lastTarget = target;
        updatePickerHighlight(target);
      }
    },
    click: (event) => {
      block(event);
      if (isPickable(event.target)) finishPicker(event.target);
    },
    mousedown: block,
    mouseup: block,
    pointerdown: block,
    pointerup: block,
    // Capture phase also catches scrolling inner containers (scroll doesn't bubble)
    scroll: () => {
      if (pickerState.lastTarget) positionPickerHighlight(pickerState.lastTarget);
    },
    keydown: (event) => {
      if (event.key === 'Escape') {
        block(event);
        stopPicker();
        showPickerToast('RTL picker cancelled');
      }
    }
  };

  pickerState = { highlight, label, handlers, lastTarget: null };
  Object.entries(handlers).forEach(([type, handler]) => {
    window.addEventListener(type, handler, true);
  });
}

// ---------------------------------------------------------------------------
// Wiring
// ---------------------------------------------------------------------------

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startPicker') {
    startPicker();
    sendResponse({ ok: true });
  } else if (request.action === 'toggleExtension') {
    customEnabled = request.enabled;
    refreshCustomRules();
  } else if (request.action === 'updateFont') {
    // content.js (registered first) has already updated fontEnabled/selectedFont
    refreshCustomRules();
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes[CUSTOM_RULES_KEY]) {
    loadCustomRules();
  }
});

loadCustomRules();
