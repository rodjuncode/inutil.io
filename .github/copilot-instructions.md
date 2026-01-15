# GitHub Copilot Instructions for Inutil.io Component Library

## Project Overview

This is a **mobile-first, client-side component library** for graphic UI elements with motion design. It uses vanilla HTML/CSS/JavaScript with SVG graphics—no frameworks, no build tools, no server-side processing.

## Architecture & Key Patterns

### Component Registration System
- Components live in `components/` as ES6 modules
- Each component **self-registers** on import using `registerComponent()` from `utils/component-loader.js`
- Components must export an object with a `render()` method that returns an HTMLElement, SVGElement, or HTML string
- **Important**: After creating a component, add its filename to the `componentFiles` array in `utils/component-loader.js`

### File Structure Convention
```
components/
  my-component.js         # Component module (kebab-case filename)
styles/
  base.css               # Design tokens (CSS custom properties)
  components.css         # Shared component styles & animations
utils/
  component-loader.js    # Registration & SVG helpers
```

### Component Template Pattern
Every new component should follow this structure:

```javascript
import { registerComponent, createSVGElement, getViewBox } from '../utils/component-loader.js';

const ComponentName = {
    description: 'Brief component description',
    
    render() {
        // Return HTMLElement, SVGElement, or HTML string
        const element = document.createElement('div');
        element.className = 'component-specific-class';
        // ... component logic
        return element;
    }
};

registerComponent('Display Name', ComponentName);
```

## Mobile-First Development Rules

1. **Always start with mobile layout** (320px+), then use `@media (min-width: ...)` for larger screens
2. **Touch targets minimum 44x44px** for interactive elements
3. **Use CSS custom properties** from `styles/base.css` for all colors, spacing, typography
4. **Leverage `touch-action: manipulation`** on interactive elements to eliminate 300ms tap delay
5. **Test hover states** with `@media (hover: none)` to avoid sticky hover on mobile
6. **Use viewport units cautiously**—prefer `rem` and `%` for better mobile support

## SVG Best Practices

- Use `createSVGElement(tag, attrs)` helper for proper namespace handling
- Set `viewBox` with `getViewBox(width, height)` for responsive scaling
- Keep SVG dimensions relative to container (use CSS `width: 100%`)
- Add `class="interactive-element"` for touch/click interactions
- Prefer CSS animations over SMIL for motion design

## Design System Variables

All design tokens are in `styles/base.css` under `:root`. **Always use these instead of hardcoded values**:

- **Colors**: `--primary-color`, `--secondary-color`, `--accent-color`, `--background`, `--surface`, `--text-primary`, `--text-secondary`, `--border`
- **Spacing**: `--spacing-xs` through `--spacing-xl` (0.25rem to 2rem scale)
- **Typography**: `--font-size-sm` through `--font-size-2xl`, `--font-family`
- **Transitions**: `--transition-fast`, `--transition-base`, `--transition-slow`
- **Borders**: `--border-radius-sm/md/lg`
- **Shadows**: `--shadow-sm/md/lg`

## Animation Patterns

Three keyframe animations are predefined in `styles/components.css`:
- `@keyframes fadeIn` - entrance animations
- `@keyframes pulse` - attention/loading states  
- `@keyframes spin` - rotation animations

Apply with utility classes: `.animate-fade-in`, `.animate-pulse`, `.animate-spin`

For custom animations, use CSS transitions with `var(--transition-base)` for consistency.

## Development Workflow

1. **Create component**: Add `.js` file to `components/` following the template (use kebab-case filename)
2. **Register in loader**: Add filename to `componentFiles` array in `utils/component-loader.js`
3. **Test in browser**: Run `npm run dev` and open `http://localhost:8080`
4. **Mobile testing**: Use browser DevTools device emulation or test on actual device

## Common Pitfalls to Avoid

- ❌ Don't use build tools or transpilation—keep it vanilla ES6
- ❌ Don't add external dependencies—everything must be client-side vanilla
- ❌ Don't use desktop-first CSS (avoid `max-width` media queries)
- ❌ Don't hardcode colors/spacing—use CSS custom properties
- ❌ Don't create SVGs without proper `viewBox` (breaks responsive scaling)
- ❌ Don't forget to call `registerComponent()` at end of component module

## When Creating New Components

**Always include**:
- Self-registration call at module bottom
- Description string in component object
- Mobile-optimized touch interactions
- Proper semantic HTML or SVG structure
- CSS classes that use design system variables

**Consider adding**:
- Animation states using predefined keyframes
- Interactive demos with event handlers
- Accessibility attributes (ARIA labels, roles)
- Responsive behavior across breakpoints
