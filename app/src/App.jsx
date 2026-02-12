import { useState, useCallback, useEffect, useRef } from 'react'
import './App.css'

const PHOTOS = [
  '/photos/couple1.png',
  '/photos/couple2.png',
  '/photos/couple3.jpg',
]

const LOVE_MESSAGES = [
  "From the moment I met you, my life became a beautiful adventure.",
  "You're not just my love, you're my best friend, my soulmate, my everything.",
  "Every day with you feels like Valentine's Day.",
  "I didn't believe in magic until I looked into your eyes.",
  "You make my heart smile in ways I never knew were possible.",
  "If I had a flower for every time you made me smile, I'd have an endless garden.",
  "You're the reason I believe in love.",
  "My favorite place in the world is next to you.",
  "I love you more than yesterday, but less than tomorrow.",
  "You are my today and all of my tomorrows.",
]

function FloatingHearts() {
  const hearts = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 10 + Math.random() * 25,
    opacity: 0.3 + Math.random() * 0.5,
  }))

  return (
    <div className="floating-hearts">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart"
          style={{
            left: `${h.left}%`,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
            fontSize: `${h.size}px`,
            opacity: h.opacity,
          }}
        >
          {['❤️', '💕', '💖', '💗', '💘', '💝'][h.id % 6]}
        </span>
      ))}
    </div>
  )
}

function LoveLetter({ onClose }) {
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [visibleMessages, setVisibleMessages] = useState([])

  useEffect(() => {
    LOVE_MESSAGES.forEach((_, i) => {
      setTimeout(() => {
        setVisibleMessages((prev) => [...prev, i])
      }, 300 * (i + 1))
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhoto((p) => (p + 1) % PHOTOS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content love-letter" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="letter-header">
          <h1 className="letter-title">She Said Yes!</h1>
          <div className="letter-hearts">💕💕💕</div>
        </div>

        <div className="photo-carousel">
          {PHOTOS.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="Our memories"
              className={`carousel-img ${i === currentPhoto ? 'active' : ''}`}
            />
          ))}
          <div className="carousel-dots">
            {PHOTOS.map((_, i) => (
              <span
                key={i}
                className={`dot ${i === currentPhoto ? 'active' : ''}`}
                onClick={() => setCurrentPhoto(i)}
              />
            ))}
          </div>
        </div>

        <div className="love-messages">
          {LOVE_MESSAGES.map((msg, i) => (
            <p
              key={i}
              className={`love-msg ${visibleMessages.includes(i) ? 'visible' : ''}`}
            >
              {msg}
            </p>
          ))}
        </div>

        <div className="letter-footer">
          <p className="forever-text">Forever & Always Yours</p>
          <span className="big-heart">💝</span>
        </div>
      </div>
    </div>
  )
}

function RunawayButton({ onInteract }) {
  const [pos, setPos] = useState(null)
  const [count, setCount] = useState(0)

  const noTexts = [
    'No',
    'Are you sure?',
    'Really sure?',
    'Think again!',
    'Last chance!',
    'Surely not?',
    'You might regret this!',
    'Give it another thought!',
    'Are you crazy?!',
    'I dare you to say no!',
    'Come on, say yes!',
    'Pretty please?',
    "I'll be sad :(",
    "You're breaking my heart!",
    'NOOOO, pick YES!',
  ]

  const runAway = () => {
    const padding = 60
    const maxX = window.innerWidth - 200
    const maxY = window.innerHeight - 60
    const newX = padding + Math.random() * (maxX - padding)
    const newY = padding + Math.random() * (maxY - padding)
    setPos({ x: newX, y: newY })
    setCount((c) => {
      const next = c + 1
      onInteract(next)
      return next
    })
  }

  return (
    <button
      className="btn btn-no"
      style={
        pos
          ? {
              position: 'fixed',
              left: pos.x,
              top: pos.y,
              zIndex: 1000,
              transition: 'left 0.2s ease-out, top 0.2s ease-out',
            }
          : {}
      }
      onMouseEnter={runAway}
      onTouchStart={runAway}
    >
      {noTexts[Math.min(count, noTexts.length - 1)]}
    </button>
  )
}

function App() {
  const [showModal, setShowModal] = useState(false)
  const [noCount, setNoCount] = useState(0)

  const handleNoInteract = useCallback((count) => {
    setNoCount(count)
  }, [])

  const yesScale = 1 + noCount * 0.15

  return (
    <>
      <FloatingHearts />

      <div className="main-container">
        <div className="photo-frame">
          <div className="heart-shape">
            <img src="/photos/me.png" alt="Saroj" className="hero-photo" />
          </div>
        </div>

        <h1 className="title">Will You Be My Valentine?</h1>
        <p className="subtitle">I promise to make you smile every single day</p>

        <div className="buttons-container">
          <button
            className="btn btn-yes"
            style={{ transform: `scale(${yesScale})` }}
            onClick={() => setShowModal(true)}
          >
            Yes! 💖
          </button>

          <RunawayButton onInteract={handleNoInteract} />
        </div>

        {noCount >= 3 && (
          <p className="hint-text">
            {noCount >= 8
              ? "The 'No' button is literally running from you... take the hint! 😂"
              : "Hmm, that button seems to have a mind of its own... 🤔"}
          </p>
        )}
      </div>

      {showModal && <LoveLetter onClose={() => setShowModal(false)} />}
    </>
  )
}

export default App
