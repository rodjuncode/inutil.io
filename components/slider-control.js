import { registerComponent, createSVGElement, getViewBox } from '../utils/component-loader.js';

const SliderControl = {
    description: 'A colored square with parallel slider controls',
    
    render() {
        const container = document.createElement('div');
        container.style.cssText = 'position: relative;';
        
        // Create the square element
        const square = document.createElement('div');
        square.className = 'colored-square';
        const squareSize = 120;
        let isHorizontal = true;
        let sliderCount = 1;
        
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
        
        // Create SVG for the sliders
        const svg = createSVGElement('svg', {
            viewBox: getViewBox(100, 100),
            width: squareSize.toString(),
            height: squareSize.toString(),
            style: 'position: absolute; pointer-events: none;'
        });
        
        // Store slider tracks and knobs
        let sliderTracks = [];
        let sliderKnobs = [];
        let sliderValues = [50]; // Default positions (0-100)
        
        // Function to create sliders
        const createSliders = () => {
            // Clear existing sliders
            while (svg.firstChild) {
                svg.removeChild(svg.firstChild);
            }
            sliderTracks = [];
            sliderKnobs = [];
            
            // Ensure we have the right number of values
            while (sliderValues.length < sliderCount) {
                sliderValues.push(50);
            }
            sliderValues = sliderValues.slice(0, sliderCount);
            
            const spacing = 100 / (sliderCount + 1);
            
            for (let i = 0; i < sliderCount; i++) {
                const position = spacing * (i + 1);
                
                if (isHorizontal) {
                    // Horizontal sliders (vertical tracks)
                    const track = createSVGElement('line', {
                        x1: position.toString(),
                        y1: '20',
                        x2: position.toString(),
                        y2: '80',
                        stroke: 'black',
                        'stroke-width': '2',
                        'stroke-linecap': 'round'
                    });
                    
                    const knobY = 20 + (sliderValues[i] / 100) * 60;
                    const knob = createSVGElement('rect', {
                        x: (position - 6).toString(),
                        y: (knobY - 4).toString(),
                        width: '12',
                        height: '8',
                        fill: 'black',
                        stroke: 'black',
                        'stroke-width': '2'
                    });
                    
                    knob.style.cssText = 'transition: y 0.4s ease-out;';
                    
                    sliderTracks.push(track);
                    sliderKnobs.push(knob);
                    svg.appendChild(track);
                    svg.appendChild(knob);
                } else {
                    // Vertical sliders (horizontal tracks)
                    const track = createSVGElement('line', {
                        x1: '20',
                        y1: position.toString(),
                        x2: '80',
                        y2: position.toString(),
                        stroke: 'black',
                        'stroke-width': '2',
                        'stroke-linecap': 'round'
                    });
                    
                    const knobX = 20 + (sliderValues[i] / 100) * 60;
                    const knob = createSVGElement('rect', {
                        x: (knobX - 4).toString(),
                        y: (position - 6).toString(),
                        width: '8',
                        height: '12',
                        fill: 'black',
                        stroke: 'black',
                        'stroke-width': '2'
                    });
                    
                    knob.style.cssText = 'transition: x 0.4s ease-out;';
                    
                    sliderTracks.push(track);
                    sliderKnobs.push(knob);
                    svg.appendChild(track);
                    svg.appendChild(knob);
                }
            }
        };
        
        createSliders();
        square.appendChild(svg);
        
        // Move sliders randomly on mouse over
        const animateSliders = () => {
            for (let i = 0; i < sliderCount; i++) {
                sliderValues[i] = Math.random() * 100;
                
                if (isHorizontal) {
                    const newY = 20 + (sliderValues[i] / 100) * 60;
                    sliderKnobs[i].setAttribute('y', (newY - 4).toString());
                } else {
                    const newX = 20 + (sliderValues[i] / 100) * 60;
                    sliderKnobs[i].setAttribute('x', (newX - 4).toString());
                }
            }
        };
        
        square.addEventListener('mouseenter', animateSliders);
        
        // Touch support for mobile
        let touchTimer = null;
        let isLongPress = false;
        
        square.addEventListener('touchstart', (e) => {
            isLongPress = false;
            animateSliders();
            
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
        title.textContent = 'Slider Control';
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
        horizontalRadio.name = 'slider-orientation';
        horizontalRadio.value = 'horizontal';
        horizontalRadio.checked = false;
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
        verticalRadio.name = 'slider-orientation';
        verticalRadio.value = 'vertical';
        verticalRadio.checked = true;
        verticalRadio.style.cssText = 'cursor: pointer; width: 20px; height: 20px;';
        
        const verticalText = document.createElement('span');
        verticalText.textContent = 'Vertical';
        
        verticalLabel.appendChild(verticalRadio);
        verticalLabel.appendChild(verticalText);
        
        orientationContainer.appendChild(horizontalLabel);
        orientationContainer.appendChild(verticalLabel);
        
        // Slider count radio buttons
        const countLabel = document.createElement('div');
        countLabel.textContent = 'Number of Sliders:';
        countLabel.style.cssText = 'font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--spacing-xs);';
        
        const countContainer = document.createElement('div');
        countContainer.style.cssText = 'display: flex; gap: var(--spacing-md);';
        
        // Create radio buttons for 1, 2, 3 sliders
        const countRadios = [];
        for (let i = 1; i <= 3; i++) {
            const countOptionLabel = document.createElement('label');
            countOptionLabel.style.cssText = 'display: flex; align-items: center; gap: var(--spacing-xs); cursor: pointer; font-size: var(--font-size-sm);';
            
            const countRadio = document.createElement('input');
            countRadio.type = 'radio';
            countRadio.name = 'slider-count';
            countRadio.value = i.toString();
            countRadio.checked = (i === 1);
            countRadio.style.cssText = 'cursor: pointer; width: 20px; height: 20px;';
            
            const countText = document.createElement('span');
            countText.textContent = i.toString();
            
            countOptionLabel.appendChild(countRadio);
            countOptionLabel.appendChild(countText);
            countContainer.appendChild(countOptionLabel);
            countRadios.push(countRadio);
        }
        
        // Radio button change handlers
        const updateOrientation = (horizontal) => {
            isHorizontal = horizontal;
            createSliders();
        };
        
        const updateSliderCount = (count) => {
            sliderCount = count;
            createSliders();
        };
        
        horizontalRadio.addEventListener('change', () => updateOrientation(false));
        verticalRadio.addEventListener('change', () => updateOrientation(true));
        
        countRadios.forEach((radio, index) => {
            radio.addEventListener('change', () => updateSliderCount(index + 1));
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
        controls.appendChild(countLabel);
        controls.appendChild(countContainer);
        controls.appendChild(closeButton);
        
        controlsPanel.appendChild(controls);
        
        container.appendChild(square);
        document.body.appendChild(backdrop);
        document.body.appendChild(controlsPanel);
        
        return container;
    }
};

registerComponent('Slider Control', SliderControl);
