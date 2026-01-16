import { registerComponent, createSVGElement, getViewBox } from '../utils/component-loader.js';

const ButtonGrid = {
    description: '3x3 button grid with active/inactive states',
    
    render() {
        const container = document.createElement('div');
        container.style.cssText = 'position: relative;';
        
        // State - track which buttons are active
        let gridSize = 3;
        let buttonStates = Array(gridSize * gridSize).fill(false).map(() => Math.random() > 0.5);
        let animationInterval = null; // Random initial states
        
        // Create the colored square background (inherited from ColoredSquare)
        const square = document.createElement('div');
        square.className = 'colored-square';
        square.style.cssText = `
            width: 120px;
            height: 120px;
            background-color: rgba(220, 38, 38, 0.7);
            transition: all var(--transition-base);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        `;
        
        // Create SVG container
        const svg = createSVGElement('svg', {
            viewBox: getViewBox(100, 100),
            width: '120',
            height: '120',
            style: 'position: absolute; pointer-events: none;'
        });
        
        // Create 3x3 grid
        const cells = [];
        
        function drawGrid() {
            // Clear existing cells
            svg.innerHTML = '';
            cells.length = 0;
            
            // Reinitialize buttonStates if grid size changed
            if (buttonStates.length !== gridSize * gridSize) {
                buttonStates = Array(gridSize * gridSize).fill(false).map(() => Math.random() > 0.5);
            }
            
            const padding = 15;
            const gap = 3;
            const availableSpace = 100 - (2 * padding);
            const totalGaps = (gridSize - 1) * gap;
            const cellSize = (availableSpace - totalGaps) / gridSize;
        
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const index = row * gridSize + col;
                const x = padding + col * (cellSize + gap);
                const y = padding + row * (cellSize + gap);
                
                const cell = createSVGElement('rect', {
                    x: x.toString(),
                    y: y.toString(),
                    width: cellSize.toString(),
                    height: cellSize.toString(),
                    fill: buttonStates[index] ? 'black' : 'rgba(0, 0, 0, 0.2)',
                    rx: '2',
                    ry: '2',
                    style: 'cursor: pointer; pointer-events: auto; transition: fill 0.2s ease-out;'
                });
                
                // Toggle on click
                cell.addEventListener('click', (e) => {
                    buttonStates[index] = !buttonStates[index];
                    cell.setAttribute('fill', buttonStates[index] ? 'black' : 'rgba(0, 0, 0, 0.2)');
                });
                
                cells.push(cell);
                svg.appendChild(cell);
            }
        }
        }
        
        // Mouse over animation
        square.addEventListener('mouseenter', () => {
            if (animationInterval) return;
            
            animationInterval = setInterval(() => {
                // Toggle 2-4 random buttons
                const toggleCount = Math.floor(Math.random() * 3) + 2;
                for (let i = 0; i < toggleCount; i++) {
                    const randomIndex = Math.floor(Math.random() * buttonStates.length);
                    buttonStates[randomIndex] = !buttonStates[randomIndex];
                    cells[randomIndex].setAttribute('fill', buttonStates[randomIndex] ? 'black' : 'rgba(0, 0, 0, 0.2)');
                }
            }, 200);
        });
        
        square.addEventListener('mouseleave', () => {
            if (animationInterval) {
                clearInterval(animationInterval);
                animationInterval = null;
            }
        });
        
        // Initial draw
        drawGrid();
        
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
        title.textContent = 'Button Grid Controls';
        title.style.cssText = 'margin: 0 0 var(--spacing-sm) 0; font-size: var(--font-size-lg);';
        controls.appendChild(title);
        
        // Color picker (inherited from ColoredSquare)
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
        
        // Transparency slider (inherited from ColoredSquare)
        const transparencyLabel = document.createElement('label');
        transparencyLabel.textContent = 'Transparency: 70%';
        transparencyLabel.style.cssText = 'font-size: var(--font-size-sm); color: var(--text-secondary);';
        
        const transparencySlider = document.createElement('input');
        transparencySlider.type = 'range';
        transparencySlider.min = '0';
        transparencySlider.max = '100';
        transparencySlider.value = '70';
        transparencySlider.style.cssText = `
            width: 100%;
            height: 44px;
            cursor: pointer;
        `;
        
        // Update color and transparency
        const updateSquareColor = () => {
            const color = colorInput.value;
            const transparency = transparencySlider.value / 100;
            const rgb = parseInt(color.slice(1), 16);
            const r = (rgb >> 16) & 255;
            const g = (rgb >> 8) & 255;
            const b = rgb & 255;
            square.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${transparency})`;
        };
        
        colorInput.addEventListener('input', updateSquareColor);
        transparencySlider.addEventListener('input', () => {
            transparencyLabel.textContent = `Transparency: ${transparencySlider.value}%`;
            updateSquareColor();
        });
        
        controls.appendChild(colorLabel);
        controls.appendChild(colorInput);
        controls.appendChild(transparencyLabel);
        controls.appendChild(transparencySlider);
        
        // Grid size controls
        const gridSizeLabel = document.createElement('label');
        gridSizeLabel.textContent = 'Grid Size:';
        gridSizeLabel.style.cssText = 'font-size: var(--font-size-sm); color: var(--text-secondary); margin-top: var(--spacing-sm);';
        
        const gridSizeContainer = document.createElement('div');
        gridSizeContainer.style.cssText = 'display: flex; gap: var(--spacing-sm);';
        
        const gridSizes = [3, 4, 5];
        gridSizes.forEach(size => {
            const button = document.createElement('button');
            button.textContent = `${size}x${size}`;
            button.style.cssText = `
                flex: 1;
                padding: var(--spacing-sm);
                background: ${size === gridSize ? 'var(--primary-color)' : 'var(--surface)'};
                color: ${size === gridSize ? 'white' : 'var(--text-primary)'};
                border: 1px solid var(--border);
                border-radius: var(--border-radius-sm);
                cursor: pointer;
                font-size: var(--font-size-sm);
                min-height: 44px;
                transition: all var(--transition-fast);
            `;
            
            button.addEventListener('click', () => {
                gridSize = size;
                drawGrid();
                
                // Update button styles
                gridSizeContainer.querySelectorAll('button').forEach(btn => {
                    btn.style.background = 'var(--surface)';
                    btn.style.color = 'var(--text-primary)';
                });
                button.style.background = 'var(--primary-color)';
                button.style.color = 'white';
            });
            
            gridSizeContainer.appendChild(button);
        });
        
        controls.appendChild(gridSizeLabel);
        controls.appendChild(gridSizeContainer);
        
        // Close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `
            padding: var(--spacing-sm) var(--spacing-md);
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: var(--border-radius-sm);
            cursor: pointer;
            font-size: var(--font-size-sm);
            min-height: 44px;
        `;
        
        // Close controls
        const closeControls = () => {
            controlsPanel.style.display = 'none';
            backdrop.style.display = 'none';
        };
        
        closeButton.addEventListener('click', closeControls);
        backdrop.addEventListener('click', closeControls);
        
        controls.appendChild(closeButton);
        controlsPanel.appendChild(controls);
        
        // Show controls on square click
        square.addEventListener('click', (e) => {
            controlsPanel.style.display = 'block';
            backdrop.style.display = 'block';
        });
        
        square.appendChild(svg);
        container.appendChild(square);
        document.body.appendChild(backdrop);
        document.body.appendChild(controlsPanel);
        
        return container;
    }
};

registerComponent('Button Grid', ButtonGrid);
