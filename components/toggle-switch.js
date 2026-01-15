import { registerComponent, createSVGElement, getViewBox } from '../utils/component-loader.js';

const ToggleSwitch = {
    description: 'A colored square with a toggle switch control',
    
    render() {
        const container = document.createElement('div');
        container.style.cssText = 'position: relative;';
        
        // Create the square element (inherited from ColoredSquare)
        const square = document.createElement('div');
        square.className = 'colored-square';
        const squareSize = 120;
        let isOn = false;
        let isHorizontal = true; // Orientation: true = horizontal, false = vertical
        
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
        
        // Create SVG for the switch
        const svg = createSVGElement('svg', {
            viewBox: getViewBox(100, 100),
            width: squareSize.toString(),
            height: squareSize.toString(),
            style: 'position: absolute; pointer-events: none;'
        });
        
        // Rectangle (switch track) - thinner, with rounded corners
        const switchTrack = createSVGElement('rect', {
            x: '25',
            y: '35',
            width: '50',
            height: '30',
            rx: '15',
            ry: '15',
            fill: 'none',
            stroke: 'black',
            'stroke-width': '2'
        });
        
        // Circle (switch knob) - positioned in top half initially
        const switchKnob = createSVGElement('circle', {
            cx: '40',
            cy: '50',
            r: '8',
            fill: 'black',
            stroke: 'black',
            'stroke-width': '2'
        });
        
        switchKnob.style.cssText = 'transition: cx 0.3s ease-out, cy 0.3s ease-out, fill 0.3s ease-out;';
        
        svg.appendChild(switchTrack);
        svg.appendChild(switchKnob);
        square.appendChild(svg);
        
        // Toggle switch on mouse over
        square.addEventListener('mouseenter', () => {
            isOn = !isOn;
            if (isHorizontal) {
                if (isOn) {
                    switchKnob.setAttribute('cx', '60');
                    switchKnob.setAttribute('fill', 'none');
                } else {
                    switchKnob.setAttribute('cx', '40');
                    switchKnob.setAttribute('fill', 'black');
                }
            } else {
                if (isOn) {
                    switchKnob.setAttribute('cy', '60');
                    switchKnob.setAttribute('fill', 'none');
                } else {
                    switchKnob.setAttribute('cy', '40');
                    switchKnob.setAttribute('fill', 'black');
                }
            }
        });
        
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
        title.textContent = 'Toggle Switch Controls';
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
        
        // Orientation radio buttons
        const orientationLabel = document.createElement('div');
        orientationLabel.textContent = 'Orientation:';
        orientationLabel.style.cssText = 'font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--spacing-xs);';
        
        const orientationContainer = document.createElement('div');
        orientationContainer.style.cssText = 'display: flex; gap: var(--spacing-md);';
        
        // Horizontal radio
        const horizontalLabel = document.createElement('label');
        horizontalLabel.style.cssText = 'display: flex; align-items: center; gap: var(--spacing-xs); cursor: pointer; font-size: var(--font-size-sm);';
        
        const horizontalRadio = document.createElement('input');
        horizontalRadio.type = 'radio';
        horizontalRadio.name = 'orientation';
        horizontalRadio.value = 'horizontal';
        horizontalRadio.checked = true;
        horizontalRadio.style.cssText = 'cursor: pointer; width: 20px; height: 20px;';
        
        const horizontalText = document.createElement('span');
        horizontalText.textContent = 'Horizontal';
        
        horizontalLabel.appendChild(horizontalRadio);
        horizontalLabel.appendChild(horizontalText);
        
        // Vertical radio
        const verticalLabel = document.createElement('label');
        verticalLabel.style.cssText = 'display: flex; align-items: center; gap: var(--spacing-xs); cursor: pointer; font-size: var(--font-size-sm);';
        
        const verticalRadio = document.createElement('input');
        verticalRadio.type = 'radio';
        verticalRadio.name = 'orientation';
        verticalRadio.value = 'vertical';
        verticalRadio.style.cssText = 'cursor: pointer; width: 20px; height: 20px;';
        
        const verticalText = document.createElement('span');
        verticalText.textContent = 'Vertical';
        
        verticalLabel.appendChild(verticalRadio);
        verticalLabel.appendChild(verticalText);
        
        orientationContainer.appendChild(horizontalLabel);
        orientationContainer.appendChild(verticalLabel);
        
        // Radio button change handlers
        const updateOrientation = (horizontal) => {
            isHorizontal = horizontal;
            if (isHorizontal) {
                switchTrack.setAttribute('x', '25');
                switchTrack.setAttribute('y', '35');
                switchTrack.setAttribute('width', '50');
                switchTrack.setAttribute('height', '30');
                switchKnob.setAttribute('cx', isOn ? '60' : '40');
                switchKnob.setAttribute('cy', '50');
            } else {
                switchTrack.setAttribute('x', '35');
                switchTrack.setAttribute('y', '25');
                switchTrack.setAttribute('width', '30');
                switchTrack.setAttribute('height', '50');
                switchKnob.setAttribute('cx', '50');
                switchKnob.setAttribute('cy', isOn ? '60' : '40');
            }
        };
        
        horizontalRadio.addEventListener('change', () => updateOrientation(true));
        verticalRadio.addEventListener('change', () => updateOrientation(false));
        
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
        controls.appendChild(orientationLabel);
        controls.appendChild(orientationContainer);
        controls.appendChild(closeButton);
        
        controlsPanel.appendChild(controls);
        
        container.appendChild(square);
        document.body.appendChild(backdrop);
        document.body.appendChild(controlsPanel);
        
        return container;
    }
};

registerComponent('Toggle Switch', ToggleSwitch);
