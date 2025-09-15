# AI Universal Clipboard

A Chrome extension that provides a universal clipboard for managing text and image clips with a modern side panel interface.

## Features

- 📋 **Side Panel Interface** - Clean, modern UI that opens when clicking the extension icon
- ✂️ **Easy Text Selection** - Select text on any webpage and save it with Ctrl+Shift+S
- 📝 **Manual Clip Creation** - Add clips directly through the interface
- 💾 **Local Storage** - All clips are stored locally in your browser
- 🗑️ **Clip Management** - Easy deletion of individual clips or clear all
- 📥 **Export Functionality** - Export your clips as JSON for backup
- 🎨 **Modern Design** - Built with React, TypeScript, and Tailwind CSS

## Installation

### Development Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/realharry/ai-universal-clipboard.git
   cd ai-universal-clipboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` folder from this project

### Usage

1. **Opening the Clipboard**: Click the extension icon in your browser toolbar to open the side panel

2. **Saving Text from Web Pages**: 
   - Select any text on a webpage
   - Press `Ctrl+Shift+S` or click the floating save indicator that appears
   - The text will be automatically saved to your clipboard

3. **Manual Clip Creation**:
   - Click "Add new clip" in the side panel
   - Enter your text content and optional title
   - Click "Add Clip" to save

4. **Using Clips**:
   - Click the copy button (📋) next to any clip to copy it to your system clipboard
   - Click the delete button (🗑️) to remove individual clips
   - Use the header buttons to export all clips or clear all clips

## Technical Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite with Chrome Extension plugin (@crxjs/vite-plugin)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Chrome APIs**: Side Panel API, Storage API, Tabs API

## Development

```bash
# Start development mode (rebuilds on changes)
npm run dev

# Build for production
npm run build

# Preview built extension
npm run preview
```

## File Structure

```
src/
├── components/          # React components
│   ├── Sidepanel.tsx   # Main sidepanel component
│   ├── ClipList.tsx    # List of clips
│   ├── ClipItem.tsx    # Individual clip component
│   ├── AddClipForm.tsx # Form for adding new clips
│   └── Toast.tsx       # Toast notifications
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── storage.ts      # Chrome storage management
│   └── clipboard.ts    # Clipboard operations
├── background.ts       # Background service worker
├── content.ts          # Content script for web pages
├── sidepanel.tsx       # Sidepanel entry point
├── sidepanel.html      # Sidepanel HTML template
└── sidepanel.css       # Styles with Tailwind
```

## Browser Permissions

The extension requires the following permissions:
- `sidePanel` - To display the side panel interface
- `activeTab` - To interact with the current tab for text selection
- `storage` - To save and retrieve clips locally

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Build and test the extension
5. Submit a pull request

## License

This project is licensed under the ISC License - see the LICENSE file for details.
