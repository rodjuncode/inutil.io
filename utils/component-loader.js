// Global info/error banner for diagnostics
export function showGlobalInfoBanner(msg, isError = false) {
    let banner = document.getElementById('global-info-banner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'global-info-banner';
        banner.style.cssText = 'position:fixed;top:0;left:0;width:100vw;z-index:9999;padding:0.5em 1em;font-size:1em;text-align:center;' +
            'background:' + (isError ? '#fff0f0' : '#f9f9ff') + ';color:' + (isError ? '#a00' : '#333') + ';border-bottom:1px solid ' + (isError ? '#f00' : '#99f') + ';';
        document.body.prepend(banner);
    }
    banner.textContent = msg;
}
/**
 * Component Loader
 * Dynamically loads and registers UI components
 */


/**
 * Utility: Detect if current device is a touch device (mobile/tablet)
 * Uses modern media query for accuracy
 */
export function isTouchDevice() {
    return window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

const componentRegistry = new Map();

/**
 * Register a component in the library
 * @param {string} name - Component name
 * @param {Object} component - Component definition with render() method
 */
export function registerComponent(name, component) {
    if (!component.render || typeof component.render !== 'function') {
        console.error(`Component "${name}" must have a render() method`);
        return;
    }
    
    componentRegistry.set(name, component);
    console.log(`✓ Registered component: ${name}`);
}

/**
 * Get a registered component
 * @param {string} name - Component name
 * @returns {Object|null} Component definition or null
 */
export function getComponent(name) {
    return componentRegistry.get(name) || null;
}

/**
 * Load all components from the components directory
 */
export async function loadComponents() {
    const componentGrid = document.getElementById('componentGrid');
    if (!componentGrid) {
        console.error('Component grid element not found');
        return;
    }

    // List of component modules to load
    // Add new components to this array
const componentFiles = [
    'colored-square.js',
    'dial-knob.js',
    'toggle-switch.js',
    'slider-control.js',
    'gauge.js',
    'grill.js',
    'volume-level.js',
    'cassette-gear.js',
    'button-grid.js'
];
    for (const file of componentFiles) {
        try {
            await import(`../components/${file}`);
        } catch (error) {
            console.error(`Failed to load component from ${file}:`, error);
        }
    }

    // Render all registered components
    if (componentRegistry.size === 0) {
        componentGrid.innerHTML = `
            <div class="component-card" style="grid-column: 1 / -1;">
                <p style="text-align: center; color: var(--text-secondary);">
                    No components yet. Add your first component to the <code>components/</code> folder!
                </p>
            </div>
        `;
        return;
    }

    // Track active components in the grid
    const activeComponents = [];
    
    componentRegistry.forEach((component, name) => {
        activeComponents.push({ name, component });
    });
    
    // Render initially visible components
    activeComponents.forEach(({ name, component }) => {
        const card = createComponentCard(name, component);
        componentGrid.appendChild(card);
    });
    
    // Add the "+" button card at the end
    const addButton = createAddButton(componentRegistry);
    componentGrid.appendChild(addButton);
}

/**
 * Create the add button card
 * @param {Map} componentRegistry - Registry of all available components
 * @returns {HTMLElement} Add button card
 */
function createAddButton(componentRegistry) {
    const card = document.createElement('div');
    card.className = 'component-card';
    
    const button = document.createElement('div');
    button.className = 'add-component-button';
    button.style.cssText = `
        width: var(--grid-size, 120px);
        height: var(--grid-size, 120px);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background: var(--surface);
        border: 2px dashed var(--border);
        border-radius: var(--border-radius-sm);
        transition: all var(--transition-fast);
    `;
    
    const plusIcon = document.createElement('div');
    plusIcon.style.cssText = `
        font-size: 48px;
        color: var(--text-secondary);
        line-height: 1;
        user-select: none;
    `;
    plusIcon.textContent = '+';
    
    button.appendChild(plusIcon);
    card.appendChild(button);
    
    // Hover effect
    button.addEventListener('mouseenter', () => {
        button.style.borderColor = 'var(--primary-color)';
        plusIcon.style.color = 'var(--primary-color)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.borderColor = 'var(--border)';
        plusIcon.style.color = 'var(--text-secondary)';
    });
    
    // Click to show component selector
    button.addEventListener('click', () => {
        showComponentSelector(componentRegistry);
    });
    
    return card;
}

/**
 * Show modal with all available components to add
 * @param {Map} componentRegistry - Registry of all available components
 */
function showComponentSelector(componentRegistry) {
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 3000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--border-radius-md);
        padding: var(--spacing-lg);
        box-shadow: var(--shadow-lg);
        max-width: 90vw;
        max-height: 90vh;
        overflow-y: auto;
    `;
    
    // Title
    const title = document.createElement('h2');
    title.textContent = 'Add Component';
    title.style.cssText = `
        margin: 0 0 var(--spacing-md) 0;
        font-size: var(--font-size-xl);
        color: var(--text-primary);
    `;
    modal.appendChild(title);
    
    // Component grid
    const grid = document.createElement('div');
    grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-md);
    `;
    
    // Add each component as a selectable option
    componentRegistry.forEach((component, name) => {
        const option = document.createElement('div');
        option.style.cssText = `
            cursor: pointer;
            border: 2px solid var(--border);
            border-radius: var(--border-radius-sm);
            padding: var(--spacing-sm);
            transition: all var(--transition-fast);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--spacing-xs);
        `;
        
        // Create small non-interactive version of the component
        const preview = document.createElement('div');
        preview.style.cssText = `
            pointer-events: none;
            transform: scale(0.7);
            transform-origin: center;
        `;
        
        try {
            const rendered = component.render();
            if (rendered instanceof HTMLElement || rendered instanceof SVGElement) {
                preview.appendChild(rendered.cloneNode(true));
            }
        } catch (error) {
            console.error(`Error rendering preview for "${name}":`, error);
        }
        
        // Component name label
        const label = document.createElement('div');
        label.textContent = name;
        label.style.cssText = `
            font-size: var(--font-size-sm);
            color: var(--text-secondary);
            text-align: center;
            margin-top: var(--spacing-xs);
        `;
        
        option.appendChild(preview);
        option.appendChild(label);
        
        // Hover effect
        option.addEventListener('mouseenter', () => {
            option.style.borderColor = 'var(--primary-color)';
            option.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
        });
        
        option.addEventListener('mouseleave', () => {
            option.style.borderColor = 'var(--border)';
            option.style.backgroundColor = 'transparent';
        });
        
        // Click to add component
        option.addEventListener('click', () => {
            addComponentToGrid(name, component);
            document.body.removeChild(backdrop);
        });
        
        grid.appendChild(option);
    });
    
    modal.appendChild(grid);
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Cancel';
    closeButton.style.cssText = `
        width: 100%;
        padding: var(--spacing-sm) var(--spacing-md);
        background: var(--surface);
        color: var(--text-primary);
        border: 1px solid var(--border);
        border-radius: var(--border-radius-sm);
        cursor: pointer;
        font-size: var(--font-size-base);
        min-height: 44px;
    `;
    
    closeButton.addEventListener('click', () => {
        document.body.removeChild(backdrop);
    });
    
    modal.appendChild(closeButton);
    backdrop.appendChild(modal);
    
    // Click backdrop to close
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
            document.body.removeChild(backdrop);
        }
    });
    
    document.body.appendChild(backdrop);
}

/**
 * Add a component to the grid
 * @param {string} name - Component name
 * @param {Object} component - Component definition
 */
function addComponentToGrid(name, component) {
    const componentGrid = document.getElementById('componentGrid');
    
    // Find the add button and insert before it
    const addButton = componentGrid.querySelector('.component-card:last-child');
    const newCard = createComponentCard(name, component);
    
    componentGrid.insertBefore(newCard, addButton);
}

/**
 * Create a component card for the showcase
 * @param {string} name - Component name
 * @param {Object} component - Component definition
 * @returns {HTMLElement} Component card element
 */
function createComponentCard(name, component) {
    const card = document.createElement('div');
    card.className = 'component-card';
    
    try {
        const rendered = component.render();
        if (rendered instanceof HTMLElement || rendered instanceof SVGElement) {
            card.appendChild(rendered);
        } else if (typeof rendered === 'string') {
            card.innerHTML = rendered;
        }
    } catch (error) {
        console.error(`Error rendering component "${name}":`, error);
        card.innerHTML = `<p style="color: red;">Error rendering component</p>`;
    }
    
    return card;
}

/**
 * Helper to create SVG elements with proper namespace
 * @param {string} tag - SVG element tag name
 * @param {Object} attrs - Element attributes
 * @returns {SVGElement}
 */
export function createSVGElement(tag, attrs = {}) {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
    
    for (const [key, value] of Object.entries(attrs)) {
        element.setAttribute(key, value);
    }
    
    return element;
}

/**
 * Helper for responsive SVG viewBox calculation
 * @param {number} width - Base width
 * @param {number} height - Base height
 * @returns {string} ViewBox attribute value
 */
export function getViewBox(width, height) {
    return `0 0 ${width} ${height}`;
}
