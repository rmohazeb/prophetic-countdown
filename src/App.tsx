// Prophetic Countdown - Complete Single-File Application
// Setup: npm install react-router-dom@6
// Run: npm run dev (localhost:3000) or npm run build (for GitHub Pages)
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';

// ============================================================
// ROUTE DATA
// ============================================================
interface RouteData {
  path: string;
  navLabel: string;
  pageTitle: string;
  bgColor: string;
  type: 'home' | 'future' | 'fulfilled';
  startDate?: string;
  endDate?: string;
  fulfilledText?: string;
  images: string[];
  pdfs: string[];
  utcTimestamp?: string;
  utcClass?: 'utc-timestamp' | 'utc-timestamp-wrap';
}

const BASE = import.meta.env.BASE_URL;

const routeData: RouteData[] = [
  {
    path: '/',
    navLabel: 'Home',
    pageTitle: 'Prophetic Countdown',
    bgColor: '#1e2a4a',
    type: 'home',
    images: ['final_testament1.jpg', 'final_testament2.jpg', 'final_testament3.jpg', 'final_testament4.jpg'],
    pdfs: ['intro_to_prophetic_countdown1.pdf', 'intro_to_prophetic_countdown2.pdf', 'intro_to_prophetic_countdown3.pdf'],
  },
  {
    path: '/resurrection',
    navLabel: 'Resurrection Day',
    pageTitle: 'Resurrection Day (This Is The End!)',
    bgColor: '#1a3a5c',
    type: 'future',
    startDate: '2280-11-27T01:00:00Z',
    endDate: '2280-12-09T17:00:00Z',
    utcTimestamp: 'UTC Saturday 2280-11-27 01:00:00 → Thursday 2280-12-09 17:00:00',
    utcClass: 'utc-timestamp-wrap',
    images: ['earth_quake1.jpg', 'earth_quake2.jpg', 'earth_quake3.jpg', 'earth_quake4.jpg'],
    pdfs: ['the_first_the_second_blow1.pdf', 'the_first_the_second_blow2.pdf'],
  },
  {
    path: '/gog-magog',
    navLabel: 'Gog & Magog',
    pageTitle: 'Gog & Magog (10 Years Before The End)',
    bgColor: '#1e4d8c',
    type: 'future',
    startDate: '2270-12-23T14:00:00Z',
    endDate: '2271-01-11T14:00:00Z',
    utcTimestamp: 'UTC Friday 2270-12-23 14:00:00 → Wednesday 2271-01-11 14:00:00',
    utcClass: 'utc-timestamp-wrap',
    images: ['star_wars1.jpg', 'star_wars2.jpg', 'star_wars3.jpg', 'star_wars4.jpg'],
    pdfs: ['gog_magog1.pdf', 'gog_magog2.pdf'],
  },
  {
    path: '/day-of-smoke',
    navLabel: 'The Day Of Smoke',
    pageTitle: 'The Day Of Smoke (60 Years Before The End)',
    bgColor: '#2a2a3a',
    type: 'future',
    startDate: '2220-06-16T21:00:00Z',
    endDate: '2221-04-08T04:00:00Z',
    utcTimestamp: 'UTC Friday 2220-06-16 21:00:00 → Sunday 2221-04-08 04:00:00',
    utcClass: 'utc-timestamp',
    images: ['smoke_day1.jpg', 'smoke_day2.jpg', 'smoke_day3.jpg', 'smoke_day4.jpg'],
    pdfs: ['the_day_of_smoke1.pdf', 'the_day_of_smoke2.pdf', 'the_day_of_smoke3.pdf'],
  },
  {
    path: '/computer',
    navLabel: 'Computer, The Creature',
    pageTitle: 'Computer, The Creature',
    bgColor: '#4a1f7a',
    type: 'fulfilled',
    fulfilledText: 'Fulfilled: AD 1824 & 1947',
    images: ['computerthecreature1.jpg', 'computerthecreature2.jpg', 'computerthecreature3.jpg', 'computerthecreature4.jpg'],
    pdfs: ['computer_the_creature_details1.pdf'],
  },
  {
    path: '/moon-split',
    navLabel: 'Splitting of The Moon',
    pageTitle: 'Splitting of The Moon (Apollo 11 Mission)',
    bgColor: '#1f3d5c',
    type: 'fulfilled',
    fulfilledText: 'Fulfilled: AD 1969-07-21, UTC 17:54 (1:54 PM EDT)',
    images: ['moon_split1.jpg', 'moon_split2.jpg', 'moon_split3.jpg', 'moon_split4.jpg'],
    pdfs: ['moon_split_fulfilled1.pdf'],
  },
  {
    path: '/messenger',
    navLabel: 'Messenger of The Covenant',
    pageTitle: 'Messenger of The Covenant',
    bgColor: '#1a5c4a',
    type: 'fulfilled',
    fulfilledText: 'Fulfilled: AD 1972-01-21',
    images: ['messenger1.jpg', 'messenger2.jpg', 'messenger3.jpg', 'messenger4.jpg'],
    pdfs: ['messenger_details1.pdf'],
  },
  {
    path: '/quran-19',
    navLabel: "Quran's 19 Code",
    pageTitle: "Quran's 19-Based Code",
    bgColor: '#5c1f2a',
    type: 'fulfilled',
    fulfilledText: 'Fulfilled: AD 1974 (Quran 74:30-37)',
    images: ['quran19based1.jpg', 'quran19based2.jpg', 'quran19based3.jpg', 'quran19based4.jpg'],
    pdfs: ['quran19_based_details1.pdf'],
  },
];

// ============================================================
// COUNTDOWN CALCULATOR
// ============================================================
interface TimeLeft {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calculateTimeLeft(endDate: string): TimeLeft {
  const end = new Date(endDate).getTime();
  const now = Date.now();
  const total = end - now;

  if (total <= 0) {
    return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  const msPerSecond = 1000;
  const msPerMinute = 60 * msPerSecond;
  const msPerHour = 60 * msPerMinute;
  const msPerDay = 24 * msPerHour;
  const msPerYear = 365.25 * msPerDay;

  const years = Math.floor(total / msPerYear);
  let remaining = total - years * msPerYear;

  const days = Math.floor(remaining / msPerDay);
  remaining = remaining - days * msPerDay;

  const hours = Math.floor(remaining / msPerHour);
  remaining = remaining - hours * msPerHour;

  const minutes = Math.floor(remaining / msPerMinute);
  remaining = remaining - minutes * msPerMinute;

  const seconds = Math.floor(remaining / msPerSecond);

  return { years, days, hours, minutes, seconds, total };
}

function isInProgress(startDate: string, endDate: string): boolean {
  const now = Date.now();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return now >= start && now <= end;
}

function isFulfilled(endDate: string): boolean {
  return Date.now() > new Date(endDate).getTime();
}

// ============================================================
// EMBEDDED CSS
// ============================================================
const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Georgia', 'Times New Roman', serif;
    font-weight: bold;
    font-style: italic;
    color: #ffffff;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
  }

  /* NAVIGATION */
  .nav-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.50rem;
    padding: 1rem;
    max-width: 1200px;
    width: 100%;
  }

  .nav-link {
    padding: 0.5rem 0.75rem;
    border: 0.20rem solid rgba(255,255,255,0.3);
    background: transparent;
    color: rgba(255,255,255,0.6);
    font-weight: bold;
    font-style: italic;
    font-size: 0.85rem;
    text-decoration: none;
    border-radius: 4px;
    transition: all 0.3s ease;
    text-align: center;
  }

  .nav-link:hover {
    color: #ffffff;
    border-color: rgba(255,255,255,0.6);
  }

  .nav-link.active {
    border: 0.30rem solid #eab308 !important;
    background: transparent !important;
    color: #ffffff !important;
  }

  /* PAGE CONTENT */
  .page-content {
    max-width: 1200px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
  }

  .page-title {
    font-size: 42px;
    text-align: center;
    color: #ffffff;
    font-weight: bold;
    font-style: italic;
    margin-bottom: 1rem;
  }

  .subheading-yellow {
    font-size: 42px;
    color: #eab308;
    text-align: center;
    font-weight: bold;
    font-style: italic;
    max-width: 1120px;
    white-space: normal;
    word-wrap: break-word;
    margin: 0 auto 0.5rem auto;
  }

  .subheading-blue {
    font-size: 42px;
    color: #3b82f6;
    text-align: center;
    font-weight: bold;
    font-style: italic;
    max-width: 1120px;
    white-space: normal;
    word-wrap: break-word;
    margin: 0 auto 1.5rem auto;
  }

  @media (max-width: 1024px) {
    .subheading-yellow,
    .subheading-blue {
      font-size: 32px;
    }
  }

  @media (max-width: 768px) {
    .subheading-yellow,
    .subheading-blue {
      font-size: 24px;
    }
  }

  /* IMAGE GRID - SINGLE ROW LAYOUT */
  .section-heading {
    font-size: 28px;
    text-align: left;
    color: #ffffff;
    font-weight: bold;
    font-style: italic;
    width: 100%;
    max-width: 1120px;
    margin: 1.5rem auto 0.75rem auto;
  }

  .image-grid {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 10px;
    justify-content: center;
    margin: 0 auto;
    max-width: 1120px;
  }

  .image-grid img {
    width: 280px;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
    border: 2px solid rgba(255,255,255,0.2);
    flex-shrink: 0;
  }

  @media (max-width: 1119px) and (min-width: 768px) {
    .image-grid {
      flex-wrap: wrap;
    }
    .image-grid img {
      width: calc(50% - 5px);
      max-width: 280px;
    }
  }

  @media (max-width: 767px) {
    .image-grid {
      flex-direction: column;
      align-items: center;
    }
    .image-grid img {
      width: 100%;
      max-width: 280px;
    }
  }

  /* PDF CARDS */
  .pdf-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin: 1rem auto;
  }

  .pdf-card {
    width: 180px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.1);
    border: 2px solid rgba(255,255,255,0.3);
    border-radius: 8px;
    color: #ffffff;
    font-weight: bold;
    font-style: italic;
    font-size: 0.9rem;
    text-decoration: none;
    text-align: center;
    padding: 0.5rem;
    transition: all 0.3s ease;
    white-space: normal;
    word-wrap: break-word;
  }

  .pdf-card:hover {
    background: rgba(255,255,255,0.25);
    border-color: #eab308;
    color: #eab308;
  }

  /* UTC TIMESTAMP - SCROLLABLE (Day of Smoke) */
  .utc-timestamp {
    max-width: 1120px !important;
    margin: 0.5rem auto 1rem auto;
    white-space: nowrap !important;
    overflow-x: auto !important;
    padding: 0 1rem !important;
    color: #eab308;
    font-weight: bold;
    font-style: italic;
    text-align: center;
    font-size: 32px;
  }

  @media (max-width: 1023px) and (min-width: 768px) {
    .utc-timestamp {
      font-size: 28px;
    }
  }

  @media (max-width: 767px) {
    .utc-timestamp {
      font-size: 20px;
    }
  }

  /* UTC TIMESTAMP - WRAPPING (Resurrection & Gog & Magog) */
  .utc-timestamp-wrap {
    max-width: 1120px !important;
    margin: 0.5rem auto 1rem auto;
    white-space: normal !important;
    word-wrap: break-word !important;
    padding: 0 1rem !important;
    color: #eab308;
    font-weight: bold;
    font-style: italic;
    text-align: center;
    font-size: 28px;
  }

  @media (max-width: 1023px) and (min-width: 768px) {
    .utc-timestamp-wrap {
      font-size: 22px;
    }
  }

  @media (max-width: 767px) {
    .utc-timestamp-wrap {
      font-size: 18px;
    }
  }

  /* COUNTDOWN */
  .countdown-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    align-items: center;
    margin: 1.5rem auto;
    max-width: 1120px;
  }

  .countdown-unit {
    min-width: 120px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 12px;
  }

  .countdown-digit {
    font-size: 48px;
    font-weight: bold;
    font-style: italic;
    color: #ffffff;
  }

  .countdown-digit.red {
    color: #ef4444 !important;
  }

  .countdown-label {
    font-size: 14px;
    color: rgba(255,255,255,0.7);
    margin-top: 0.25rem;
    font-weight: bold;
    font-style: italic;
  }

  /* SOUND TOGGLE */
  .snd-btn {
    width: 140px !important;
    height: 50px !important;
    border-radius: 25px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.15);
    border: 2px solid rgba(255,255,255,0.4);
    color: #ffffff;
    font-weight: bold;
    font-style: italic;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .snd-btn:hover {
    background: rgba(255,255,255,0.3);
    border-color: #eab308;
  }

  /* FULFILLED INDICATOR */
  .fulfilled-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    align-items: center;
    margin: 1.5rem auto;
  }

  .fulfilled-badge {
    width: 340px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(45deg, #22c55e, #16a34a);
    border-radius: 12px;
    font-size: 42px;
    font-weight: bold;
    font-style: italic;
    color: #ffffff;
  }

  .fulfilled-check {
    width: 110px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(45deg, #22c55e, #16a34a);
    border-radius: 12px;
    font-size: 48px;
    font-weight: bold;
    color: #ffffff;
  }

  .fulfilled-date {
    font-size: 24px;
    color: #ffffff;
    text-align: center;
    font-weight: bold;
    font-style: italic;
    margin-top: 1rem;
    white-space: normal;
    word-wrap: break-word;
  }

  /* IN PROGRESS INDICATOR */
  .in-progress-badge {
    width: 340px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(45deg, #22c55e, #16a34a);
    border-radius: 12px;
    font-size: 42px;
    font-weight: bold;
    font-style: italic;
    color: #ffffff;
  }

  @media (max-width: 768px) {
    .page-title {
      font-size: 28px;
    }
    .countdown-unit {
      min-width: 80px;
      padding: 0.5rem;
    }
    .countdown-digit {
      font-size: 32px;
    }
    .fulfilled-badge {
      width: 260px;
      height: 90px;
      font-size: 28px;
    }
    .fulfilled-check {
      width: 80px;
      height: 90px;
      font-size: 36px;
    }
    .in-progress-badge {
      width: 260px;
      height: 90px;
      font-size: 28px;
    }
    .nav-link {
      font-size: 0.7rem;
      padding: 0.4rem 0.5rem;
    }
  }
`;

// ============================================================
// COUNTDOWN DISPLAY COMPONENT (Pure - no interactive elements)
// ============================================================
function CountdownDisplay({ timeLeft, isInProg }: { timeLeft: TimeLeft; isInProg: boolean }) {
  const digitClass = isInProg ? 'countdown-digit red' : 'countdown-digit';

  return (
    <>
      <div className="countdown-unit">
        <span className={digitClass}>{timeLeft.years}</span>
        <span className="countdown-label">Years</span>
      </div>
      <div className="countdown-unit">
        <span className={digitClass}>{timeLeft.days}</span>
        <span className="countdown-label">Days</span>
      </div>
      <div className="countdown-unit">
        <span className={digitClass}>{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="countdown-label">Hours</span>
      </div>
      <div className="countdown-unit">
        <span className={digitClass}>{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="countdown-label">Minutes</span>
      </div>
      <div className="countdown-unit">
        <span className={digitClass}>{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="countdown-label">Seconds</span>
      </div>
    </>
  );
}

// ============================================================
// HOMEPAGE
// ============================================================
function Homepage() {
  const data = routeData[0];
  return (
    <div className="page-content">
      <h1 className="page-title">{data.pageTitle}</h1>
      <p className="subheading-yellow">Are You Ready? Time Is Running Out!</p>
      <p className="subheading-blue">Comments? Use: AmazingQuran19@gmail.com</p>

      <h2 className="section-heading">Imagery</h2>
      <div className="image-grid">
        {data.images.map((img, i) => (
          <img key={i} src={`${BASE}${img}`} alt={`Final Testament ${i + 1}`} />
        ))}
      </div>

      <h2 className="section-heading">Signs &amp; Proofs</h2>
      <div className="pdf-row">
        {data.pdfs.map((pdf, i) => (
          <a key={i} href={`${BASE}${pdf}`} target="_blank" rel="noopener noreferrer" className="pdf-card">
            Signs &amp; Proofs {i + 1}
          </a>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// FUTURE PROPHECY PAGE (All 3 have audio - iOS Compatible)
// ============================================================
function FutureProphecyPage({ route }: { route: RouteData }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(route.endDate!));
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);

  const inProgress = route.startDate && route.endDate ? isInProgress(route.startDate, route.endDate) : false;
  const fulfilled = route.endDate ? isFulfilled(route.endDate) : false;

  // Play sound function using Web Audio API
  const playSound = () => {
    if (audioContextRef.current && audioBufferRef.current) {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBufferRef.current;
      source.connect(audioContextRef.current.destination);
      source.start(0);
    }
  };

  // Audio unlock on first click using Web Audio API (iOS compatible)
  useEffect(() => {
    const unlockAudio = async () => {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const response = await fetch(`${BASE}tick_tock_sound2.mp3`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        audioContextRef.current = ctx;
        audioBufferRef.current = audioBuffer;
        setAudioUnlocked(true);
      } catch (error) {
        console.error('Failed to unlock audio:', error);
      }
    };

    const handleClick = () => {
      if (!audioUnlocked) {
        unlockAudio();
      }
    };

    document.addEventListener('click', handleClick, { once: true });
    return () => document.removeEventListener('click', handleClick);
  }, [audioUnlocked]);

  // Countdown interval
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(route.endDate!);
      setTimeLeft(newTimeLeft);

      // Play sound if enabled and unlocked (works on iOS)
      if (soundEnabled && audioUnlocked && !fulfilled) {
        playSound();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [route.endDate, soundEnabled, audioUnlocked, fulfilled]);

  const utcClass = route.utcClass || 'utc-timestamp';

  return (
    <div className="page-content">

      <h1 className="page-title">{route.pageTitle}</h1>

      {route.utcTimestamp && (
        <p className={utcClass}>{route.utcTimestamp}</p>
      )}

      {fulfilled ? (
        // FULFILLED STATE
        <div className="fulfilled-container">
          <div className="fulfilled-badge">FULFILLED</div>
          <div className="fulfilled-check">✓</div>
        </div>
      ) : (
        // COUNTDOWN STATE
        <div className="countdown-row">
          <CountdownDisplay timeLeft={timeLeft} isInProg={inProgress} />
          {inProgress ? (
            <div className="in-progress-badge">In Progress!?</div>
          ) : (
            <button
              className="snd-btn"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? 'Turn Sound OFF' : 'Turn Sound ON'}
            </button>
          )}
        </div>
      )}

      <h2 className="section-heading">Imagery</h2>
      <div className="image-grid">
        {route.images.map((img, i) => (
          <img key={i} src={`${BASE}${img}`} alt={`${route.navLabel} ${i + 1}`} />
        ))}
      </div>

      <h2 className="section-heading">Signs &amp; Proofs</h2>
      <div className="pdf-row">
        {route.pdfs.map((pdf, i) => (
          <a key={i} href={`${BASE}${pdf}`} target="_blank" rel="noopener noreferrer" className="pdf-card">
            Signs &amp; Proofs {i + 1}
          </a>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// FULFILLED PROPHECY PAGE
// ============================================================
function FulfilledProphecyPage({ route }: { route: RouteData }) {
  return (
    <div className="page-content">
      <h1 className="page-title">{route.pageTitle}</h1>

      <div className="fulfilled-container">
        <div className="fulfilled-badge">FULFILLED</div>
        <div className="fulfilled-check">✓</div>
      </div>

      {route.fulfilledText && (
        <p className="fulfilled-date">{route.fulfilledText}</p>
      )}

      <h2 className="section-heading">Imagery</h2>
      <div className="image-grid">
        {route.images.map((img, i) => (
          <img key={i} src={`${BASE}${img}`} alt={`${route.navLabel} ${i + 1}`} />
        ))}
      </div>

      <h2 className="section-heading">Signs &amp; Proofs</h2>
      <div className="pdf-row">
        {route.pdfs.map((pdf, i) => (
          <a key={i} href={`${BASE}${pdf}`} target="_blank" rel="noopener noreferrer" className="pdf-card">
            Signs &amp; Proofs {i + 1}
          </a>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// LAYOUT WITH DYNAMIC BACKGROUND
// ============================================================
function Layout() {
  const location = useLocation();
  const currentRoute = routeData.find(r => r.path === location.pathname) || routeData[0];

  return (
    <div className="app-container" style={{ backgroundColor: currentRoute.bgColor, minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      <nav className="nav-container">
        {routeData.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            {route.navLabel}
          </NavLink>
        ))}
      </nav>

      <Routes>
        {routeData.map((route) => {
          if (route.type === 'home') {
            return <Route key={route.path} path={route.path} element={<Homepage />} />;
          } else if (route.type === 'future') {
            return <Route key={route.path} path={route.path} element={<FutureProphecyPage route={route} />} />;
          } else {
            return <Route key={route.path} path={route.path} element={<FulfilledProphecyPage route={route} />} />;
          }
        })}
      </Routes>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  );
}
