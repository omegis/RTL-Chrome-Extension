/**
 * RTL Helper Popup Script
 * Version 2.8.1
 * Last update: 2026-10-04
 * Handles the extension popup UI and communicates with content scripts,
 * including the custom RTL element picker and per-site rule list
 */

// Get current state when popup opens
chrome.storage.local.get(['rtlHelperEnabled', 'fontEnabled', 'selectedFont'], (result) => {
  const enabled = result.rtlHelperEnabled !== false; // Default to true
  updateUI(enabled);

  // Font settings
  const fontEnabled = result.fontEnabled === true; // Default to false
  const selectedFont = result.selectedFont || 'Frank Ruhl Libre';
  const fontCheckbox = document.getElementById('font-enabled');
  const fontSelect = document.getElementById('font-select');
  fontCheckbox.checked = fontEnabled;
  fontSelect.disabled = !fontEnabled;
  fontSelect.value = selectedFont;
});

// Toggle button click handler
document.getElementById('toggle-button').addEventListener('click', () => {
  chrome.storage.local.get(['rtlHelperEnabled'], (result) => {
    const currentEnabled = result.rtlHelperEnabled !== false;
    const newEnabled = !currentEnabled;
    
    // Save new state
    chrome.storage.local.set({ rtlHelperEnabled: newEnabled }, () => {
      updateUI(newEnabled);
      
      // Custom rules can exist on any site, so every tab gets the message
      broadcastToTabs({ action: 'toggleExtension', enabled: newEnabled });
    });
  });
});

// Font checkbox handler
document.getElementById('font-enabled').addEventListener('change', (e) => {
  const fontEnabled = e.target.checked;
  const fontSelect = document.getElementById('font-select');
  fontSelect.disabled = !fontEnabled;

  const selectedFont = fontSelect.value;
  chrome.storage.local.set({ fontEnabled, selectedFont }, () => {
    sendFontMessage(fontEnabled, selectedFont);
  });
});

// Font select handler
document.getElementById('font-select').addEventListener('change', (e) => {
  const selectedFont = e.target.value;
  const fontEnabled = document.getElementById('font-enabled').checked;
  chrome.storage.local.set({ selectedFont }, () => {
    if (fontEnabled) {
      sendFontMessage(fontEnabled, selectedFont);
    }
  });
});

// Send font settings to all tabs
function sendFontMessage(fontEnabled, selectedFont) {
  broadcastToTabs({ action: 'updateFont', fontEnabled, selectedFont });
}

/**
 * Sends a message to every tab, ignoring tabs without the content script
 * (chrome:// pages, tabs opened before the extension was installed/updated).
 * @param {Object} message
 */
function broadcastToTabs(message) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, message).catch(() => {});
    });
  });
}

// ---------------------------------------------------------------------------
// Custom RTL rules (element picker)
// ---------------------------------------------------------------------------

const CUSTOM_RULES_KEY = 'customRtlRules';

/**
 * Reads the rules map from a storage result, tolerating a corrupted value.
 * Mirrors readRulesMap() in custom-rules.js.
 * @param {Object} result chrome.storage.local.get result
 * @returns {Object} hostname -> rules array
 */
function readRulesMap(result) {
  const stored = result[CUSTOM_RULES_KEY];
  return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
}

/**
 * Returns the hostname of a tab the content script can run on, or null.
 * @param {chrome.tabs.Tab} tab
 * @returns {string|null}
 */
function getPickableHostname(tab) {
  if (!tab || !tab.url) return null;
  try {
    const url = new URL(tab.url);
    // 'file' fallback must match getRulesHostKey() in custom-rules.js
    return ['http:', 'https:', 'file:'].includes(url.protocol) ? (url.hostname || 'file') : null;
  } catch (error) {
    return null;
  }
}

function setPickerMessage(text) {
  document.getElementById('picker-message').textContent = text;
}

function renderCustomRules(hostname) {
  const list = document.getElementById('rules-list');
  list.textContent = '';

  chrome.storage.local.get([CUSTOM_RULES_KEY], (result) => {
    const allRules = readRulesMap(result);
    const siteRules = Array.isArray(allRules[hostname]) ? allRules[hostname] : [];

    document.getElementById('rules-count').textContent = siteRules.length ? `(${siteRules.length})` : '';

    siteRules.forEach(rule => {
      const item = document.createElement('li');
      item.className = 'rule-item';

      const selector = document.createElement('span');
      selector.className = 'rule-selector';
      selector.textContent = rule.selector;
      selector.title = rule.selector;

      const remove = document.createElement('button');
      remove.className = 'rule-remove';
      remove.textContent = '×';
      remove.title = 'Remove this rule';
      remove.addEventListener('click', () => removeCustomRule(hostname, rule.id));

      item.append(selector, remove);
      list.appendChild(item);
    });
  });
}

function removeCustomRule(hostname, ruleId) {
  chrome.storage.local.get([CUSTOM_RULES_KEY], (result) => {
    const allRules = readRulesMap(result);
    const siteRules = Array.isArray(allRules[hostname]) ? allRules[hostname] : [];
    const remaining = siteRules.filter(rule => rule && rule.id !== ruleId);
    if (remaining.length) {
      allRules[hostname] = remaining;
    } else {
      delete allRules[hostname];
    }
    // Tabs on this site re-apply via storage.onChanged
    chrome.storage.local.set({ [CUSTOM_RULES_KEY]: allRules }, () => renderCustomRules(hostname));
  });
}

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  const pickButton = document.getElementById('pick-button');
  const hostname = getPickableHostname(tab);

  if (!hostname) {
    pickButton.disabled = true;
    setPickerMessage("Can't run on this page");
    return;
  }

  document.getElementById('rules-host').textContent = hostname;
  renderCustomRules(hostname);

  pickButton.addEventListener('click', () => {
    chrome.tabs.sendMessage(tab.id, { action: 'startPicker' })
      .then(() => window.close())
      .catch(() => setPickerMessage('Reload this page, then try again'));
  });
});

// Update UI based on state
function updateUI(enabled) {
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');
  const infoText = document.getElementById('info-text');
  
  if (enabled) {
    statusDot.className = 'status-dot enabled';
    statusText.textContent = 'Enabled';
    infoText.textContent = 'Click to disable';
  } else {
    statusDot.className = 'status-dot disabled';
    statusText.textContent = 'Disabled';
    infoText.textContent = 'Click to enable';
  }
}