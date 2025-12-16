import { Link } from 'react-router-dom'
import './dashboard.css'

const guidedProjects = [
  {
    id: 'led-blink',
    title: 'LED Blinking',
    description: 'Make your first LED blink using simple blocks. Learn the basics of digital output and timing.',
    icon: '💡',
    difficulty: 'Beginner',
    duration: '15 min',
    color: '#3b82f6',
  },
  {
    id: 'traffic-light',
    title: 'Traffic Light',
    description: 'Create a mini traffic light with three LEDs. Master sequencing and timing control.',
    icon: '🚦',
    difficulty: 'Intermediate',
    duration: '25 min',
    color: '#10b981',
  },
  {
    id: 'sound-generator',
    title: 'Sound Generator',
    description: 'Use a buzzer to play simple tones and patterns. Explore audio output and frequency.',
    icon: '🔊',
    difficulty: 'Intermediate',
    duration: '20 min',
    color: '#f59e0b',
  },
]

const courses = [
  {
    id: 'basics',
    title: 'Electronics Basics',
    description:
      'Learn the fundamentals of electricity, current, voltage, and how energy moves in a circuit using water-flow animations.',
    topics: ['Current & Voltage', 'Ohm\'s Law', 'Series & Parallel Circuits'],
    icon: '⚡',
    color: '#3b82f6',
    progress: 0,
  },
  {
    id: 'components',
    title: 'Electronic Components',
    description:
      'Discover what each component does—resistors, LEDs, capacitors, and more—and how to read their symbols on a circuit diagram.',
    topics: ['Resistors', 'LEDs', 'Capacitors', 'Breadboards'],
    icon: '🔧',
    color: '#10b981',
    progress: 0,
  },
  {
    id: 'arduino',
    title: 'Arduino Programming',
    description:
      'Master Arduino basics, digital and analog pins, and core programming ideas like loops, conditions, and variables.',
    topics: ['Arduino Basics', 'Digital Pins', 'Analog Input', 'Loops & Conditions'],
    icon: '🤖',
    color: '#8b5cf6',
    progress: 0,
  },
  {
    id: 'sensors',
    title: 'Sensors & Actuators',
    description:
      'Work with buttons, sensors, motors, and servos to make your circuits sense the world and move in response.',
    topics: ['Buttons & Switches', 'Temperature Sensors', 'Motors', 'Servos'],
    icon: '📡',
    color: '#ec4899',
    progress: 0,
  },
]

const learningTopics = [
  {
    id: 'current-voltage',
    title: 'Current & Voltage',
    description: 'See how electric "water" flows in a circuit. Understand the basics of electricity.',
    icon: '⚡',
  },
  {
    id: 'resistors',
    title: 'Resistors',
    description: 'Discover how resistors make LEDs safe and control current flow.',
    icon: '🔌',
  },
  {
    id: 'breadboard',
    title: 'Breadboard Basics',
    description: 'Learn how the rows and rails connect components together.',
    icon: '🔲',
  },
  {
    id: 'arduino-intro',
    title: 'Arduino Introduction',
    description: 'Get to know your Arduino board and its pins.',
    icon: '🤖',
  },
]

export function DashboardPage() {
  return (
    <div className="dashboard-page">
      {/* Hero Section: full screen for desktop */}
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-content">
            <h1 className="hero-title">
              Learn <span className="hero-accent">Electronics & Coding</span> by Building
            </h1>
            <p className="hero-subtitle">
              Guided projects, playful simulations, and step‑by‑step courses designed for kids
              aged 8–16.
              <br />
              <span className="hero-motto">Let us build the future Ethiopia</span>
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">3</span>
                <span className="stat-label">Guided Projects</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">4</span>
                <span className="stat-label">Courses</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">12+</span>
                <span className="stat-label">Lessons</span>
              </div>
            </div>
          </div>

          <div className="hero-course-strip">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/learn/${course.id}`}
                className="hero-course-card"
              >
                <div
                  className="hero-course-icon"
                  style={{ background: `${course.color}20` }}
                >
                  <span>{course.icon}</span>
                </div>
                <div className="hero-course-text">
                  <h3 className="hero-course-title">{course.title}</h3>
                  <p className="hero-course-description">{course.description}</p>
                  <div className="hero-course-topics">
                    {course.topics.slice(0, 2).map((topic) => (
                      <span key={topic} className="hero-topic-pill">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="hero-decoration">
          <div className="floating-icon">💡</div>
          <div className="floating-icon">⚡</div>
          <div className="floating-icon">🔧</div>
        </div>
      </section>

      {/* Guided Projects Section */}
      <section className="section projects-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Guided Projects</h2>
            <p className="section-description">
              Start with these hands-on projects. Build circuits and program them with blocks.
            </p>
          </div>
        </div>
        <div className="project-grid">
          {guidedProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="project-card"
            >
              <div className="project-card-header" style={{ background: `${project.color}15` }}>
                <span className="project-icon">{project.icon}</span>
                <div className="project-badges">
                  <span className="badge badge-difficulty" style={{ background: project.color }}>
                    {project.difficulty}
                  </span>
                  <span className="badge badge-duration">{project.duration}</span>
                </div>
              </div>
              <div className="project-card-body">
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-description">{project.description}</p>
              </div>
              <div className="project-card-footer">
                <span className="project-link">
                  Start Project <span className="arrow">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section className="section courses-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Learning Courses</h2>
            <p className="section-description">
              Master electronics step by step. Interactive lessons with animations and examples.
            </p>
          </div>
          <Link to="/learn" className="section-link">
            View All Courses →
          </Link>
        </div>
        <div className="course-grid">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/learn/${course.id}`}
              className="course-card"
            >
              <div className="course-card-icon" style={{ background: `${course.color}15` }}>
                <span className="course-icon">{course.icon}</span>
              </div>
              <div className="course-card-content">
                <h3 className="course-card-title">{course.title}</h3>
                <p className="course-card-description">{course.description}</p>
                <div className="course-topics">
                  {course.topics.slice(0, 3).map((topic, idx) => (
                    <span key={idx} className="topic-tag">
                      {topic}
                    </span>
                  ))}
                  {course.topics.length > 3 && (
                    <span className="topic-tag topic-more">
                      +{course.topics.length - 3} more
                    </span>
                  )}
                </div>
                <div className="course-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${course.progress}%`, background: course.color }}
                    />
                  </div>
                  <span className="progress-text">{course.progress}% Complete</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Learning Topics */}
      <section className="section topics-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Quick Learning Topics</h2>
            <p className="section-description">
              Explore these fundamental concepts to understand electronics better.
            </p>
          </div>
          <Link to="/learn" className="section-link">
            Explore All →
          </Link>
        </div>
        <div className="topic-grid">
          {learningTopics.map((topic) => (
            <Link
              key={topic.id}
              to={`/learn/${topic.id}`}
              className="topic-card"
            >
              <div className="topic-icon-wrapper">
                <span className="topic-icon">{topic.icon}</span>
              </div>
              <h3 className="topic-title">{topic.title}</h3>
              <p className="topic-description">{topic.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
