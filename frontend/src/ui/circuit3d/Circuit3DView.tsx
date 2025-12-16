import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei'
import * as THREE from 'three'

type PinState = 'HIGH' | 'LOW'

type Circuit3DViewProps = {
  pinStates: Record<string, PinState>
}

// 3D Arduino Board Component
function ArduinoBoard({ pinStates }: { pinStates: Record<string, PinState> }) {
  const boardRef = useRef<THREE.Group>(null)

  return (
    <group ref={boardRef} position={[0, 0, 0]}>
      {/* Main board body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 4, 0.2]} />
        <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* USB connector */}
      <mesh position={[-2.5, 0, 0.15]} castShadow>
        <boxGeometry args={[0.4, 0.8, 0.3]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* Pin headers */}
      {['D2', 'D3', 'D4', 'D5'].map((pin, idx) => {
        const xPos = -1.5 + idx * 0.5
        const isHigh = pinStates[pin] === 'HIGH'
        return (
          <group key={pin} position={[xPos, 1.5, 0.2]}>
            {/* Pin header */}
            <mesh castShadow>
              <boxGeometry args={[0.15, 0.3, 0.4]} />
              <meshStandardMaterial color={isHigh ? '#22c55e' : '#64748b'} />
            </mesh>
            {/* Pin label */}
            <Text
              position={[0, -0.5, 0.3]}
              fontSize={0.15}
              color={isHigh ? '#22c55e' : '#94a3b8'}
              anchorX="center"
              anchorY="middle"
            >
              {pin}
            </Text>
          </group>
        )
      })}

      {/* GND and 5V pins */}
      <group position={[-1.5, -1.5, 0.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.15, 0.3, 0.4]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <Text
          position={[0, -0.5, 0.3]}
          fontSize={0.15}
          color="#94a3b8"
          anchorX="center"
          anchorY="middle"
        >
          GND
        </Text>
      </group>

      <group position={[-1, -1.5, 0.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.15, 0.3, 0.4]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
        <Text
          position={[0, -0.5, 0.3]}
          fontSize={0.15}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
        >
          5V
        </Text>
      </group>
    </group>
  )
}

// 3D LED Component
function LED3D({
  position,
  isOn,
  label,
}: {
  position: [number, number, number]
  isOn: boolean
  label: string
}) {
  const ledRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (ledRef.current && isOn) {
      // Subtle pulsing animation when on
      const scale = 1 + Math.sin(Date.now() * 0.005) * 0.1
      ledRef.current.scale.set(scale, scale, scale)
    } else if (ledRef.current) {
      ledRef.current.scale.set(1, 1, 1)
    }
  })

  return (
    <group ref={ledRef} position={position}>
      {/* LED body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
        <meshStandardMaterial
          color={isOn ? '#22c55e' : '#64748b'}
          emissive={isOn ? '#22c55e' : '#000000'}
          emissiveIntensity={isOn ? 0.8 : 0}
        />
      </mesh>
      {/* LED glow effect when on */}
      {isOn && (
        <mesh>
          <cylinderGeometry args={[0.25, 0.25, 0.1, 16]} />
          <meshStandardMaterial
            color="#22c55e"
            transparent
            opacity={0.3}
            emissive="#22c55e"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
      {/* Label */}
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.12}
        color={isOn ? '#22c55e' : '#94a3b8'}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  )
}

// Wire connecting pin to LED
function Wire3D({
  start,
  end,
  isActive,
}: {
  start: [number, number, number]
  end: [number, number, number]
  isActive: boolean
}) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  return (
    <line geometry={geometry}>
      <lineBasicMaterial
        color={isActive ? '#22c55e' : '#64748b'}
        linewidth={2}
        opacity={isActive ? 1 : 0.3}
        transparent
      />
    </line>
  )
}

// Breadboard representation
function Breadboard3D() {
  return (
    <group position={[0, -3, 0]}>
      {/* Main breadboard body */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[8, 3, 0.3]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
      </mesh>
      {/* Breadboard holes (simplified as small dots) */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={i}
          position={[-3.5 + (i % 10) * 0.7, -1 + Math.floor(i / 10) * 0.5, 0.2]}
        >
          <cylinderGeometry args={[0.05, 0.05, 0.1, 8]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
      ))}
    </group>
  )
}

// Main 3D Scene
function CircuitScene({ pinStates }: Circuit3DViewProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <pointLight position={[-5, 5, 5]} intensity={0.4} />

      {/* Camera */}
      <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={50} />

      {/* Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
      />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {/* Arduino Board */}
      <ArduinoBoard pinStates={pinStates} />

      {/* LEDs positioned around the board */}
      <LED3D
        position={[2, 1.5, 1]}
        isOn={pinStates.D2 === 'HIGH'}
        label="D2"
      />
      <LED3D
        position={[2.5, 1.5, 1]}
        isOn={pinStates.D3 === 'HIGH'}
        label="D3"
      />
      <LED3D
        position={[3, 1.5, 1]}
        isOn={pinStates.D4 === 'HIGH'}
        label="D4"
      />
      <LED3D
        position={[3.5, 1.5, 1]}
        isOn={pinStates.D5 === 'HIGH'}
        label="D5"
      />

      {/* Wires connecting pins to LEDs */}
      <Wire3D
        start={[-1.5, 1.5, 0.4]}
        end={[2, 1.5, 1.2]}
        isActive={pinStates.D2 === 'HIGH'}
      />
      <Wire3D
        start={[-1, 1.5, 0.4]}
        end={[2.5, 1.5, 1.2]}
        isActive={pinStates.D3 === 'HIGH'}
      />
      <Wire3D
        start={[-0.5, 1.5, 0.4]}
        end={[3, 1.5, 1.2]}
        isActive={pinStates.D4 === 'HIGH'}
      />
      <Wire3D
        start={[0, 1.5, 0.4]}
        end={[3.5, 1.5, 1.2]}
        isActive={pinStates.D5 === 'HIGH'}
      />

      {/* Breadboard */}
      <Breadboard3D />
    </>
  )
}

export function Circuit3DView({ pinStates }: Circuit3DViewProps) {
  return (
    <div className="circuit-3d-container">
      <Canvas shadows gl={{ antialias: true }}>
        <CircuitScene pinStates={pinStates} />
      </Canvas>
    </div>
  )
}

