# RTL Helper for Notion, Claude & Gemini

A Chrome browser extension that automatically applies RTL (Right-to-Left) text direction for Hebrew content on Notion, Claude AI, and Gemini Canvas websites. Features an elegant dropdown interface with complete user control over functionality.

## ✨ Features

### 🌐 Multi-Website Support
- **Notion**: Full support for all Notion pages with Hebrew content
- **Claude AI**: Seamless RTL support for conversations with Hebrew text
- **Gemini Canvas**: Full RTL support for Gemini's immersive editor and canvas interface
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

## 📸 Screenshots

### Notion Integration
The extension seamlessly integrates with Notion, applying RTL formatting to Hebrew text blocks while preserving the original layout and functionality.

### Claude AI Support  
Hebrew conversations in Claude AI are automatically formatted with proper RTL alignment, making Hebrew text much more readable.

### Gemini Canvas Support
Gemini's immersive editor and canvas documents with Hebrew content are properly formatted with RTL alignment, including headers, paragraphs, and lists.

### Dropdown Interface
Clean, modern dropdown menu provides easy access to all controls without cluttering the interface.

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
   - Visit any Notion page, Claude AI, or Gemini Canvas
   - Look for the 🔤 button in the top-right corner

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
| **Claude AI** | `https://claude.ai/*` | Message RTL, Conversation formatting, Real-time updates |
| **Gemini Canvas** | `https://gemini.google.com/*` | Canvas RTL, Headers, Lists, Immersive editor support |

## 🛠️ Technical Details

### Architecture
- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: `storage` (for preferences), website access
- **Content Scripts**: Runs on Notion, Claude, and Gemini domains
- **No Background Scripts**: Lightweight, efficient operation

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
├── CLAUDE.md            # Developer documentation
├── claudechat.html      # Reference HTML sample
└── README.md           # This file
```

## 🔧 Development

### Prerequisites
- Google Chrome (version 88 or higher)
- Basic understanding of Chrome extensions
- Text editor for code modifications

### Making Changes
1. **Edit Files**: Modify `content.js` or `manifest.json` as needed
2. **Reload Extension**: Go to `chrome://extensions/` and click reload
3. **Test Changes**: Visit Notion or Claude to verify functionality

### Debugging
- **Console Logs**: Check browser console for extension messages
- **Extension Logs**: Look for "RTL Helper v2.1.0 is loaded..." messages
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
4. Test thoroughly on both Notion and Claude
5. Submit a pull request with clear description

### Development Guidelines
- Follow existing code style and patterns
- Test on both supported websites
- Update documentation for new features
- Ensure backward compatibility

## 📝 Changelog

### Version 2.2.0 (Current)
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

### Version 2.0.0 (Previous)
- ✅ Added Claude AI website support
- ✅ Redesigned UI with elegant dropdown menu
- ✅ Added complete interface hiding functionality
- ✅ Implemented keyboard shortcut for menu restoration
- ✅ Enhanced state persistence across sessions
- ✅ Improved Hebrew text detection algorithm
- ✅ Added website-specific RTL styling logic

### Version 1.2.0 (Previous)
- ✅ Initial Notion support
- ✅ Basic Hebrew detection with emoji handling
- ✅ Simple button interface
- ✅ List formatting support

## 🆘 Support & Troubleshooting

### Common Issues

**Extension not working on specific pages?**
- Ensure you're on a supported website (Notion, Claude, or Gemini)
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
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check `CLAUDE.md` for technical details
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