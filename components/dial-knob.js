import { registerComponent, createSVGElement, getViewBox, isTouchDevice } from '../utils/component-loader.js';

const DialKnob = {
    description: 'A colored square with a centered dial knob control',
    
    render() {
        try {
            const container = document.createElement('div');
            container.style.cssText = 'position: relative;';
            // Create the square element (inherited from ColoredSquare)
            const square = document.createElement('div');
            square.className = 'colored-square';
            const squareSize = 120;
            let circleRadiusPercent = 60; // Default 60% of square side
            square.style.cssText = `
                width: ${squareSize}px;
                height: ${squareSize}px;
                background-color: rgba(220, 38, 38, 0.7);
                transition: all var(--transition-base);
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            `;
            // Create SVG for the dial
            const svg = createSVGElement('svg', {
                viewBox: getViewBox(100, 100),
                width: squareSize.toString(),
                height: squareSize.toString(),
                style: 'position: absolute; pointer-events: none;'
            });
            // Outer circle - radius based on circleRadiusPercent
            const outerCircle = createSVGElement('circle', {
                cx: '50',
                cy: '50',
                r: (circleRadiusPercent / 2).toString(),
                fill: 'none',
                stroke: 'black',
                'stroke-width': '2'
            });
            // Inner circle (indicator/pointer) - positioned near the outer circle's edge
            const innerCircle = createSVGElement('circle', {
                cx: '50',
                cy: (50 - (circleRadiusPercent / 2) + 10).toString(),
                r: '3',
                fill: 'black',
                style: 'transition: transform 0.6s ease-out; transform-origin: 50px 50px;'
            });
            svg.appendChild(outerCircle);
            svg.appendChild(innerCircle);
            square.appendChild(svg);
            // --- Interaction pattern: Desktop vs Mobile ---
            let touchTimer = null;
            let isLongPress = false;
            let lastTouchTime = 0;
            if (isTouchDevice()) {
                // Mobile/touch: tap = animate, long-press = config
                square.addEventListener('touchstart', (e) => {
                    isLongPress = false;
                    // Trigger animation on tap
                    const randomDegrees = Math.floor(Math.random() * 361);
                    innerCircle.style.transform = `rotate(${randomDegrees}deg)`;
                    // Start timer for long press (500ms)
                    touchTimer = setTimeout(() => {
                        isLongPress = true;
                        controlsPanel.style.display = 'block';
                        backdrop.style.display = 'block';
                    }, 500);
                });
                square.addEventListener('touchend', (e) => {
                    if (touchTimer) {
                        clearTimeout(touchTimer);
                        touchTimer = null;
                    }
                    // Prevent click event from firing after long press
                    if (isLongPress) {
                        e.preventDefault();
                    }
                });
                square.addEventListener('touchcancel', () => {
                    if (touchTimer) {
                        clearTimeout(touchTimer);
                        touchTimer = null;
                    }
                });
                // On touch devices, always prevent click from opening config
                square.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }, true);
            } else {
                // Desktop: hover = animate, click = config
                square.addEventListener('mouseenter', () => {
                    const randomDegrees = Math.floor(Math.random() * 361);
                    innerCircle.style.transform = `rotate(${randomDegrees}deg)`;
                });
            }
            // ...existing code...
            // (rest of render function unchanged)
            // ...existing code...
            return container;
        } catch (err) {
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = 'color: red; background: #fff0f0; padding: 1em; border: 1px solid #f00;';
            errorDiv.textContent = 'DialKnob error: ' + (err && err.message ? err.message : err);
            return errorDiv;
        }
        
        // Create controls panel (hidden by default)
        const controlsPanel = document.createElement('div');
        controlsPanel.className = 'controls-panel';
        controlsPanel.style.cssText = `
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--surface);
            border: 1px solid var(--border);
            padding: var(--spacing-lg);
            box-shadow: var(--shadow-lg);
            z-index: 1000;
            min-width: 300px;
        `;
        
        // Create backdrop
        const backdrop = document.createElement('div');
        backdrop.style.cssText = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
        `;
        
        // Create controls (inherited from ColoredSquare)
        const controls = document.createElement('div');
        controls.style.cssText = 'display: flex; flex-direction: column; gap: var(--spacing-md);';
        
        // Title
        const title = document.createElement('h3');
        title.textContent = 'Dial Knob Controls';
        title.style.cssText = 'margin: 0 0 var(--spacing-sm) 0; font-size: var(--font-size-lg);';
        controls.appendChild(title);
        
        // Color picker
        const colorLabel = document.createElement('label');
        colorLabel.textContent = 'Color: ';
        colorLabel.style.cssText = 'font-size: var(--font-size-sm); color: var(--text-secondary);';
        
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.value = '#dc2626';
        colorInput.style.cssText = `
            width: 100%;
            height: 44px;
            border: 1px solid var(--border);
            border-radius: var(--border-radius-sm);
            cursor: pointer;
        `;
        
        // Transparency slider
        const transparencyLabel = document.createElement('label');
        transparencyLabel.textContent = 'Transparency: 70%';
        transparencyLabel.style.cssText = 'font-size: var(--font-size-sm); color: var(--text-secondary);';
        
        const transparencyInput = document.createElement('input');
        transparencyInput.type = 'range';
        transparencyInput.min = '0';
        transparencyInput.max = '100';
        transparencyInput.value = '70';
        transparencyInput.style.cssText = `
            width: 100%;
            height: 44px;
            cursor: pointer;
        `;
        
        // Circle radius slider
        const radiusLabel = document.createElement('label');
        radiusLabel.textContent = 'Circle Radius: 60%';
        radiusLabel.style.cssText = 'font-size: var(--font-size-sm); color: var(--text-secondary);';
        
        const radiusInput = document.createElement('input');
        radiusInput.type = 'range';
        radiusInput.min = '40';
        radiusInput.max = '80';
        radiusInput.value = '60';
        radiusInput.style.cssText = `
            width: 100%;
            height: 44px;
            cursor: pointer;
        `;
        
        // Close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `
            margin-top: var(--spacing-sm);
            padding: var(--spacing-sm) var(--spacing-md);
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: var(--border-radius-sm);
            cursor: pointer;
            font-size: var(--font-size-base);
            min-height: 44px;
        `;
        
        // Update square on color change
        colorInput.addEventListener('input', (e) => {
            updateSquareColor();
        });
        
        // Update square on transparency change
        transparencyInput.addEventListener('input', (e) => {
            const transparency = e.target.value;
            transparencyLabel.textContent = `Transparency: ${transparency}%`;
            updateSquareColor();
        });
        
        // Update circle radius
        radiusInput.addEventListener('input', (e) => {
            circleRadiusPercent = parseInt(e.target.value);
            radiusLabel.textContent = `Circle Radius: ${circleRadiusPercent}%`;
            const newRadius = circleRadiusPercent / 2;
            outerCircle.setAttribute('r', newRadius.toString());
            innerCircle.setAttribute('cy', (50 - newRadius + 10).toString());
        });
        
        function updateSquareColor() {
            const color = colorInput.value;
            const transparency = transparencyInput.value / 100;
            
            // Convert hex to RGB
            const r = parseInt(color.substr(1, 2), 16);
            const g = parseInt(color.substr(3, 2), 16);
            const b = parseInt(color.substr(5, 2), 16);
            
            square.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${transparency})`;
        }
        
        // Show controls on square click
        square.addEventListener('click', (e) => {
            e.stopPropagation();
            controlsPanel.style.display = 'block';
            backdrop.style.display = 'block';
        });
        
        // Close controls
        const closeControls = () => {
            controlsPanel.style.display = 'none';
            backdrop.style.display = 'none';
        };
        
        closeButton.addEventListener('click', closeControls);
        backdrop.addEventListener('click', closeControls);
        
        colorLabel.appendChild(colorInput);
        controls.appendChild(colorLabel);
        controls.appendChild(transparencyLabel);
        controls.appendChild(transparencyInput);
        controls.appendChild(radiusLabel);
        controls.appendChild(radiusInput);
        controls.appendChild(closeButton);
        
        controlsPanel.appendChild(controls);
        
        container.appendChild(square);
        document.body.appendChild(backdrop);
        document.body.appendChild(controlsPanel);
        
        return container;
    }
};

registerComponent('Dial Knob', DialKnob);
