/**
 * Component Loader
 * Dynamically loads and registers UI components
 */

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
        'gauge.js'
    ];

    // Dynamically import all component modules
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

    componentRegistry.forEach((component, name) => {
        const card = createComponentCard(name, component);
        componentGrid.appendChild(card);
    });
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
