import { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei'
import * as THREE from 'three'

type PinState = 'HIGH' | 'LOW'

type ComponentType = 'LED' | 'Resistor' | 'Button' | 'Buzzer'

type Component = {
  id: string
  type: ComponentType
  position: [number, number, number]
  rotation?: [number, number, number]
  color?: string
  connectedPin?: string
  name?: string
}

type TinkercadStyleSimulatorProps = {
  pinStates: Record<string, PinState>
}

// 3D Arduino Uno Board (more detailed)
function ArduinoUno3D({ pinStates }: { pinStates: Record<string, PinState> }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Main board body - blue like Arduino */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[7, 5.3, 0.15]} />
        <meshStandardMaterial color="#1e40af" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* USB connector */}
      <mesh position={[-3.2, 0, 0.2]} castShadow>
        <boxGeometry args={[0.5, 1, 0.3]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* Digital pins row (top) */}
      {Array.from({ length: 14 }).map((_, i) => {
        const pinNum = i
        const xPos = -2.5 + (i * 0.35)
        const pinLabel = `D${pinNum}`
        const isHigh = pinStates[pinLabel] === 'HIGH'
        
        return (
          <group key={`digital-${i}`} position={[xPos, 2.3, 0.15]}>
            <mesh castShadow>
              <boxGeometry args={[0.2, 0.4, 0.5]} />
              <meshStandardMaterial color={isHigh ? '#22c55e' : '#64748b'} />
            </mesh>
            {i < 4 && (
              <Text
                position={[0, -0.6, 0.3]}
                fontSize={0.12}
                color={isHigh ? '#22c55e' : '#94a3b8'}
                anchorX="center"
                anchorY="middle"
              >
                {pinNum}
              </Text>
            )}
          </group>
        )
      })}

      {/* Power pins (bottom right) */}
      <group position={[2.8, -2, 0.15]}>
        <mesh castShadow>
          <boxGeometry args={[0.2, 0.4, 0.5]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
        <Text
          position={[0, -0.6, 0.3]}
          fontSize={0.12}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
        >
          5V
        </Text>
      </group>

      <group position={[2.8, -2.4, 0.15]}>
        <mesh castShadow>
          <boxGeometry args={[0.2, 0.4, 0.5]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <Text
          position={[0, -0.6, 0.3]}
          fontSize={0.12}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          GND
        </Text>
      </group>

      {/* Analog pins */}
      {Array.from({ length: 6 }).map((_, i) => {
        const xPos = 2.8
        const yPos = -1.2 - (i * 0.4)
        return (
          <group key={`analog-${i}`} position={[xPos, yPos, 0.15]}>
            <mesh castShadow>
              <boxGeometry args={[0.2, 0.4, 0.5]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
            {i === 0 && (
              <Text
                position={[0, -0.6, 0.3]}
                fontSize={0.12}
                color="#94a3b8"
                anchorX="center"
                anchorY="middle"
              >
                A0
              </Text>
            )}
          </group>
        )
      })}

      {/* Arduino text label */}
      <Text
        position={[-1.5, -0.5, 0.1]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="left"
        anchorY="middle"
      >
        ARDUINO
      </Text>
      <Text
        position={[-1.5, -0.8, 0.1]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="left"
        anchorY="middle"
      >
        UNO R3
      </Text>
    </group>
  )
}

// 3D LED Component (more detailed)
function LED3DComponent({
  position,
  isOn,
  color = 'red',
  label,
  isSelected,
  onClick,
}: {
  position: [number, number, number]
  isOn: boolean
  color?: string
  label: string
  isSelected: boolean
  onClick: () => void
}) {
  const ledRef = useRef<THREE.Group>(null)
  const colorMap: Record<string, string> = {
    red: '#ef4444',
    yellow: '#eab308',
    green: '#22c55e',
    blue: '#3b82f6',
  }

  useFrame(() => {
    if (ledRef.current && isOn) {
      const scale = 1 + Math.sin(Date.now() * 0.005) * 0.15
      ledRef.current.scale.set(scale, scale, scale)
    } else if (ledRef.current) {
      ledRef.current.scale.set(1, 1, 1)
    }
  })

  const ledColor = colorMap[color] || colorMap.red

  return (
    <group
      ref={ledRef}
      position={position}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
      }}
    >
      {/* LED body - cylindrical */}
      <mesh castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.5, 16]} />
        <meshStandardMaterial
          color={isOn ? ledColor : '#64748b'}
          emissive={isOn ? ledColor : '#000000'}
          emissiveIntensity={isOn ? 1 : 0}
        />
      </mesh>
      
      {/* LED glow when on */}
      {isOn && (
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 0.15, 16]} />
          <meshStandardMaterial
            color={ledColor}
            transparent
            opacity={0.4}
            emissive={ledColor}
            emissiveIntensity={0.6}
          />
        </mesh>
      )}

      {/* Selection outline */}
      {isSelected && (
        <mesh>
          <cylinderGeometry args={[0.35, 0.35, 0.55, 16]} />
          <meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={0.3}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Label */}
      <Text
        position={[0, -0.7, 0]}
        fontSize={0.15}
        color={isSelected ? '#3b82f6' : '#94a3b8'}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  )
}

// 3D Resistor Component
function Resistor3D({
  position,
  isSelected,
  onClick,
}: {
  position: [number, number, number]
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <group
      position={position}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
      }}
    >
      {/* Resistor body */}
      <mesh castShadow>
        <boxGeometry args={[0.8, 0.3, 0.3]} />
        <meshStandardMaterial color="#8b5cf6" />
      </mesh>
      
      {/* Resistor bands */}
      {[0, 0.15, 0.3, 0.45].map((offset, i) => (
        <mesh key={i} position={[-0.3 + offset, 0, 0.16]}>
          <boxGeometry args={[0.05, 0.3, 0.05]} />
          <meshStandardMaterial color={i === 0 ? '#ef4444' : '#1f2937'} />
        </mesh>
      ))}

      {/* Selection outline */}
      {isSelected && (
        <mesh>
          <boxGeometry args={[0.9, 0.4, 0.4]} />
          <meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={0.3}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  )
}

// Wire connecting components
function Wire3D({
  start,
  end,
  color = '#64748b',
  isActive = false,
}: {
  start: [number, number, number]
  end: [number, number, number]
  color?: string
  isActive?: boolean
}) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <line geometry={geometry}>
      <lineBasicMaterial
        color={isActive ? '#22c55e' : color}
        linewidth={3}
        opacity={isActive ? 1 : 0.6}
        transparent
      />
    </line>
  )
}

// Main 3D Scene
function CircuitScene({
  pinStates,
  components,
  selectedComponentId,
  onComponentClick,
}: {
  pinStates: Record<string, PinState>
  components: Component[]
  selectedComponentId: string | null
  onComponentClick: (id: string) => void
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={0.9} castShadow />
      <pointLight position={[-5, 5, 5]} intensity={0.5} />

      {/* Camera */}
      <PerspectiveCamera makeDefault position={[12, 8, 12]} fov={45} />

      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={8}
        maxDistance={25}
        target={[0, 0, 0]}
      />

      {/* Ground plane with grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>

      {/* Grid lines on ground */}
      {Array.from({ length: 31 }).map((_, i) => {
        const pos = -15 + i
        return (
          <group key={`grid-${i}`}>
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([pos, -0.49, -15, pos, -0.49, 15])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#e2e8f0" opacity={0.5} transparent />
            </line>
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([-15, -0.49, pos, 15, -0.49, pos])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#e2e8f0" opacity={0.5} transparent />
            </line>
          </group>
        )
      })}

      {/* Arduino Board */}
      <ArduinoUno3D pinStates={pinStates} />

      {/* Render components */}
      {components.map((comp) => {
        if (comp.type === 'LED') {
          const isOn = comp.connectedPin
            ? pinStates[comp.connectedPin] === 'HIGH'
            : false
          return (
            <LED3DComponent
              key={comp.id}
              position={comp.position}
              isOn={isOn}
              color={comp.color || 'red'}
              label={comp.name || comp.id}
              isSelected={selectedComponentId === comp.id}
              onClick={() => onComponentClick(comp.id)}
            />
          )
        }
        if (comp.type === 'Resistor') {
          return (
            <Resistor3D
              key={comp.id}
              position={comp.position}
              isSelected={selectedComponentId === comp.id}
              onClick={() => onComponentClick(comp.id)}
            />
          )
        }
        return null
      })}

      {/* Render wires */}
      {components
        .filter((c) => c.type === 'LED' && c.connectedPin)
        .map((led) => {
          const pinNum = led.connectedPin?.replace('D', '') || '2'
          const pinX = -2.5 + parseInt(pinNum) * 0.35
          const isActive = pinStates[led.connectedPin || ''] === 'HIGH'
          
          // Wire from pin to resistor
          const resistor = components.find(
            (c) => c.type === 'Resistor' && Math.abs(c.position[0] - led.position[0]) < 1
          )
          
          if (resistor) {
            return (
              <group key={`wire-${led.id}`}>
                <Wire3D
                  start={[pinX, 2.3, 0.4]}
                  end={[resistor.position[0], resistor.position[1] + 0.3, resistor.position[2]]}
                  color={led.color === 'red' ? '#ef4444' : led.color === 'yellow' ? '#eab308' : '#22c55e'}
                  isActive={isActive}
                />
                <Wire3D
                  start={[resistor.position[0], resistor.position[1] - 0.3, resistor.position[2]]}
                  end={[led.position[0], led.position[1] + 0.3, led.position[2]]}
                  color={led.color === 'red' ? '#ef4444' : led.color === 'yellow' ? '#eab308' : '#22c55e'}
                  isActive={isActive}
                />
                <Wire3D
                  start={[led.position[0], led.position[1] - 0.3, led.position[2]]}
                  end={[2.8, -2.4, 0.4]}
                  color="#1f2937"
                  isActive={false}
                />
              </group>
            )
          }
          return null
        })}
    </>
  )
}

const COMPONENT_LIBRARY: Array<{ type: ComponentType; name: string; icon: string }> = [
  { type: 'Resistor', name: 'Resistor', icon: '⚡' },
  { type: 'LED', name: 'LED', icon: '💡' },
  { type: 'Button', name: 'Pushbutton', icon: '🔘' },
  { type: 'Buzzer', name: 'Buzzer', icon: '🔊' },
]

export function TinkercadStyleSimulator({
  pinStates,
}: TinkercadStyleSimulatorProps) {
  const [components, setComponents] = useState<Component[]>([
    {
      id: 'led1',
      type: 'LED',
      position: [3, 3, 0.5],
      color: 'red',
      connectedPin: 'D2',
      name: '1',
    },
    {
      id: 'res1',
      type: 'Resistor',
      position: [1.5, 3, 0.5],
    },
    {
      id: 'led2',
      type: 'LED',
      position: [3, 2, 0.5],
      color: 'yellow',
      connectedPin: 'D3',
      name: '2',
    },
    {
      id: 'res2',
      type: 'Resistor',
      position: [1.5, 2, 0.5],
    },
    {
      id: 'led3',
      type: 'LED',
      position: [3, 1, 0.5],
      color: 'green',
      connectedPin: 'D4',
      name: '3',
    },
    {
      id: 'res3',
      type: 'Resistor',
      position: [1.5, 1, 0.5],
    },
  ])

  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null,
  )

  const selectedComponent = components.find((c) => c.id === selectedComponentId)

  const handleAddComponent = (type: ComponentType) => {
    const newId = `${type.toLowerCase()}${Date.now()}`
    const newComponent: Component = {
      id: newId,
      type,
      position: [5, 2, 0.5],
      ...(type === 'LED' && { color: 'red' }),
    }
    setComponents((prev) => [...prev, newComponent])
  }

  return (
    <div className="tinkercad-simulator">
      {/* Component Library Sidebar */}
      <div className="tinkercad-library">
        <div className="library-header">
          <span>Components</span>
          <select className="library-category">
            <option>Basic</option>
          </select>
        </div>
        <div className="library-search">
          <input type="text" placeholder="Search components..." />
        </div>
        <div className="library-grid">
          {COMPONENT_LIBRARY.map((comp) => (
            <button
              key={comp.type}
              className="library-item"
              type="button"
              onClick={() => handleAddComponent(comp.type)}
              title={comp.name}
            >
              <span className="library-icon">{comp.icon}</span>
              <span className="library-name">{comp.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="tinkercad-workplane">
        <Canvas shadows gl={{ antialias: true }}>
          <CircuitScene
            pinStates={pinStates}
            components={components}
            selectedComponentId={selectedComponentId}
            onComponentClick={setSelectedComponentId}
          />
        </Canvas>
      </div>

      {/* Properties Panel */}
      {selectedComponent && (
        <div className="tinkercad-properties">
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

