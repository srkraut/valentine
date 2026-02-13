import { useState, useCallback, useEffect, useRef } from 'react'
import './App.css'

const PHOTOS = [
  '/photos/samir-screenshot.png',
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
  const [started, setStarted] = useState(false)

  const noTexts = [
    'No 😢',
    'Are you sure? 😢',
    'Really sure? 😭',
    'Think again! 😭',
    'Last chance! 😭',
    'Surely not? 😿',
    'You might regret this! 😭',
    'Give it another thought! 😢',
    'Are you crazy?! 😭',
    'I dare you to say no! 😤',
    'Come on, say yes! 😭',
    'Pretty please? 🥺',
    "I'll be sad 😭😭",
    "You're breaking my heart! 💔😭",
    'NOOOO, pick YES! 😭😭😭',
  ]

  // On mount, snap to the placeholder position (nudged up 20px)
  useEffect(() => {
    const anchor = document.getElementById('no-anchor')
    if (anchor) {
      const rect = anchor.getBoundingClientRect()
      setPos({ x: rect.left, y: rect.top - 20 })
    }
  }, [])

  const runAway = useCallback(() => {
    setStarted(true)
    const vw = document.documentElement.clientWidth
    const vh = document.documentElement.clientHeight
    const margin = 30
    const btnW = 180
    const btnH = 55
    const newX = margin + Math.random() * (vw - btnW - margin * 2)
    const newY = margin + Math.random() * (vh - btnH - margin * 2)
    setPos({ x: newX, y: newY })
    setCount((c) => {
      const next = c + 1
      onInteract(next)
      return next
    })
  }, [onInteract])

  if (!pos) return null

  return (
    <button
      className="btn btn-no btn-no-fixed"
      style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      onMouseEnter={runAway}
      onClick={runAway}
      onTouchStart={(e) => { e.preventDefault(); runAway() }}
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
        {noCount >= 3 && (
          <p className="hint-text">
            {noCount >= 8
              ? "The 'No' button is literally running from you... take the hint! 😂"
              : "Hmm, that button seems to have a mind of its own... 🤔"}
          </p>
        )}

        <div className="photo-section">
          <div className="ecg-container">
            <svg className="ecg-line" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <polyline
                className="ecg-path"
                points="0,60 100,60 120,60 140,55 160,65 180,60 200,60 220,60 240,60 260,20 270,100 280,10 290,90 300,60 320,60 340,60 400,60 420,60 440,55 460,65 480,60 500,60 520,60 540,60 560,20 570,100 580,10 590,90 600,60 620,60 640,60 700,60 720,60 740,55 760,65 780,60 800,60 820,60 840,60 860,20 870,100 880,10 890,90 900,60 920,60 940,60 1000,60 1020,60 1040,55 1060,65 1080,60 1100,60 1120,60 1140,60 1160,20 1170,100 1180,10 1190,90 1200,60"
              />
            </svg>
          </div>
          <div className="photo-frame">
            <div className="heart-shape">
              <img src="/photos/samir-screenshot.png" alt="Love" className="hero-photo" />
            </div>
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

          <span className="btn-no-placeholder" id="no-anchor">No</span>
        </div>
      </div>

      <RunawayButton onInteract={handleNoInteract} />

      {showModal && <LoveLetter onClose={() => setShowModal(false)} />}
    </>
  )
}

export default App
