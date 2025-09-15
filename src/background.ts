// Background script for the Chrome extension
chrome.action.onClicked.addListener(async (tab) => {
  // Open the side panel when the extension icon is clicked
  if (tab.id) {
    await chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  if (message.type === 'SAVE_SELECTION') {
    // Forward the message to the side panel
    chrome.runtime.sendMessage({
      type: 'ADD_CLIP_FROM_CONTENT',
      payload: message.payload
    });
  }
  
  return true; // Keep the message channel open for async responses
});

// Initialize the extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Universal Clipboard extension installed');
});