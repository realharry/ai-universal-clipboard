// Background script for the Chrome extension
chrome.action.onClicked.addListener(async (tab) => {
  // Open the side panel when the extension icon is clicked
  if (tab.id) {
    await chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
  if (message.type === 'SAVE_SELECTION') {
    // Store the clip data directly since we can't reliably forward to sidepanel
    try {
      const result = await chrome.storage.local.get(['clips']);
      const clips = result.clips || [];
      
      const newClip = {
        id: Date.now().toString(),
        content: message.payload.content,
        type: message.payload.type,
        title: message.payload.title,
        url: message.payload.url,
        createdAt: new Date().toISOString()
      };
      
      clips.unshift(newClip);
      await chrome.storage.local.set({ clips });
      
      // Send response back to content script
      sendResponse({ success: true, clip: newClip });
    } catch (error) {
      console.error('Error saving clip:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      sendResponse({ success: false, error: errorMessage });
    }
  }
  
  return true; // Keep the message channel open for async responses
});

// Initialize the extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Universal Clipboard extension installed');
  
  // Create context menu for selected text
  chrome.contextMenus.create({
    id: 'save-to-clipboard',
    title: 'Save to Clipboard',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'save-to-clipboard' && info.selectionText && tab?.id) {
    try {
      const result = await chrome.storage.local.get(['clips']);
      const clips = result.clips || [];
      
      const newClip = {
        id: Date.now().toString(),
        content: info.selectionText,
        type: 'text',
        title: info.selectionText.substring(0, 50) + (info.selectionText.length > 50 ? '...' : ''),
        url: info.pageUrl,
        createdAt: new Date().toISOString()
      };
      
      clips.unshift(newClip);
      await chrome.storage.local.set({ clips });
      
      // Show notification or badge
      chrome.action.setBadgeText({ text: clips.length.toString(), tabId: tab.id });
      chrome.action.setBadgeBackgroundColor({ color: '#4ade80', tabId: tab.id });
      
      // Clear badge after 2 seconds
      setTimeout(() => {
        chrome.action.setBadgeText({ text: '', tabId: tab.id });
      }, 2000);
      
    } catch (error) {
      console.error('Error saving clip from context menu:', error);
    }
  }
});