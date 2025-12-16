import { Link } from 'react-router-dom'
import './learn.css'

const courses = [
  {
    id: 'basics',
    title: 'Electronics Basics',
    description: 'Learn the fundamentals of electricity, current, voltage, and circuits.',
    topics: [
      { id: 'current-voltage', title: 'Current & Voltage', icon: '⚡' },
      { id: 'ohms-law', title: "Ohm's Law", icon: '📐' },
      { id: 'circuits', title: 'Series & Parallel Circuits', icon: '🔗' },
    ],
    icon: '⚡',
    color: '#3b82f6',
    progress: 0,
  },
  {
    id: 'components',
    title: 'Electronic Components',
    description: 'Discover resistors, LEDs, capacitors, and how they work together.',
    topics: [
      { id: 'resistors', title: 'Resistors', icon: '🔌' },
      { id: 'leds', title: 'LEDs', icon: '💡' },
      { id: 'capacitors', title: 'Capacitors', icon: '🔋' },
      { id: 'breadboard', title: 'Breadboards', icon: '🔲' },
    ],
    icon: '🔧',
    color: '#10b981',
    progress: 0,
  },
  {
    id: 'arduino',
    title: 'Arduino Programming',
    description: 'Master Arduino basics, digital I/O, analog input, and programming concepts.',
    topics: [
      { id: 'arduino-intro', title: 'Arduino Introduction', icon: '🤖' },
      { id: 'digital-pins', title: 'Digital Pins', icon: '🔘' },
      { id: 'analog-input', title: 'Analog Input', icon: '📊' },
      { id: 'loops', title: 'Loops & Conditions', icon: '🔄' },
    ],
    icon: '🤖',
    color: '#8b5cf6',
    progress: 0,
  },
  {
    id: 'sensors',
    title: 'Sensors & Actuators',
    description: 'Work with buttons, sensors, motors, and make your projects interactive.',
    topics: [
      { id: 'buttons', title: 'Buttons & Switches', icon: '🔘' },
      { id: 'temperature', title: 'Temperature Sensors', icon: '🌡️' },
      { id: 'motors', title: 'Motors', icon: '⚙️' },
      { id: 'servos', title: 'Servos', icon: '🎯' },
    ],
    icon: '📡',
    color: '#ec4899',
    progress: 0,
  },
]

const allTopics = [
  { id: 'current-voltage', title: 'Current & Voltage', icon: '⚡', course: 'basics' },
  { id: 'resistors', title: 'Resistors', icon: '🔌', course: 'components' },
  { id: 'breadboard', title: 'Breadboard Basics', icon: '🔲', course: 'components' },
  { id: 'arduino-intro', title: 'Arduino Introduction', icon: '🤖', course: 'arduino' },
]

export function LearnLandingPage() {
  return (
    <div className="learn-page">
      <header className="learn-header">
        <h1 className="learn-title">Learn Electronics</h1>
        <p className="learn-subtitle">
          Interactive lessons to master electronics and programming step by step.
        </p>
      </header>

      <div className="learn-content">
        {/* Courses Section */}
        <section className="learn-section">
          <h2 className="learn-section-title">Courses</h2>
          <p className="learn-section-description">
            Follow structured courses to build your knowledge systematically.
          </p>
          <div className="course-list">
            {courses.map((course) => (
              <div key={course.id} className="course-item">
                <Link to={`/learn/${course.id}`} className="course-item-link">
                  <div className="course-item-header">
                    <div className="course-item-icon" style={{ background: `${course.color}15` }}>
                      <span className="course-item-icon-emoji">{course.icon}</span>
                    </div>
                    <div className="course-item-info">
                      <h3 className="course-item-title">{course.title}</h3>
                      <p className="course-item-description">{course.description}</p>
                    </div>
                  </div>
                  <div className="course-item-topics">
                    {course.topics.map((topic) => (
                      <span key={topic.id} className="topic-badge">
                        <span>{topic.icon}</span>
                        {topic.title}
                      </span>
                    ))}
                  </div>
                  <div className="course-item-footer">
                    <div className="course-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${course.progress}%`, background: course.color }}
                        />
                      </div>
                      <span className="progress-text">{course.progress}% Complete</span>
                    </div>
                    <span className="course-link">View Course →</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* All Topics Section */}
        <section className="learn-section">
          <h2 className="learn-section-title">All Topics</h2>
          <p className="learn-section-description">
            Browse individual topics or jump to what interests you most.
          </p>
          <div className="topic-grid">
            {allTopics.map((topic) => (
              <Link key={topic.id} to={`/learn/${topic.id}`} className="topic-card">
                <div className="topic-card-icon">
                  <span>{topic.icon}</span>
                </div>
                <h3 className="topic-card-title">{topic.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
