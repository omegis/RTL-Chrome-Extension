/**
 * Rotem Daily RTL - RTL Helper for Multiple Websites
 * Version 2.4.1: Fixed ManyChat to target visible div._content_okm14_17 (dual-display system).
 * Last update: 2025-09-30
 * This script runs on Notion, Claude, Gemini, Bunny.net, and ManyChat pages and aligns text blocks to RTL
 * if their first letter is a Hebrew character.
 */

// Extension state management
let extensionEnabled = true;
let observer = null;
let bunnyEventListeners = new Map(); // Store event listeners for cleanup
let manychatEventListeners = new Map(); // Store event listeners for cleanup

/**
 * Throttle function to limit execution frequency
 * @param {Function} func The function to throttle
 * @param {number} limit Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

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
 * @returns {string} 'notion', 'claude', 'gemini', 'bunny', or 'manychat'
 */
function getWebsiteType() {
  const hostname = window.location.hostname;
  if (hostname === 'www.notion.so') return 'notion';
  if (hostname === 'claude.ai') return 'claude';
  if (hostname === 'gemini.google.com') return 'gemini';
  if (hostname === 'dash.bunny.net') return 'bunny';
  if (hostname === 'app.manychat.com') return 'manychat';
  return 'unknown';
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
    'div[class*="whitespace-pre-wrap"]',
    '#markdown-artifact',  // Research documents
    '.font-claude-response'  // Claude response content
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
        
        // Handle nested content - including research document elements
        const contentElements = block.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, li, ul, ol');
        contentElements.forEach(element => {
          const elemText = element.textContent.trim();
          const elemFirstLetter = findFirstLetter(elemText);
          if (elemFirstLetter && /[\u0590-\u05FF]/.test(elemFirstLetter)) {
            element.style.direction = 'rtl';
            element.style.textAlign = 'right';
            
            // Special handling for lists
            if (element.tagName === 'UL' || element.tagName === 'OL') {
              element.style.paddingRight = '20px';
              element.style.paddingLeft = '0';
            }
            
            if (element.tagName === 'LI') {
              element.style.paddingRight = '15px';
              element.style.paddingLeft = '0';
            }
          }
        });
      }
    }

    block.dataset.rtlChecked = 'true';
  });
}

/**
 * Applies RTL styling to Gemini Canvas blocks
 */
function alignGeminiBlocks() {
  // Debug logging
  console.log('RTL Helper: Checking for Gemini content...');
  
  // Target Gemini Canvas content areas - more specific selectors
  const canvasSelectors = [
    '.ProseMirror',
    '.immersive-editor.markdown',
    'immersive-editor .immersive-editor-container',
    '.immersive-editor-container .ProseMirror',
    '[contenteditable="true"].ProseMirror',
    'immersive-panel',
    'extended-response-panel'
  ];

  // Try each selector individually for better debugging
  let foundElements = false;
  canvasSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      console.log(`RTL Helper: Found ${elements.length} elements with selector: ${selector}`);
      foundElements = true;
      
      elements.forEach(block => {
        // Skip if already checked
        if (block.dataset.rtlChecked) {
          return;
        }
        
        // For ProseMirror specifically, we need to handle it differently
        if (block.classList.contains('ProseMirror') || selector.includes('ProseMirror')) {
          // Process direct children for better control
          const directElements = block.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, ul, ol, blockquote, code');
          
          directElements.forEach(element => {
            // Skip if already processed
            if (element.dataset.rtlProcessed) return;
            
            const text = element.textContent.trim();
            if (text.length > 0) {
              const firstLetter = findFirstLetter(text);
              
              if (firstLetter && /[\u0590-\u05FF]/.test(firstLetter)) {
                console.log(`RTL Helper: Applying RTL to element: ${element.tagName}, text: ${text.substring(0, 50)}...`);
                
                element.style.direction = 'rtl';
                element.style.textAlign = 'right';
                
                // Handle list items specially
                if (element.tagName === 'LI') {
                  element.style.paddingRight = '20px';
                  element.style.paddingLeft = '0';
                  // Also check parent list
                  const parentList = element.closest('ul, ol');
                  if (parentList && !parentList.dataset.rtlProcessed) {
                    parentList.style.direction = 'rtl';
                    parentList.style.paddingRight = '20px';
                    parentList.style.paddingLeft = '0';
                    parentList.dataset.rtlProcessed = 'true';
                  }
                }
                
                // Handle nested ul/ol within lists
                if (element.tagName === 'UL' || element.tagName === 'OL') {
                  element.style.paddingRight = '20px';
                  element.style.paddingLeft = '0';
                }
              }
              
              element.dataset.rtlProcessed = 'true';
            }
          });
        } else {
          // For non-ProseMirror elements, use the broader approach
          const textElements = block.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, div:not(.ProseMirror), span');
          
          textElements.forEach(element => {
            if (element.dataset.rtlProcessed) return;
            
            const text = element.textContent.trim();
            if (text.length > 0) {
              const firstLetter = findFirstLetter(text);
              
              if (firstLetter && /[\u0590-\u05FF]/.test(firstLetter)) {
                element.style.direction = 'rtl';
                element.style.textAlign = 'right';
                
                if (element.tagName === 'LI') {
                  element.style.paddingRight = '20px';
                  element.style.paddingLeft = '0';
                }
                
                if (element.tagName === 'UL' || element.tagName === 'OL') {
                  element.style.paddingRight = '20px';
                  element.style.paddingLeft = '0';
                }
              }
              
              element.dataset.rtlProcessed = 'true';
            }
          });
        }
        
        block.dataset.rtlChecked = 'true';
      });
    }
  });
  
  if (!foundElements) {
    console.log('RTL Helper: No Gemini Canvas elements found yet. Will retry on next mutation.');
  }
}

/**
 * Applies RTL styling to Bunny.net form elements
 */
function alignBunnyBlocks() {
  // Target Bunny.net form inputs and textareas
  const bunnySelectors = [
    'input.bn-input__input.bn-form__control__input',
    'textarea.bn-form__control__input'
  ];

  const formElements = document.querySelectorAll(bunnySelectors.join(', '));

  formElements.forEach(element => {
    if (element.dataset.rtlChecked) {
      return;
    }

    // For inputs, check the value; for empty inputs, we'll apply RTL on focus
    const text = element.value.trim();

    // Add event listeners for dynamic content
    if (!element.dataset.rtlListenerAdded) {
      // Create listener function and store reference
      const inputListener = () => {
        const currentText = element.value.trim();
        if (currentText.length > 0) {
          const firstLetter = findFirstLetter(currentText);
          if (firstLetter && /[\u0590-\u05FF]/.test(firstLetter)) {
            element.style.direction = 'rtl';
            element.style.textAlign = 'right';
          } else {
            element.style.direction = 'ltr';
            element.style.textAlign = 'left';
          }
        }
      };

      // Add listener and store reference for cleanup
      element.addEventListener('input', inputListener);
      bunnyEventListeners.set(element, inputListener);
      element.dataset.rtlListenerAdded = 'true';
    }

    // Check current content
    if (text.length > 0) {
      const firstLetter = findFirstLetter(text);
      if (firstLetter && /[\u0590-\u05FF]/.test(firstLetter)) {
        element.style.direction = 'rtl';
        element.style.textAlign = 'right';
      }
    }

    element.dataset.rtlChecked = 'true';
  });
}

/**
 * Applies RTL styling to ManyChat textarea elements and their visible counterparts
 */
function alignManychatBlocks() {
  // Target ManyChat textarea elements
  const manychatSelectors = [
    'textarea._input_okm14_1',
    'textarea._texInput_t2ybz_1'
  ];

  const textareas = document.querySelectorAll(manychatSelectors.join(', '));

  textareas.forEach(element => {
    if (element.dataset.rtlChecked) {
      return;
    }

    // Find the visible content div (ManyChat's dual-display system)
    const parent = element.parentElement;
    const visibleDiv = parent ? parent.querySelector('div._content_okm14_17') : null;

    // Check current value
    const text = element.value.trim();

    // Add event listeners for dynamic content
    if (!element.dataset.rtlListenerAdded) {
      // Create listener function and store reference
      const inputListener = () => {
        const currentText = element.value.trim();
        if (currentText.length > 0) {
          const firstLetter = findFirstLetter(currentText);
          if (firstLetter && /[\u0590-\u05FF]/.test(firstLetter)) {
            // Apply RTL to both textarea and visible div
            element.style.direction = 'rtl';
            element.style.textAlign = 'right';
            if (visibleDiv) {
              visibleDiv.style.direction = 'rtl';
              visibleDiv.style.textAlign = 'right';
            }
          } else {
            // Apply LTR to both textarea and visible div
            element.style.direction = 'ltr';
            element.style.textAlign = 'left';
            if (visibleDiv) {
              visibleDiv.style.direction = 'ltr';
              visibleDiv.style.textAlign = 'left';
            }
          }
        }
      };

      // Add listener and store reference for cleanup
      element.addEventListener('input', inputListener);
      manychatEventListeners.set(element, inputListener);
      element.dataset.rtlListenerAdded = 'true';
    }

    // Check current content and apply to both elements
    if (text.length > 0) {
      const firstLetter = findFirstLetter(text);
      if (firstLetter && /[\u0590-\u05FF]/.test(firstLetter)) {
        element.style.direction = 'rtl';
        element.style.textAlign = 'right';
        if (visibleDiv) {
          visibleDiv.style.direction = 'rtl';
          visibleDiv.style.textAlign = 'right';
        }
      }
    }

    element.dataset.rtlChecked = 'true';
    if (visibleDiv) {
      visibleDiv.dataset.rtlChecked = 'true';
    }
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
  } else if (websiteType === 'gemini') {
    alignGeminiBlocks();
  } else if (websiteType === 'bunny') {
    alignBunnyBlocks();
  } else if (websiteType === 'manychat') {
    alignManychatBlocks();
  }
}

/**
 * Listener for messages from popup
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleExtension') {
    extensionEnabled = request.enabled;
    
    if (extensionEnabled) {
      // Re-enable observer and process existing content
      startObserver();
      alignHebrewBlocks();
    } else {
      // Stop observer and reset RTL styling
      stopObserver();
      resetRTLStyling();
    }
    
    console.log(`RTL Helper: Extension ${extensionEnabled ? 'enabled' : 'disabled'} via popup`);
  }
});



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
      'div[class*="whitespace-pre-wrap"][data-rtl-checked]',
      '#markdown-artifact[data-rtl-checked]',
      '.font-claude-response[data-rtl-checked]'
    ];
    
    const blocks = document.querySelectorAll(messageSelectors.join(', '));
    blocks.forEach(block => {
      block.style.direction = '';
      block.style.textAlign = '';
      
      const contentElements = block.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, li, ul, ol');
      contentElements.forEach(element => {
        element.style.direction = '';
        element.style.textAlign = '';
        element.style.paddingRight = '';
        element.style.paddingLeft = '';
      });
      
      delete block.dataset.rtlChecked;
    });
  } else if (websiteType === 'gemini') {
    // Reset Gemini Canvas styling
    const canvasSelectors = [
      '.ProseMirror[data-rtl-checked]',
      '.immersive-editor[data-rtl-checked]',
      '.immersive-editor-container[data-rtl-checked]',
      '[contenteditable="true"][data-rtl-checked]'
    ];

    const blocks = document.querySelectorAll(canvasSelectors.join(', '));
    blocks.forEach(block => {
      const textElements = block.querySelectorAll('[data-rtl-processed]');
      textElements.forEach(element => {
        element.style.direction = '';
        element.style.textAlign = '';
        element.style.paddingRight = '';
        element.style.paddingLeft = '';
        delete element.dataset.rtlProcessed;
      });

      delete block.dataset.rtlChecked;
    });
  } else if (websiteType === 'bunny') {
    // Reset Bunny.net form element styling and remove event listeners
    const bunnySelectors = [
      'input.bn-input__input.bn-form__control__input[data-rtl-checked]',
      'textarea.bn-form__control__input[data-rtl-checked]'
    ];

    const formElements = document.querySelectorAll(bunnySelectors.join(', '));
    formElements.forEach(element => {
      // Remove event listener if it exists
      if (bunnyEventListeners.has(element)) {
        const listener = bunnyEventListeners.get(element);
        element.removeEventListener('input', listener);
        bunnyEventListeners.delete(element);
      }

      // Reset styling
      element.style.direction = '';
      element.style.textAlign = '';
      delete element.dataset.rtlChecked;
      delete element.dataset.rtlListenerAdded;
    });
  } else if (websiteType === 'manychat') {
    // Reset ManyChat textarea styling and remove event listeners
    const manychatSelectors = [
      'textarea._input_okm14_1[data-rtl-checked]',
      'textarea._texInput_t2ybz_1[data-rtl-checked]'
    ];

    const textareas = document.querySelectorAll(manychatSelectors.join(', '));
    textareas.forEach(element => {
      // Remove event listener if it exists
      if (manychatEventListeners.has(element)) {
        const listener = manychatEventListeners.get(element);
        element.removeEventListener('input', listener);
        manychatEventListeners.delete(element);
      }

      // Find and reset the visible content div as well
      const parent = element.parentElement;
      const visibleDiv = parent ? parent.querySelector('div._content_okm14_17[data-rtl-checked]') : null;
      if (visibleDiv) {
        visibleDiv.style.direction = '';
        visibleDiv.style.textAlign = '';
        delete visibleDiv.dataset.rtlChecked;
      }

      // Reset textarea styling
      element.style.direction = '';
      element.style.textAlign = '';
      delete element.dataset.rtlChecked;
      delete element.dataset.rtlListenerAdded;
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

  const websiteType = getWebsiteType();

  // Create throttled version of alignHebrewBlocks
  const throttledAlign = throttle(alignHebrewBlocks, 200);

  observer = new MutationObserver((mutations) => {
    // For Gemini, add a small delay to ensure content is rendered
    if (websiteType === 'gemini') {
      // Check if any mutation added nodes with relevant classes
      const hasRelevantChanges = mutations.some(mutation => {
        return Array.from(mutation.addedNodes).some(node => {
          if (node.nodeType === 1) { // Element node
            const element = node;
            return element.classList?.contains('ProseMirror') ||
                   element.classList?.contains('immersive-editor') ||
                   element.querySelector?.('.ProseMirror') ||
                   element.querySelector?.('.immersive-editor');
          }
          return false;
        });
      });

      if (hasRelevantChanges) {
        console.log('RTL Helper: Detected relevant changes in Gemini, applying RTL...');
        setTimeout(() => {
          alignHebrewBlocks();
        }, 100);
      }
      throttledAlign();
    } else {
      // Use throttled version to reduce processing overhead
      throttledAlign();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: websiteType === 'gemini' // Also watch for text changes in Gemini
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
  chrome.storage.local.get(['rtlHelperEnabled'], (result) => {
    extensionEnabled = result.rtlHelperEnabled !== false; // Default to true
    
    if (extensionEnabled) {
      startObserver();
      alignHebrewBlocks();
      
      // For Gemini, add periodic checking as fallback
      const websiteType = getWebsiteType();
      if (websiteType === 'gemini') {
        // Initial check after a delay
        setTimeout(() => {
          console.log('RTL Helper: Running initial Gemini check...');
          alignHebrewBlocks();
        }, 1000);
        
        // Another check after 2 seconds
        setTimeout(() => {
          console.log('RTL Helper: Running secondary Gemini check...');
          alignHebrewBlocks();
        }, 2000);
        
        // Set up periodic checking every 3 seconds for the first 15 seconds
        let checkCount = 0;
        const geminiInterval = setInterval(() => {
          checkCount++;
          if (checkCount > 5) {
            clearInterval(geminiInterval);
            console.log('RTL Helper: Stopped periodic Gemini checks');
          } else {
            console.log(`RTL Helper: Periodic Gemini check ${checkCount}/5`);
            alignHebrewBlocks();
          }
        }, 3000);
      }
    }
    
    const websiteType = getWebsiteType();
    console.log(`Rotem Daily RTL v2.4.1 is loaded for ${websiteType}! Status: ${extensionEnabled ? 'ENABLED' : 'DISABLED'}`);
  });
}


// Initialize when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeExtension();
  });
} else {
  initializeExtension();
}

