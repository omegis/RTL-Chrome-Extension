/**
 * RTL Helper for Notion & Claude
 * Version 2.0.0: Added support for Claude website and enable/disable toggle.
 * This script runs on Notion and Claude pages and aligns text blocks to RTL
 * if their first letter is a Hebrew character.
 */

// Extension state management
let extensionEnabled = true;
let observer = null;

/**
 * Finds the first actual letter in a string, ignoring spaces, emojis, and symbols.
 * @param {string} str The string to search.
 * @returns {string|null} The first letter found, or null if no letters exist.
 */
function findFirstLetter(str) {
  const match = str.match(/\p{L}/u);
  return match ? match[0] : null;
}

/**
 * Determines the current website type
 * @returns {string} 'notion' or 'claude'
 */
function getWebsiteType() {
  return window.location.hostname === 'www.notion.so' ? 'notion' : 'claude';
}

/**
 * Applies RTL styling to Notion blocks
 */
function alignNotionBlocks() {
  const notionBlocks = document.querySelectorAll('div[data-block-id]');

  notionBlocks.forEach(block => {
    if (block.dataset.rtlChecked) {
      return;
    }

    const text = block.textContent.trim();
    if (text.length > 0) {
      const firstLetter = findFirstLetter(text);

      if (firstLetter && /[\u0590-\u05FF]/.test(firstLetter)) {
        // Apply RTL to editable content
        const editableElement = block.querySelector('[contenteditable="true"]');
        if (editableElement) {
          editableElement.style.direction = 'rtl';
          editableElement.style.textAlign = 'right';
        }

        // Handle lists
        const isBulletedList = block.classList.contains('notion-bulleted_list-block');
        const isNumberedList = block.classList.contains('notion-numbered_list-block');

        if (isBulletedList || isNumberedList) {
          const flexContainer = block.firstElementChild;
          if (flexContainer && flexContainer.style.display === 'flex') {
            flexContainer.style.flexDirection = 'row-reverse';
            const bulletBox = flexContainer.querySelector('.notion-list-item-box-left');
            if (bulletBox) {
              bulletBox.style.marginRight = '0px';
              bulletBox.style.marginLeft = '2px';
            }
          }
        }
      }
    }

    block.dataset.rtlChecked = 'true';
  });
}

/**
 * Applies RTL styling to Claude message blocks
 */
function alignClaudeBlocks() {
  // Target message content areas - both user and assistant messages
  const messageSelectors = [
    '[data-testid*="message"]',
    '[class*="message"]',
    '.font-user-message',
    '.font-claude-message',
    'div[class*="whitespace-pre-wrap"]'
  ];

  const messageBlocks = document.querySelectorAll(messageSelectors.join(', '));

  messageBlocks.forEach(block => {
    if (block.dataset.rtlChecked) {
      return;
    }

    const text = block.textContent.trim();
    if (text.length > 0) {
      const firstLetter = findFirstLetter(text);

      if (firstLetter && /[\u0590-\u05FF]/.test(firstLetter)) {
        block.style.direction = 'rtl';
        block.style.textAlign = 'right';
        
        // Handle nested content
        const paragraphs = block.querySelectorAll('p, div');
        paragraphs.forEach(p => {
          const pText = p.textContent.trim();
          const pFirstLetter = findFirstLetter(pText);
          if (pFirstLetter && /[\u0590-\u05FF]/.test(pFirstLetter)) {
            p.style.direction = 'rtl';
            p.style.textAlign = 'right';
          }
        });
      }
    }

    block.dataset.rtlChecked = 'true';
  });
}

/**
 * Main function to align Hebrew blocks based on website type
 */
function alignHebrewBlocks() {
  if (!extensionEnabled) return;

  const websiteType = getWebsiteType();
  
  if (websiteType === 'notion') {
    alignNotionBlocks();
  } else if (websiteType === 'claude') {
    alignClaudeBlocks();
  }
}

/**
 * Creates and inserts the dropdown menu
 */
function createToggleButton() {
  // Remove existing elements if they exist
  const existingContainer = document.getElementById('rtl-helper-container');
  if (existingContainer) {
    existingContainer.remove();
  }

  // Create container
  const container = document.createElement('div');
  container.id = 'rtl-helper-container';
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  `;

  // Create toggle button (smaller and less intrusive)
  const toggleButton = document.createElement('button');
  toggleButton.id = 'rtl-helper-toggle';
  toggleButton.innerHTML = '🔤';
  toggleButton.style.cssText = `
    background: #6366f1;
    color: white;
    border: none;
    padding: 6px 8px;
    border-radius: 50%;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    transition: all 0.2s ease;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  // Create dropdown menu
  const dropdown = document.createElement('div');
  dropdown.id = 'rtl-helper-dropdown';
  dropdown.style.cssText = `
    position: absolute;
    top: 42px;
    right: 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    min-width: 180px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-5px);
    transition: all 0.2s ease;
    z-index: 10001;
  `;

  // Create dropdown content
  const dropdownContent = `
    <div style="padding: 8px 0;">
      <div style="padding: 8px 16px; font-size: 12px; font-weight: 600; color: #6b7280; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center;">
        <span>RTL Helper</span>
        <button id="rtl-hide-btn" style="
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-size: 16px;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 3px;
          transition: all 0.2s ease;
        " title="Hide menu">×</button>
      </div>
      <button id="rtl-enable-btn" style="
        width: 100%;
        padding: 8px 16px;
        border: none;
        background: none;
        text-align: left;
        cursor: pointer;
        font-size: 14px;
        color: #374151;
        transition: background-color 0.2s ease;
        display: flex;
        align-items: center;
        gap: 8px;
      ">
        <span style="color: ${extensionEnabled ? '#10b981' : '#6b7280'};">●</span>
        ${extensionEnabled ? 'Enabled' : 'Disabled'}
      </button>
      <div style="padding: 4px 16px; font-size: 11px; color: #9ca3af;">
        Click to ${extensionEnabled ? 'disable' : 'enable'}
      </div>
    </div>
  `;

  dropdown.innerHTML = dropdownContent;

  // Add hover effects for dropdown button
  const enableBtn = dropdown.querySelector('#rtl-enable-btn');
  enableBtn.addEventListener('mouseenter', () => {
    enableBtn.style.backgroundColor = '#f9fafb';
  });
  enableBtn.addEventListener('mouseleave', () => {
    enableBtn.style.backgroundColor = 'transparent';
  });

  // Add click handler for enable/disable
  enableBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleExtension();
    hideDropdown();
  });

  // Add hover effects and click handler for hide button
  const hideBtn = dropdown.querySelector('#rtl-hide-btn');
  hideBtn.addEventListener('mouseenter', () => {
    hideBtn.style.backgroundColor = '#f3f4f6';
    hideBtn.style.color = '#ef4444';
  });
  hideBtn.addEventListener('mouseleave', () => {
    hideBtn.style.backgroundColor = 'transparent';
    hideBtn.style.color = '#9ca3af';
  });
  hideBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    hideEntireMenu();
  });

  // Assemble elements
  container.appendChild(toggleButton);
  container.appendChild(dropdown);
  document.body.appendChild(container);

  // Add toggle button effects
  toggleButton.addEventListener('mouseenter', () => {
    toggleButton.style.transform = 'scale(1.1)';
    toggleButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  });
  
  toggleButton.addEventListener('mouseleave', () => {
    toggleButton.style.transform = 'scale(1)';
    toggleButton.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
  });

  // Add click handler for dropdown toggle
  toggleButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown();
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      hideDropdown();
    }
  });

  // Helper functions for dropdown
  function toggleDropdown() {
    const isVisible = dropdown.style.visibility === 'visible';
    if (isVisible) {
      hideDropdown();
    } else {
      showDropdown();
    }
  }

  function showDropdown() {
    dropdown.style.opacity = '1';
    dropdown.style.visibility = 'visible';
    dropdown.style.transform = 'translateY(0)';
  }

  function hideDropdown() {
    dropdown.style.opacity = '0';
    dropdown.style.visibility = 'hidden';
    dropdown.style.transform = 'translateY(-5px)';
  }

  // Function to hide the entire menu
  function hideEntireMenu() {
    chrome.storage.local.set({ rtlHelperMenuHidden: true });
    container.style.display = 'none';
  }
}

/**
 * Toggles the extension on/off
 */
function toggleExtension() {
  extensionEnabled = !extensionEnabled;
  
  // Save state to chrome storage
  chrome.storage.local.set({ rtlHelperEnabled: extensionEnabled });
  
  // Update dropdown content
  updateDropdownContent();

  if (extensionEnabled) {
    // Re-enable observer and process existing content
    startObserver();
    alignHebrewBlocks();
  } else {
    // Stop observer and reset RTL styling
    stopObserver();
    resetRTLStyling();
  }
}

/**
 * Updates the dropdown content to reflect current state
 */
function updateDropdownContent() {
  const enableBtn = document.getElementById('rtl-enable-btn');
  const dropdown = document.getElementById('rtl-helper-dropdown');
  
  if (enableBtn && dropdown) {
    const dropdownContent = `
      <div style="padding: 8px 0;">
        <div style="padding: 8px 16px; font-size: 12px; font-weight: 600; color: #6b7280; border-bottom: 1px solid #f3f4f6; display: flex; justify-content: space-between; align-items: center;">
          <span>RTL Helper</span>
          <button id="rtl-hide-btn" style="
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            font-size: 16px;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 3px;
            transition: all 0.2s ease;
          " title="Hide menu">×</button>
        </div>
        <button id="rtl-enable-btn" style="
          width: 100%;
          padding: 8px 16px;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
          color: #374151;
          transition: background-color 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <span style="color: ${extensionEnabled ? '#10b981' : '#6b7280'};">●</span>
          ${extensionEnabled ? 'Enabled' : 'Disabled'}
        </button>
        <div style="padding: 4px 16px; font-size: 11px; color: #9ca3af;">
          Click to ${extensionEnabled ? 'disable' : 'enable'}
        </div>
      </div>
    `;
    
    dropdown.innerHTML = dropdownContent;
    
    // Re-attach event listeners for enable button
    const newEnableBtn = dropdown.querySelector('#rtl-enable-btn');
    newEnableBtn.addEventListener('mouseenter', () => {
      newEnableBtn.style.backgroundColor = '#f9fafb';
    });
    newEnableBtn.addEventListener('mouseleave', () => {
      newEnableBtn.style.backgroundColor = 'transparent';
    });
    newEnableBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleExtension();
      const container = document.getElementById('rtl-helper-container');
      const dropdown = document.getElementById('rtl-helper-dropdown');
      if (container && dropdown) {
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        dropdown.style.transform = 'translateY(-5px)';
      }
    });

    // Re-attach event listeners for hide button
    const newHideBtn = dropdown.querySelector('#rtl-hide-btn');
    newHideBtn.addEventListener('mouseenter', () => {
      newHideBtn.style.backgroundColor = '#f3f4f6';
      newHideBtn.style.color = '#ef4444';
    });
    newHideBtn.addEventListener('mouseleave', () => {
      newHideBtn.style.backgroundColor = 'transparent';
      newHideBtn.style.color = '#9ca3af';
    });
    newHideBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const container = document.getElementById('rtl-helper-container');
      if (container) {
        chrome.storage.local.set({ rtlHelperMenuHidden: true });
        container.style.display = 'none';
      }
    });
  }
}

/**
 * Resets all RTL styling applied by the extension
 */
function resetRTLStyling() {
  const websiteType = getWebsiteType();
  
  if (websiteType === 'notion') {
    const blocks = document.querySelectorAll('div[data-block-id][data-rtl-checked]');
    blocks.forEach(block => {
      const editableElement = block.querySelector('[contenteditable="true"]');
      if (editableElement) {
        editableElement.style.direction = '';
        editableElement.style.textAlign = '';
      }
      
      const flexContainer = block.firstElementChild;
      if (flexContainer) {
        flexContainer.style.flexDirection = '';
        const bulletBox = flexContainer.querySelector('.notion-list-item-box-left');
        if (bulletBox) {
          bulletBox.style.marginRight = '';
          bulletBox.style.marginLeft = '';
        }
      }
      
      delete block.dataset.rtlChecked;
    });
  } else if (websiteType === 'claude') {
    const messageSelectors = [
      '[data-testid*="message"][data-rtl-checked]',
      '[class*="message"][data-rtl-checked]',
      '.font-user-message[data-rtl-checked]',
      '.font-claude-message[data-rtl-checked]',
      'div[class*="whitespace-pre-wrap"][data-rtl-checked]'
    ];
    
    const blocks = document.querySelectorAll(messageSelectors.join(', '));
    blocks.forEach(block => {
      block.style.direction = '';
      block.style.textAlign = '';
      
      const paragraphs = block.querySelectorAll('p, div');
      paragraphs.forEach(p => {
        p.style.direction = '';
        p.style.textAlign = '';
      });
      
      delete block.dataset.rtlChecked;
    });
  }
}

/**
 * Starts the mutation observer
 */
function startObserver() {
  if (observer) {
    observer.disconnect();
  }
  
  observer = new MutationObserver(() => {
    alignHebrewBlocks();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/**
 * Stops the mutation observer
 */
function stopObserver() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

/**
 * Initializes the extension
 */
function initializeExtension() {
  // Load saved state from chrome storage
  chrome.storage.local.get(['rtlHelperEnabled', 'rtlHelperMenuHidden'], (result) => {
    extensionEnabled = result.rtlHelperEnabled !== false; // Default to true
    const menuHidden = result.rtlHelperMenuHidden === true; // Default to false
    
    if (!menuHidden) {
      createToggleButton();
    }
    
    if (extensionEnabled) {
      startObserver();
      alignHebrewBlocks();
    }
    
    const websiteType = getWebsiteType();
    console.log(`RTL Helper v2.0.0 is loaded for ${websiteType}! Status: ${extensionEnabled ? 'ENABLED' : 'DISABLED'}, Menu: ${menuHidden ? 'HIDDEN' : 'VISIBLE'}`);
  });
}

/**
 * Adds keyboard shortcut to show hidden menu
 */
function addKeyboardShortcut() {
  document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+R to show menu
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
      e.preventDefault();
      chrome.storage.local.get(['rtlHelperMenuHidden'], (result) => {
        if (result.rtlHelperMenuHidden === true) {
          chrome.storage.local.set({ rtlHelperMenuHidden: false });
          createToggleButton();
          console.log('RTL Helper menu restored! (Ctrl+Shift+R)');
        }
      });
    }
  });
}

// Initialize when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeExtension();
    addKeyboardShortcut();
  });
} else {
  initializeExtension();
  addKeyboardShortcut();
}

