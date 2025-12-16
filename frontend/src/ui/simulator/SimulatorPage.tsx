import { useState } from 'react'
import { Circuit2DView } from '../circuit2d/Circuit2DView'
import '../projects/projectEditor.css'

type PinState = 'HIGH' | 'LOW'

const PIN_LIST = ['D2', 'D3', 'D4', 'D5'] as const
type PinName = (typeof PIN_LIST)[number]

export function SimulatorPage() {
  const [pinStates, setPinStates] = useState<Record<PinName, PinState>>({
    D2: 'LOW',
    D3: 'LOW',
    D4: 'LOW',
    D5: 'LOW',
  })

  const togglePin = (pin: PinName) => {
    setPinStates((prev) => ({
      ...prev,
      [pin]: prev[pin] === 'HIGH' ? 'LOW' : 'HIGH',
    }))
  }

  const setAllLow = () => {
    setPinStates({
      D2: 'LOW',
      D3: 'LOW',
      D4: 'LOW',
      D5: 'LOW',
    })
  }

  return (
    <div className="page editor-page codekit-style">
      <div className="codekit-topbar">
        <div className="codekit-logo">
          <span className="logo-icon">💡</span>
          <span className="logo-text">
            EDU <span className="logo-accent">KIT</span>
          </span>
        </div>
        <div className="codekit-center-controls">
          <span className="codekit-project-name">2D Circuit Simulator (Test)</span>
        </div>
        <div className="codekit-right-controls" />
      </div>

      <div className="codekit-main-layout">
        <div className="codekit-canvas-container">
          <div className="codekit-canvas-header">
            <span>Manual pin controls for testing</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
              {PIN_LIST.map((pin) => (
                <button
                  key={pin}
                  type="button"
                  className={
                    pinStates[pin] === 'HIGH'
                      ? 'codekit-btn-run'
                      : 'codekit-btn-reset'
                  }
                  onClick={() => togglePin(pin)}
                >
                  {pin}: {pinStates[pin]}
                </button>
              ))}
              <button
                type="button"
                className="codekit-btn-reset"
                onClick={setAllLow}
              >
                All LOW
              </button>
            </div>
          </div>
          <div className="block-editor-shell codekit-canvas">
            <Circuit2DView pinStates={pinStates} />
          </div>
        </div>
      </div>
    </div>
  )
}


