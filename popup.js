/**
 * RTL Helper Popup Script
 * Version 2.6.1
 * Last update: 2026-04-18
 * Handles the extension popup UI and communicates with content scripts
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
      
      // Send message to all tabs to update their state
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          if (tab.url && (
            tab.url.includes('notion.so') ||
            tab.url.includes('claude.ai') ||
            tab.url.includes('gemini.google.com') ||
            tab.url.includes('dash.bunny.net') ||
            tab.url.includes('app.manychat.com') ||
            tab.url.includes('creators.spotify.com')
          )) {
            chrome.tabs.sendMessage(tab.id, { 
              action: 'toggleExtension', 
              enabled: newEnabled 
            }).catch(() => {
              // Ignore errors for tabs that don't have content script loaded
            });
          }
        });
      });
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

// Send font settings to all relevant tabs
function sendFontMessage(fontEnabled, selectedFont) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      if (tab.url && (
        tab.url.includes('notion.so') ||
        tab.url.includes('claude.ai') ||
        tab.url.includes('gemini.google.com') ||
        tab.url.includes('dash.bunny.net') ||
        tab.url.includes('app.manychat.com') ||
        tab.url.includes('creators.spotify.com')
      )) {
        chrome.tabs.sendMessage(tab.id, {
          action: 'updateFont',
          fontEnabled,
          selectedFont
        }).catch(() => {});
      }
    });
  });
}

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