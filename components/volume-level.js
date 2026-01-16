import { registerComponent, createSVGElement, getViewBox } from '../utils/component-loader.js';

const VolumeLevel = {
    description: 'A volume level indicator with stacked cells',
    
    render() {
        const container = document.createElement('div');
        container.style.cssText = 'position: relative;';
        
        // Create the square element
        const square = document.createElement('div');
        square.className = 'colored-square';
        const squareSize = 120;
        let orientation = 'vertical';
        let columnCount = 3;
        let cellsPerColumn = 8;
        let volumeLevels = [0.6, 0.5, 0.7]; // Individual volume for each column
        
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
        
        // Create SVG for the volume indicator
        const svg = createSVGElement('svg', {
            viewBox: getViewBox(100, 100),
            width: squareSize.toString(),
            height: squareSize.toString(),
            style: 'position: absolute; pointer-events: none;'
        });
        
        // Function to create volume level indicator
        const createVolumeIndicator = () => {
            // Clear existing cells
            while (svg.firstChild) {
                svg.removeChild(svg.firstChild);
            }
            
            const padding = 15;
            const gapBetweenCells = 2;
            const gapBetweenColumns = 4;
            
            if (orientation === 'vertical') {
                const totalWidth = 100 - (2 * padding);
                const totalColumnGaps = (columnCount - 1) * gapBetweenColumns;
                const columnWidth = (totalWidth - totalColumnGaps) / columnCount;
                
                const totalHeight = 100 - (2 * padding);
                const cellHeight = (totalHeight - (gapBetweenCells * (cellsPerColumn - 1))) / cellsPerColumn;
                
                for (let col = 0; col < columnCount; col++) {
                    const columnX = padding + (col * (columnWidth + gapBetweenColumns));
                    const currentLevel = volumeLevels[col] || 0.5;
                    
                    for (let i = 0; i < cellsPerColumn; i++) {
                        const y = padding + (i * (cellHeight + gapBetweenCells));
                        const fillLevel = (cellsPerColumn - i) / cellsPerColumn;
                        const isActive = fillLevel <= currentLevel;
                        
                        const rect = createSVGElement('rect', {
                            x: columnX.toString(),
                            y: y.toString(),
                            width: columnWidth.toString(),
                            height: cellHeight.toString(),
                            fill: isActive ? 'black' : 'rgba(0, 0, 0, 0.2)',
                            rx: '2',
                            ry: '2'
                        });
                        rect.style.cssText = 'transition: fill 0.3s ease-out;';
                        svg.appendChild(rect);
                    }
                }
            } else {
                // Horizontal orientation
                const totalHeight = 100 - (2 * padding);
                const totalColumnGaps = (columnCount - 1) * gapBetweenColumns;
                const columnHeight = (totalHeight - totalColumnGaps) / columnCount;
                
                const totalWidth = 100 - (2 * padding);
                const cellWidth = (totalWidth - (gapBetweenCells * (cellsPerColumn - 1))) / cellsPerColumn;
                
                for (let col = 0; col < columnCount; col++) {
                    const columnY = padding + (col * (columnHeight + gapBetweenColumns));
                    const currentLevel = volumeLevels[col] || 0.5;
                    
                    for (let i = 0; i < cellsPerColumn; i++) {
                        const x = padding + (i * (cellWidth + gapBetweenCells));
                        const fillLevel = (i + 1) / cellsPerColumn;
                        const isActive = fillLevel <= currentLevel;
                        
                        const rect = createSVGElement('rect', {
                            x: x.toString(),
                            y: columnY.toString(),
                            width: cellWidth.toString(),
                            height: columnHeight.toString(),
                            fill: isActive ? 'black' : 'rgba(0, 0, 0, 0.2)',
                            rx: '2',
                            ry: '2'
                        });
                        rect.style.cssText = 'transition: fill 0.3s ease-out;';
                        svg.appendChild(rect);
                    }
                }
            }
        };
        
        createVolumeIndicator();
        
        // Mouse over animation - change volume level slightly
        const changeVolume = () => {
            const newLevels = [];
            for (let i = 0; i < columnCount; i++) {
                newLevels.push(Math.random() * 0.4 + 0.3);
            }
            animateVolumeChange(newLevels);
        };
        
        square.addEventListener('mouseenter', changeVolume);
        
        function animateVolumeChange(targetLevels) {
            const startLevels = [...volumeLevels];
            const duration = 500;
            const startTime = performance.now();
            
            function animate(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out cubic
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                for (let i = 0; i < columnCount; i++) {
                    volumeLevels[i] = startLevels[i] + (targetLevels[i] - startLevels[i]) * easeProgress;
                }
                createVolumeIndicator();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            }
            
            requestAnimationFrame(animate);
        }
        
        square.appendChild(svg);
        
        // Touch support for mobile
        let touchTimer = null;
        let isLongPress = false;
        
        square.addEventListener('touchstart', (e) => {
            isLongPress = false;
            changeVolume();
            
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
        title.textContent = 'Volume Level Controls';
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
        orientationContainer.style.cssText = 'display: flex; flex-direction: column; gap: var(--spacing-sm);';
        
        const orientations = [
            { value: 'vertical', label: 'Vertical' },
            { value: 'horizontal', label: 'Horizontal' }
        ];
        
        orientations.forEach((orient) => {
            const orientOptionLabel = document.createElement('label');
            orientOptionLabel.style.cssText = 'display: flex; align-items: center; gap: var(--spacing-xs); cursor: pointer; font-size: var(--font-size-sm);';
            
            const orientRadio = document.createElement('input');
            orientRadio.type = 'radio';
            orientRadio.name = 'orientation';
            orientRadio.value = orient.value;
            orientRadio.checked = (orient.value === 'vertical');
            orientRadio.style.cssText = 'cursor: pointer; width: 20px; height: 20px;';
            
            const orientText = document.createElement('span');
            orientText.textContent = orient.label;
            
            orientRadio.addEventListener('change', () => {
                orientation = orient.value;
                createVolumeIndicator();
            });
            
            orientOptionLabel.appendChild(orientRadio);
            orientOptionLabel.appendChild(orientText);
            orientationContainer.appendChild(orientOptionLabel);
        });
        
        // Stack count radio buttons
        const stackLabel = document.createElement('div');
        stackLabel.textContent = 'Number of Columns:';
        stackLabel.style.cssText = 'font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--spacing-xs);';
        
        const stackContainer = document.createElement('div');
        stackContainer.style.cssText = 'display: flex; flex-direction: column; gap: var(--spacing-sm);';
        
        const stacks = [
            { value: 1, label: '1' },
            { value: 3, label: '3' },
            { value: 5, label: '5' }
        ];
        
        stacks.forEach((stack) => {
            const stackOptionLabel = document.createElement('label');
            stackOptionLabel.style.cssText = 'display: flex; align-items: center; gap: var(--spacing-xs); cursor: pointer; font-size: var(--font-size-sm);';
            
            const stackRadio = document.createElement('input');
            stackRadio.type = 'radio';
            stackRadio.name = 'stack-count';
            stackRadio.value = stack.value.toString();
            stackRadio.checked = (stack.value === 3);
            stackRadio.style.cssText = 'cursor: pointer; width: 20px; height: 20px;';
            
            const stackText = document.createElement('span');
            stackText.textContent = stack.label;
            
            stackRadio.addEventListener('change', () => {
                columnCount = stack.value;
                // Initialize volume levels for new column count
                volumeLevels = [];
                for (let i = 0; i < columnCount; i++) {
                    volumeLevels.push(Math.random() * 0.4 + 0.3);
                }
                createVolumeIndicator();
            });
            
            stackOptionLabel.appendChild(stackRadio);
            stackOptionLabel.appendChild(stackText);
            stackContainer.appendChild(stackOptionLabel);
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
        controls.appendChild(orientationLabel);
        controls.appendChild(orientationContainer);
        controls.appendChild(stackLabel);
        controls.appendChild(stackContainer);
        controls.appendChild(closeButton);
        
        controlsPanel.appendChild(controls);
        
        container.appendChild(square);
        document.body.appendChild(backdrop);
        document.body.appendChild(controlsPanel);
        
        return container;
    }
};

registerComponent('Volume Level', VolumeLevel);
