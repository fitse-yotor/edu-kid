import { useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { BlocklyWorkspace } from '../blocks/BlocklyWorkspace'
import './projectEditor.css'

const projectNames: Record<string, string> = {
  'led-blink': 'LED Blinking',
  'traffic-light': 'Traffic Light',
  'sound-generator': 'Sound Generator',
}

const sampleXmlByProject: Record<string, string> = {
  'led-blink': `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="start_block" x="40" y="40">
    <statement name="DO">
      <block type="digital_write">
        <field name="PIN">D2</field>
        <field name="LEVEL">HIGH</field>
        <next>
          <block type="delay_ms">
            <field name="MS">500</field>
            <next>
              <block type="digital_write">
                <field name="PIN">D2</field>
                <field name="LEVEL">LOW</field>
                <next>
                  <block type="delay_ms">
                    <field name="MS">500</field>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`,
  'traffic-light': `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="start_block" x="40" y="40">
    <statement name="DO">
      <block type="digital_write">
        <field name="PIN">D2</field>
        <field name="LEVEL">HIGH</field>
        <next>
          <block type="digital_write">
            <field name="PIN">D3</field>
            <field name="LEVEL">LOW</field>
            <next>
              <block type="digital_write">
                <field name="PIN">D4</field>
                <field name="LEVEL">LOW</field>
                <next>
                  <block type="delay_ms">
                    <field name="MS">800</field>
                    <next>
                      <block type="digital_write">
                        <field name="PIN">D2</field>
                        <field name="LEVEL">LOW</field>
                        <next>
                          <block type="digital_write">
                            <field name="PIN">D4</field>
                            <field name="LEVEL">HIGH</field>
                            <next>
                              <block type="delay_ms">
                                <field name="MS">800</field>
                                <next>
                                  <block type="digital_write">
                                    <field name="PIN">D4</field>
                                    <field name="LEVEL">LOW</field>
                                    <next>
                                      <block type="digital_write">
                                        <field name="PIN">D3</field>
                                        <field name="LEVEL">HIGH</field>
                                        <next>
                                          <block type="delay_ms">
                                            <field name="MS">600</field>
                                          </block>
                                        </next>
                                      </block>
                                    </next>
                                  </block>
                                </next>
                              </block>
                            </next>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`,
  'sound-generator': `<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="start_block" x="40" y="40">
    <statement name="DO">
      <block type="digital_write">
        <field name="PIN">D5</field>
        <field name="LEVEL">HIGH</field>
        <next>
          <block type="delay_ms">
            <field name="MS">300</field>
            <next>
              <block type="digital_write">
                <field name="PIN">D5</field>
                <field name="LEVEL">LOW</field>
                <next>
                  <block type="delay_ms">
                    <field name="MS">300</field>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </statement>
  </block>
</xml>`,
}

type GuideContent = {
  steps: string[]
  codeHint: string
}

const guideByProject: Record<string, GuideContent> = {
  'led-blink': {
    steps: [
      'Use the start block “when program starts”.',
      'Add a “set pin” block and choose D2 → HIGH to turn the LED on.',
      'Add another “set pin” block and choose D2 → LOW to turn the LED off.',
      'Later you can wrap these in a loop and add waits to make a blinking pattern.',
    ],
    codeHint: `// Example LED blink idea
setDigitalPin('D2', true);
// wait a little (later we will add a delay block)
setDigitalPin('D2', false);`,
  },
  'traffic-light': {
    steps: [
      'Use D2 for RED, D3 for YELLOW, and D4 for GREEN.',
      'First set D2 HIGH and D3/D4 LOW for the RED phase.',
      'Then set D4 HIGH and D2/D3 LOW for the GREEN phase.',
      'Then set D3 HIGH and D2/D4 LOW for the YELLOW phase.',
      'Later you can repeat these steps in a loop to make a full traffic cycle.',
    ],
    codeHint: `// Traffic light example
const int redPin = D2;
const int yellowPin = D3;
const int greenPin = D4;

void setup() {
  pinMode(redPin, OUTPUT);
  pinMode(yellowPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
}

void loop() {
  // Red on
  digitalWrite(redPin, HIGH);
  delay(5000);

  // Red off, green on
  digitalWrite(redPin, LOW);
  digitalWrite(greenPin, HIGH);
  delay(5000);

  // Green off, yellow on
  digitalWrite(greenPin, LOW);
  digitalWrite(yellowPin, HIGH);
  delay(2000);

  // Yellow off
  digitalWrite(yellowPin, LOW);
}`,
  },
  'sound-generator': {
    steps: [
      'Use digital write on pin D5 to turn the buzzer “on”.',
      'Add a wait, then turn D5 “off” to create a beep.',
      'Repeat ON / OFF with waits to make a simple rhythm.',
    ],
    codeHint: `// Beep example on pin D5
const int buzzerPin = D5;

void setup() {
  pinMode(buzzerPin, OUTPUT);
}

void loop() {
  digitalWrite(buzzerPin, HIGH); // beep on
  delay(300);
  digitalWrite(buzzerPin, LOW);  // beep off
  delay(300);
}`,
  },
}

type PinState = 'HIGH' | 'LOW'

const PIN_LIST = ['D2', 'D3', 'D4', 'D5'] as const
type PinName = (typeof PIN_LIST)[number]

export function ProjectEditorPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const title = (projectId && projectNames[projectId]) || 'Guided Project'
  const guide = (projectId && guideByProject[projectId]) || guideByProject['led-blink']
  const sampleXml = (projectId && sampleXmlByProject[projectId]) || undefined

  const [generatedCode, setGeneratedCode] = useState('')
  const [arduinoCode, setArduinoCode] = useState('void setup() {\n}\n\nvoid loop() {\n}\n')
  const [blocksXml, setBlocksXml] = useState('')
  const [pinStates, setPinStates] = useState<Record<PinName, PinState>>({
    D2: 'LOW',
    D3: 'LOW',
    D4: 'LOW',
    D5: 'LOW',
  })
  const [ledColors, setLedColors] = useState<Record<PinName, string>>({
    D2: '#ef4444', // Red
    D3: '#eab308', // Yellow
    D4: '#22c55e', // Green
    D5: '#3b82f6', // Blue
  })
  const [resetCounter, setResetCounter] = useState(0)
  const [status, setStatus] = useState('Simulation stopped')
  const [isRunning, setIsRunning] = useState(false)
  const runTokenRef = useRef(0)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscRef = useRef<OscillatorNode | null>(null)

  const handleRun = async () => {
    if (!generatedCode.trim()) {
      setStatus('Add some blocks before running.')
      return
    }

    setIsRunning(true)
    setStatus('Running program...')

    // Increment run token so any previous loop stops.
    const currentToken = runTokenRef.current + 1
    runTokenRef.current = currentToken

    const setPin = (pin: PinName, high: boolean) => {
      setPinStates((prev) => ({
        ...prev,
        [pin]: high ? 'HIGH' : 'LOW',
      }))
    }

    const digitalWrite = (pin: string, high: boolean) => {
      if (!PIN_LIST.includes(pin as PinName)) return
      setPin(pin as PinName, high)

      // Simple beep on D5 for the sound project
      if (pin === 'D5') {
        if (high) {
          if (!audioCtxRef.current) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const AC = (window as any).AudioContext || (window as any).webkitAudioContext
            if (AC) {
              audioCtxRef.current = new AC()
            }
          }
          if (!oscRef.current && audioCtxRef.current) {
            const ctx = audioCtxRef.current
            if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
              // Resume audio context on user gesture
              ctx.resume()
            }
            const osc = ctx.createOscillator()
            osc.type = 'square'
            osc.frequency.value = 880 // A5 tone
            osc.connect(ctx.destination)
            osc.start()
            oscRef.current = osc
          }
        } else if (oscRef.current) {
          oscRef.current.stop()
          oscRef.current.disconnect()
          oscRef.current = null
        }
      }
    }

    const delay = (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, ms)
      })

    try {
      // Treat the block body as a single "loop iteration" and keep
      // running it until the user presses Stop.
      const wrapped = `return async function loopBody() {
${generatedCode}
}`

      // eslint-disable-next-line no-new-func
      const factory = new Function('digitalWrite', 'delay', wrapped) as (
        digitalWriteFn: typeof digitalWrite,
        delayFn: typeof delay,
      ) => () => Promise<void>

      const loopBody = factory(digitalWrite, delay)

      // Run continuously until the token changes (Stop pressed).
      while (runTokenRef.current === currentToken) {
        // eslint-disable-next-line no-await-in-loop
        await loopBody()
      }

      setStatus('Simulation stopped')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
      setStatus('Error while running program. Check your blocks.')
    } finally {
      setIsRunning(false)
    }
  }

  const handleStop = () => {
    setPinStates({
      D2: 'LOW',
      D3: 'LOW',
      D4: 'LOW',
      D5: 'LOW',
    })
    if (oscRef.current) {
      try {
        oscRef.current.stop()
      } catch {
        // ignore if already stopped
      }
      oscRef.current.disconnect()
      oscRef.current = null
    }
    // Change token so the running loop exits.
    runTokenRef.current += 1
    setStatus('Simulation stopped')
    setIsRunning(false)
  }

  const handleResetBlocks = () => {
    setResetCounter((c) => c + 1)
    setStatus('Blocks reset')
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(arduinoCode)
    setStatus('Code copied to clipboard')
    setTimeout(() => setStatus('Simulation stopped'), 2000)
  }

  return (
    <div className="page editor-page">
      <header className="page-header editor-header">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">
            Build the circuit on the right and program it with blocks on the left.
          </p>
        </div>
      </header>

      <div className="editor-body">
        <section className="editor-panel editor-left">
          <header className="panel-header">
            <h2 className="panel-title">Blocks</h2>
            <div className="panel-actions">
              {sampleXml && (
                <button
                  className="button secondary small"
                  type="button"
                  onClick={handleResetBlocks}
                >
                  Load example
                </button>
              )}
              <button
                className="button secondary small"
                type="button"
                onClick={handleResetBlocks}
              >
                Reset blocks
              </button>
            </div>
          </header>
          <div className="block-editor-shell">
            <BlocklyWorkspace
              onCodeChange={setGeneratedCode}
              onArduinoCodeChange={setArduinoCode}
              onXmlChange={setBlocksXml}
              resetSignal={resetCounter}
              initialXml={sampleXml}
            />
          </div>
          <div className="code-panel">
            <div className="code-panel-header">
              <div className="code-panel-title-row">
                <span className="code-panel-icon">{'{}'}</span>
                <span className="code-panel-title">Arduino Source Code</span>
              </div>
            </div>
            <pre className="code-panel-body">
              {arduinoCode || 'void setup() {\n}\n\nvoid loop() {\n}\n'}
            </pre>
          </div>
        </section>

        <section className="editor-panel editor-right">
          <div className="right-tabs">
            <button className="tab-button active" type="button">
              Circuit
            </button>
            <button className="tab-button" type="button">
              Guide
            </button>
          </div>

          <div className="right-panel-content">
            <div className="circuit-view">
              <div className="board">
                <div className="board-label">Virtual Board</div>
                <div className="board-pins">
                  {PIN_LIST.map((pin) => (
                    <span
                      key={pin}
                      className={
                        pinStates[pin] === 'HIGH' ? 'pin pin-on' : 'pin pin-off'
                      }
                    >
                      {pin}
                    </span>
                  ))}
                  <span className="pin">GND</span>
                  <span className="pin">5V</span>
                </div>
              </div>

              {projectId === 'sound-generator' ? (
                <div className="components-panel">
                  <div className="components-title">Speaker / Buzzer</div>
                  <div className="speaker-wrapper">
                    <div
                      className={
                        pinStates.D5 === 'HIGH'
                          ? 'speaker-icon speaker-on'
                          : 'speaker-icon speaker-off'
                      }
                    >
                      <span className="speaker-symbol">🔊</span>
                    </div>
                    <span className="speaker-label">D5 (sound pin)</span>
                    <p className="speaker-hint">
                      When your blocks set D5 HIGH, the speaker turns on and you
                      hear a beep.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="components-panel">
                  <div className="components-title">LEDs (simulated)</div>
                  <div className="led-row">
                    {PIN_LIST.map((pin) => (
                      <div key={pin} className="led-wrapper">
                        <div
                          className={
                            pinStates[pin] === 'HIGH' ? 'led led-on' : 'led led-off'
                          }
                          style={
                            pinStates[pin] === 'HIGH'
                              ? {
                                  background: ledColors[pin],
                                  boxShadow: `0 0 12px ${ledColors[pin]}, 0 0 20px ${ledColors[pin]}80`,
                                  borderColor: ledColors[pin],
                                }
                              : {
                                  background: '#e5e7eb',
                                }
                          }
                        />
                        <span className="led-label">{pin}</span>
                        <div className="led-color-picker">
                          <label
                            className="color-picker-label"
                            htmlFor={`color-${pin}`}
                          >
                            Color:
                          </label>
                          <input
                            type="color"
                            id={`color-${pin}`}
                            value={ledColors[pin]}
                            onChange={(e) => {
                              setLedColors((prev) => ({
                                ...prev,
                                [pin]: e.target.value,
                              }))
                            }}
                            className="color-picker-input"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="guide-view">
              <h3 className="guide-title">Steps for this project</h3>
              <ol className="guide-steps">
                {guide.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <div className="guide-code-hint">
                <div className="guide-code-title">One possible solution</div>
                <pre className="guide-code-body">{guide.codeHint}</pre>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="editor-footer">
        <div className="simulation-controls">
          <button
            className="button primary"
            type="button"
            onClick={handleRun}
            disabled={isRunning}
          >
            {isRunning ? 'Running…' : 'Run'}
          </button>
          <button className="button danger" type="button" onClick={handleStop}>
            Stop
          </button>
          <button
            className="button secondary"
            type="button"
            onClick={handleResetBlocks}
          >
            Reset blocks
          </button>
          <span className="sim-status">{status}</span>
        </div>
      </footer>
    </div>
  )
}

