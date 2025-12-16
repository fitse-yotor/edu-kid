import { useEffect, useRef } from 'react'
import * as Blockly from 'blockly'
import 'blockly/blocks'
import { javascriptGenerator } from 'blockly/javascript'

type BlocklyWorkspaceProps = {
  onCodeChange?: (code: string) => void
  onArduinoCodeChange?: (code: string) => void
  onXmlChange?: (xml: string) => void
  resetSignal?: number
  initialXml?: string
}

// Very small Arduino-like generator for preview (not used to run the program)
const arduinoGenerator = new Blockly.Generator('arduino')

// Define simple custom blocks for start + IO + delay
function defineCustomBlocks() {
  if (Blockly.Blocks['start_block']) {
    // already defined
    return
  }

  Blockly.Blocks['start_block'] = {
    init() {
      this.appendDummyInput().appendField('when program starts')
      this.appendStatementInput('DO').setCheck(null)
      this.setColour(210)
      this.setDeletable(false)
    },
  }

  javascriptGenerator.forBlock['start_block'] = function (block) {
    const statements = javascriptGenerator.statementToCode(block, 'DO')
    return statements
  }

  arduinoGenerator.forBlock['start_block'] = function (block) {
    const branch = arduinoGenerator.statementToCode(block, 'DO')
    return branch
  }

  // Simple digitalWrite block
  Blockly.Blocks['digital_write'] = {
    init() {
      this.appendDummyInput()
        .appendField('digital write pin')
        .appendField(
          new Blockly.FieldDropdown([
            ['D2', 'D2'],
            ['D3', 'D3'],
            ['D4', 'D4'],
            ['D5', 'D5'],
          ]),
          'PIN',
        )
        .appendField('to')
        .appendField(
          new Blockly.FieldDropdown([
            ['HIGH', 'HIGH'],
            ['LOW', 'LOW'],
          ]),
          'LEVEL',
        )
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour(120)
    },
  }

  javascriptGenerator.forBlock['digital_write'] = function (block) {
    const pin = block.getFieldValue('PIN')
    const level = block.getFieldValue('LEVEL') === 'HIGH' ? 'true' : 'false'
    return `digitalWrite('${pin}', ${level});\n`
  }

  arduinoGenerator.forBlock['digital_write'] = function (block) {
    const pin = block.getFieldValue('PIN')
    const level = block.getFieldValue('LEVEL') === 'HIGH' ? 'HIGH' : 'LOW'
    return `  digitalWrite(${pin}, ${level});\n`
  }

  // Simple delay block
  Blockly.Blocks['delay_ms'] = {
    init() {
      this.appendDummyInput()
        .appendField('wait')
        .appendField(new Blockly.FieldNumber(500, 0, 10000, 50), 'MS')
        .appendField('ms')
      this.setPreviousStatement(true, null)
      this.setNextStatement(true, null)
      this.setColour(200)
    },
  }

  javascriptGenerator.forBlock['delay_ms'] = function (block) {
    const ms = block.getFieldValue('MS')
    return `await delay(${ms});\n`
  }

  arduinoGenerator.forBlock['delay_ms'] = function (block) {
    const ms = block.getFieldValue('MS')
    return `  delay(${ms});\n`
  }
}

const TOOLBOX_XML = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <category name="Start" colour="#FFB300">
    <block type="start_block"></block>
  </category>
  <category name="Pins" colour="#43A047">
    <block type="digital_write"></block>
  </category>
  <category name="Time" colour="#1E88E5">
    <block type="delay_ms"></block>
  </category>
</xml>
`

export function BlocklyWorkspace({
  onCodeChange,
  onArduinoCodeChange,
  onXmlChange,
  resetSignal,
  initialXml,
}: BlocklyWorkspaceProps) {
  const blocklyDivRef = useRef<HTMLDivElement | null>(null)
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null)

  useEffect(() => {
    defineCustomBlocks()

    if (!blocklyDivRef.current) return

    const toolboxDom = Blockly.utils.xml.textToDom(TOOLBOX_XML)

    const workspace = Blockly.inject(blocklyDivRef.current, {
      toolbox: toolboxDom,
      renderer: 'geras',
      trashcan: true,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.9,
      },
    })

    workspaceRef.current = workspace

    // Place a start block by default
    const startBlock = workspace.newBlock('start_block')
    startBlock.initSvg()
    startBlock.render()
    startBlock.moveBy(40, 40)

    const handleChange = () => {
      const jsCode = javascriptGenerator.workspaceToCode(workspace)
      const arduinoBody = arduinoGenerator.workspaceToCode(workspace)

      // Rough Ardublockly-like technique: scan generated body to decide pinMode lines.
      const usedPins = new Set<string>()
      const pinMatchRegex = /digitalWrite\((D[0-9]+),/g
      let match: RegExpExecArray | null
      // eslint-disable-next-line no-cond-assign
      while ((match = pinMatchRegex.exec(arduinoBody)) !== null) {
        usedPins.add(match[1])
      }

      let setupSection = 'void setup() {\n'
      usedPins.forEach((pin) => {
        setupSection += `  pinMode(${pin}, OUTPUT);\n`
      })
      setupSection += '}\n\n'

      const arduinoFull = setupSection + 'void loop() {\n' + arduinoBody + '}\n'

      const xmlDom = Blockly.Xml.workspaceToDom(workspace)
      const xmlText = Blockly.Xml.domToPrettyText(xmlDom)

      if (onCodeChange) onCodeChange(jsCode)
      if (onArduinoCodeChange) onArduinoCodeChange(arduinoFull)
      if (onXmlChange) onXmlChange(xmlText)
    }

    workspace.addChangeListener(handleChange)
    handleChange()

    return () => {
      workspace.dispose()
      workspaceRef.current = null
    }
  }, [])

  // Simple reset: clear workspace and add a new start block when resetSignal changes
  useEffect(() => {
    if (!workspaceRef.current) return
    const ws = workspaceRef.current
    ws.clear()

    if (initialXml && initialXml.trim()) {
      try {
        const xml = Blockly.utils.xml.textToDom(initialXml)
        Blockly.Xml.domToWorkspace(xml, ws)
      } catch {
        const startBlock = ws.newBlock('start_block')
        startBlock.initSvg()
        startBlock.render()
        startBlock.moveBy(40, 40)
      }
    } else {
      const startBlock = ws.newBlock('start_block')
      startBlock.initSvg()
      startBlock.render()
      startBlock.moveBy(40, 40)
    }

    const jsCode = javascriptGenerator.workspaceToCode(ws)
    const arduinoBody = arduinoGenerator.workspaceToCode(ws)

    const usedPins = new Set<string>()
    const pinMatchRegex = /digitalWrite\((D[0-9]+),/g
    let match: RegExpExecArray | null
    // eslint-disable-next-line no-cond-assign
    while ((match = pinMatchRegex.exec(arduinoBody)) !== null) {
      usedPins.add(match[1])
    }

    let setupSection = 'void setup() {\n'
    usedPins.forEach((pin) => {
      setupSection += `  pinMode(${pin}, OUTPUT);\n`
    })
    setupSection += '}\n\n'

    const arduinoFull = setupSection + 'void loop() {\n' + arduinoBody + '}\n'
    const xmlDom = Blockly.Xml.workspaceToDom(ws)
    const xmlText = Blockly.Xml.domToPrettyText(xmlDom)

    if (onCodeChange) onCodeChange(jsCode)
    if (onArduinoCodeChange) onArduinoCodeChange(arduinoFull)
    if (onXmlChange) onXmlChange(xmlText)
  }, [resetSignal, onCodeChange, onArduinoCodeChange, onXmlChange])

  return <div className="blockly-container" ref={blocklyDivRef} />
}


