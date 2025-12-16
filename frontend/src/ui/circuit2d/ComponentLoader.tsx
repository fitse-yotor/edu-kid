/**
 * Component Loader for Custom SVG Components
 * 
 * To use custom SVG components:
 * 1. Place your SVG files in: frontend/public/components/
 * 2. Name them: arduino.svg, led.svg, resistor.svg, etc.
 * 3. The loader will automatically detect and use them
 * 
 * Or provide SVG as string directly in the component definition
 */

export type CustomComponent = {
  id: string
  name: string
  svg: string // SVG content as string
  width?: number
  height?: number
  pins?: Array<{ id: string; x: number; y: number }> // Pin positions for connections
}

// Predefined component SVGs (fallback if custom not provided)
export const defaultComponents: Record<string, string> = {
  arduino: `
    <rect x="0" y="0" width="200" height="120" rx="4" fill="#1e40af" stroke="#0f172a" stroke-width="2"/>
    <text x="100" y="60" font-size="16" fill="#ffffff" text-anchor="middle" font-weight="700">ARDUINO</text>
    <text x="100" y="80" font-size="12" fill="#ffffff" text-anchor="middle" font-weight="600">UNO R3</text>
  `,
  led: `
    <ellipse cx="0" cy="0" rx="15" ry="8" fill="#ef4444"/>
    <rect x="-15" y="-8" width="30" height="16" fill="#ef4444"/>
    <line x1="-10" y1="8" x2="-10" y2="20" stroke="#1f2937" stroke-width="2"/>
    <line x1="10" y1="8" x2="10" y2="20" stroke="#1f2937" stroke-width="2"/>
  `,
  resistor: `
    <rect x="-25" y="-6" width="50" height="12" rx="2" fill="#8b5cf6" stroke="#1f2937" stroke-width="1"/>
    <rect x="-25" y="-6" width="3" height="12" fill="#ef4444"/>
    <rect x="-17" y="-6" width="3" height="12" fill="#1f2937"/>
    <rect x="-9" y="-6" width="3" height="12" fill="#1f2937"/>
    <rect x="-1" y="-6" width="3" height="12" fill="#1f2937"/>
    <line x1="-30" y1="0" x2="-40" y2="0" stroke="#1f2937" stroke-width="2"/>
    <line x1="30" y1="0" x2="40" y2="0" stroke="#1f2937" stroke-width="2"/>
  `,
}

/**
 * Load SVG component from file or use default
 */
export async function loadComponent(
  componentName: string,
  customPath?: string,
): Promise<string> {
  try {
    if (customPath) {
      const response = await fetch(customPath)
      if (response.ok) {
        return await response.text()
      }
    }
    
    // Try to load from public/components/
    const response = await fetch(`/components/${componentName}.svg`)
    if (response.ok) {
      return await response.text()
    }
  } catch (error) {
    console.warn(`Could not load custom SVG for ${componentName}, using default`)
  }

  // Fallback to default
  return defaultComponents[componentName] || ''
}

/**
 * Example usage in your component:
 * 
 * const [arduinoSvg, setArduinoSvg] = useState('')
 * 
 * useEffect(() => {
 *   loadComponent('arduino', '/custom/arduino.svg').then(setArduinoSvg)
 * }, [])
 * 
 * Then use: <g dangerouslySetInnerHTML={{ __html: arduinoSvg }} />
 */

