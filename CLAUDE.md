# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RTL Helper for Notion & Claude is a Chrome browser extension that automatically sets text direction to RTL (right-to-left) for Hebrew content on both Notion and Claude AI websites. The extension detects Hebrew text blocks and applies appropriate RTL styling including text alignment and list item reordering, with a user-friendly dropdown interface for control.

## Architecture

This is a Chrome extension (Manifest v3) with multi-website support and advanced UI controls:

### Core Files
- **manifest.json**: Chrome extension manifest (v3) with permissions for both Notion and Claude websites, plus storage API
- **content.js**: Main content script that runs on both `https://www.notion.so/*` and `https://claude.ai/*`
- **claudechat.html**: Sample HTML file for understanding Claude's website structure (reference only)

### Key Functionality

#### Hebrew Detection & Processing
- **Hebrew Detection**: Uses Unicode regex `/[\u0590-\u05FF]/` to detect Hebrew characters
- **Smart Text Processing**: `findFirstLetter()` function finds the first actual letter in text, ignoring emojis and symbols using `/\p{L}/u` regex
- **Multi-Website Support**: `getWebsiteType()` function detects current website (Notion vs Claude)

#### RTL Styling Engine
- **Notion Support**: Targets `div[data-block-id]` elements with special list handling
- **Claude Support**: Targets message content areas with multiple selectors for user and assistant messages
- **Dynamic Content**: Uses `MutationObserver` to detect dynamically added content
- **Smart Reset**: Website-specific RTL styling reset when disabled

#### User Interface
- **Dropdown Menu**: Elegant dropdown interface with small circular button (🔤)
- **Enable/Disable Toggle**: Click-to-toggle functionality with visual status indicators
- **Hide Functionality**: X button to completely hide the menu interface
- **Keyboard Shortcut**: Ctrl+Shift+R to restore hidden menu
- **Persistent State**: Chrome storage API for remembering user preferences

### Extension Structure

#### Multi-Website Architecture
```javascript
// Website detection
function getWebsiteType() {
  return window.location.hostname === 'www.notion.so' ? 'notion' : 'claude';
}

// Website-specific processing
function alignNotionBlocks() { /* Notion-specific logic */ }
function alignClaudeBlocks() { /* Claude-specific logic */ }
```

#### State Management
- `extensionEnabled`: Boolean for RTL functionality on/off
- `rtlHelperEnabled`: Stored in Chrome storage (persistent across sessions)
- `rtlHelperMenuHidden`: Stored flag for menu visibility state
- `dataset.rtlChecked`: Per-element flag to avoid reprocessing

#### UI Components
- **Toggle Button**: 36x36px circular button with hover effects
- **Dropdown Menu**: Clean white dropdown with status indicators and controls
- **Status Indicators**: Green/gray dots showing enabled/disabled state
- **Hide Button**: X button in dropdown header for menu hiding

## Development Commands

This is a pure JavaScript Chrome extension with no build process:

### Testing
1. **Load Extension**: Go to `chrome://extensions/`, enable Developer mode, load unpacked folder
2. **Test Notion**: Visit any Notion page with Hebrew content - should auto-apply RTL
3. **Test Claude**: Visit `claude.ai` and type Hebrew messages - should apply RTL to Hebrew text
4. **Test Controls**: Use dropdown to enable/disable, test hide/show functionality
5. **Test Persistence**: Reload pages to verify settings are remembered

### Deployment
- Package the directory as a .zip file for Chrome Web Store submission
- No compilation or build steps required
- Ensure all permissions are properly declared in manifest.json

## Key Implementation Details

### Multi-Website Support
- Extension runs on both Notion (`https://www.notion.so/*`) and Claude (`https://claude.ai/*`)
- Different DOM selectors and styling approaches for each website
- Unified Hebrew detection logic across both platforms

### Advanced UI Features
- **Dropdown Interface**: Non-intrusive circular button that expands to show controls
- **Complete Hide Option**: Users can hide entire interface while keeping functionality active
- **Keyboard Restoration**: Ctrl+Shift+R shortcut to restore hidden menu
- **Visual Feedback**: Hover effects, color coding, smooth animations

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
2. **Use**: RTL functionality works automatically on Hebrew text
3. **Control**: Click 🔤 button in top-right to access controls
4. **Toggle**: Use dropdown to enable/disable functionality
5. **Hide**: Click X in dropdown to hide menu entirely
6. **Restore**: Press Ctrl+Shift+R to bring back hidden menu

### For Developers
- Extension follows modern Chrome extension best practices
- Clean separation of concerns between websites
- Comprehensive state management
- User-centric design with multiple control options