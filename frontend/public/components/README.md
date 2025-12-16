# Custom SVG Components

Place your custom SVG component files here to use them in the 2D circuit simulator.

## How to Use Custom SVGs

### Option 1: Place SVG files in this folder

1. Create SVG files with these names:
   - `arduino.svg` - Arduino Uno board
   - `led.svg` - LED component
   - `resistor.svg` - Resistor component
   - `button.svg` - Push button
   - `buzzer.svg` - Buzzer/speaker

2. The simulator will automatically load them if they exist in `/components/`

### Option 2: Use online SVG URLs

You can also provide SVG URLs directly in the code. The `ComponentLoader` supports:
- Local files: `/components/component-name.svg`
- External URLs: `https://example.com/component.svg`

## SVG Requirements

- **ViewBox**: Your SVG should have a proper `viewBox` attribute
- **Size**: Recommended size: 100x100 for components, 200x120 for Arduino
- **Pins/Connections**: For components that connect to pins, ensure connection points are clearly defined
- **Colors**: Use standard component colors:
  - LEDs: Red (#ef4444), Yellow (#eab308), Green (#22c55e), Blue (#3b82f6)
  - Resistors: Purple (#8b5cf6) with colored bands
  - Arduino: Blue (#1e40af)

## Example LED SVG

```svg
<svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="15" cy="15" rx="12" ry="6" fill="#ef4444"/>
  <rect x="3" y="9" width="24" height="12" fill="#ef4444"/>
  <line x1="5" y1="23" x2="5" y2="30" stroke="#1f2937" stroke-width="2"/>
  <line x1="25" y1="23" x2="25" y2="30" stroke="#1f2937" stroke-width="2"/>
</svg>
```

## Download Free SVG Components

You can download free SVG components from:
- **Flaticon**: https://www.flaticon.com/search?word=arduino
- **Icons8**: https://icons8.com/icons/set/arduino
- **The Noun Project**: https://thenounproject.com/search/?q=arduino
- **OpenClipart**: https://openclipart.org/search/?query=arduino

Make sure to check the license before using any downloaded SVGs.

