import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';

const PUBLIC_URL = import.meta.env.BASE_URL || '/';

interface RouteData {
  path: string;
  navLabel: string;
  pageTitle: string;
  color: string;
  isFulfilled: boolean;
  endDate?: Date;
  fulfilledLabel?: string;
  images: string[];
  pdfs: string[];
  pdfLabels: string[];
}

const routes: RouteData[] = [
  {
    path: '/',
    navLabel: 'Home',
    pageTitle: 'Prophetic Countdown',
    color: '#1e3a5f',
    isFulfilled: false,
    images: ['final_testament1.jpg', 'final_testament2.jpg', 'final_testament3.jpg', 'final_testament4.jpg'],
    pdfs: ['intro_to_prophetic_countdown1.pdf', 'intro_to_prophetic_countdown2.pdf', 'intro_to_prophetic_countdown3.pdf'],
    pdfLabels: ['Signs & Proofs 1', 'Signs & Proofs 2', 'Signs & Proofs 3'],
  },
  {
    path: '/resurrection',
    navLabel: 'Resurrection Day',
    pageTitle: 'Resurrection Day (This Is The End!)',
    color: '#4a1942',
    isFulfilled: false,
    endDate: new Date('2280-12-09T17:00:00Z'),
    images: ['earth_quake1.jpg', 'earth_quake2.jpg', 'earth_quake3.jpg', 'earth_quake4.jpg'],
    pdfs: ['the_first_the_second_blow1.pdf', 'the_first_the_second_blow2.pdf'],
    pdfLabels: ['Signs & Proofs 1', 'Signs & Proofs 2'],
  },
  {
    path: '/gog-magog',
    navLabel: 'Gog & Magog',
    pageTitle: 'Gog & Magog (10 Years Before The End)',
    color: '#2d1b4e',
    isFulfilled: false,
    endDate: new Date('2271-01-11T14:00:00Z'),
    images: ['star_wars1.jpg', 'star_wars2.jpg', 'star_wars3.jpg', 'star_wars4.jpg'],
    pdfs: ['gog_magog1.pdf', 'gog_magog2.pdf'],
    pdfLabels: ['Signs & Proofs 1', 'Signs & Proofs 2'],
  },
  {
    path: '/day-of-smoke',
    navLabel: 'The Day Of Smoke',
    pageTitle: 'The Day Of Smoke (60 Years Before The End)',
    color: '#1a3c34',
    isFulfilled: false,
    endDate: new Date('2221-04-08T04:00:00Z'),
    images: ['smoke_day1.jpg', 'smoke_day2.jpg', 'smoke_day3.jpg', 'smoke_day4.jpg'],
    pdfs: ['the_day_of_smoke1.pdf', 'the_day_of_smoke2.pdf', 'the_day_of_smoke3.pdf'],
    pdfLabels: ['Signs & Proofs 1', 'Signs & Proofs 2', 'Signs & Proofs 3'],
  },
  {
    path: '/computer',
    navLabel: 'Computer, The Creature',
    pageTitle: 'Computer, The Creature',
    color: '#1b2d4a',
    isFulfilled: true,
    fulfilledLabel: 'AD 1824 & 1947',
    images: ['computerthecreature1.jpg', 'computerthecreature2.jpg', 'computerthecreature3.jpg', 'computerthecreature4.jpg'],
    pdfs: ['computer_the_creature_details1.pdf'],
    pdfLabels: ['Signs & Proofs 1'],
  },
  {
    path: '/moon',
    navLabel: 'Splitting of The Moon',
    pageTitle: 'Splitting of The Moon (Apollo 11 Mission)',
    color: '#0f2b4a',
    isFulfilled: true,
    fulfilledLabel: 'AD 1969-07-21 UTC17:54 / 13:54 / 1:54 PM EDT, See Quran 54:1',
    images: ['moon_split1.jpg', 'moon_split2.jpg', 'moon_split3.jpg', 'moon_split4.jpg'],
    pdfs: ['moon_split_fulfilled1.pdf'],
    pdfLabels: ['Signs & Proofs 1'],
  },
  {
    path: '/messenger',
    navLabel: 'Messenger of The Covenant',
    pageTitle: 'Messenger of The Covenant',
    color: '#2a1a3e',
    isFulfilled: true,
    fulfilledLabel: 'AD 1972-01-21',
    images: ['messenger1.jpg', 'messenger2.jpg', 'messenger3.jpg', 'messenger4.jpg'],
    pdfs: ['messenger_details1.pdf'],
    pdfLabels: ['Signs & Proofs 1'],
  },
  {
    path: '/quran-19',
    navLabel: "Quran's 19-Based Code",
    pageTitle: "Quran's 19-Based Code",
    color: '#1a3344',
    isFulfilled: true,
    fulfilledLabel: 'AD 1974',
    images: ['quran19based1.jpg', 'quran19based2.jpg', 'quran19based3.jpg', 'quran19based4.jpg'],
    pdfs: ['quran19_based_details1.pdf'],
    pdfLabels: ['Signs & Proofs 1'],
  },
];

const prophecyTimestamps: Record<string, string> = {
  '/resurrection': 'UTC Saturday 2280-11-27 01:00:00 → Thursday 2280-12-09 17:00:00',
  '/gog-magog': 'UTC Friday 2270-12-23 14:00:00 → Wednesday 2271-01-11 14:00:00',
  '/day-of-smoke': 'UTC Friday 2220-06-16 21:00:00 → Sunday 2221-04-08 04:00:00',
};

interface TimeLeft {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  const remaining = diff - years * 1000 * 60 * 60 * 24 * 365.25;
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
  return { years, days, hours, minutes, seconds };
}

function CountdownDisplay({ timeLeft }: { timeLeft: TimeLeft }) {
  const units = [
    { label: 'Years', value: timeLeft.years },
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];
  return (
    <>
      {units.map((unit) => (
        <div className="countdown-unit" key={unit.label}>
          <span className="countdown-digit">{unit.value}</span>
          <span className="countdown-label">{unit.label}</span>
        </div>
      ))}
    </>
  );
}

function FulfilledDisplay() {
  return (
    <div className="fulfilled-row">
      <div className="fulfilled-box">FULFILLED</div>
      <div className="fulfilled-check">✓</div>
    </div>
  );
}

function ProphecyPage({ route }: { route: RouteData }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (route.isFulfilled) return;
    const target = route.endDate!;
    setTimeLeft(calculateTimeLeft(target));
    const interval = setInterval(() => {
      const newTime = calculateTimeLeft(target);
      setTimeLeft(newTime);
      if (soundEnabled && audioUnlocked && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [route, soundEnabled, audioUnlocked]);

  useEffect(() => {
    if (route.isFulfilled) return;
    const handleClick = () => {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          audioRef.current!.pause();
          setAudioUnlocked(true);
        }).catch(() => {});
      }
    };
    document.addEventListener('click', handleClick, { once: true });
    return () => document.removeEventListener('click', handleClick);
  }, [route.isFulfilled]);

  const timestamp = prophecyTimestamps[route.path];

  return (
    <div className="prophecy-page">
      <h1>{route.pageTitle}</h1>
      {timestamp && <div className="utc-timestamp">{timestamp}</div>}
      {route.isFulfilled && route.fulfilledLabel && (
        <div className="fulfilled-label">{route.fulfilledLabel}</div>
      )}
      {!route.isFulfilled && route.path !== '/' && (
        <div className="countdown-row">
          <CountdownDisplay timeLeft={timeLeft} />
          <button className="snd-btn" onClick={() => setSoundEnabled(!soundEnabled)}>
            {soundEnabled ? 'Turn Sound OFF' : 'Turn Sound ON'}
          </button>
        </div>
      )}
      {route.isFulfilled && route.path !== '/' && <FulfilledDisplay />}
      <h2 className="section-heading">Imagery</h2>
      <div className="image-grid">
        {route.images.map((img, i) => (
          <img key={i} src={`${PUBLIC_URL}${img}`} alt={`${route.pageTitle} ${i + 1}`} className="grid-image" />
        ))}
      </div>
      <h2 className="section-heading">Signs &amp; Proofs</h2>
      <div className="pdf-row">
        {route.pdfs.map((pdf, i) => (
          <a key={i} href={`${PUBLIC_URL}${pdf}`} target="_blank" rel="noopener noreferrer" className="pdf-card">
            {route.pdfLabels[i]}
          </a>
        ))}
      </div>
      {!route.isFulfilled && (
        <audio ref={audioRef} preload="auto">
          <source src={`${PUBLIC_URL}tick_tock_sound2.mp3`} type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
}

function Homepage() {
  const route = routes[0];
  return (
    <div className="prophecy-page">
      <h1>{route.pageTitle}</h1>
      <div className="home-subheading-yellow">Are You Ready? Time Is Running Out!</div>
      <div className="home-subheading-blue">Comments? Use:: AmazingQuran19@gmail.com</div>
      <h2 className="section-heading">Imagery</h2>
      <div className="image-grid">
        {route.images.map((img, i) => (
          <img key={i} src={`${PUBLIC_URL}${img}`} alt={`Homepage ${i + 1}`} className="grid-image" />
        ))}
      </div>
      <h2 className="section-heading">Signs &amp; Proofs</h2>
      <div className="pdf-row">
        {route.pdfs.map((pdf, i) => (
          <a key={i} href={`${PUBLIC_URL}${pdf}`} target="_blank" rel="noopener noreferrer" className="pdf-card">
            {route.pdfLabels[i]}
          </a>
        ))}
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const currentRoute = routes.find((r) => r.path === location.pathname) || routes[0];

  return (
    <div className="app-container" style={{ backgroundColor: currentRoute.color }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-weight: bold !important; font-style: italic !important; color: #ffffff !important; font-family: Georgia, 'Times New Roman', serif; }
        .app-container { min-height: 100vh; padding: 1rem; transition: background-color 0.3s ease; }
        .nav-bar { display: -ms-flexbox; display: flex; -ms-flex-wrap: wrap; flex-wrap: wrap; gap: 0.50rem; justify-content: center; padding: 1rem 0; margin-bottom: 1rem; }
        .nav-link { display: inline-block; padding: 0.5rem 0.75rem; border: 0.30rem solid #eab308; background: transparent; color: #cccccc; text-decoration: none; font-weight: bold; font-style: italic; font-size: 0.85rem; transition: all 0.2s ease; text-align: center; }
        .nav-link:hover { color: #ffffff; }
        .nav-link.active { border: 0.30rem solid #eab308; background: transparent; color: #eab308; }
        h1 { font-size: 42px; text-align: center; font-weight: bold; font-style: italic; color: #ffffff; margin-bottom: 1rem; white-space: normal; word-wrap: break-word; }
        .home-subheading-yellow { font-size: 32px; color: #eab308; text-align: center; max-width: 1120px; margin: 0.5rem auto; white-space: normal; word-wrap: break-word; font-weight: bold; font-style: italic; }
        .home-subheading-blue { font-size: 32px; color: #60a5fa; text-align: center; max-width: 1120px; margin: 0.5rem auto; white-space: normal; word-wrap: break-word; font-weight: bold; font-style: italic; }
        .utc-timestamp { font-size: 26px; color: #eab308; text-align: center; max-width: 1120px !important; margin: 0.5rem auto !important; white-space: nowrap !important; overflow: hidden !important; padding: 0 1rem !important; font-weight: bold; font-style: italic; }
        .fulfilled-label { font-size: 28px; color: #eab308; text-align: center; max-width: 1120px; margin: 0.5rem auto; white-space: normal; word-wrap: break-word; font-weight: bold; font-style: italic; }
        .countdown-row { display: -ms-flexbox; display: flex; -ms-flex-wrap: wrap; flex-wrap: wrap; justify-content: center; align-items: center; gap: 0.75rem; margin: 1.5rem auto; max-width: 1120px; }
        .countdown-unit { min-width: 120px; padding: 1rem; display: -ms-flexbox; display: flex; -ms-flex-direction: column; flex-direction: column; align-items: center; justify-content: center; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; }
        .countdown-digit { font-size: 48px; font-weight: bold; font-style: italic; color: #ffffff; line-height: 1; }
        .countdown-label { font-size: 14px; font-weight: bold; font-style: italic; color: #eab308; margin-top: 0.25rem; }
        .snd-btn { width: 140px !important; height: 50px !important; border-radius: 25px !important; display: -ms-flexbox; display: flex; -ms-flex-pack: center; justify-content: center; -ms-flex-align: center; align-items: center; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); color: #ffffff; font-weight: bold; font-style: italic; font-size: 12px; cursor: pointer; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); transition: all 0.2s ease; }
        .snd-btn:hover { background: rgba(255,255,255,0.2); }
        .fulfilled-row { display: -ms-flexbox; display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin: 1.5rem auto; }
        .fulfilled-box { width: 340px; height: 120px; background: linear-gradient(45deg, #22c55e, #16a34a); display: -ms-flexbox; display: flex; -ms-flex-pack: center; justify-content: center; -ms-flex-align: center; align-items: center; border-radius: 12px; font-size: 42px; font-weight: bold; font-style: italic; color: #ffffff; }
        .fulfilled-check { width: 110px; height: 120px; background: linear-gradient(45deg, #22c55e, #16a34a); display: -ms-flexbox; display: flex; -ms-flex-pack: center; justify-content: center; -ms-flex-align: center; align-items: center; border-radius: 12px; font-size: 48px; font-weight: bold; color: #ffffff; }
        .section-heading { text-align: left; font-size: 28px; font-weight: bold; font-style: italic; color: #ffffff; margin: 1.5rem auto 1rem auto; max-width: 1120px; padding-left: 0.5rem; }
        .image-grid { display: -ms-flexbox; display: flex; -ms-flex-wrap: wrap; flex-wrap: wrap; gap: 0; max-width: 1120px; margin: 0 auto; justify-content: center; }
        .grid-image { width: 280px; height: 200px; object-fit: cover; border: 2px solid rgba(255,255,255,0.2); }
        .pdf-row { display: -ms-flexbox; display: flex; -ms-flex-wrap: wrap; flex-wrap: wrap; gap: 1rem; max-width: 1120px; margin: 0 auto; justify-content: flex-start; }
        .pdf-card { width: 180px; height: 80px; display: -ms-flexbox; display: flex; -ms-flex-pack: center; justify-content: center; -ms-flex-align: center; align-items: center; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.25); border-radius: 8px; color: #ffffff; text-decoration: none; font-weight: bold; font-style: italic; font-size: 14px; text-align: center; padding: 0.5rem; transition: all 0.2s ease; white-space: normal; word-wrap: break-word; }
        .pdf-card:hover { background: rgba(255,255,255,0.2); border-color: #eab308; }
        .prophecy-page { max-width: 1200px; margin: 0 auto; padding-bottom: 2rem; }
        @media (max-width: 768px) {
          .home-subheading-yellow, .home-subheading-blue { font-size: 24px; }
          .utc-timestamp { font-size: 16px; }
          h1 { font-size: 28px; }
          .grid-image { width: 140px; height: 100px; }
          .countdown-unit { min-width: 80px; padding: 0.5rem; }
          .countdown-digit { font-size: 32px; }
          .fulfilled-box { width: 200px; height: 80px; font-size: 28px; }
          .fulfilled-check { width: 70px; height: 80px; font-size: 32px; }
        }
        @media (min-width: 768px) and (max-width: 1023px) { .utc-timestamp { font-size: 22px; } }
        @media (min-width: 1024px) { .utc-timestamp { font-size: 26px; } }
      `}</style>
      <nav className="nav-bar">
        {routes.map((r) => (
          <NavLink key={r.path} to={r.path} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            {r.navLabel}
          </NavLink>
        ))}
      </nav>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/resurrection" element={<ProphecyPage route={routes[1]} />} />
        <Route path="/gog-magog" element={<ProphecyPage route={routes[2]} />} />
        <Route path="/day-of-smoke" element={<ProphecyPage route={routes[3]} />} />
        <Route path="/computer" element={<ProphecyPage route={routes[4]} />} />
        <Route path="/moon" element={<ProphecyPage route={routes[5]} />} />
        <Route path="/messenger" element={<ProphecyPage route={routes[6]} />} />
        <Route path="/quran-19" element={<ProphecyPage route={routes[7]} />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}
