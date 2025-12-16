# Edu Kid Lab - Interactive Electronics Learning Platform

> **Let us build the future Ethiopia**

A web-based learning platform designed for kids aged 8-16 to learn electronics and programming through interactive block-based coding and circuit simulation.

![Edu Kid Lab](https://img.shields.io/badge/Edu%20Kid%20Lab-v1.0-blue)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6)
![Blockly](https://img.shields.io/badge/Blockly-12.3.1-4285f4)

## 🌟 Features

### 🎯 Guided Projects
- **LED Blinking** - Learn digital output and timing with your first blinking LED
- **Traffic Light** - Create a mini traffic light with three LEDs and sequencing
- **Sound Generator** - Use a buzzer to play tones and explore audio output

### 📚 Learning Courses
- **Electronics Basics** - Current, voltage, Ohm's Law, and circuit fundamentals
- **Electronic Components** - Resistors, LEDs, capacitors, and breadboards
- **Arduino Programming** - Digital I/O, analog input, loops, and conditions
- **Sensors & Actuators** - Buttons, sensors, motors, and servos

### 🛠️ Key Capabilities
- **Block-Based Programming** - Drag-and-drop visual programming similar to MIT App Inventor
- **2D Circuit Simulation** - Interactive circuit visualization with real-time updates
- **Live Code Generation** - Automatic Arduino C code generation from blocks
- **Interactive Lessons** - Step-by-step tutorials with Intro, Interactive demos, and Quizzes
- **Customizable LEDs** - Color picker for each LED in the simulator
- **Real-Time Simulation** - Watch your circuits respond as you program

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "edu kid"
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173`
   - The app will automatically reload when you make changes

### Build for Production

```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/`

## 📁 Project Structure

```
edu kid/
├── frontend/
│   ├── src/
│   │   ├── ui/
│   │   │   ├── blocks/          # Blockly workspace and code generation
│   │   │   ├── circuit2d/       # 2D circuit simulator
│   │   │   ├── circuit3d/       # 3D circuit visualization (optional)
│   │   │   ├── dashboard/       # Landing page
│   │   │   ├── learn/           # Learning courses and lessons
│   │   │   ├── projects/        # Project editor page
│   │   │   ├── simulator/       # Standalone simulator page
│   │   │   └── MainLayout.tsx   # Main app layout
│   │   ├── routes.tsx           # React Router configuration
│   │   └── App.tsx              # Main app component
│   ├── public/
│   │   └── components/          # Custom SVG components (optional)
│   └── package.json
└── README.md
```

## 🎓 Available Projects

### 1. LED Blinking 💡
**Difficulty:** Beginner | **Duration:** 15 min

Learn the basics of digital output by making an LED blink on and off. This project introduces:
- Digital pin control
- HIGH/LOW states
- Timing with delays
- Basic block programming

**Route:** `/projects/led-blink`

### 2. Traffic Light 🚦
**Difficulty:** Intermediate | **Duration:** 25 min

Create a working traffic light system with three LEDs (red, yellow, green). Learn:
- Multiple pin control
- Sequencing and timing
- State management
- Real-world applications

**Route:** `/projects/traffic-light`

### 3. Sound Generator 🔊
**Difficulty:** Intermediate | **Duration:** 20 min

Generate sounds and patterns using a buzzer. Explore:
- Audio output
- Frequency control
- Pattern creation
- Timing variations

**Route:** `/projects/sound-generator`

## 📖 Learning Courses

### Electronics Basics ⚡
- Current & Voltage
- Ohm's Law
- Series & Parallel Circuits

**Route:** `/learn/basics`

### Electronic Components 🔧
- Resistors
- LEDs
- Capacitors
- Breadboards

**Route:** `/learn/components`

### Arduino Programming 🤖
- Arduino Introduction
- Digital Pins
- Analog Input
- Loops & Conditions

**Route:** `/learn/arduino`

### Sensors & Actuators 📡
- Buttons & Switches
- Temperature Sensors
- Motors
- Servos

**Route:** `/learn/sensors`

## 🎮 How to Use

### Starting a Project

1. **Navigate to Dashboard**
   - Go to the home page (`/`)
   - Browse available projects

2. **Open a Project**
   - Click on any project card
   - You'll see the project editor with:
     - **Left Panel:** Block programming workspace
     - **Right Panel:** Circuit view and guide

3. **Program with Blocks**
   - Drag blocks from the toolbox
   - Connect blocks to create your program
   - Use "Load Example" to see a working example

4. **Run Your Program**
   - Click the **Run** button
   - Watch the circuit respond in real-time
   - LEDs will light up, sounds will play
   - Click **Stop** to end the simulation

5. **View Generated Code**
   - See the Arduino C code generated from your blocks
   - Copy or download the code
   - Use it with a real Arduino board

### Using the Simulator

1. **Standalone Simulator**
   - Visit `/simulator` for a test-only simulator
   - Toggle pins manually to see circuit responses

2. **Customize LEDs**
   - In any project, go to the Circuit tab
   - Click the color picker below each LED
   - Choose your preferred color

## 🛠️ Technology Stack

- **Frontend Framework:** React 19.2.0 with TypeScript
- **Block Programming:** Google Blockly 12.3.1
- **Routing:** React Router DOM 6.30.2
- **3D Visualization:** Three.js, React Three Fiber, Drei
- **Build Tool:** Vite 7.2.4
- **Styling:** CSS3 with custom animations

## 🎨 Customization

### Adding Custom SVG Components

1. Place your SVG files in `frontend/public/components/`
2. Name them: `arduino.svg`, `led.svg`, `resistor.svg`, etc.
3. The simulator will automatically use them

See `frontend/public/components/README.md` for details.

### Adding New Projects

1. Add project data to `DashboardPage.tsx`:
   ```typescript
   {
     id: 'your-project',
     title: 'Your Project',
     description: 'Description here',
     icon: '🎯',
     difficulty: 'Beginner',
     duration: '20 min',
     color: '#3b82f6',
   }
   ```

2. Add sample Blockly XML to `ProjectEditorPage.tsx`
3. Add guide content with steps and code hints
4. Create route: `/projects/your-project`

### Adding New Courses

1. Add course data to `DashboardPage.tsx` and `LearnLandingPage.tsx`
2. Create lesson content in `LessonViewerPage.tsx`
3. Add route: `/learn/your-course`

## 🧪 Development

### Running Tests
```bash
cd frontend
npm run lint
```

### Code Structure
- **Components:** React functional components with TypeScript
- **State Management:** React hooks (useState, useRef, useEffect)
- **Styling:** Modular CSS files per component
- **Code Generation:** Custom Blockly generators for JavaScript and Arduino C

## 📝 Code Generation

The platform generates two types of code:

1. **JavaScript Code** - For simulation execution
   - Runs in the browser
   - Handles delays and pin state changes
   - Supports continuous loop execution

2. **Arduino C Code** - For real hardware
   - Complete Arduino sketch
   - Automatically includes `pinMode` in `setup()`
   - Full `loop()` function with your block logic

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is part of the educational initiative: **"Let us build the future Ethiopia"**

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📧 Support

For questions or support, please open an issue in the repository.

## 🎯 Project Goals

- Make electronics and programming accessible to kids aged 8-16
- Provide hands-on learning through interactive projects
- Build foundational skills in electronics and coding
- Inspire the next generation of engineers and innovators in Ethiopia

---

**Built with ❤️ for the future of Ethiopia**

