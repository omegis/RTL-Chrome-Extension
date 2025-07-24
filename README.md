# RTL Helper for Notion & Claude

A Chrome browser extension that automatically applies RTL (Right-to-Left) text direction for Hebrew content on Notion and Claude AI websites. Features an elegant dropdown interface with complete user control over functionality.

## ✨ Features

### 🌐 Multi-Website Support
- **Notion**: Full support for all Notion pages with Hebrew content
- **Claude AI**: Seamless RTL support for conversations with Hebrew text
- **Smart Detection**: Automatically detects Hebrew text while ignoring emojis and symbols

### 🎛️ Advanced User Interface
- **Elegant Dropdown**: Non-intrusive circular button (🔤) in top-right corner
- **One-Click Toggle**: Enable/disable RTL functionality instantly
- **Complete Hide Option**: Hide the entire interface with X button
- **Keyboard Restore**: Press `Ctrl+Shift+R` to bring back hidden menu
- **Visual Feedback**: Color-coded status indicators and smooth animations

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
   - Visit any Notion page or Claude AI
   - Look for the 🔤 button in the top-right corner

### Option 2: Chrome Web Store (Coming Soon)
The extension will be available on the Chrome Web Store for easy one-click installation.

## 📖 Usage Guide

### Basic Usage
1. **Automatic Operation**: The extension works automatically on Hebrew text
2. **Access Controls**: Click the 🔤 button in the top-right corner
3. **Toggle Functionality**: Use the dropdown to enable/disable RTL support

### Advanced Controls

#### Enable/Disable Toggle
- Click the 🔤 button to open the dropdown
- Click "Enabled" or "Disabled" to toggle functionality
- Green dot = Enabled, Gray dot = Disabled

#### Hide Interface Completely
- Open the dropdown menu
- Click the **×** button in the header
- The entire interface disappears (extension still works)

#### Restore Hidden Interface
- Press `Ctrl+Shift+R` on any supported website
- The dropdown interface reappears
- All your previous settings are preserved

### Supported Websites

| Website | URL Pattern | Features |
|---------|-------------|----------|
| **Notion** | `https://www.notion.so/*` | Block-level RTL, List formatting, Dynamic content |
| **Claude AI** | `https://claude.ai/*` | Message RTL, Conversation formatting, Real-time updates |

## 🛠️ Technical Details

### Architecture
- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: `storage` (for preferences), website access
- **Content Scripts**: Runs on Notion and Claude domains
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
- **Extension Logs**: Look for "RTL Helper v2.0.0 is loaded..." messages
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

### Version 2.0.0 (Current)
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
- Ensure you're on a supported website (Notion or Claude)
- Check that the extension is enabled in Chrome
- Try refreshing the page

**Dropdown menu not appearing?**
- Look for the 🔤 button in the top-right corner
- If hidden, press `Ctrl+Shift+R` to restore
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