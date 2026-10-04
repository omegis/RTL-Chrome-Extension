# Rotem Daily RTL - Hebrew RTL Helper

A Chrome browser extension that automatically applies RTL (Right-to-Left) text direction for Hebrew content across multiple productivity platforms: Notion, Claude AI, Gemini Canvas, Bunny.net, ManyChat, Spotify Creators, and ChatGPT. Features a simple popup interface with complete user control over functionality, plus an optional Hebrew font selector.

## Features

### Multi-Website Support
- **Notion**: Full support for all Notion pages with Hebrew content
- **Claude AI**: Seamless RTL support for conversations and streaming responses with Hebrew text
- **Gemini Canvas**: Full RTL support for Gemini's immersive editor and canvas interface
- **Bunny.net**: RTL support for forms and textareas in dash.bunny.net
- **ManyChat**: RTL support for message builders and chat editors with dual-display handling
- **Spotify Creators**: RTL support for podcast comment sections
- **ChatGPT**: RTL for conversations, canvas documents, and the chat composer — including Hebrew paragraphs that open with an English word
- **Any website — Element Picker**: Click "Pick element to fix RTL" in the popup, then click any element. That element and similar ones on the site get RTL whenever their text is mostly Hebrew — on every visit. Manage or remove rules per site from the popup
- **Smart Detection**: Automatically detects Hebrew text while ignoring emojis and symbols

### Advanced User Interface
- **Browser Extension Button**: Control via Chrome's extension toolbar
- **One-Click Toggle**: Enable/disable RTL functionality instantly
- **Clean Popup**: Simple, intuitive popup interface
- **Visual Feedback**: Color-coded status indicators

### Hebrew Font Selector (Optional)
- **5 Hebrew Fonts**: Frank Ruhl Libre, Heebo, Assistant, Noto Sans Hebrew, Rubik
- **Disabled by Default**: Enable via checkbox in the popup - no external requests until you opt in
- **Persistent Selection**: Remembers your font choice across sessions
- **Instant Preview**: Font changes apply immediately to all Hebrew text on the page

### Persistent Settings
- **Session Memory**: Remembers your enable/disable preference
- **Font Selection**: Saves your chosen Hebrew font
- **Cross-Tab Sync**: Settings apply across all browser tabs

### Smart Text Processing
- **Hebrew Detection**: Uses Unicode patterns to identify Hebrew characters
- **Mixed Content**: Handles text with emojis, symbols, and Hebrew together
- **List Support**: Special handling for bulleted and numbered lists in Notion
- **Dynamic Content**: Automatically processes new content as it loads
- **Streaming Support**: Handles real-time streaming responses in Claude AI
- **Dual-Display**: Special handling for ManyChat's visible and hidden text areas

## Installation

### Option 1: Chrome Web Store
Install directly from the [Chrome Web Store](https://chromewebstore.google.com/) (search for "Rotem Daily RTL").

### Option 2: Load as Unpacked Extension (Development)

1. **Download the Extension**
   ```bash
   git clone https://github.com/omegis/RTL-Chrome-Extension.git
   cd RTL-Chrome-Extension
   ```

2. **Open Chrome Extensions**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the downloaded `RTL-Chrome-Extension` folder
   - The extension should now appear in your extensions list

4. **Verify Installation**
   - Visit any supported website
   - Click the extension icon in Chrome's toolbar to access controls

## Usage Guide

### Basic Usage
1. **Automatic Operation**: The extension works automatically on Hebrew text
2. **Access Controls**: Click the extension icon in Chrome's toolbar
3. **Toggle Functionality**: Use the popup to enable/disable RTL support

### Hebrew Font Feature
1. Click the extension icon in Chrome's toolbar
2. Check the "Hebrew Font" checkbox to enable
3. Select your preferred font from the dropdown
4. The font is applied instantly to all Hebrew RTL text on the page

### Element Picker (Any Website)
1. Open the page and click the extension icon
2. Click **Pick element to fix RTL**
3. Hover the page — a green box shows the element and how many similar ones will match; click to save, Esc to cancel
4. Matching elements switch to RTL whenever their text is mostly Hebrew, on every visit to that site
5. Remove a rule with **×** in the popup's rule list

**Known limitations**
- Rules are CSS selectors. Sites that regenerate class names on each deploy can break a saved rule — pick the element again if it stops working
- Inside rich-text editors (ProseMirror, Lexical, Slate, Draft.js, Quill) the whole editor is picked, not a single paragraph — editors rebuild their paragraphs and would discard per-paragraph styling
- Top frame only — elements inside iframes can't be picked
- Tabs opened before installing/updating the extension must be reloaded once

### Supported Websites

| Website | URL Pattern | Features |
|---------|-------------|----------|
| **Notion** | `https://www.notion.so/*` | Block-level RTL, List formatting, Dynamic content |
| **Claude AI** | `https://claude.ai/*` | Message RTL, Streaming responses, Chat input RTL |
| **Gemini Canvas** | `https://gemini.google.com/*` | Canvas RTL, Headers, Lists, Chat input RTL |
| **Bunny.net** | `https://dash.bunny.net/*` | Form inputs, Textareas, Dynamic detection |
| **ManyChat** | `https://app.manychat.com/*` | Message builders, Chat editors, Dual-display |
| **Spotify Creators** | `https://creators.spotify.com/*` | Comment sections, Text spans, Truncated messages |
| **ChatGPT** | `https://chatgpt.com/*` | Messages, Canvas documents, Chat composer, Streaming responses |

## Technical Details

### Architecture
- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: `storage` (for preferences), `tabs` (for website detection)
- **Content Scripts**: `content.js` + `custom-rules.js` load on all sites (`<all_urls>`); built-in logic runs only on Notion, Claude, Gemini, Bunny.net, ManyChat, Spotify Creators, and ChatGPT, and custom rules only start an observer on sites that have rules
- **No Background Scripts**: Lightweight, efficient operation
- **Memory Optimized**: Event listener management with proper cleanup
- **CPU Efficient**: Throttled mutation observers and minimal periodic checks

### Browser Compatibility
- **Chrome**: Fully supported (version 88+)
- **Edge**: Compatible with Chromium-based Edge
- **Firefox**: Not supported (different extension format)

### File Structure
```
RTL-Chrome-Extension/
├── manifest.json          # Extension configuration
├── content.js             # Main functionality script (built-in sites + shared helpers)
├── custom-rules.js        # Element picker and per-site custom RTL rules (all sites)
├── popup.html             # Extension popup interface
├── popup.js               # Popup functionality
├── icon16.png             # Extension icon (16x16)
├── icon48.png             # Extension icon (48x48)
├── icon128.png            # Extension icon (128x128)
├── logo.png               # Promotional logo
├── privacy-policy.html    # Privacy policy for Chrome Web Store
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Development

### Prerequisites
- Google Chrome (version 88 or higher)
- Basic understanding of Chrome extensions
- Text editor for code modifications

### Making Changes
1. **Edit Files**: Modify `content.js` or `manifest.json` as needed
2. **Reload Extension**: Go to `chrome://extensions/` and click reload
3. **Test Changes**: Visit any supported website to verify functionality

### Debugging
- **Console Logs**: Check browser console for extension messages
- **Extension Logs**: Look for "Rotem Daily RTL v2.6.2 is loaded..." messages
- **Storage Inspector**: Use Chrome DevTools to inspect extension storage

## Contributing

We welcome contributions! Here's how you can help:

### Reporting Issues
1. Check existing issues on GitHub
2. Provide detailed reproduction steps
3. Include browser version and website URL
4. Describe expected vs actual behavior

### Submitting Features
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on all supported websites
5. Submit a pull request with clear description

## Changelog

### Version 2.8.1 (Current)
- Fixed an endless restyle loop when picking a paragraph inside a rich-text editor — the picker now selects the editor root (ProseMirror, Lexical, Slate, Draft.js, Quill)
- Fixed rules on local `file://` pages not showing in the popup
- Fixed misleading "RTL fixed" toast when the extension is disabled
- Picker highlight follows the element while scrolling
- Turning off one RTL source (built-in or custom rule) no longer removes RTL another source still applies
- Rule storage reads tolerate corrupted data

### Version 2.8.0
- Added **Element Picker**: pick any element on any website to fix its RTL; similar elements are matched too, with Hebrew-dominant auto-detection
- Popup lists the current site's custom rules with a remove button
- Extension now loads on all sites (install permission: "Read and change your data on all websites"); idle on sites without built-in support or custom rules
- New storage key `customRtlRules` (`{ hostname: [{ id, selector, createdAt }] }`)

### Version 2.7.0
- Added RTL support for ChatGPT (`chatgpt.com`): chat messages, canvas documents, document titles, and the chat composer
- Hebrew-dominant detection fixes paragraphs that start with an English word (e.g. "Jev של TypeSafe AI..."), which ChatGPT's `dir="auto"` rendered LTR with scrambled word order

### Version 2.6.2
- Fixed Spotify Creators comments reverting to LTR when expanded via "See more" — RTL is now applied to the comment's block container, which survives Spotify removing the truncated-message wrapper

### Version 2.6.1
- Fixed Claude RTL skipping responses that open with English proper nouns (e.g. "Opus 4.7:", "Claude API:") — now uses Hebrew-dominant detection instead of first-letter only

### Version 2.6.0
- Added optional Hebrew font selector (Frank Ruhl Libre, Heebo, Assistant, Noto Sans Hebrew, Rubik)
- Font feature disabled by default with enable/disable checkbox
- Google Fonts loaded only when font feature is enabled
- Updated privacy policy for font feature and Spotify Creators
- Fixed toggle message not reaching Bunny.net, ManyChat, and Spotify tabs

### Version 2.5.0
- Added RTL support for Spotify Creators comment section
- Support for CommentText, TruncatedMessage, and encore text spans

### Version 2.4.7
- Fixed Claude chat input RTL to set container direction

### Version 2.4.6
- Added RTL support for Gemini chat input box

### Version 2.4.5
- Added RTL support for Claude chat input box

### Version 2.4.4
- Fixed Claude AI streaming responses RTL handling
- Added `.standard-markdown` selector for improved Claude support
- Published privacy policy for Chrome Web Store compliance

### Version 2.4.3
- Optimized ManyChat efficiency with single delayed check
- Removed excessive periodic intervals for CPU optimization

### Version 2.4.0 - 2.4.2
- Added ManyChat support with dual-display handling
- Memory-optimized event listener management

### Version 2.3.0 - 2.3.1
- Added Bunny.net support for forms and textareas
- Throttled MutationObserver callbacks (200ms)

### Version 2.2.0
- Moved controls to browser extension popup
- Added Claude research document support

### Version 2.1.0 - 2.1.2
- Added Gemini Canvas support
- Enhanced text element detection

## Support & Troubleshooting

### Common Issues

**Extension not working on specific pages?**
- Ensure you're on a supported website
- Check that the extension is enabled in Chrome
- Try refreshing the page

**Extension controls not appearing?**
- Look for the extension icon in Chrome's toolbar
- If not visible, click the puzzle icon and pin the extension

**Hebrew font not applying?**
- Make sure the "Hebrew Font" checkbox is checked in the popup
- Try toggling the checkbox off and on
- Refresh the page after enabling

### Getting Help
- **GitHub Issues**: [Report bugs and request features](https://github.com/omegis/RTL-Chrome-Extension/issues)
- **Privacy Policy**: See [privacy-policy.html](privacy-policy.html) for data handling details

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Made for the Hebrew-speaking community**

*Enhance your productivity with proper RTL text formatting on your favorite websites.*
