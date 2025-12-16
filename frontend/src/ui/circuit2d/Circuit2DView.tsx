import { useState } from 'react'

type PinState = 'HIGH' | 'LOW'

type ComponentType = 'LED' | 'Resistor' | 'Button' | 'Buzzer'

type Component = {
  id: string
  type: ComponentType
  x: number
  y: number
  color?: string
  connectedPin?: string
  name?: string
  rotation?: number
}

type Circuit2DViewProps = {
  pinStates: Record<string, PinState>
}

// SVG Arduino Uno (simplified 2D top view)
const ArduinoSVG = ({ pinStates }: { pinStates: Record<string, PinState> }) => {
  return (
    <g transform="translate(100, 200)">
      {/* Arduino Board Body */}
      <rect
        x="0"
        y="0"
        width="200"
        height="120"
        rx="4"
        fill="#1e40af"
        stroke="#0f172a"
        strokeWidth="2"
      />
      
      {/* USB Connector */}
      <rect x="0" y="50" width="15" height="20" fill="#374151" />
      
      {/* Digital Pins Row (Top) */}
      {Array.from({ length: 14 }).map((_, i) => {
        const xPos = 20 + i * 12
        const pinLabel = `D${i}`
        const isHigh = pinStates[pinLabel] === 'HIGH'
        
        return (
          <g key={`digital-${i}`}>
            <rect
              x={xPos}
              y={-8}
              width="8"
              height="8"
              fill={isHigh ? '#22c55e' : '#64748b'}
              stroke="#0f172a"
              strokeWidth="1"
            />
            {i < 4 && (
              <text
                x={xPos + 4}
                y={-12}
                fontSize="8"
                fill={isHigh ? '#22c55e' : '#94a3b8'}
                textAnchor="middle"
                fontWeight="600"
              >
                {i}
              </text>
            )}
          </g>
        )
      })}

      {/* Power Pins (Bottom Right) */}
      <g transform="translate(180, 120)">
        <rect x="0" y="0" width="8" height="8" fill="#fbbf24" stroke="#0f172a" strokeWidth="1" />
        <text x="4" y="20" fontSize="8" fill="#fbbf24" textAnchor="middle" fontWeight="600">
          5V
        </text>
        <rect x="0" y="12" width="8" height="8" fill="#64748b" stroke="#0f172a" strokeWidth="1" />
        <text x="4" y="32" fontSize="8" fill="#94a3b8" textAnchor="middle" fontWeight="600">
          GND
        </text>
      </g>

      {/* Analog Pins */}
      {Array.from({ length: 6 }).map((_, i) => {
        const xPos = 200
        const yPos = 20 + i * 15
        return (
          <rect
            key={`analog-${i}`}
            x={xPos}
            y={yPos}
            width="8"
            height="8"
            fill="#64748b"
            stroke="#0f172a"
            strokeWidth="1"
          />
        )
      })}

      {/* Arduino Text */}
      <text x="100" y="60" fontSize="16" fill="#ffffff" textAnchor="middle" fontWeight="700">
        ARDUINO
      </text>
      <text x="100" y="80" fontSize="12" fill="#ffffff" textAnchor="middle" fontWeight="600">
        UNO R3
      </text>
    </g>
  )
}

// SVG LED Component
const LEDSVG = ({
  x,
  y,
  isOn,
  color = 'red',
  label,
  isSelected,
  onClick,
}: {
  x: number
  y: number
  isOn: boolean
  color?: string
  label: string
  isSelected: boolean
  onClick: () => void
}) => {
  const colorMap: Record<string, string> = {
    red: '#ef4444',
    yellow: '#eab308',
    green: '#22c55e',
    blue: '#3b82f6',
  }
  const ledColor = colorMap[color] || colorMap.red

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Selection outline */}
      {isSelected && (
        <circle
          cx="0"
          cy="0"
          r="25"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeDasharray="5,5"
          opacity="0.6"
        />
      )}

      {/* LED Body - cylindrical view from side */}
      <ellipse cx="0" cy="0" rx="15" ry="8" fill={isOn ? ledColor : '#64748b'} />
      <rect x="-15" y="-8" width="30" height="16" fill={isOn ? ledColor : '#64748b'} />
      <ellipse cx="0" cy="0" rx="12" ry="6" fill={isOn ? '#ffffff' : '#94a3b8'} opacity="0.3" />
      
      {/* Glow effect when on */}
      {isOn && (
        <>
          <ellipse cx="0" cy="0" rx="20" ry="12" fill={ledColor} opacity="0.3" />
          <ellipse cx="0" cy="0" rx="18" ry="10" fill={ledColor} opacity="0.2" />
        </>
      )}

      {/* LED Legs */}
      <line x1="-10" y1="8" x2="-10" y2="20" stroke="#1f2937" strokeWidth="2" />
      <line x1="10" y1="8" x2="10" y2="20" stroke="#1f2937" strokeWidth="2" />

      {/* Label */}
      <text
        x="0"
        y="35"
        fontSize="12"
        fill={isSelected ? '#3b82f6' : '#64748b'}
        textAnchor="middle"
        fontWeight="600"
      >
        {label}
      </text>
    </g>
  )
}

// SVG Resistor Component
const ResistorSVG = ({
  x,
  y,
  isSelected,
  onClick,
}: {
  x: number
  y: number
  isSelected: boolean
  onClick: () => void
}) => {
  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {/* Selection outline */}
      {isSelected && (
        <rect
          x="-30"
          y="-8"
          width="60"
          height="16"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          strokeDasharray="5,5"
          opacity="0.6"
          rx="2"
        />
      )}

      {/* Resistor Body */}
      <rect x="-25" y="-6" width="50" height="12" rx="2" fill="#8b5cf6" stroke="#1f2937" strokeWidth="1" />
      
      {/* Resistor Bands */}
      {[0, 8, 16, 24].map((offset, i) => (
        <rect
          key={i}
          x={-25 + offset}
          y="-6"
          width="3"
          height="12"
          fill={i === 0 ? '#ef4444' : '#1f2937'}
        />
      ))}

      {/* Resistor Legs */}
      <line x1="-30" y1="0" x2="-40" y2="0" stroke="#1f2937" strokeWidth="2" />
      <line x1="30" y1="0" x2="40" y2="0" stroke="#1f2937" strokeWidth="2" />
    </g>
  )
}

// Wire connecting components
const WireSVG = ({
  x1,
  y1,
  x2,
  y2,
  color = '#64748b',
  isActive = false,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  color?: string
  isActive?: boolean
}) => {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={isActive ? '#22c55e' : color}
      strokeWidth={isActive ? 3 : 2}
      opacity={isActive ? 1 : 0.6}
      strokeLinecap="round"
    />
  )
}

export function Circuit2DView({ pinStates }: Circuit2DViewProps) {
  const [components, setComponents] = useState<Component[]>([
    {
      id: 'led1',
      type: 'LED',
      x: 350,
      y: 150,
      color: 'red',
      connectedPin: 'D2',
      name: '1',
    },
    {
      id: 'res1',
      type: 'Resistor',
      x: 250,
      y: 150,
    },
    {
      id: 'led2',
      type: 'LED',
      x: 350,
      y: 200,
      color: 'yellow',
      connectedPin: 'D3',
      name: '2',
    },
    {
      id: 'res2',
      type: 'Resistor',
      x: 250,
      y: 200,
    },
    {
      id: 'led3',
      type: 'LED',
      x: 350,
      y: 250,
      color: 'green',
      connectedPin: 'D4',
      name: '3',
    },
    {
      id: 'res3',
      type: 'Resistor',
      x: 250,
      y: 250,
    },
  ])

  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)

  const selectedComponent = components.find((c) => c.id === selectedComponentId)

  return (
    <div className="circuit-2d-container">
      <svg
        viewBox="0 0 800 400"
        className="circuit-2d-svg"
        style={{ width: '100%', height: '100%', background: '#f1f5f9' }}
      >
        {/* Grid Background */}
        <defs>
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Arduino Board */}
        <ArduinoSVG pinStates={pinStates} />

        {/* Render Wires First (so they appear behind components) */}
        {components
          .filter((c) => c.type === 'LED' && c.connectedPin)
          .map((led) => {
            const pinNum = parseInt(led.connectedPin?.replace('D', '') || '2')
            const pinX = 100 + 20 + pinNum * 12 + 4
            const pinY = 200 - 8
            const isActive = pinStates[led.connectedPin || ''] === 'HIGH'
            
            const resistor = components.find(
              (c) => c.type === 'Resistor' && Math.abs(c.x - led.x) < 50 && Math.abs(c.y - led.y) < 10
            )

            if (resistor) {
              return (
                <g key={`wires-${led.id}`}>
                  {/* Wire from pin to resistor */}
                  <WireSVG
                    x1={pinX}
                    y1={pinY}
                    x2={resistor.x - 40}
                    y2={resistor.y}
                    color={led.color === 'red' ? '#ef4444' : led.color === 'yellow' ? '#eab308' : '#22c55e'}
                    isActive={isActive}
                  />
                  {/* Wire from resistor to LED */}
                  <WireSVG
                    x1={resistor.x + 40}
                    y1={resistor.y}
                    x2={led.x - 10}
                    y2={led.y + 8}
                    color={led.color === 'red' ? '#ef4444' : led.color === 'yellow' ? '#eab308' : '#22c55e'}
                    isActive={isActive}
                  />
                  {/* Wire from LED to GND */}
                  <WireSVG
                    x1={led.x + 10}
                    y1={led.y + 8}
                    x2={300}
                    y2={led.y + 20}
                    color="#1f2937"
                    isActive={false}
                  />
                  <WireSVG
                    x1={300}
                    y1={led.y + 20}
                    x2={300}
                    y2={320}
                    color="#1f2937"
                    isActive={false}
                  />
                  <WireSVG
                    x1={300}
                    y1={320}
                    x2={188}
                    y2={320}
                    color="#1f2937"
                    isActive={false}
                  />
                </g>
              )
            }
            return null
          })}

        {/* Render Components */}
        {components.map((comp) => {
          if (comp.type === 'LED') {
            const isOn = comp.connectedPin
              ? pinStates[comp.connectedPin] === 'HIGH'
              : false
            return (
              <LEDSVG
                key={comp.id}
                x={comp.x}
                y={comp.y}
                isOn={isOn}
                color={comp.color || 'red'}
                label={comp.name || comp.id}
                isSelected={selectedComponentId === comp.id}
                onClick={() => setSelectedComponentId(comp.id)}
              />
            )
          }
          if (comp.type === 'Resistor') {
            return (
              <ResistorSVG
                key={comp.id}
                x={comp.x}
                y={comp.y}
                isSelected={selectedComponentId === comp.id}
                onClick={() => setSelectedComponentId(comp.id)}
              />
            )
          }
          return null
        })}
      </svg>

      {/* Properties Panel */}
      {selectedComponent && (
        <div className="circuit-2d-properties">
          <div className="properties-header">
            <span>{selectedComponent.type}</span>
            <span className="properties-help">?</span>
          </div>
          <div className="properties-content">
            <div className="property-field">
              <label>Name</label>
              <input
                type="text"
                value={selectedComponent.name || selectedComponent.id}
                onChange={(e) => {
                  setComponents((prev) =>
                    prev.map((c) =>
                      c.id === selectedComponent.id
                        ? { ...c, name: e.target.value }
                        : c,
                    ),
                  )
                }}
              />
            </div>
            {selectedComponent.type === 'LED' && (
              <div className="property-field">
                <label>Color</label>
                <select
                  value={selectedComponent.color || 'red'}
                  onChange={(e) => {
                    setComponents((prev) =>
                      prev.map((c) =>
                        c.id === selectedComponent.id
                          ? { ...c, color: e.target.value }
                          : c,
                      ),
                    )
                  }}
                >
                  <option value="red">Red</option>
                  <option value="yellow">Yellow</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

