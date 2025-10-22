/**
 * Top Offer Scroller Web Component
 * A lightweight, accessible, embeddable offer/announcement scroller
 * @version 1.0.0
 * @license MIT
 */

import styles from './scroller.css';

/**
 * Storage key for close state persistence
 * @const {string}
 */
const STORAGE_KEY = 'offer-scroller-closed';

/**
 * Default configuration values
 * @const {Object}
 */
const DEFAULTS = {
  items: [{ text: 'Welcome! Check out our latest offers.', link: '#' }],
  speed: 12,
  placement: 'top',
  bg: '#111',
  color: '#fff',
  closeable: false,
  persist: 'local', // 'local' or 'session'
  ariaLabel: 'Promotional offers',
  fontFamily: '',
  fontSize: '',
  fontWeight: '',
  fontStyle: '',
  letterSpacing: '',
  textTransform: '',
  textDecoration: '',
  animation: 'scroll', // 'scroll', 'slide', or 'fade'
  slideDuration: 3000, // milliseconds for slide/fade mode
  pauseOnHover: true, // pause animation on hover
  showLinkUnderline: false, // show underline on link hover
  showHoverBorder: true, // show border/outline on link hover
  alwaysShowUnderline: false, // always show underline on links
};

/**
 * Parse JSON safely with fallback
 * @param {string} jsonString - JSON string to parse
 * @param {*} fallback - Fallback value if parsing fails
 * @returns {*} Parsed value or fallback
 */
function parseJSON(jsonString, fallback) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.warn('[OfferScroller] Invalid JSON:', e.message);
    return fallback;
  }
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Get storage interface based on persist mode
 * @param {string} mode - 'local' or 'session'
 * @returns {Storage} Storage interface
 */
function getStorage(mode) {
  try {
    const storage = mode === 'session' ? sessionStorage : localStorage;
    // Test if storage is available
    const test = '__storage_test__';
    storage.setItem(test, test);
    storage.removeItem(test);
    return storage;
  } catch (e) {
    // Fallback to in-memory storage if localStorage/sessionStorage unavailable
    console.warn('[OfferScroller] Storage unavailable, using in-memory fallback');
    return {
      _data: {},
      getItem(key) { return this._data[key] || null; },
      setItem(key, value) { this._data[key] = value; },
      removeItem(key) { delete this._data[key]; },
    };
  }
}

/**
 * Check if scroller should be hidden based on stored state
 * @param {Storage} storage - Storage interface
 * @param {string} key - Storage key
 * @returns {boolean} True if should be hidden
 */
function shouldHide(storage, key) {
  const stored = storage.getItem(key);
  if (!stored) return false;
  
  try {
    const { timestamp, duration } = JSON.parse(stored);
    const now = Date.now();
    return now - timestamp < duration;
  } catch (e) {
    return false;
  }
}

/**
 * Store close state with timestamp
 * @param {Storage} storage - Storage interface
 * @param {string} key - Storage key
 * @param {number} duration - Duration in milliseconds
 */
function storeCloseState(storage, key, duration) {
  try {
    storage.setItem(key, JSON.stringify({
      timestamp: Date.now(),
      duration,
    }));
  } catch (e) {
    console.warn('[OfferScroller] Failed to store close state:', e.message);
  }
}

/**
 * Calculate scroll duration based on speed and content width
 * @param {number} speed - Speed in pixels per second
 * @param {number} width - Content width in pixels
 * @returns {number} Duration in seconds
 */
function calculateDuration(speed, width) {
  if (speed <= 0 || width <= 0) return 20;
  return width / speed;
}

/**
 * OfferScroller Custom Element
 * @class
 * @extends HTMLElement
 */
class OfferScroller extends HTMLElement {
  /**
   * Observed attributes for reactive updates
   * @static
   * @returns {string[]} Array of attribute names
   */
  static get observedAttributes() {
    return [
      'data-items',
      'data-speed',
      'data-placement',
      'data-bg',
      'data-color',
      'data-closeable',
      'data-persist',
      'data-aria-label',
      'data-class',
      'data-font-family',
      'data-font-size',
      'data-font-weight',
      'data-font-style',
      'data-letter-spacing',
      'data-text-transform',
      'data-text-decoration',
      'data-animation',
      'data-slide-duration',
      'data-pause-on-hover',
      'data-show-link-underline',
      'data-show-hover-border',
      'data-always-show-underline',
    ];
  }

  constructor() {
    super();
    
    // Attach shadow DOM
    this.attachShadow({ mode: 'open' });
    
    // Internal state
    this._config = { ...DEFAULTS };
    this._slideInterval = null;
    this._currentSlideIndex = 0;
    this._storage = null;
    this._resizeObserver = null;
  }

  /**
   * Called when element is added to DOM
   */
  connectedCallback() {
    // Parse configuration from attributes
    this._parseConfig();
    
    // Check if should be hidden due to previous close
    this._storage = getStorage(this._config.persist);
    if (this._config.closeable && shouldHide(this._storage, STORAGE_KEY)) {
      this.setAttribute('hidden', '');
      this._dispatchEvent('offer-scroller:hidden', { reason: 'previously-closed' });
      return;
    }
    
    // Render the component
    this._render();
    
    // Dispatch open event
    this._dispatchEvent('offer-scroller:open', { config: this._config });
    
    // Set up resize observer to recalculate animation duration
    this._setupResizeObserver();
  }

  /**
   * Called when element is removed from DOM
   */
  disconnectedCallback() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    
    // Clear slide interval
    if (this._slideInterval) {
      clearInterval(this._slideInterval);
      this._slideInterval = null;
    }
  }

  /**
   * Called when observed attributes change
   * @param {string} name - Attribute name
   * @param {string} oldValue - Previous value
   * @param {string} newValue - New value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    // Re-parse config and re-render
    this._parseConfig();
    if (this.shadowRoot.children.length > 0) {
      this._render();
    }
  }

  /**
   * Parse configuration from element attributes
   * @private
   */
  _parseConfig() {
    // Parse items
    const itemsAttr = this.getAttribute('data-items');
    if (itemsAttr) {
      const parsed = parseJSON(itemsAttr, null);
      if (Array.isArray(parsed) && parsed.length > 0) {
        this._config.items = parsed;
      } else {
        console.warn('[OfferScroller] Invalid data-items, using default');
        this._config.items = DEFAULTS.items;
      }
    }
    
    // Parse speed
    const speedAttr = this.getAttribute('data-speed');
    if (speedAttr) {
      const speed = parseFloat(speedAttr);
      this._config.speed = !isNaN(speed) && speed > 0 ? speed : DEFAULTS.speed;
    }
    
    // Parse placement
    const placement = this.getAttribute('data-placement');
    this._config.placement = placement === 'bottom' ? 'bottom' : 'top';
    
    // Parse colors
    this._config.bg = this.getAttribute('data-bg') || DEFAULTS.bg;
    this._config.color = this.getAttribute('data-color') || DEFAULTS.color;
    
    // Parse closeable
    const closeable = this.getAttribute('data-closeable');
    this._config.closeable = closeable === 'true';
    
    // Parse persist mode
    const persist = this.getAttribute('data-persist');
    this._config.persist = persist === 'session' ? 'session' : 'local';
    
    // Parse aria-label
    this._config.ariaLabel = this.getAttribute('data-aria-label') || DEFAULTS.ariaLabel;
    
    // Parse custom class for theming
    this._config.customClass = this.getAttribute('data-class') || '';
    
    // Parse typography attributes
    this._config.fontFamily = this.getAttribute('data-font-family') || DEFAULTS.fontFamily;
    this._config.fontSize = this.getAttribute('data-font-size') || DEFAULTS.fontSize;
    this._config.fontWeight = this.getAttribute('data-font-weight') || DEFAULTS.fontWeight;
    this._config.fontStyle = this.getAttribute('data-font-style') || DEFAULTS.fontStyle;
    this._config.letterSpacing = this.getAttribute('data-letter-spacing') || DEFAULTS.letterSpacing;
    this._config.textTransform = this.getAttribute('data-text-transform') || DEFAULTS.textTransform;
    this._config.textDecoration = this.getAttribute('data-text-decoration') || DEFAULTS.textDecoration;
    
    // Parse animation attributes
    const animation = this.getAttribute('data-animation');
    this._config.animation = ['scroll', 'slide', 'fade'].includes(animation) ? animation : DEFAULTS.animation;
    
    const slideDuration = this.getAttribute('data-slide-duration');
    this._config.slideDuration = slideDuration ? parseInt(slideDuration, 10) : DEFAULTS.slideDuration;
    
    // Parse interaction attributes
    const pauseOnHover = this.getAttribute('data-pause-on-hover');
    this._config.pauseOnHover = pauseOnHover === 'false' ? false : DEFAULTS.pauseOnHover;
    
    const showLinkUnderline = this.getAttribute('data-show-link-underline');
    this._config.showLinkUnderline = showLinkUnderline === 'true' ? true : DEFAULTS.showLinkUnderline;
    
    const showHoverBorder = this.getAttribute('data-show-hover-border');
    this._config.showHoverBorder = showHoverBorder === 'false' ? false : DEFAULTS.showHoverBorder;
    
    const alwaysShowUnderline = this.getAttribute('data-always-show-underline');
    this._config.alwaysShowUnderline = alwaysShowUnderline === 'true' ? true : DEFAULTS.alwaysShowUnderline;
  }

  /**
   * Render the component into shadow DOM
   * @private
   */
  _render() {
    const { 
      items, bg, color, closeable, ariaLabel, customClass,
      fontFamily, fontSize, fontWeight, fontStyle, 
      letterSpacing, textTransform, textDecoration,
      pauseOnHover, showLinkUnderline, showHoverBorder, alwaysShowUnderline
    } = this._config;
    
    // Clear shadow root
    this.shadowRoot.innerHTML = '';
    
    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    this.shadowRoot.appendChild(styleEl);
    
    // Create container
    const container = document.createElement('div');
    container.className = `scroller-container ${customClass}`.trim();
    container.style.setProperty('--scroller-bg', bg);
    container.style.setProperty('--scroller-color', color);
    
    // Apply typography styles if provided
    if (fontFamily) container.style.setProperty('--scroller-font-family', fontFamily);
    if (fontSize) container.style.setProperty('--scroller-font-size', fontSize);
    if (fontWeight) container.style.setProperty('--scroller-font-weight', fontWeight);
    if (fontStyle) container.style.setProperty('--scroller-font-style', fontStyle);
    if (letterSpacing) container.style.setProperty('--scroller-letter-spacing', letterSpacing);
    if (textTransform) container.style.setProperty('--scroller-text-transform', textTransform);
    if (textDecoration) container.style.setProperty('--scroller-text-decoration', textDecoration);
    
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', ariaLabel);
    
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'scroller-wrapper';
    
    // Create scrolling track
    const track = document.createElement('div');
    let trackClasses = `scroller-track animation-${this._config.animation}`;
    if (!pauseOnHover) trackClasses += ' no-pause-on-hover';
    if (showLinkUnderline) trackClasses += ' show-link-underline';
    if (!showHoverBorder) trackClasses += ' no-hover-border';
    if (alwaysShowUnderline) trackClasses += ' always-show-underline';
    track.className = trackClasses;
    track.setAttribute('aria-live', 'polite');
    
    // Build items
    const itemsHTML = this._buildItems(items);
    
    // For scroll animation, duplicate items for seamless loop
    if (this._config.animation === 'scroll') {
      track.innerHTML = itemsHTML + itemsHTML; // Duplicate for seamless scroll
    } else {
      // For slide/fade, show items one by one
      track.innerHTML = itemsHTML;
    }
    
    wrapper.appendChild(track);
    
    // Add close button if closeable
    if (closeable) {
      const closeBtn = this._createCloseButton();
      wrapper.appendChild(closeBtn);
    }
    
    container.appendChild(wrapper);
    this.shadowRoot.appendChild(container);
    
    // Set up animation based on mode
    if (this._config.animation === 'scroll') {
      this._updateScrollDuration();
    } else {
      this._startSlideAnimation();
    }
  }

  /**
   * Build HTML for scroller items
   * @private
   * @param {Array} items - Array of item objects
   * @returns {string} HTML string
   */
  _buildItems(items) {
    return items.map((item, index) => {
      // Allow HTML content if 'html' property is true
      const text = item.html ? (item.text || '') : sanitizeHTML(item.text || '');
      const link = item.link || '#';
      const target = item.target || '_self';
      
      return `
        <div class="scroller-item">
          <a 
            href="${sanitizeHTML(link)}" 
            target="${sanitizeHTML(target)}"
            class="scroller-link"
            data-index="${index}"
            rel="${target === '_blank' ? 'noopener noreferrer' : ''}"
          >
            <span class="scroller-text">${text}</span>
          </a>
        </div>
      `;
    }).join('');
  }

  /**
   * Create close button element
   * @private
   * @returns {HTMLElement} Close button
   */
  _createCloseButton() {
    const btn = document.createElement('button');
    btn.className = 'scroller-close';
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', 'Close offer banner');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    
    btn.addEventListener('click', () => this._handleClose());
    
    return btn;
  }

  /**
   * Handle close button click
   * @private
   */
  _handleClose() {
    // Hide element
    this.setAttribute('hidden', '');
    
    // Store close state (24 hours = 86400000ms)
    const duration = 24 * 60 * 60 * 1000;
    storeCloseState(this._storage, STORAGE_KEY, duration);
    
    // Dispatch close event
    this._dispatchEvent('offer-scroller:close', { 
      timestamp: Date.now(),
      persist: this._config.persist,
    });
  }

  /**
   * Update scroll animation duration based on content width
   * @private
   */
  _updateScrollDuration() {
    const track = this.shadowRoot.querySelector('.scroller-track');
    if (!track) return;
    
    // Wait for next frame to ensure layout is complete
    requestAnimationFrame(() => {
      const trackWidth = track.scrollWidth / 2; // Divide by 2 because content is duplicated
      const duration = calculateDuration(this._config.speed, trackWidth);
      track.style.setProperty('--scroll-duration', `${duration}s`);
    });
  }
  
  /**
   * Start slide/fade animation (one by one)
   * @private
   */
  _startSlideAnimation() {
    const track = this.shadowRoot.querySelector('.scroller-track');
    if (!track) return;
    
    const items = track.querySelectorAll('.scroller-item');
    if (items.length === 0) return;
    
    // Clear any existing interval
    if (this._slideInterval) {
      clearInterval(this._slideInterval);
    }
    
    // Show first item
    this._currentSlideIndex = 0;
    items[0].classList.add('active');
    
    // Set up interval to cycle through items
    this._slideInterval = setInterval(() => {
      // Remove active class from current item
      items[this._currentSlideIndex].classList.remove('active');
      
      // Move to next item
      this._currentSlideIndex = (this._currentSlideIndex + 1) % items.length;
      
      // Add active class to new item
      items[this._currentSlideIndex].classList.add('active');
    }, this._config.slideDuration);
  }

  /**
   * Set up ResizeObserver to recalculate duration on resize
   * @private
   */
  _setupResizeObserver() {
    if (!window.ResizeObserver) return;
    
    this._resizeObserver = new ResizeObserver(() => {
      if (this._config.animation === 'scroll') {
        this._updateScrollDuration();
      }
    });
    
    this._resizeObserver.observe(this);
  }

  /**
   * Dispatch custom event
   * @private
   * @param {string} eventName - Event name
   * @param {Object} detail - Event detail
   */
  _dispatchEvent(eventName, detail = {}) {
    this.dispatchEvent(new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true,
    }));
  }

  /**
   * Public API: Programmatically close the scroller
   * @public
   */
  close() {
    this._handleClose();
  }

  /**
   * Public API: Programmatically show the scroller
   * @public
   */
  show() {
    this.removeAttribute('hidden');
    if (this._storage) {
      this._storage.removeItem(STORAGE_KEY);
    }
    this._dispatchEvent('offer-scroller:show', { timestamp: Date.now() });
  }

  /**
   * Public API: Update items dynamically
   * @public
   * @param {Array} items - New items array
   */
  updateItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
      console.warn('[OfferScroller] Invalid items array');
      return;
    }
    
    this.setAttribute('data-items', JSON.stringify(items));
  }
}

// Register custom element
if (!customElements.get('offer-scroller')) {
  customElements.define('offer-scroller', OfferScroller);
}

// Set global version for debugging
if (typeof window !== 'undefined') {
  window.OfferScrollerWidgetVersion = '1.0.0';
}

export default OfferScroller;
