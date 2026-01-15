# i2 Component Library

A mobile-first, client-side component library for building graphic UI elements with motion design. Built with HTML, CSS, JavaScript, and SVG.

## Quick Start

### Running the Project

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

Open your browser to `http://localhost:8080` to view the component showcase.

## Project Structure

```
inutil.io/
├── components/          # Component modules
├── demos/              # Component usage examples and demos
├── styles/             # Global styles and CSS variables
│   ├── base.css       # Mobile-first base styles & design tokens
│   └── components.css  # Shared component patterns & animations
├── utils/              # Utility functions and helpers
│   └── component-loader.js  # Component registration system
└── index.html          # Main showcase page
```

## Creating a New Component

Components are ES6 modules that self-register with the component loader. Each component should:

1. **Export a registration** that happens on module load
2. **Provide a `render()` method** that returns an HTMLElement, SVGElement, or HTML string
3. **Be self-contained** with all necessary styles and logic
4. **Be mobile-optimized** with touch interactions

### Component Template

Create a new file in `components/`:

```javascript
import { registerComponent, createSVGElement, getViewBox } from '../utils/component-loader.js';

const MyComponent = {
    description: 'Brief description of what this component does',
    
    render() {
        // Create and return your component
        const container = document.createElement('div');
        container.className = 'my-component';
        
        // Add your component logic here
        
        return container;
    }
};

// Auto-register when module loads
registerComponent('My Component', MyComponent);
```

### SVG Component Example

```javascript
import { registerComponent, createSVGElement, getViewBox } from '../utils/component-loader.js';

const SvgIcon = {
    description: 'An animated SVG icon',
    
    render() {
        const svg = createSVGElement('svg', {
            viewBox: getViewBox(100, 100),
            width: '100',
            height: '100',
            class: 'interactive-element'
        });
        
        const circle = createSVGElement('circle', {
            cx: '50',
            cy: '50',
            r: '40',
            fill: 'var(--primary-color)'
        });
        
        svg.appendChild(circle);
        return svg;
    }
};

registerComponent('SVG Icon', SvgIcon);
```

## Design System

The project uses CSS custom properties (variables) for consistent theming. See `styles/base.css` for:

- **Colors**: Primary, secondary, accent, and semantic colors
- **Spacing**: Consistent spacing scale (xs, sm, md, lg, xl)
- **Typography**: Font sizes and families
- **Animations**: Transition speeds and easing functions
- **Shadows & Borders**: Elevation and border radius scales

## Mobile-First Principles

- **Touch targets**: Minimum 44x44px for interactive elements
- **Responsive layout**: CSS Grid with mobile-first breakpoints
- **Performance**: Client-side only, no build step required
- **Gestures**: Touch-optimized interactions using `touch-action`
- **Viewport**: Proper meta viewport configuration

## Development Guidelines

- Components should be **zero-dependency** (vanilla JS only)
- Use **CSS custom properties** from `styles/base.css`
- Follow **mobile-first** responsive design (start with mobile, enhance for desktop)
- Leverage **SVG** for scalable graphics
- Apply **smooth animations** using CSS transitions and keyframes
- Ensure **accessibility** with proper ARIA labels and semantic HTML

## Browser Support

Modern browsers with ES6 module support:
- Chrome/Edge 61+
- Firefox 60+
- Safari 11+
- Mobile browsers (iOS Safari 11+, Chrome Android)

## License

MIT
