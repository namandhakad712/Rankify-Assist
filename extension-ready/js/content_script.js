/**
 * EKO WEB EXTRACTION TECHNOLOGY
 * Implements "Visual Grounding" and "Pseudo-HTML" generation
 * based on EKO-DOCS specifications.
 */

(function () {
  console.log('👁️ EKO Web Extractor Loaded');

  // State
  let interactiveElements = [];
  let overlayContainer = null;

  /**
   * Identifying interactive elements based on tags and roles
   */
  function getInteractiveElements() {
    const selector = [
      'a', 'button', 'input', 'textarea', 'select', 'details',
      '[role="button"]', '[role="link"]', '[role="menuitem"]', '[role="tab"]',
      '[onclick]', '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    const elements = Array.from(document.querySelectorAll(selector));

    // Filter out invisible or disabled elements
    return elements.filter(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.visibility !== 'hidden' &&
        style.display !== 'none' &&
        !el.disabled
      );
    });
  }

  /**
   * Create or update the visual overlay
   */
  function updateOverlay(elements) {
    if (!overlayContainer) {
      overlayContainer = document.createElement('div');
      overlayContainer.id = 'eko-overlay-container';
      overlayContainer.style.position = 'fixed';
      overlayContainer.style.top = '0';
      overlayContainer.style.left = '0';
      overlayContainer.style.width = '100vw';
      overlayContainer.style.height = '100vh';
      overlayContainer.style.pointerEvents = 'none'; // Click-through
      overlayContainer.style.zIndex = '9999999';
      document.body.appendChild(overlayContainer);
    }

    overlayContainer.innerHTML = ''; // Clear existing

    elements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const id = index; // Simple numeric ID for model reference
      el.dataset.ekoId = id; // Tag the actual element

      const box = document.createElement('div');
      box.style.position = 'absolute';
      box.style.left = `${rect.left + window.scrollX}px`;
      box.style.top = `${rect.top + window.scrollY}px`;
      box.style.width = `${rect.width}px`;
      box.style.height = `${rect.height}px`;
      box.style.border = '2px solid #ff4400'; // Standard EKO orange
      box.style.backgroundColor = 'rgba(255, 68, 0, 0.1)';
      box.style.fontSize = '12px';
      box.style.color = 'white';
      box.style.display = 'flex';
      box.style.alignItems = 'start';
      box.style.justifyContent = 'start';

      // Label tag
      const label = document.createElement('span');
      label.textContent = id;
      label.style.backgroundColor = '#ff4400';
      label.style.padding = '1px 4px';
      label.style.fontSize = '10px';

      box.appendChild(label);
      overlayContainer.appendChild(box);
    });
  }

  /**
   * Generate "Pseudo-HTML" for the LLM
   * Compresses the DOM into a token-efficient format
   */
  function generatePseudoHTML(elements) {
    let pseudoHTML = '';

    elements.forEach(el => {
      const id = el.dataset.ekoId;
      const tagName = el.tagName.toLowerCase();
      let attributes = '';

      // Extract meaningful attributes
      if (el.id) attributes += ` id="${el.id}"`;
      if (el.name) attributes += ` name="${el.name}"`;
      if (el.type) attributes += ` type="${el.type}"`;
      if (el.role) attributes += ` role="${el.role}"`;
      if (el.getAttribute('aria-label')) attributes += ` aria-label="${el.getAttribute('aria-label')}"`;
      if (el.placeholder) attributes += ` placeholder="${el.placeholder}"`;
      if (el.title) attributes += ` title="${el.title}"`;

      // Get text content (truncated)
      let text = el.textContent.trim().substring(0, 50);
      if (text) text = `>${text}</${tagName}>`;
      else text = '/>';

      pseudoHTML += `[${id}]:<${tagName}${attributes}${text}\n`;
    });

    return pseudoHTML;
  }

  /**
   * Main execution function
   */
  function scanPage() {
    const elements = getInteractiveElements();
    interactiveElements = elements; // Store for later action mapping
    updateOverlay(elements);
    const pseudoHTML = generatePseudoHTML(elements);

    console.log(`👁️ Scanned ${elements.length} interactive elements`);

    return {
      elementCount: elements.length,
      pseudoHTML: pseudoHTML,
      // We could also capture a screenshot here if we had html2canvas, 
      // but usually the background script handles the tab capture.
    };
  }

  // Message Listener
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'EKO_SCAN_PAGE') {
      const result = scanPage();
      sendResponse(result);
    }
    else if (request.action === 'EKO_EXECUTE_ACTION') {
      const { elementId, actionType, value } = request;
      const el = interactiveElements[elementId];

      if (el) {
        // Visualize the click/action
        const rect = el.getBoundingClientRect();
        const cursor = document.createElement('div');
        cursor.style.position = 'fixed';
        cursor.style.left = `${rect.left + rect.width / 2}px`;
        cursor.style.top = `${rect.top + rect.height / 2}px`;
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.backgroundColor = 'red';
        cursor.style.borderRadius = '50%';
        cursor.style.zIndex = '10000000';
        cursor.style.transition = 'all 0.5s ease';
        document.body.appendChild(cursor);

        setTimeout(() => {
          if (actionType === 'click') {
            el.click();
            el.focus();
          } else if (actionType === 'input') {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }
          cursor.remove();
        }, 500); // Artificial delay to simulate human

        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: 'Element not found' });
      }
    }
  });

})();