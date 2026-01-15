import { registerComponent, createSVGElement, getViewBox } from '../utils/component-loader.js';

const Grill = {
    description: 'A colored square with Dieter Rams-inspired speaker grill patterns',
    
    render() {
        const container = document.createElement('div');
        container.style.cssText = 'position: relative;';
        
        // Create the square element
        const square = document.createElement('div');
        square.className = 'colored-square';
        const squareSize = 120;
        let grillPattern = 'circular-grid'; // circular-grid will be the first pattern
        
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
        
        // Create SVG for the grill
        const svg = createSVGElement('svg', {
            viewBox: getViewBox(100, 100),
            width: squareSize.toString(),
            height: squareSize.toString(),
            style: 'position: absolute; pointer-events: none;'
        });
        
        // Function to create grill patterns
        const createGrill = () => {
            // Clear existing grill
            while (svg.firstChild) {
                svg.removeChild(svg.firstChild);
            }
            
            switch (grillPattern) {
                case 'circular-grid':
                    // Uniform circular grid - circles arranged in a radial pattern
                    const centerX = 50;
                    const centerY = 50;
                    const circleRadius = 2;
                    const spacing = 8;
                    
                    // Create circles in a grid pattern
                    for (let row = 0; row < 11; row++) {
                        for (let col = 0; col < 11; col++) {
                            const x = 10 + (col * spacing);
                            const y = 10 + (row * spacing);
                            
                            const circle = createSVGElement('circle', {
                                cx: x.toString(),
                                cy: y.toString(),
                                r: circleRadius.toString(),
                                fill: 'black'
                            });
                            svg.appendChild(circle);
                        }
                    }
                    break;
                
                case 'circular-shape':
                    // Circles forming an overall circular shape
                    const centerX2 = 50;
                    const centerY2 = 50;
                    const circleRadius2 = 2;
                    const mainRadius = 35; // Radius of the overall circular shape
                    const spacing2 = 8;
                    
                    // Create circles only if they fall within the main circular area
                    for (let row = 0; row < 11; row++) {
                        for (let col = 0; col < 11; col++) {
                            const x = 10 + (col * spacing2);
                            const y = 10 + (row * spacing2);
                            
                            // Calculate distance from center
                            const dx = x - centerX2;
                            const dy = y - centerY2;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            
                            // Only create circle if within the main circular boundary
                            if (distance <= mainRadius) {
                                const circle = createSVGElement('circle', {
                                    cx: x.toString(),
                                    cy: y.toString(),
                                    r: circleRadius2.toString(),
                                    fill: 'black'
                                });
                                svg.appendChild(circle);
                            }
                        }
                    }
                    break;
                
                case 'horizontal-lines':
                    // Parallel horizontal lines centered
                    const lineSpacing = 12;
                    const lineCount = 6;
                    const totalHeight = (lineCount - 1) * lineSpacing;
                    const startY = (100 - totalHeight) / 2;
                    const margin = 10;
                    
                    for (let i = 0; i < lineCount; i++) {
                        const y = startY + (i * lineSpacing);
                        const line = createSVGElement('line', {
                            x1: margin.toString(),
                            y1: y.toString(),
                            x2: (100 - margin).toString(),
                            y2: y.toString(),
                            stroke: 'black',
                            'stroke-width': '3',
                            'stroke-linecap': 'round'
                        });
                        svg.appendChild(line);
                    }
                    break;
            }
        };
        
        createGrill();
        square.appendChild(svg);
        
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
        title.textContent = 'Grill Controls';
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
        
        // Grill pattern radio buttons
        const patternLabel = document.createElement('div');
        patternLabel.textContent = 'Grill Pattern:';
        patternLabel.style.cssText = 'font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--spacing-xs);';
        
        const patternContainer = document.createElement('div');
        patternContainer.style.cssText = 'display: flex; flex-direction: column; gap: var(--spacing-sm);';
        
        const patterns = [
            { value: 'circular-grid', label: 'A' },
            { value: 'circular-shape', label: 'B' },
            { value: 'horizontal-lines', label: 'C' }
        ];
        
        patterns.forEach((pattern) => {
            const patternOptionLabel = document.createElement('label');
            patternOptionLabel.style.cssText = 'display: flex; align-items: center; gap: var(--spacing-xs); cursor: pointer; font-size: var(--font-size-sm);';
            
            const patternRadio = document.createElement('input');
            patternRadio.type = 'radio';
            patternRadio.name = 'grill-pattern';
            patternRadio.value = pattern.value;
            patternRadio.checked = (pattern.value === 'circular-grid');
            patternRadio.style.cssText = 'cursor: pointer; width: 20px; height: 20px;';
            
            const patternText = document.createElement('span');
            patternText.textContent = pattern.label;
            
            patternRadio.addEventListener('change', () => {
                grillPattern = pattern.value;
                createGrill();
            });
            
            patternOptionLabel.appendChild(patternRadio);
            patternOptionLabel.appendChild(patternText);
            patternContainer.appendChild(patternOptionLabel);
        });
        
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
        controls.appendChild(patternLabel);
        controls.appendChild(patternContainer);
        controls.appendChild(closeButton);
        
        controlsPanel.appendChild(controls);
        
        container.appendChild(square);
        document.body.appendChild(backdrop);
        document.body.appendChild(controlsPanel);
        
        return container;
    }
};

registerComponent('Grill', Grill);
