import { registerComponent } from '../utils/component-loader.js';

const ColoredSquare = {
    description: 'A simple square with customizable background color and transparency',
    
    render() {
        const container = document.createElement('div');
        container.style.cssText = 'position: relative;';
        
        // Create the square element
        const square = document.createElement('div');
        square.className = 'colored-square';
        square.style.cssText = `
            width: 120px;
            height: 120px;
            background-color: rgba(220, 38, 38, 0.7);
            transition: all var(--transition-base);
            cursor: pointer;
        `;
        
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
        
        // Create controls
        const controls = document.createElement('div');
        controls.style.cssText = 'display: flex; flex-direction: column; gap: var(--spacing-md);';
        
        // Title
        const title = document.createElement('h3');
        title.textContent = 'Colored Square Controls';
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
        square.addEventListener('click', () => {
            controlsPanel.style.display = 'block';
            backdrop.style.display = 'block';
        });
        
        // Touch support for mobile - long press opens config
        let touchTimer = null;
        
        square.addEventListener('touchstart', (e) => {
            touchTimer = setTimeout(() => {
                controlsPanel.style.display = 'block';
                backdrop.style.display = 'block';
            }, 500);
        });
        
        square.addEventListener('touchend', (e) => {
            if (touchTimer) {
                clearTimeout(touchTimer);
                touchTimer = null;
            }
        });
        
        square.addEventListener('touchcancel', () => {
            if (touchTimer) {
                clearTimeout(touchTimer);
                touchTimer = null;
            }
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
        controls.appendChild(closeButton);
        
        controlsPanel.appendChild(controls);
        
        container.appendChild(square);
        document.body.appendChild(backdrop);
        document.body.appendChild(controlsPanel);
        
        return container;
    }
};

registerComponent('Colored Square', ColoredSquare);
