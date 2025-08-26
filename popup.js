/**
 * RTL Helper Popup Script
 * Version 2.2.0
 * Last update: 2025-08-25
 * Handles the extension popup UI and communicates with content scripts
 */

// Get current state when popup opens
chrome.storage.local.get(['rtlHelperEnabled'], (result) => {
  const enabled = result.rtlHelperEnabled !== false; // Default to true
  updateUI(enabled);
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
            tab.url.includes('gemini.google.com')
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