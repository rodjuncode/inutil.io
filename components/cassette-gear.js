import { registerComponent, createSVGElement, getViewBox } from '../utils/component-loader.js';

const CassetteGear = {
    description: 'A cassette tape gear that rotates on mouse over',
    
    render() {
        const container = document.createElement('div');
        container.style.cssText = 'position: relative;';
        
        // Create the square element
        const square = document.createElement('div');
        square.className = 'colored-square';
        const squareSize = 120;
        let gearSize = 'medium';
        let isRotating = false;
        let currentRotation = 0;
        
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
        
        // Create SVG for the gear
        const svg = createSVGElement('svg', {
            viewBox: getViewBox(100, 100),
            width: squareSize.toString(),
            height: squareSize.toString(),
            style: 'position: absolute; pointer-events: none;'
        });
        
        let gearGroup;
        
        // Function to create cassette gear
        const createGear = () => {
            // Clear existing gear
            while (svg.firstChild) {
                svg.removeChild(svg.firstChild);
            }
            
            // Create a group for the gear so we can rotate it
            gearGroup = createSVGElement('g', {});
            
            const centerX = 50;
            const centerY = 50;
            
            // Determine gear radius based on size
            let outerRadius, innerRadius;
            switch (gearSize) {
                case 'small':
                    outerRadius = 15;
                    innerRadius = 4;
                    break;
                case 'medium':
                    outerRadius = 25;
                    innerRadius = 6;
                    break;
                case 'large':
                    outerRadius = 35;
                    innerRadius = 8;
                    break;
            }
            
            // Main hollow circle
            const mainCircle = createSVGElement('circle', {
                cx: centerX.toString(),
                cy: centerY.toString(),
                r: outerRadius.toString(),
                fill: 'none',
                stroke: 'black',
                'stroke-width': '2'
            });
            gearGroup.appendChild(mainCircle);
            
            // Inner filled circle (much smaller)
            const innerCircle = createSVGElement('circle', {
                cx: centerX.toString(),
                cy: centerY.toString(),
                r: innerRadius.toString(),
                fill: 'black',
                stroke: 'black',
                'stroke-width': '1'
            });
            gearGroup.appendChild(innerCircle);
            
            // Three arc sections along the main circle
            const arcRadius = (outerRadius + innerRadius) / 2; // Midpoint between inner and outer circles
            const strokeWidth = gearSize === 'large' ? outerRadius * 0.42 : outerRadius * 0.35; // Thicker for large size
            
            // Arc 1 - top (around 0 degrees)
            const arc1 = createSVGElement('path', {
                d: describeArc(centerX, centerY, arcRadius, -30, 30),
                fill: 'none',
                stroke: 'black',
                'stroke-width': strokeWidth.toString()
            });
            gearGroup.appendChild(arc1);
            
            // Arc 2 - bottom left (around 120 degrees)
            const arc2 = createSVGElement('path', {
                d: describeArc(centerX, centerY, arcRadius, 90, 150),
                fill: 'none',
                stroke: 'black',
                'stroke-width': strokeWidth.toString()
            });
            gearGroup.appendChild(arc2);
            
            // Arc 3 - bottom right (around 240 degrees)
            const arc3 = createSVGElement('path', {
                d: describeArc(centerX, centerY, arcRadius, 210, 270),
                fill: 'none',
                stroke: 'black',
                'stroke-width': strokeWidth.toString()
            });
            gearGroup.appendChild(arc3);
            
            // Set initial rotation
            gearGroup.setAttribute('transform', `rotate(${currentRotation} 50 50)`);
            
            svg.appendChild(gearGroup);
        };
        
        // Helper function to describe an arc path
        function describeArc(x, y, radius, startAngle, endAngle) {
            const start = polarToCartesian(x, y, radius, endAngle);
            const end = polarToCartesian(x, y, radius, startAngle);
            const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
            
            return [
                "M", start.x, start.y,
                "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
            ].join(" ");
        }
        
        function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
            const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
            return {
                x: centerX + (radius * Math.cos(angleInRadians)),
                y: centerY + (radius * Math.sin(angleInRadians))
            };
        }
        
        createGear();
        square.appendChild(svg);
        
        // Mouse over rotation animation
        square.addEventListener('mouseenter', () => {
            if (!isRotating) {
                isRotating = true;
                rotateGear();
            }
        });
        
        square.addEventListener('mouseleave', () => {
            isRotating = false;
        });
        
        function rotateGear() {
            if (!isRotating) return;
            
            currentRotation += 2; // Rotation speed
            if (currentRotation >= 360) {
                currentRotation -= 360;
            }
            
            if (gearGroup) {
                gearGroup.setAttribute('transform', `rotate(${currentRotation} 50 50)`);
            }
            
            requestAnimationFrame(rotateGear);
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
        
        // Create controls
        const controls = document.createElement('div');
        controls.style.cssText = 'display: flex; flex-direction: column; gap: var(--spacing-md);';
        
        // Title
        const title = document.createElement('h3');
        title.textContent = 'Cassette Gear Controls';
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
        
        // Gear size radio buttons
        const sizeLabel = document.createElement('div');
        sizeLabel.textContent = 'Gear Size:';
        sizeLabel.style.cssText = 'font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--spacing-xs);';
        
        const sizeContainer = document.createElement('div');
        sizeContainer.style.cssText = 'display: flex; flex-direction: column; gap: var(--spacing-sm);';
        
        const sizes = [
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' }
        ];
        
        sizes.forEach((size) => {
            const sizeOptionLabel = document.createElement('label');
            sizeOptionLabel.style.cssText = 'display: flex; align-items: center; gap: var(--spacing-xs); cursor: pointer; font-size: var(--font-size-sm);';
            
            const sizeRadio = document.createElement('input');
            sizeRadio.type = 'radio';
            sizeRadio.name = 'gear-size';
            sizeRadio.value = size.value;
            sizeRadio.checked = (size.value === 'medium');
            sizeRadio.style.cssText = 'cursor: pointer; width: 20px; height: 20px;';
            
            const sizeText = document.createElement('span');
            sizeText.textContent = size.label;
            
            sizeRadio.addEventListener('change', () => {
                gearSize = size.value;
                createGear();
            });
            
            sizeOptionLabel.appendChild(sizeRadio);
            sizeOptionLabel.appendChild(sizeText);
            sizeContainer.appendChild(sizeOptionLabel);
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
        controls.appendChild(sizeContainer);
        controls.appendChild(closeButton);
        
        controlsPanel.appendChild(controls);
        
        container.appendChild(square);
        document.body.appendChild(backdrop);
        document.body.appendChild(controlsPanel);
        
        return container;
    }
};

registerComponent('Cassette Gear', CassetteGear);
