# Rotem Daily RTL - Hebrew RTL Helper

A Chrome browser extension that automatically applies RTL (Right-to-Left) text direction for Hebrew content across multiple productivity platforms: Notion, Claude AI, Gemini Canvas, Bunny.net, and ManyChat. Features a simple popup interface with complete user control over functionality.

## ✨ Features

### 🌐 Multi-Website Support
- **Notion**: Full support for all Notion pages with Hebrew content
- **Claude AI**: Seamless RTL support for conversations and streaming responses with Hebrew text
- **Gemini Canvas**: Full RTL support for Gemini's immersive editor and canvas interface
- **Bunny.net**: RTL support for forms and textareas in dash.bunny.net
- **ManyChat**: RTL support for message builders and chat editors with dual-display handling
- **Smart Detection**: Automatically detects Hebrew text while ignoring emojis and symbols

### 🎛️ Advanced User Interface
- **Browser Extension Button**: Control via Chrome's extension toolbar
- **One-Click Toggle**: Enable/disable RTL functionality instantly
- **Clean Popup**: Simple, intuitive popup interface
- **Visual Feedback**: Color-coded status indicators

### 💾 Persistent Settings
- **Session Memory**: Remembers your enable/disable preference
- **Menu Visibility**: Saves whether you've hidden the interface
- **Cross-Tab Sync**: Settings apply across all browser tabs

### 🔤 Smart Text Processing
- **Hebrew Detection**: Uses Unicode patterns to identify Hebrew characters
- **Mixed Content**: Handles text with emojis, symbols, and Hebrew together
- **List Support**: Special handling for bulleted and numbered lists in Notion
- **Dynamic Content**: Automatically processes new content as it loads
- **Streaming Support**: Handles real-time streaming responses in Claude AI
- **Dual-Display**: Special handling for ManyChat's visible and hidden text areas

## 📸 Screenshots

### Notion Integration
The extension seamlessly integrates with Notion, applying RTL formatting to Hebrew text blocks while preserving the original layout and functionality.

### Claude AI Support  
Hebrew conversations in Claude AI are automatically formatted with proper RTL alignment, making Hebrew text much more readable.

### Gemini Canvas Support
Gemini's immersive editor and canvas documents with Hebrew content are properly formatted with RTL alignment, including headers, paragraphs, and lists.

### Bunny.net & ManyChat Support
Form inputs, textareas, and message builders in Bunny.net and ManyChat are automatically formatted with proper RTL alignment for Hebrew content.

## 🚀 Installation

### Option 1: Load as Unpacked Extension (Recommended for Development)

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
   - Visit any supported website (Notion, Claude AI, Gemini Canvas, Bunny.net, or ManyChat)
   - Click the extension icon in Chrome's toolbar to access controls

### Option 2: Chrome Web Store (Coming Soon)
The extension will be available on the Chrome Web Store for easy one-click installation.

## 📖 Usage Guide

### Basic Usage
1. **Automatic Operation**: The extension works automatically on Hebrew text
2. **Access Controls**: Click the extension icon in Chrome's toolbar
3. **Toggle Functionality**: Use the popup to enable/disable RTL support

### Advanced Controls

#### Enable/Disable Toggle
- Click the extension icon in Chrome's toolbar
- Click "Enabled" or "Disabled" to toggle functionality
- Green dot = Enabled, Gray dot = Disabled

### Supported Websites

| Website | URL Pattern | Features |
|---------|-------------|----------|
| **Notion** | `https://www.notion.so/*` | Block-level RTL, List formatting, Dynamic content |
| **Claude AI** | `https://claude.ai/*` | Message RTL, Streaming responses, Real-time updates |
| **Gemini Canvas** | `https://gemini.google.com/*` | Canvas RTL, Headers, Lists, Immersive editor support |
| **Bunny.net** | `https://dash.bunny.net/*` | Form inputs, Textareas, Memory-optimized event handling |
| **ManyChat** | `https://app.manychat.com/*` | Message builders, Chat editors, Dual-display text handling |

## 🛠️ Technical Details

### Architecture
- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: `storage` (for preferences), `tabs` (for website detection)
- **Content Scripts**: Runs on Notion, Claude, Gemini, Bunny.net, and ManyChat domains
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
├── content.js            # Main functionality script
├── popup.html           # Extension popup interface
├── popup.js             # Popup functionality
├── icon16.png           # Extension icon (16x16)
├── icon48.png           # Extension icon (48x48)
├── icon128.png          # Extension icon (128x128)
├── logo.png             # Original logo file
├── privacy-policy.html  # Privacy policy for Chrome Web Store
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## 🔧 Development

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
- **Extension Logs**: Look for "RTL Helper v2.4.4 is loaded..." messages
- **Storage Inspector**: Use Chrome DevTools to inspect extension storage

## 🤝 Contributing

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

### Development Guidelines
- Follow existing code style and patterns
- Test on all supported websites
- Update documentation for new features
- Ensure backward compatibility
- Maintain memory efficiency and CPU optimization

## 📝 Changelog

### Version 2.4.4 (Current)
- ✅ Fixed Claude AI streaming responses RTL handling
- ✅ Added `.standard-markdown` selector for improved Claude support
- ✅ Optimized re-checking mechanism for streaming content
- ✅ Published privacy policy for Chrome Web Store compliance

### Version 2.4.3
- ✅ Optimized ManyChat efficiency with single 1-second delayed check
- ✅ Removed excessive periodic intervals for CPU optimization
- ✅ Improved memory efficiency across all websites

### Version 2.4.2
- ✅ Added delayed content checking for ManyChat (handles JS-populated text)
- ✅ Implemented periodic re-checking for dual-display systems

### Version 2.4.1
- ✅ Fixed ManyChat visible div RTL styling
- ✅ Added dual-display handling (visible div + hidden textarea)
- ✅ Enhanced input listener to style both elements simultaneously

### Version 2.4.0
- ✅ Added ManyChat support (app.manychat.com)
- ✅ Implemented memory-optimized event listener management
- ✅ Added support for message builders and chat editors

### Version 2.3.1
- ✅ Optimized Bunny.net event listener cleanup
- ✅ Added throttling for MutationObserver (200ms)
- ✅ Improved memory management with Map storage

### Version 2.3.0
- ✅ Added Bunny.net support (dash.bunny.net)
- ✅ Implemented form input and textarea RTL handling
- ✅ Added website-specific event listener management

### Version 2.2.0
- ✅ Moved controls from floating button to browser extension button
- ✅ Added support for Claude research documents and artifacts
- ✅ Improved user interface accessibility
- ✅ Enhanced popup controls

### Version 2.1.2
- ✅ Added support for Claude research documents
- ✅ Fixed detection for Claude's markdown artifacts

### Version 2.1.1
- ✅ Fixed Gemini Canvas detection for improved RTL application
- ✅ Enhanced element targeting for better compatibility

### Version 2.1.0
- ✅ Added Gemini Canvas support
- ✅ Enhanced text element detection for immersive editors
- ✅ Improved list formatting for all supported websites
- ✅ Updated documentation for multi-website support

## 🆘 Support & Troubleshooting

### Common Issues

**Extension not working on specific pages?**
- Ensure you're on a supported website (Notion, Claude, Gemini, Bunny.net, or ManyChat)
- Check that the extension is enabled in Chrome
- Try refreshing the page

**Extension controls not appearing?**
- Look for the extension icon in Chrome's toolbar
- If not visible, click the puzzle icon and pin the extension
- Check Chrome's extension permissions

**RTL not applying to Hebrew text?**
- Verify the text contains actual Hebrew characters
- Check if extension is enabled via dropdown
- Try toggling the extension off and on

**Settings not persisting?**
- Ensure Chrome has permission to store extension data
- Try clearing and reconfiguring the extension

### Getting Help
- **GitHub Issues**: [Report bugs and request features](https://github.com/omegis/RTL-Chrome-Extension/issues)
- **Privacy Policy**: See [privacy-policy.html](privacy-policy.html) for data handling details
- **Community**: Share experiences and solutions

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with modern Chrome Extension APIs
- Inspired by the need for better RTL support in productivity tools
- Community feedback and contributions welcomed

---

**Made with ❤️ for the Hebrew-speaking community**

*Enhance your productivity with proper RTL text formatting on your favorite websites.*