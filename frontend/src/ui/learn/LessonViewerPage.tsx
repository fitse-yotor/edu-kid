import { useParams } from 'react-router-dom'
import './learn.css'

const steps = ['Intro', 'Interactive', 'Quiz']

type QuizQuestion = {
  question: string
  options: string[]
  answerIndex: number
}

type LessonContent = {
  title: string
  introTitle: string
  introBody: string[]
  interactiveTitle: string
  interactiveBody: string
  quizTitle: string
  quizQuestions: QuizQuestion[]
}

const lessonContentById: Record<string, LessonContent> = {
  basics: {
    title: 'Electronics Basics',
    introTitle: 'Electricity as Moving Water',
    introBody: [
      'Imagine electricity as water flowing through pipes. Voltage is like water pressure, current is how much water flows, and resistance is how narrow the pipe is.',
      'In a circuit, the battery pushes charges around the loop, wires guide the flow, and components like resistors and LEDs control or use the energy.',
    ],
    interactiveTitle: 'Water-Flow Analogy Demo',
    interactiveBody:
      'Use a slider (voltage) and a slider (resistance) to see a river animation speed up or slow down. When you increase voltage, the water flows faster. When you increase resistance, the pipe narrows and the flow slows down. This helps you see how V, I, and R are linked.',
    quizTitle: 'Check Your Understanding',
    quizQuestions: [
      {
        question: 'In the water pipe analogy, what does current represent?',
        options: ['Water pressure', 'Amount of water flowing', 'Size of the pipe', 'Color of the water'],
        answerIndex: 1,
      },
      {
        question: 'If you make the pipe thinner (more resistance), what happens to the current?',
        options: ['It increases', 'It stays the same', 'It decreases', 'It disappears instantly'],
        answerIndex: 2,
      },
    ],
  },
  components: {
    title: 'Electronic Components',
    introTitle: 'Meet the Parts of a Circuit',
    introBody: [
      'Every circuit is built from simple building blocks: resistors, LEDs, capacitors, buttons, and more. Each part has a symbol and a job, just like characters in a story.',
      'Resistors slow current down and protect LEDs. LEDs turn electrical energy into light. Capacitors store and release energy, like tiny rechargeable buckets.',
    ],
    interactiveTitle: 'Build-a-Circuit Playground',
    interactiveBody:
      'Drag and drop virtual components onto a breadboard. As you connect a resistor and LED to a battery, the LED glows. Remove the resistor and the LED flashes a warning to show that too much current can damage it.',
    quizTitle: 'Name That Component',
    quizQuestions: [
      {
        question: 'Which component protects an LED by limiting current?',
        options: ['Button', 'Resistor', 'Capacitor', 'Battery'],
        answerIndex: 1,
      },
      {
        question: 'Which part of the circuit actually lights up?',
        options: ['Resistor', 'Wire', 'LED', 'Switch'],
        answerIndex: 2,
      },
    ],
  },
  arduino: {
    title: 'Arduino Programming',
    introTitle: 'A Tiny Computer You Can Program',
    introBody: [
      'An Arduino is a small computer that can read inputs (like buttons and sensors) and control outputs (like LEDs, motors, and buzzers).',
      'Your Arduino sketch has two main parts: setup(), which runs once at the beginning, and loop(), which runs again and again to keep your project alive.',
    ],
    interactiveTitle: 'Blink Simulator',
    interactiveBody:
      'Use block-based code to turn an LED on and off on a virtual Arduino board. As you change the delay time in your blocks, the blinking on the board speeds up or slows down in real time.',
    quizTitle: 'Arduino Basics Quiz',
    quizQuestions: [
      {
        question: 'Which function runs over and over again on the Arduino?',
        options: ['start()', 'main()', 'setup()', 'loop()'],
        answerIndex: 3,
      },
      {
        question: 'What does pinMode(13, OUTPUT); do?',
        options: [
          'Reads the value of pin 13',
          'Turns pin 13 into an output to control things like LEDs',
          'Disables pin 13',
          'Saves data to pin 13',
        ],
        answerIndex: 1,
      },
    ],
  },
  sensors: {
    title: 'Sensors & Actuators',
    introTitle: 'Making Projects Feel and Move',
    introBody: [
      'Sensors are the “eyes and ears” of your project. They measure things like light, temperature, or distance.',
      'Actuators are the “muscles”. They move or make sound, like motors, servos, and buzzers. Together they let your project sense the world and react to it.',
    ],
    interactiveTitle: 'Reacting to the World',
    interactiveBody:
      'Move a virtual slider to change the light level or temperature. Watch an LED, fan, or servo react when the value crosses a threshold, just like a real streetlight or smart fan.',
    quizTitle: 'Sensors vs Actuators',
    quizQuestions: [
      {
        question: 'Which of these is a sensor?',
        options: ['Button', 'Temperature sensor', 'Servo motor', 'LED'],
        answerIndex: 1,
      },
      {
        question: 'What is an actuator mainly used for?',
        options: ['Measuring data', 'Storing code', 'Moving or making sound', 'Showing errors'],
        answerIndex: 2,
      },
    ],
  },
  'current-voltage': {
    title: 'Current & Voltage',
    introTitle: 'Push and Flow in a Circuit',
    introBody: [
      'Voltage is the “push” that makes charges move. Current is how many charges pass a point every second.',
      'Just like a higher waterfall pushes water harder, a higher voltage pushes charges with more energy.',
    ],
    interactiveTitle: 'Lamp Brightness Explorer',
    interactiveBody:
      'Adjust the battery voltage slider and see a virtual lamp get brighter or dimmer. A current meter on the wire shows the number changing as you move the slider.',
    quizTitle: 'Fast Check: V and I',
    quizQuestions: [
      {
        question: 'Raising the voltage in a simple circuit usually makes the current…',
        options: ['Smaller', 'Stay exactly the same', 'Larger', 'Turn negative'],
        answerIndex: 2,
      },
      {
        question: 'What units do we measure current in?',
        options: ['Volts (V)', 'Amps (A)', 'Ohms (Ω)', 'Watts (W)'],
        answerIndex: 1,
      },
    ],
  },
  resistors: {
    title: 'Resistors',
    introTitle: 'Why We Need Resistors',
    introBody: [
      'Resistors slow down current so parts like LEDs do not burn out. They turn some electrical energy into heat.',
      'The bigger the resistance, the smaller the current for the same voltage, following Ohm’s law (V = I × R).',
    ],
    interactiveTitle: 'LED Safety Lab',
    interactiveBody:
      'Try different resistor values in series with a virtual LED. When the resistor is too small, the LED flashes a danger symbol. With the right value, it glows safely.',
    quizTitle: 'Resistor Quick Quiz',
    quizQuestions: [
      {
        question: 'What happens if you remove the resistor from an LED circuit?',
        options: [
          'Nothing changes',
          'The LED may get too much current and be damaged',
          'The LED becomes dimmer',
          'The battery charges faster',
        ],
        answerIndex: 1,
      },
      {
        question: 'The unit for resistance is:',
        options: ['Volt (V)', 'Ampere (A)', 'Ohm (Ω)', 'Watt (W)'],
        answerIndex: 2,
      },
    ],
  },
}

export function LessonViewerPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const content: LessonContent =
    (topicId && lessonContentById[topicId]) || lessonContentById.basics

  return (
    <div className="page lesson-page">
      <header className="page-header">
        <h1 className="page-title">{content.title}</h1>
        <p className="page-subtitle">
          Follow the three steps: read the intro, play with the interactive demo, then test
          yourself with a quick quiz.
        </p>
      </header>

      <div className="lesson-body">
        <aside className="lesson-sidebar">
          <ol className="step-list">
            {steps.map((step, index) => (
              <li key={step} className="step-list-item active">
                <span className="step-index">{index + 1}</span>
                <span className="step-label">{step}</span>
              </li>
            ))}
          </ol>
        </aside>

        <section className="lesson-content">
          <div className="lesson-panel">
            <h2 className="lesson-section-title">{content.introTitle}</h2>
            {content.introBody.map((paragraph) => (
              <p key={paragraph} className="lesson-text">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="lesson-panel">
            <h2 className="lesson-section-title">{content.interactiveTitle}</h2>
            <div className="interactive-placeholder">
              <p>{content.interactiveBody}</p>
            </div>
          </div>

          <div className="lesson-panel">
            <h2 className="lesson-section-title">{content.quizTitle}</h2>
            <div className="quiz-list">
              {content.quizQuestions.map((q) => (
                <div key={q.question} className="quiz-question">
                  <p className="quiz-question-text">{q.question}</p>
                  <div className="quiz-options">
                    {q.options.map((opt) => (
                      <button key={opt} type="button" className="quiz-option-button">
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

