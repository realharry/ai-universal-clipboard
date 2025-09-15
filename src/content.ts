// Content script to handle text and image selection on web pages

let isSelectionMode = false;

console.log('AI Universal Clipboard content script loaded');

// Ensure DOM is ready
function initializeContentScript() {
  console.log('Initializing content script...');
  
  // Listen for messages from the popup/sidepanel
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'TOGGLE_SELECTION_MODE') {
      isSelectionMode = !isSelectionMode;
      updateSelectionMode();
      sendResponse({ success: true });
    }
    return true;
  });

  // Handle text selection
  document.addEventListener('mouseup', () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      // Show a small popup or indicator that text can be saved
      showSelectionIndicator(selection);
    }
  });

  // Handle right-click context menu for saving selections
  document.addEventListener('contextmenu', (_event) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      // We could add a context menu item here, but for now we'll use a keyboard shortcut
    }
  });

  // Listen for keyboard shortcuts
  document.addEventListener('keydown', (event) => {
    // Ctrl+Shift+C to save selection (changed from S to C to avoid conflicts)
    if (event.ctrlKey && event.shiftKey && event.key === 'C') {
      console.log('Keyboard shortcut Ctrl+Shift+C detected!');
      event.preventDefault();
      event.stopPropagation();
      saveCurrentSelection();
    }
  }, true); // Use capture phase to ensure we get the event first
  
  console.log('Content script initialized successfully');
  
  // Add a global test function for debugging
  (window as any).testClipboardSave = function() {
    console.log('Testing clipboard save function...');
    saveCurrentSelection();
  };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeContentScript);
} else {
  initializeContentScript();
}

function showSelectionIndicator(selection: Selection) {
  // Remove any existing indicators
  const existingIndicator = document.getElementById('clipboard-selection-indicator');
  if (existingIndicator) {
    existingIndicator.remove();
  }

  const selectedText = selection.toString().trim();
  if (!selectedText) return;

  // Create a small indicator
  const indicator = document.createElement('div');
  indicator.id = 'clipboard-selection-indicator';
  indicator.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #333;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 10000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      cursor: pointer;
    ">
      📋 Click to save to clipboard
    </div>
  `;
  
  document.body.appendChild(indicator);
  
  // Add click handler
  indicator.addEventListener('click', () => {
    saveCurrentSelection();
    indicator.remove();
  });
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (indicator.parentNode) {
      indicator.remove();
    }
  }, 3000);
}

function saveCurrentSelection() {
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();
  
  console.log('saveCurrentSelection called, selectedText:', selectedText);
  
  if (selectedText) {
    console.log('Attempting to send message to background script...');
    // Send to background script
    chrome.runtime.sendMessage({
      type: 'SAVE_SELECTION',
      payload: {
        content: selectedText,
        type: 'text',
        title: selectedText.substring(0, 50) + (selectedText.length > 50 ? '...' : ''),
        url: window.location.href
      }
    }, (response) => {
      console.log('Response from background script:', response);
      if (response && response.success) {
        showSaveConfirmation();
      } else {
        showSaveError();
      }
    });
  } else {
    console.log('No text selected, showing error');
    showSaveError();
  }
}

function showSaveError() {
  const error = document.createElement('div');
  error.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ef4444;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 10000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">
      ❌ Failed to save clip
    </div>
  `;
  
  document.body.appendChild(error);
  
  setTimeout(() => {
    if (error.parentNode) {
      error.remove();
    }
  }, 3000);
}

function showSaveConfirmation() {
  const confirmation = document.createElement('div');
  confirmation.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4ade80;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      z-index: 10000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">
      ✓ Saved to clipboard!
    </div>
  `;
  
  document.body.appendChild(confirmation);
  
  setTimeout(() => {
    if (confirmation.parentNode) {
      confirmation.remove();
    }
  }, 2000);
}

function updateSelectionMode() {
  // Visual feedback for selection mode
  if (isSelectionMode) {
    document.body.style.cursor = 'crosshair';
  } else {
    document.body.style.cursor = '';
  }
}