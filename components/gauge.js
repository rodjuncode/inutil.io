import { registerComponent, createSVGElement, getViewBox } from '../utils/component-loader.js';

const Gauge = {
    description: 'A colored square with a semi-circular gauge and needle',
    
    render() {
        const container = document.createElement('div');
        container.style.cssText = 'position: relative;';
        
        // Create the square element
        const square = document.createElement('div');
        square.className = 'colored-square';
        const squareSize = 120;
        let gaugeSize = 60; // Percentage of square size (40-60)
        let needleAngle = -90; // -180 = left, -90 = up, 0 = right
        
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
        
        // Create SVG for the gauge
        const svg = createSVGElement('svg', {
            viewBox: getViewBox(100, 100),
            width: squareSize.toString(),
            height: squareSize.toString(),
            style: 'position: absolute; pointer-events: none;'
        });
        
        let gaugeArc = null;
        let needle = null;
        
        // Function to create the gauge
        const createGauge = () => {
            // Clear existing gauge
            while (svg.firstChild) {
                svg.removeChild(svg.firstChild);
            }
            
            const radius = gaugeSize / 2;
            const centerX = 50;
            // Position the pivot point so the arc is centered in the square
            const centerY = 50 + (radius / 2);
            
            // Create semi-circular arc (path)
            // Arc goes from -90 degrees (left) to 90 degrees (right)
            const startX = centerX - radius;
            const startY = centerY;
            const endX = centerX + radius;
            const endY = centerY;
            
            gaugeArc = createSVGElement('path', {
                d: `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`,
                fill: 'none',
                stroke: 'black',
                'stroke-width': '2',
                'stroke-linecap': 'round'
            });
            
            // Create needle
            const needleLength = radius - 5;
            const angleRad = (needleAngle * Math.PI) / 180;
            const needleX = centerX + needleLength * Math.cos(angleRad);
            const needleY = centerY + needleLength * Math.sin(angleRad);
            
            needle = createSVGElement('line', {
                x1: centerX.toString(),
                y1: centerY.toString(),
                x2: needleX.toString(),
                y2: needleY.toString(),
                stroke: 'black',
                'stroke-width': '2',
                'stroke-linecap': 'round'
            });
            
            needle.style.cssText = 'transition: all 0.5s ease-out; transform-origin: 50% 50%;';
            
            // Create center dot
            const centerDot = createSVGElement('circle', {
                cx: centerX.toString(),
                cy: centerY.toString(),
                r: '3',
                fill: 'black'
            });
            
            svg.appendChild(gaugeArc);
            svg.appendChild(needle);
            svg.appendChild(centerDot);
        };
        
        createGauge();
        square.appendChild(svg);
        
        // Move needle randomly on mouse over
        square.addEventListener('mouseenter', () => {
            // For upper semi-circle: -180 (left) through -90 (up) to 0 (right)
            const targetAngle = -180 + Math.random() * 180;
            const startAngle = needleAngle;
            const startTime = performance.now();
            const duration = 500; // milliseconds
            
            // Ease-out cubic function
            const easeOutCubic = (t) => {
                return 1 - Math.pow(1 - t, 3);
            };
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutCubic(progress);
                
                needleAngle = startAngle + (targetAngle - startAngle) * easedProgress;
                
                const radius = gaugeSize / 2;
                const centerX = 50;
                const centerY = 50 + (radius / 2);
                const needleLength = radius - 5;
                const angleRad = (needleAngle * Math.PI) / 180;
                const needleX = centerX + needleLength * Math.cos(angleRad);
                const needleY = centerY + needleLength * Math.sin(angleRad);
                
                needle.setAttribute('x2', needleX.toString());
                needle.setAttribute('y2', needleY.toString());
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            requestAnimationFrame(animate);
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
        title.textContent = 'Gauge Controls';
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
        
        // Gauge size slider
        const sizeLabel = document.createElement('label');
        sizeLabel.textContent = 'Gauge Size: 60%';
        sizeLabel.style.cssText = 'font-size: var(--font-size-sm); color: var(--text-secondary);';
        
        const sizeInput = document.createElement('input');
        sizeInput.type = 'range';
        sizeInput.min = '40';
        sizeInput.max = '60';
        sizeInput.value = '60';
        sizeInput.style.cssText = `
            width: 100%;
            height: 44px;
            cursor: pointer;
        `;
        
        sizeInput.addEventListener('input', (e) => {
            gaugeSize = parseInt(e.target.value);
            sizeLabel.textContent = `Gauge Size: ${gaugeSize}%`;
            createGauge();
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
        controls.appendChild(sizeLabel);
        controls.appendChild(sizeInput);
        controls.appendChild(closeButton);
        
        controlsPanel.appendChild(controls);
        
        container.appendChild(square);
        document.body.appendChild(backdrop);
        document.body.appendChild(controlsPanel);
        
        return container;
    }
};

registerComponent('Gauge', Gauge);
