import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Gift, 
  BookOpen, 
  Star, 
  Smile, 
  Shuffle, 
  HeartHandshake, 
  Flame, 
  Sparkle,
  Bookmark, 
  Award, 
  ChevronRight, 
  Sparkle as SparkleIcon, 
  RefreshCw, 
  PlusCircle, 
  Wind,
  MessageCircle,
  Share2,
  Copy,
  Check,
  Send
} from 'lucide-react';
import FloraSketch from './components/FloraSketch';
import { MARI_QUOTES, MariQuote } from './mariQuotes';
import { generateApologyLetter, APOLOGY_PRESETS, REASON_LABELS } from './letters';
import { ApologyConfig } from './types';
import { startAmbientMusic, stopAmbientMusic } from './utils/audioSynth';
import WhatsAppShareModal from './components/WhatsAppShareModal';

interface GiftItem {
  id: number;
  title: string;
  description: string;
  reveal: string;
  emoji: string;
  isOpened: boolean;
}

interface FallingGift {
  id: number;
  x: number; // percentage width (0-100)
  y: number; // vertical offset pixels
  speed: number;
  angle: number;
  rotSpeed: number;
  text: string;
  emoji: string;
  scale: number;
}

export default function App() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isCoverOpened, setIsCoverOpened] = useState(false);
  const [roseMood, setRoseMood] = useState<'romantic' | 'celestial' | 'aurora' | 'sunset'>('romantic');
  const [sunflowerMood, setSunflowerMood] = useState<'romantic' | 'celestial' | 'aurora' | 'sunset'>('sunset');
  const [tulipMood, setTulipMood] = useState<'romantic' | 'celestial' | 'aurora' | 'sunset'>('romantic');
  const [lotusMood, setLotusMood] = useState<'romantic' | 'celestial' | 'aurora' | 'sunset'>('romantic');
  const [activeTab, setActiveTab] = useState<'all' | 'poema' | 'amor_eterno' | 'ojos_y_sonrisa' | 'promesa' | 'coqueteo'>('all');

  const roseNames = {
    romantic: "Rosa Rubor de Amor 🌹",
    celestial: "Rosa Celestial 🌌",
    aurora: "Rosa de la Aurora ❄️",
    sunset: "Rosa Ocaso Coral 🌅"
  };

  const sunflowerNames = {
    romantic: "Sol de Miel para Mari 🍯",
    celestial: "Estrella Helios 🌟",
    aurora: "Girasol de Jade 🍃",
    sunset: "Girasol de Fuego 🌻"
  };

  const tulipNames = {
    romantic: "Tulipán del Amor Eterno 💕",
    celestial: "Violeta Místico 🔮",
    aurora: "Tulipán de Hielo ❄️",
    sunset: "Sombra de Oro 🏺"
  };

  const lotusNames = {
    romantic: "Loto del Nilo 🪷",
    celestial: "Loto Cósmico 🌙",
    aurora: "Loto de Aurora ✨",
    sunset: "Loto Coral de Tarde 🌅"
  };

  const [selectedQuoteId, setSelectedQuoteId] = useState<number>(1);
  const [activeView, setActiveView] = useState<'garden' | 'letterCreator'>('garden');
  
  // WhatsApp modal control
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  // Love Letter Config
  const [letterConfig, setLetterConfig] = useState<ApologyConfig>({
    friendName: 'Mari',
    relationshipDuration: 'este tiempo de amor puro',
    reasonCategory: 'general',
    customReason: '',
    cherishedMemory: 'La primera vez que nuestras miradas se cruzaron y sentí que el mundo se detenía',
    tone: 'poetic',
    promisesForFuture: ['Cuidarte siempre', 'Amarte con devoción', 'Hacerte sonreír cada día']
  });

  // Interactive Custom Gift Configs
  const [giftCategory, setGiftCategory] = useState<'romantic' | 'promises' | 'poems' | 'custom'>('romantic');
  const [customGiftText, setCustomGiftText] = useState('');
  const [latestOpenedGiftMessage, setLatestOpenedGiftMessage] = useState<string | null>(null);

  // Active falling gifts state
  const [fallingGifts, setFallingGifts] = useState<FallingGift[]>([]);

  // Pre-defined romantic categories lists for Mari's gifts
  const presetGiftTexts = {
    romantic: [
      "¡Mari mi amor, tienes un brillo divino en tus ojitos que me enamora cada segundo más! 💕👀",
      "No hay puesta de sol ni galaxia que supere la dulzura infinita de tu sonrisa, mi Mari. 🌅✨",
      "Me tienes suspirando bajito y mirando el celular a cada minuto, anhelando leerte, hermosa. 🫣💋",
      "¡Eres la mujer más maravillosa del mundo, la dueña absoluta de mi corazón y de mi destino! 🪐👑",
      "Tu carisma risueño y tierno ilumina toda mi vida; te amo con locura, princesa Mari. 🌹👗"
    ],
    promises: [
      "¡Promesa eterna de amor! Aquí tienes a alguien que cuidará tu corazón con devoción infinita. 💍🔒",
      "Eres indispensable en mi universo, mi dulce Mari. ¡Gracias por existir y amarme tanto! 🥰🌍",
      "Pase lo que pase, sople la tormenta que sople, yo seré tu refugio y tu abrazo más cálido. 🛡️🫂",
      "¡Voto de amor sincero! Caminemos juntos tomados de la mano hoy, mañana y siempre, mi vida. 💞✨",
      "Tu felicidad es mi prioridad número uno; prometo arrancarte una sonrisa en cada amanecer. 🌸🍯"
    ],
    poems: [
      "Entre flores y jardines, tú brillas más que un clavel; con tu amor y tu ternura, eres mi cielo, Mari fiel. 🌹✍️",
      "El viento sopla constante, templado por tu dulzura; eres mi reina radiante, llena de gracia y ternura. 🌬️🏰",
      "El girasol busca el sol, la rosa busca el rocío, y yo en tus ojos, mi Mari, encuentro el amor mío. 🌻💞",
      "Naturaleza divina, de pétalos y coral; eres la flor de mi vida, mi tesoro celestial. 🌷👑",
      "Si cantaran trovadores baladas en tu honor, Mari amada, te bajarían estrellas de luz dorada. 🍯🎵"
    ]
  };

  // Music toggle handles
  const handleToggleMusic = () => {
    if (isMusicPlaying) {
      stopAmbientMusic();
      setIsMusicPlaying(false);
    } else {
      startAmbientMusic();
      setIsMusicPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientMusic();
    };
  }, []);

  // Gift Spawner logic
  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      spawnGift();
    }, 1500);

    const interval = setInterval(() => {
      spawnGift();
    }, 3500);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [giftCategory, customGiftText]);

  // Gravity animation frame loop for the gifts
  useEffect(() => {
    let animFrame: number;

    const updateGiftsPulse = () => {
      setFallingGifts(prev => {
        return prev
          .map(g => ({
            ...g,
            y: g.y + g.speed,
            angle: g.angle + g.rotSpeed
          }))
          .filter(g => g.y < window.innerHeight + 100);
      });
      animFrame = requestAnimationFrame(updateGiftsPulse);
    };

    animFrame = requestAnimationFrame(updateGiftsPulse);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  const getActiveGiftText = (): string => {
    if (giftCategory === 'custom') {
      return customGiftText.trim().length > 0 
        ? customGiftText 
        : "Mari hermosa, eres el latido más puro de mi corazón y la luz de mis días. ¡Te amo! 💖🌹";
    }
    const pool = presetGiftTexts[giftCategory];
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const spawnGift = () => {
    setFallingGifts(curr => {
      if (curr.length >= 5) {
        return curr;
      }
      
      const textOfGift = getActiveGiftText();
      const randomEmoji = "🎁";
      
      const newGift: FallingGift = {
        id: Date.now() + Math.random(),
        x: Math.random() * 88 + 6,
        y: -100,
        speed: Math.random() * 0.9 + 0.5,
        angle: Math.random() * 360,
        rotSpeed: Math.random() * 0.8 - 0.4,
        text: textOfGift,
        emoji: randomEmoji,
        scale: Math.random() * 0.2 + 0.9
      };

      return [...curr, newGift];
    });
  };

  const spawnGiftPack = (count: number) => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        setFallingGifts(curr => {
          if (curr.length >= 8) {
            return curr;
          }
          const textOfGift = getActiveGiftText();
          const randomEmoji = "🎁";

          const newGift: FallingGift = {
            id: Date.now() + i + Math.random(),
            x: Math.random() * 80 + 10,
            y: -100,
            speed: Math.random() * 0.8 + 0.6,
            angle: Math.random() * 360,
            rotSpeed: Math.random() * 0.8 - 0.4,
            text: textOfGift,
            emoji: randomEmoji,
            scale: Math.random() * 0.15 + 0.9
          };
          return [...curr, newGift];
        });
      }, i * 1600);
    }
  };

  const handleCatchGift = (gift: FallingGift) => {
    setLatestOpenedGiftMessage(gift.text);
    setFallingGifts(prev => prev.filter(g => g.id !== gift.id));
    
    try {
      const synthTrigger = new AudioContext();
      const osc = synthTrigger.createOscillator();
      const gain = synthTrigger.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(659.25, synthTrigger.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, synthTrigger.currentTime + 0.25);
      gain.gain.setValueAtTime(0, synthTrigger.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, synthTrigger.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, synthTrigger.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(synthTrigger.destination);
      osc.start();
      osc.stop(synthTrigger.currentTime + 0.55);
    } catch {
      // AudioContext fallback
    }
  };

  // 4 Romantic Gift Boxes for Mari
  const [gifts, setGifts] = useState<GiftItem[]>([
    {
      id: 1,
      title: "Boleto de Cita Romántica & Helado 🍦😋",
      description: "Para endulzarte la vida y llenarte de besos",
      reveal: "¡Válido para una cita romántica de ensueño, todos los helados y postres que se te antojen, risas interminables y caricias bajo la luz de las estrellas! Canjeable hoy, mañana y por toda la eternidad, mi Mari hermosa. 🍦🍨🤤💞",
      emoji: "🍦",
      isOpened: false
    },
    {
      id: 2,
      title: "Abrazo que Reinicia el Alma 🫂❤️",
      description: "Pura ternura, calidez y amor para Mari",
      reveal: "Cuando sientas que el mundo pesa mucho o el día se vuelva frío, este abrazo de amor sincero está disponible al instante. Un abrazo apretado que sana cualquier herida, te abriga el pecho y te recuerda que eres la reina absoluta de mi corazón. 🫂💓✨🛡️",
      emoji: "🫂",
      isOpened: false
    },
    {
      id: 3,
      title: "Serenata de Amor en la Brisa 🎵💌",
      description: "Acordes románticos compuestos para ti",
      reveal: "He susurrado una serenata al viento con notas creadas solo para ti, Mari. Habla de la magia de tu mirada, del aroma de tu piel y de la felicidad inmensa que me da amarte. ¡Música romántica encendida arriba en tu honor! 🎶💖😍🌹",
      emoji: "🎵",
      isOpened: false
    },
    {
      id: 4,
      title: "Llave de Mi Corazón Eterno 🗝️🔒",
      description: "Pacto de amor, devoción y lealtad total",
      reveal: "Pase lo que pase y contra cualquier tormenta, te entrego la llave sagrada de mi corazón. Te prometo lealtad incondicional, besos sinceros, cuidado fiel y un amor que florecerá más y más con cada nuevo amanecer. ¡Eres el amor de mi vida, Mari preciosa! 🗝️🔒👑💍✨",
      emoji: "🗝️",
      isOpened: false
    }
  ]);

  const [openedGiftId, setOpenedGiftId] = useState<number | null>(null);

  const handleOpenGift = (id: number) => {
    setGifts(prev => prev.map(g => g.id === id ? { ...g, isOpened: true } : g));
    setOpenedGiftId(id);
  };

  // Filter 55 Mari quotes
  const filteredQuotes = MARI_QUOTES.filter(q => {
    if (activeTab === 'all') return true;
    return q.category === activeTab;
  });

  const selectedQuote = MARI_QUOTES.find(q => q.id === selectedQuoteId) || MARI_QUOTES[0];

  const handleRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * MARI_QUOTES.length);
    setSelectedQuoteId(MARI_QUOTES[randomIndex].id);
  };

  // Generate current dynamic letter text
  const currentGeneratedLetter = generateApologyLetter(letterConfig);

  // Direct WhatsApp share helper
  const shareDirectWhatsApp = (message: string) => {
    const appUrl = typeof window !== 'undefined' ? window.location.href : '';
    const fullText = `${message}\n\n🌸 Abre nuestro jardín de amor aquí:\n${appUrl}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const copyTextWithToast = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#060408] text-slate-100 flex flex-col font-sans selection:bg-rose-500/30 selection:text-rose-200 overflow-x-hidden relative">

      {/* ================= PORTADA DEL ÁLBUM DE AMOR PARA MARI ================= */}
      <AnimatePresence>
        {!isCoverOpened && (
          <motion.div
            key="cover-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.08, y: -45 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-[#040206] z-50 flex flex-col justify-between items-center p-6 text-center select-none overflow-hidden"
          >
            {/* Ambient glows */}
            <div className="absolute top-1/4 left-1/4 w-[455px] h-[455px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[455px] h-[455px] bg-sky-600/10 rounded-full blur-[140px] pointer-events-none" />

            {/* Top header details */}
            <div className="pt-8 relative z-10 flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-[#f43f5e] uppercase font-black bg-rose-950/40 border border-rose-900/60 px-3.5 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" /> Dedicatoria de Amor Eterno 💍✨
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black tracking-tight bg-gradient-to-r from-rose-200 via-pink-100 to-sky-200 bg-clip-text text-transparent max-w-xl px-4 mt-2">
                Flores para el amor de mi vida, mi adorada Mari 💗🌌
              </h2>
              <p className="text-xs sm:text-sm text-rose-200/80 max-w-md font-sans font-medium px-4">
                Un jardín de rosas eternas, promesas del corazón y una rosa azul cósmica que florece solo para ti.
              </p>
            </div>

            {/* Central fully formed Blue Flower */}
            <div className="relative w-80 h-80 sm:w-[380px] sm:h-[380px] flex items-center justify-center group cursor-pointer z-10 transition">
              <div 
                onClick={() => {
                  setIsCoverOpened(true);
                  if (!isMusicPlaying) {
                    handleToggleMusic();
                  }
                }}
                className="w-full h-full"
                title="Tocar para entrar al jardín de amor de Mari"
              >
                <FloraSketch 
                  flowerType="rose"
                  interactiveMood="cosmic_blue"
                  startFullyFormed={true}
                />
              </div>
              
              <div className="absolute inset-4 rounded-full border border-sky-400/20 pointer-events-none animate-ping duration-[3s]" />
              <div className="absolute inset-8 rounded-full border border-pink-400/10 pointer-events-none animate-pulse" />
            </div>

            {/* Footer actions */}
            <div className="pb-8 relative z-10 flex flex-col items-center gap-3 w-full max-w-md">
              <div className="flex flex-col sm:flex-row gap-2.5 w-full justify-center px-4">
                <button
                  onClick={() => {
                    setIsCoverOpened(true);
                    if (!isMusicPlaying) {
                      handleToggleMusic();
                    }
                  }}
                  className="group flex-1 px-7 py-3.5 bg-gradient-to-r from-rose-600 via-pink-500 to-sky-600 hover:from-rose-500 hover:to-sky-500 text-white font-serif font-bold text-sm rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:shadow-[0_0_40px_rgba(244,63,94,0.7)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Tocar la Flor Azul de Mari para Entrar 🌌🥀</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsWhatsAppOpen(true);
                  }}
                  className="px-5 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(37,211,102,0.4)] flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                  title="Compartir por WhatsApp con Mari"
                >
                  <MessageCircle className="w-4 h-4 fill-black" />
                  <span>WhatsApp 💬</span>
                </button>
              </div>

              <span className="text-[10px] text-pink-300 font-mono tracking-wider animate-pulse uppercase">
                * Activa la música romántica al tocar la flor
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= INTERACTIVE FLOATING GIFTS OVERLAY LAYER ================= */}
      <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
        <AnimatePresence>
          {fallingGifts.map(gift => (
            <motion.button
              key={gift.id}
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: 1, scale: gift.scale }}
              exit={{ opacity: 0, scale: 0.1, y: gift.y + 40 }}
              style={{
                position: 'absolute',
                left: `${gift.x}%`,
                top: `${gift.y}px`,
                transform: `rotate(${gift.angle}deg)`,
                pointerEvents: 'auto'
              }}
              onClick={() => handleCatchGift(gift)}
              className="group cursor-pointer flex items-center justify-center filter drop-shadow-[0_0_12px_rgba(244,63,94,0.5)] active:scale-125 transition-transform"
              title="¡Toca para abrir el regalo de amor para Mari!"
            >
              <div className="relative">
                <span className="text-3xl sm:text-4xl select-none group-hover:scale-115 transition">
                  🎁
                </span>
                <span className="absolute -bottom-2 -right-1 text-xs">
                  💖
                </span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {copiedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-mono text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-emerald-400"
          >
            <Check className="w-4 h-4 text-white" />
            <span>¡Copiado al portapapeles con amor! 📋💗</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Share Modal */}
      <WhatsAppShareModal 
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        currentLetterText={currentGeneratedLetter}
        currentQuoteText={selectedQuote.text}
      />

      {/* 🧭 NAVIGATION HEADER */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-slate-950/85 border-b border-slate-900/80 px-4 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-sky-400 flex items-center justify-center text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse">
              <Heart className="w-4 h-4 fill-white text-white" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-serif font-black tracking-tight bg-gradient-to-r from-rose-200 to-pink-100 bg-clip-text text-transparent">
                Jardín de Amor para Mari 💗
              </h1>
              <p className="text-[10px] text-pink-300/70 font-mono">
                Flores eternas & cartas de amor
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
            
            {/* WHATSAPP SHARE BUTTON */}
            <button
              onClick={() => setIsWhatsAppOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-black text-[11px] sm:text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(37,211,102,0.4)]"
              title="Compartir por WhatsApp con Mari"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-black" />
              <span>WhatsApp 💬</span>
            </button>

            {/* Music Player Toggle */}
            <button
              onClick={handleToggleMusic}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] sm:text-xs transition-all active:scale-95 cursor-pointer select-none font-semibold ${
                isMusicPlaying
                  ? 'bg-rose-950/70 border-rose-500/50 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Reproducir música romántica"
            >
              {isMusicPlaying ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                  <span>Música Romántica 🔊</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                  <span>Música 🔇</span>
                </>
              )}
            </button>

            {/* View navigation */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 sm:p-1 rounded-full border border-slate-800">
              <button
                onClick={() => setActiveView('garden')}
                className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all duration-300 flex items-center gap-1 cursor-pointer ${
                  activeView === 'garden'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title="El Prado de Flores de Mari"
              >
                <span>Jardín 🌹🌸</span>
              </button>
              <button
                onClick={() => setActiveView('letterCreator')}
                className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all duration-300 flex items-center gap-1 cursor-pointer ${
                  activeView === 'letterCreator'
                    ? 'bg-gradient-to-r from-purple-500 to-rose-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title="Cartas de Amor y Sorpresas para Mari"
              >
                <span>Cartas de Amor 💌</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 🔮 MAIN CONTENT */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-8 relative z-10">
        
        {/* ================= REVELATION BANNER FROM MARI'S FLOATING GIFT ================= */}
        <AnimatePresence>
          {latestOpenedGiftMessage !== null && (
            <motion.section
              initial={{ height: 0, opacity: 0, y: -20 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-gradient-to-r from-[#200b1a] via-[#100512] to-[#240c1c] border border-pink-500/40 rounded-3xl p-5 md:p-6 shadow-[0_0_30px_rgba(244,63,94,0.25)] relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 flex gap-1">
                <SparkleIcon className="w-5 h-5 text-amber-300 animate-spin" />
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center text-4xl shadow-lg ring-4 ring-pink-500/20 flex-shrink-0 animate-bounce">
                  💝
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <h4 className="text-xs font-mono font-bold text-pink-400 uppercase tracking-widest">
                    ¡Has abierto un regalo flotante con amor para Mari! ✨🎁
                  </h4>
                  <p className="text-base sm:text-lg font-serif italic text-amber-100 font-medium leading-relaxed mt-1">
                    " {latestOpenedGiftMessage} "
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <button
                    onClick={() => shareDirectWhatsApp(`Mari mi amor 💗 Mira este mensajito que atrapé para ti:\n"${latestOpenedGiftMessage}"`)}
                    className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold rounded-xl text-xs font-mono shadow-md transition active:scale-95 flex items-center gap-1 justify-center cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-black" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => setLatestOpenedGiftMessage(null)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold rounded-xl text-xs font-mono transition active:scale-95 cursor-pointer"
                  >
                    Cerrar ✕
                  </button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ================= VIEW 1: PRADO DE FLORES ================= */}
        {activeView === 'garden' && (
          <>
            <section className="flex flex-col gap-4">
              <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 border-b border-slate-900 pb-4">
                <div>
                  <span className="text-[11px] font-mono text-pink-400 uppercase tracking-widest bg-pink-950/30 border border-pink-900/40 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 w-fit">
                    <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                    Jardín de Amor Infinito 💗🌹
                  </span>
                  <h2 className="text-2xl font-serif font-black text-white tracking-tight mt-1.5 leading-tight">
                    El Prado de Amor para Mari: Flores Especiales del Mundo
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-3xl mt-1">
                    Dedico este rincón a <strong className="text-rose-350 font-bold">Mari</strong>, el amor de mi vida. Las 4 flores exóticas florecen al compás de la brisa con un <strong className="text-teal-300">simulador de viento interactivo</strong>: la Rosa de Pasión 🌹, el Girasol Radiante 🌻, el Tulipán de Amor 💕 y la Flor de Loto Sagrada 🌸.
                  </p>
                </div>
                
                {/* Theme chooser */}
                <div className="flex flex-wrap gap-1 items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-900">
                  <span className="text-[10px] font-mono text-slate-400 px-2 uppercase font-bold">Clima del Prado:</span>
                  {[
                    { id: 'romantic' as const, label: 'Modo Rosa 💅', border: 'hover:border-pink-500/40' },
                    { id: 'celestial' as const, label: 'Modo Celestial 🌌', border: 'hover:border-purple-500/40' },
                    { id: 'aurora' as const, label: 'Modo Aurora ❄️', border: 'hover:border-teal-500/40' },
                    { id: 'sunset' as const, label: 'Modo Ocaso 🌅', border: 'hover:border-amber-500/40' }
                  ].map(mood => (
                    <button
                      key={mood.id}
                      onClick={() => {
                        setRoseMood(mood.id);
                        setSunflowerMood(mood.id);
                        setTulipMood(mood.id);
                        setLotusMood(mood.id);
                      }}
                      className={`px-3 py-1 text-[11px] rounded-xl border transition active:scale-95 cursor-pointer ${
                        (roseMood === mood.id && sunflowerMood === mood.id && tulipMood === mood.id && lotusMood === mood.id)
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold border-transparent shadow-md'
                          : `bg-slate-900 border-slate-800 text-slate-400 ${mood.border}`
                      }`}
                    >
                      {mood.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ================= LA FLOR AZUL QUE SE POSÓ DE LA PORTADA ================= */}
              <div className="bg-gradient-to-r from-[#030a24] via-[#050617] to-[#0d0312] border border-sky-500/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(14,165,233,0.18)] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6" id="landed-blue-flower-card">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex-1 max-w-lg text-center md:text-left flex flex-col gap-2">
                  <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 border border-sky-900/60 px-3 py-1 rounded-full w-fit mx-auto md:mx-0 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Star className="w-3 h-3 text-sky-400 animate-spin" /> ¡Flor Azul Cósmica para Mari! 🌌💙
                  </span>
                  <h3 className="text-xl md:text-2xl font-serif font-black text-slate-100 mt-1 leading-tight">
                    La Rosa Celestial de Amor para Mari
                  </h3>
                  <p className="text-xs text-sky-200/80 leading-relaxed font-sans">
                    Esta es la rosa de color azul cósmico que se posó desde la portada. Totalmente abierta y radiante, florece aquí para recordarte, <strong>mi adorada Mari</strong>, que lo nuestro es único en el universo y que mi amor por ti es eterno e inquebrantable.
                  </p>

                  <div className="flex flex-wrap gap-2 justify-center md:justify-start items-center mt-2.5">
                    <span className="text-[11px] font-mono text-pink-300 font-bold flex items-center gap-1 bg-pink-950/40 px-2.5 py-0.5 rounded border border-pink-900/40">
                      <Heart className="w-3 h-3 fill-pink-400 stroke-pink-400 animate-pulse" /> Amor Eterno para Mari
                    </span>
                    <button
                      onClick={() => shareDirectWhatsApp(`Mari mi amor 💗 Te dedico esta rosa azul cósmica que florece eternamente para ti en nuestro jardín celestial 🌌🥀💙`)}
                      className="px-3 py-1 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-[11px] rounded-lg transition flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <MessageCircle className="w-3 h-3 fill-black" />
                      <span>Dedicar en WhatsApp 💬</span>
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-80 h-72 bg-slate-950/60 rounded-2xl border border-sky-900/40 hover:border-sky-400/40 overflow-hidden relative shrink-0 shadow-xl" id="cover-blue-flower-holder">
                  <span className="absolute top-3 left-3 z-10 text-[10px] font-mono text-sky-300 bg-sky-950/80 backdrop-blur-md border border-sky-900/50 px-2.5 py-0.5 rounded-md font-bold">
                    Rosa Azul para Mari 🌌👑
                  </span>
                  <FloraSketch 
                    flowerType="rose"
                    interactiveMood="cosmic_blue"
                    startFullyFormed={true}
                  />
                </div>
              </div>

              {/* Flora Sketch Render Stage - 4 Species */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {/* Slot 1: Rosa de la Pasión */}
                <div className="flex flex-col h-[450px] bg-slate-950/45 p-4 rounded-3xl border border-slate-900/50 relative group hover:border-pink-500/30 transition-all duration-300 overflow-hidden shadow-xl">
                  <span className="absolute top-4 left-4 z-10 text-[11px] font-mono text-rose-350 font-bold bg-rose-950/80 backdrop-blur-md border border-rose-900/60 px-2.5 py-0.5 rounded-md select-none">
                    {roseNames[roseMood]}
                  </span>
                  <FloraSketch 
                    flowerType="rose"
                    interactiveMood={roseMood}
                  />
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex justify-center gap-1 bg-slate-950/90 backdrop-blur-sm p-1 rounded-2xl border border-slate-900">
                    {(['romantic', 'celestial', 'aurora', 'sunset'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setRoseMood(m)}
                        className={`px-2 py-1 text-[9px] font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                          roseMood === m
                            ? 'bg-rose-500/25 text-rose-200 border border-rose-500/30 font-bold scale-102'
                            : 'text-slate-500 hover:text-slate-350 bg-transparent'
                        }`}
                      >
                        {m === 'romantic' ? 'Rubor' : m === 'celestial' ? 'Celeste' : m === 'aurora' ? 'Aurora' : 'Ocaso'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slot 2: Girasol Dorado */}
                <div className="flex flex-col h-[450px] bg-slate-950/45 p-4 rounded-3xl border border-slate-900/50 relative group hover:border-amber-500/30 transition-all duration-300 overflow-hidden shadow-xl">
                  <span className="absolute top-4 left-4 z-10 text-[11px] font-mono text-amber-350 font-bold bg-amber-950/80 backdrop-blur-md border border-amber-900/60 px-2.5 py-0.5 rounded-md select-none">
                    {sunflowerNames[sunflowerMood]}
                  </span>
                  <FloraSketch 
                    flowerType="sunflower"
                    interactiveMood={sunflowerMood}
                  />
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex justify-center gap-1 bg-slate-950/90 backdrop-blur-sm p-1 rounded-2xl border border-slate-900">
                    {(['romantic', 'celestial', 'aurora', 'sunset'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setSunflowerMood(m)}
                        className={`px-2 py-1 text-[9px] font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                          sunflowerMood === m
                            ? 'bg-amber-500/25 text-amber-200 border border-amber-500/30 font-bold scale-102'
                            : 'text-slate-500 hover:text-slate-350 bg-transparent'
                        }`}
                      >
                        {m === 'romantic' ? 'Miel' : m === 'celestial' ? 'Helios' : m === 'aurora' ? 'Jade' : 'Fuego'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slot 3: Tulipán de Amor */}
                <div className="flex flex-col h-[450px] bg-slate-950/45 p-4 rounded-3xl border border-slate-900/50 relative group hover:border-red-500/30 transition-all duration-300 overflow-hidden shadow-xl">
                  <span className="absolute top-4 left-4 z-10 text-[11px] font-mono text-red-350 font-bold bg-red-950/80 backdrop-blur-md border border-red-900/60 px-2.5 py-0.5 rounded-md select-none">
                    {tulipNames[tulipMood]}
                  </span>
                  <FloraSketch 
                    flowerType="tulip"
                    interactiveMood={tulipMood}
                  />
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex justify-center gap-1 bg-slate-950/90 backdrop-blur-sm p-1 rounded-2xl border border-slate-900">
                    {(['romantic', 'celestial', 'aurora', 'sunset'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setTulipMood(m)}
                        className={`px-2 py-1 text-[9px] font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                          tulipMood === m
                            ? 'bg-red-500/25 text-red-200 border border-red-500/30 font-bold scale-102'
                            : 'text-slate-500 hover:text-slate-350 bg-transparent'
                        }`}
                      >
                        {m === 'romantic' ? 'Amor' : m === 'celestial' ? 'Místico' : m === 'aurora' ? 'Hielo' : 'Oro'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slot 4: Sagrado Loto Místico */}
                <div className="flex flex-col h-[450px] bg-slate-950/45 p-4 rounded-3xl border border-slate-900/50 relative group hover:border-purple-500/30 transition-all duration-300 overflow-hidden shadow-xl">
                  <span className="absolute top-4 left-4 z-10 text-[11px] font-mono text-purple-350 font-bold bg-purple-950/80 backdrop-blur-md border border-purple-900/60 px-2.5 py-0.5 rounded-md select-none">
                    {lotusNames[lotusMood]}
                  </span>
                  <FloraSketch 
                    flowerType="lotus"
                    interactiveMood={lotusMood}
                  />
                  <div className="absolute bottom-3 left-3 right-3 z-10 flex justify-center gap-1 bg-slate-950/90 backdrop-blur-sm p-1 rounded-2xl border border-slate-900">
                    {(['romantic', 'celestial', 'aurora', 'sunset'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setLotusMood(m)}
                        className={`px-2 py-1 text-[9px] font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                          lotusMood === m
                            ? 'bg-purple-500/25 text-purple-200 border border-purple-500/30 font-bold scale-102'
                            : 'text-slate-500 hover:text-slate-350 bg-transparent'
                        }`}
                      >
                        {m === 'romantic' ? 'Nilo' : m === 'celestial' ? 'Cósmico' : m === 'aurora' ? 'Aurora' : 'Coral'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ================= REACTION MESSAGES FOR MARI & REGALO DROPS ================= */}
            <section className="bg-gradient-to-br from-[#180a1c] via-slate-950 to-[#0e0712] border border-rose-900/40 p-5 md:p-6 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="flex flex-col gap-1 border-b border-slate-900 pb-3 mb-4">
                <span className="text-[10px] font-mono text-rose-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400 animate-pulse" /> Mensajitos de Amor que Vuelan 🎈
                </span>
                <h3 className="text-md sm:text-lg font-serif font-bold text-white">
                  ¿Qué palabras de amor quieres que lleven los regalos flotantes para Mari? 🎁✍️
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Elige una categoría de amor o <strong>escribe tu propio mensaje sincero</strong>. Cada regalo con lazo que caiga por la pantalla y Mari atrape, revelará estas hermosas palabras.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
                <div className="lg:col-span-2 flex flex-col gap-2 justify-between">
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">1. Categorías de Amor:</span>
                  <div className="flex flex-col gap-1.5 flex-grow justify-center">
                    {[
                      { id: 'romantic' as const, label: 'Piropos & Amor Enamorado 💘', color: 'hover:border-pink-500/30' },
                      { id: 'promises' as const, label: 'Promesas del Corazón 💍', color: 'hover:border-rose-500/30' },
                      { id: 'poems' as const, label: 'Poemas para Mari ✍️', color: 'hover:border-amber-500/30' },
                      { id: 'custom' as const, label: 'Escribir mi Propio Mensaje 📝', color: 'hover:border-rose-500/30' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setGiftCategory(cat.id)}
                        className={`px-4 py-2 text-xs rounded-xl border text-left transition duration-300 active:scale-95 flex items-center justify-between cursor-pointer ${
                          giftCategory === cat.id
                            ? 'bg-gradient-to-r from-rose-800 to-pink-700 text-white font-bold border-transparent shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                            : `bg-slate-950 border-slate-900 text-slate-400 ${cat.color}`
                        }`}
                      >
                        <span>{cat.label}</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${giftCategory === cat.id ? 'translate-x-1 text-amber-300' : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-3 bg-slate-950 p-4 rounded-2xl border border-slate-900 flex flex-col justify-between">
                  {giftCategory === 'custom' ? (
                    <div className="flex flex-col gap-2 h-full justify-between">
                      <div>
                        <label className="text-[11px] font-mono text-pink-300 font-bold block mb-1">
                          ¡Escribe tu mensaje de amor para Mari! ✏️💗
                        </label>
                        <textarea
                          value={customGiftText}
                          onChange={(e) => setCustomGiftText(e.target.value)}
                          placeholder="Ej: Mari hermosa, eres lo más bonito de mi vida. Te amo con cada latido de mi pecho... ❤️"
                          maxLength={180}
                          className="w-full h-24 bg-[#0a060d] border border-pink-900/50 hover:border-pink-500/40 p-3 rounded-xl text-xs text-rose-50 leading-relaxed outline-none focus:ring-1 focus:ring-pink-400 transition"
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2">
                        <span>Límite: {customGiftText.length}/180 letras</span>
                        <span className="text-amber-300 font-semibold">* Listo para flotar en pantalla</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold block mb-1">
                          Muestra de mensajitos en esta categoría:
                        </span>
                        <div className="bg-[#09050d] border border-slate-900 rounded-xl p-3 max-h-[110px] overflow-y-auto flex flex-col gap-2">
                          {presetGiftTexts[giftCategory].slice(0, 3).map((text, idx) => (
                            <p key={idx} className="text-xs text-slate-300 italic font-serif leading-tight">
                              " {text} "
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between items-center font-mono text-[10px] text-pink-400">
                        <span>* Se eligen aleatoriamente para flotar</span>
                        <span className="text-slate-500">• 5 mensajitos variados</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 justify-end border-t border-slate-900 pt-3.5">
                <button
                  onClick={() => spawnGiftPack(1)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-pink-400" />
                  <span>Soltar 1 Regalo 🎁</span>
                </button>
                
                <button
                  onClick={() => spawnGiftPack(8)}
                  className="px-5 py-2 bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-xs font-mono font-extrabold transition duration-300 shadow-md shadow-rose-900/20 hover:shadow-[0_0_25px_rgba(244,63,94,0.4)] flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Gift className="w-4 h-4 text-white animate-bounce" />
                  <span>¡Lluvia de Regalos para Mari! 🌧️🎁✨</span>
                </button>
              </div>
            </section>
          </>
        )}

        {/* ================= VIEW 2: CARTAS Y DETALLES ================= */}
        {activeView === 'letterCreator' && (
          <>
            {/* ================= GENERADOR Y VISUALIZADOR DE CARTA DE AMOR ================= */}
            <section className="bg-gradient-to-b from-[#180a22] to-slate-950 border border-slate-900 p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-rose-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

              <div className="max-w-4xl mx-auto flex flex-col gap-6">
                
                {/* Header of Letter */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-rose-300 font-bold uppercase tracking-widest flex items-center gap-1 bg-rose-950/50 border border-rose-900/50 px-2.5 py-0.5 rounded w-fit">
                      <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" /> Carta de Amor Dedicada
                    </span>
                    <h3 className="text-xl md:text-2xl font-serif font-black text-rose-100 flex items-center gap-1.5 mt-1">
                      Para Mari, el Amor de Mi Vida 💗💍
                    </h3>
                  </div>

                  {/* Share on WhatsApp button prominently */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => shareDirectWhatsApp(`Mari mi amor 💗 Te he escrito esta carta desde el fondo de mi corazón:\n\n${currentGeneratedLetter}`)}
                      className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(37,211,102,0.35)] transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4 fill-black" />
                      <span>Enviar a Mari por WhatsApp 💬💌</span>
                    </button>

                    <button
                      onClick={() => copyTextWithToast(currentGeneratedLetter)}
                      className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copiar 📋</span>
                    </button>
                  </div>
                </div>

                {/* Tone Selectors */}
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                    1. Elige el tono de tu carta para Mari:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {APOLOGY_PRESETS.map(preset => (
                      <button
                        key={preset.tone}
                        onClick={() => setLetterConfig(prev => ({ ...prev, tone: preset.tone }))}
                        className={`p-2.5 rounded-xl border text-left transition duration-200 cursor-pointer flex flex-col justify-between min-h-[68px] ${
                          letterConfig.tone === preset.tone
                            ? 'bg-gradient-to-r from-rose-900/90 to-pink-900/80 border-rose-500/60 text-white shadow-md'
                            : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-800'
                        }`}
                      >
                        <span className="text-xs font-serif font-bold text-rose-200">{preset.title}</span>
                        <span className="text-[9px] text-slate-400 leading-tight line-clamp-2 mt-1">{preset.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Custom Memory Input */}
                <div className="bg-slate-950/70 border border-slate-900 p-4 rounded-2xl flex flex-col gap-2">
                  <label className="text-[11px] font-mono text-rose-300 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Un recuerdo especial o detalle que nos une (opcional):
                  </label>
                  <input
                    type="text"
                    value={letterConfig.cherishedMemory}
                    onChange={(e) => setLetterConfig(prev => ({ ...prev, cherishedMemory: e.target.value }))}
                    placeholder="Ej: Aquel paseo de noche donde nos reímos tanto bajo la luna..."
                    className="w-full bg-[#0b0612] border border-slate-800 p-2.5 rounded-xl text-xs text-slate-100 outline-none focus:border-rose-500 transition font-serif"
                  />
                </div>

                {/* THE RENDERED LOVE LETTER */}
                <div className="w-full bg-[#1e1329]/40 border border-rose-900/30 p-6 md:p-8 rounded-2xl shadow-inner font-serif text-slate-100/95 leading-relaxed text-sm md:text-base relative overflow-hidden">
                  <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
                    <Heart className="w-32 h-32 text-rose-500 fill-rose-500" />
                  </div>
                  
                  <div className="whitespace-pre-wrap font-serif text-slate-200 leading-loose relative z-10">
                    {currentGeneratedLetter}
                  </div>

                  <div className="mt-6 pt-4 border-t border-rose-900/30 flex flex-wrap items-center justify-between gap-3 relative z-10">
                    <span className="text-[11px] font-mono text-pink-300/80 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400 animate-pulse" />
                      Dedicatoria viva para Mari 💗
                    </span>

                    <button
                      onClick={() => shareDirectWhatsApp(`Mari mi amor 💗 Te dedico esta hermosa carta de amor:\n\n${currentGeneratedLetter}`)}
                      className="px-4 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4 fill-black" />
                      <span>Compartir esta Carta por WhatsApp 💬</span>
                    </button>
                  </div>
                </div>

              </div>
            </section>

            {/* ================= CAJITAS DE REGALO PARA MARI ================= */}
            <section className="bg-slate-900/40 border border-slate-900 p-6 rounded-3xl shadow-xl backdrop-blur-sm">
              <div className="flex flex-col gap-1 border-b border-slate-900 pb-3 mb-6">
                <span className="text-[10px] font-mono text-pink-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Gift className="w-4 h-4 text-pink-400 animate-bounce" /> Sorpresas para consentirte
                </span>
                <h3 className="text-lg font-serif font-bold text-white">
                  Cajitas de Amor para Mari 🎁💖
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Haz clic sobre cada hermoso regalo con listón dorado para revelar dulces mimos y detalles con los que quiero consentirte siempre, mi vida.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {gifts.map(gift => (
                  <button
                    key={gift.id}
                    onClick={() => handleOpenGift(gift.id)}
                    className={`relative p-5 rounded-2xl border text-left transition duration-300 outline-none hover:shadow-lg group flex flex-col justify-between min-h-[145px] select-none cursor-pointer ${
                      gift.isOpened
                        ? 'bg-slate-950 border-pink-900/30'
                        : 'bg-slate-900 border-slate-850 hover:border-pink-500/40 hover:-translate-y-1'
                    }`}
                  >
                    {!gift.isOpened && (
                      <div className="absolute top-0 right-8 w-2.5 h-full bg-amber-450 opacity-60 z-10 pointer-events-none group-hover:bg-amber-300 transition" />
                    )}

                    <div>
                      <div className="flex justify-between items-start">
                        <div className="w-9 h-9 rounded-full bg-slate-950 border border-slate-850/60 flex items-center justify-center text-lg shadow-md">
                          {gift.isOpened ? gift.emoji : "🎁"}
                        </div>
                        {!gift.isOpened && (
                          <span className="text-[9px] font-mono text-amber-300 bg-amber-950/40 border border-amber-900/45 px-1.5 py-0.5 rounded font-semibold uppercase animate-pulse">
                            Abrir
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-serif font-bold text-white mt-3 flex items-center gap-1 leading-tight group-hover:text-pink-300 transition">
                        {gift.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-tight">
                        {gift.isOpened ? "¡Regalo revelado!" : gift.description}
                      </p>
                    </div>

                    <div className="mt-4">
                      {gift.isOpened ? (
                        <span className="text-[10px] text-pink-300 font-bold flex items-center gap-1 font-mono uppercase tracking-wider">
                          <Star className="w-3 h-3 fill-pink-400 text-pink-400 animate-pulse" /> Ver Sorpresa
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">Haz clic para desenvolver ✨</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {openedGiftId !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="mt-6 bg-[#1b0d21] border border-pink-500/40 p-5 rounded-2xl relative overflow-hidden shadow-[0_0_25px_rgba(244,63,94,0.15)]"
                  >
                    {(() => {
                      const activeGift = gifts.find(g => g.id === openedGiftId);
                      if (!activeGift) return null;
                      return (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-3xl shadow-lg flex-shrink-0 animate-bounce">
                            {activeGift.emoji}
                          </div>
                          <div className="flex-grow">
                            <span className="text-[9px] font-mono text-pink-400 font-bold uppercase tracking-widest block mb-1">
                              Sorpresa Revelada para Mari en la cajita {activeGift.id}:
                            </span>
                            <h4 className="text-sm font-bold text-amber-200 uppercase font-mono">{activeGift.title}</h4>
                            <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed font-serif italic">
                              " {activeGift.reveal} "
                            </p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0 mt-3 sm:mt-0">
                            <button
                              onClick={() => shareDirectWhatsApp(`Mari mi amor 💗 ¡Te dedico este regalo especial:\n*${activeGift.title}*\n"${activeGift.reveal}"`)}
                              className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs rounded-xl transition flex items-center gap-1 justify-center cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-black" />
                              <span>WhatsApp</span>
                            </button>
                            <button
                              onClick={() => setOpenedGiftId(null)}
                              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-mono font-bold transition active:scale-95 cursor-pointer"
                            >
                              Cerrar ✕
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* ================= 55 DESTELLOS DE AMOR Y POESÍA PARA MARI ================= */}
            <section className="bg-slate-900/40 border border-slate-900 p-6 rounded-3xl shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4 mb-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-pink-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Heart className="w-4 h-4 text-rose-400 fill-rose-400 animate-pulse" /> 55 Razones y Poemas de Amor
                  </span>
                  <h3 className="text-lg font-serif font-bold text-white">
                    55 Destellos de Amor y Devoción para Mari 💗✨
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Toca cualquier casilla para descubrir un poema, una promesa o una declaración de amor salida del alma. ¡55 mensajes dedicados a Mari!
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleRandomQuote}
                    className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold font-mono rounded-xl transition-all duration-300 flex items-center gap-1.5 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)] active:scale-95 cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>¿Al azar? 🎲</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left pane: Tabs and Number grid */}
                <div className="col-span-1 lg:col-span-7 flex flex-col gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-900">
                  
                  {/* Category tabs */}
                  <div className="flex flex-wrap gap-1 border-b border-slate-900 pb-3">
                    {[
                      { id: 'all' as const, label: 'Todos ✨ (55)' },
                      { id: 'amor_eterno' as const, label: 'Amor Eterno 💍' },
                      { id: 'poema' as const, label: 'Poemas ✍️' },
                      { id: 'ojos_y_sonrisa' as const, label: 'Mirada & Sonrisa 👀' },
                      { id: 'promesa' as const, label: 'Promesas 🤝' },
                      { id: 'coqueteo' as const, label: 'Coqueteo 😉' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3 py-1.5 text-xs rounded-lg transition active:scale-95 cursor-pointer ${
                          activeTab === tab.id
                            ? 'bg-rose-950/80 border-rose-700/60 text-pink-200 font-bold border'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Grid of 55 numbers */}
                  <div className="grid grid-cols-5 sm:grid-cols-11 gap-1.5 max-h-[290px] overflow-y-auto pr-1">
                    {Array.from({ length: 55 }, (_, i) => i + 1).map(num => {
                      const isMatch = filteredQuotes.some(f => f.id === num);
                      const isSelected = selectedQuoteId === num;
                      
                      return (
                        <button
                          key={num}
                          onClick={() => setSelectedQuoteId(num)}
                          className={`h-9 w-full rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer font-mono border ${
                            !isMatch 
                              ? 'opacity-30 border-transparent text-slate-600 bg-slate-950'
                              : isSelected
                                ? 'bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-400 text-white border-transparent shadow-lg scale-95 font-black ring-1 ring-pink-400'
                                : 'bg-slate-900 border-slate-850 hover:border-pink-500/30 text-slate-300'
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>

                  <div className="text-[10px] text-slate-500 italic text-center font-mono mt-1">
                    * Toca cualquiera de las casillas para leer su lindo mensaje para Mari
                  </div>
                </div>

                {/* Right presentation card for active quote */}
                <div className="col-span-1 lg:col-span-5 min-h-[340px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedQuote.id}
                      initial={{ opacity: 0, scale: 0.98, x: 10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.98, x: -10 }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-gradient-to-b from-[#1c0f24] to-[#050207] border border-rose-500/30 p-6 rounded-2xl flex flex-col justify-between shadow-2xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                        <span className="text-xs font-mono font-bold text-pink-300 uppercase tracking-widest bg-rose-950/50 border border-rose-900/40 px-2.5 py-0.5 rounded">
                          Destello #{selectedQuote.id} de 55
                        </span>
                        <span className="text-[10px] font-mono uppercase bg-slate-950 border border-slate-900 px-2 py-0.5 rounded text-slate-400">
                          {selectedQuote.category === 'poema' && "Poema ✍️"}
                          {selectedQuote.category === 'amor_eterno' && "Amor Eterno 💍"}
                          {selectedQuote.category === 'ojos_y_sonrisa' && "Mirada 👀"}
                          {selectedQuote.category === 'promesa' && "Promesa 🤝"}
                          {selectedQuote.category === 'coqueteo' && "Coqueteo 😉"}
                        </span>
                      </div>

                      <div className="my-auto py-5 min-h-[140px] flex items-center justify-center">
                        <p className="text-sm sm:text-base text-slate-100 font-serif leading-relaxed text-center px-2 italic">
                          " {selectedQuote.text} "
                        </p>
                      </div>

                      <div className="border-t border-slate-900 pt-3 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <span className="flex items-center gap-1 text-rose-300">
                            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                            <span>Para ti, mi Mari amada</span>
                          </span>
                          <span className="text-[10px] text-rose-350/80 animate-pulse">Te amo siempre 💗</span>
                        </div>

                        {/* WhatsApp button for this specific quote */}
                        <button
                          onClick={() => shareDirectWhatsApp(`Mari mi amor 💗 Mira lo que encontré en nuestro jardín para ti:\n\n"${selectedQuote.text}"`)}
                          className="w-full py-2 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-black" />
                          <span>Enviar este Mensaje a Mari por WhatsApp 💬💖</span>
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

              </div>
            </section>
          </>
        )}

      </main>

      {/* 📜 LUXURIOUS FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center mt-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            © 2026 Jardín de Amor para Mari 💗 • Flores eternas para la dueña de mi corazón
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="font-serif flex items-center gap-1.5 text-rose-300">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> Amando a Mari por siempre y para siempre.
            </span>
            <span>•</span>
            <button
              onClick={() => setIsWhatsAppOpen(true)}
              className="text-[#25D366] hover:underline font-mono text-xs flex items-center gap-1 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" /> Compartir en WhatsApp
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
