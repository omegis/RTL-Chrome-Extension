# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rotem Daily RTL is a Chrome browser extension that automatically sets text direction to RTL (right-to-left) for Hebrew content on Notion, Claude AI, Gemini Canvas, and Bunny.net websites. The extension detects Hebrew text blocks and applies appropriate RTL styling including text alignment and list item reordering, with a user-friendly browser extension button for control.

## Architecture

This is a Chrome extension (Manifest v3) with multi-website support and advanced UI controls:

### Core Files
- **manifest.json**: Chrome extension manifest (v3) with permissions for Notion, Claude, Gemini, and Bunny.net websites, plus storage API
- **content.js**: Main content script that runs on `https://www.notion.so/*`, `https://claude.ai/*`, `https://gemini.google.com/*`, and `https://dash.bunny.net/*`
- **popup.html**: Browser extension popup interface for controlling the extension
- **claudechat.html**: Sample HTML file for understanding Claude's website structure (reference only)

### Key Functionality

#### Hebrew Detection & Processing
- **Hebrew Detection**: Uses Unicode regex `/[\u0590-\u05FF]/` to detect Hebrew characters
- **Smart Text Processing**: `findFirstLetter()` function finds the first actual letter in text, ignoring emojis and symbols using `/\p{L}/u` regex
- **Multi-Website Support**: `getWebsiteType()` function detects current website (Notion, Claude, Gemini, or Bunny.net)

#### RTL Styling Engine
- **Notion Support**: Targets `div[data-block-id]` elements with special list handling
- **Claude Support**: Targets message content areas with multiple selectors for user and assistant messages, including research documents
- **Gemini Support**: Targets ProseMirror editor and Canvas content areas with smart element detection
- **Bunny.net Support**: Targets form inputs (`input.bn-input__input.bn-form__control__input`) and textareas (`textarea.bn-form__control__input`) with dynamic content detection via input event listeners
- **Dynamic Content**: Uses `MutationObserver` to detect dynamically added content
- **Smart Reset**: Website-specific RTL styling reset when disabled

#### User Interface
- **Browser Extension Button**: Controls moved to Chrome extension popup interface
- **Enable/Disable Toggle**: Toggle functionality in popup with visual status indicators
- **Persistent State**: Chrome storage API for remembering user preferences across sessions

### Extension Structure

#### Multi-Website Architecture
```javascript
// Website detection
function getWebsiteType() {
  const hostname = window.location.hostname;
  if (hostname === 'www.notion.so') return 'notion';
  if (hostname === 'claude.ai') return 'claude';
  if (hostname === 'gemini.google.com') return 'gemini';
  if (hostname === 'dash.bunny.net') return 'bunny';
  return 'unknown';
}

// Website-specific processing
function alignNotionBlocks() { /* Notion-specific logic */ }
function alignClaudeBlocks() { /* Claude-specific logic */ }
function alignGeminiBlocks() { /* Gemini-specific logic */ }
function alignBunnyBlocks() { /* Bunny.net-specific logic */ }
```

#### State Management
- `extensionEnabled`: Boolean for RTL functionality on/off
- `rtlHelperEnabled`: Stored in Chrome storage (persistent across sessions)
- `dataset.rtlChecked`: Per-element flag to avoid reprocessing
- `dataset.rtlProcessed`: Additional flag for Gemini element tracking
- `dataset.rtlListenerAdded`: Flag for Bunny.net input event listeners

#### UI Components
- **Browser Extension Popup**: Clean interface with toggle controls
- **Status Indicators**: Visual feedback showing enabled/disabled state
- **Persistent Controls**: Settings saved across browser sessions

## Development Commands

This is a pure JavaScript Chrome extension with no build process:

### Testing
1. **Load Extension**: Go to `chrome://extensions/`, enable Developer mode, load unpacked folder
2. **Test Notion**: Visit any Notion page with Hebrew content - should auto-apply RTL
3. **Test Claude**: Visit `claude.ai` and type Hebrew messages - should apply RTL to Hebrew text
4. **Test Gemini**: Visit Gemini Canvas with Hebrew content - should apply RTL styling
5. **Test Bunny.net**: Visit `dash.bunny.net` and type Hebrew in form inputs/textareas - should apply RTL dynamically
6. **Test Controls**: Use browser extension button to enable/disable functionality
7. **Test Persistence**: Reload pages to verify settings are remembered

### Deployment
- Package the directory as a .zip file for Chrome Web Store submission
- No compilation or build steps required
- Ensure all permissions are properly declared in manifest.json

## Key Implementation Details

### Multi-Website Support
- Extension runs on Notion (`https://www.notion.so/*`), Claude (`https://claude.ai/*`), Gemini (`https://gemini.google.com/*`), and Bunny.net (`https://dash.bunny.net/*`)
- Different DOM selectors and styling approaches for each website
- Unified Hebrew detection logic across all platforms
- Special handling for form inputs on Bunny.net with dynamic content detection

### Advanced Features
- **Dynamic Content Detection**: Real-time RTL detection as users type in Bunny.net forms
- **Event Listeners**: Smart input event handlers that toggle RTL based on content language
- **Periodic Checking**: Fallback mechanism for Gemini Canvas to ensure content is processed
- **Visual Feedback**: Clear status indicators in browser extension popup

### State Persistence
- Chrome storage API for cross-session preference saving
- Separate storage for extension enabled state and menu visibility
- Smart initialization that respects saved user preferences

### Performance Optimizations
- Efficient DOM querying with website-specific selectors
- Proper observer management (start/stop functionality)
- Element reprocessing prevention with dataset flags
- Resource cleanup when extension is disabled

### Error Handling & Robustness
- Graceful handling of missing DOM elements
- Proper event listener cleanup and reattachment
- Safe storage API usage with fallback defaults
- Cross-browser compatibility considerations

## Usage Instructions

### For End Users
1. **Install**: Load extension in Chrome
2. **Use**: RTL functionality works automatically on Hebrew text across supported websites
3. **Control**: Click browser extension button to access controls
4. **Toggle**: Use popup interface to enable/disable functionality
5. **Supported Sites**: Works on Notion, Claude AI, Gemini Canvas, and Bunny.net
6. **Dynamic Detection**: On Bunny.net, RTL is applied/removed dynamically as you type

### For Developers
- Extension follows modern Chrome extension best practices
- Clean separation of concerns between websites
- Comprehensive state management
- User-centric design with multiple control options