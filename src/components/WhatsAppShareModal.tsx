import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Share2, Copy, Check, X, Heart, Sparkles, Send, ExternalLink } from 'lucide-react';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLetterText: string;
  currentQuoteText: string;
}

export default function WhatsAppShareModal({
  isOpen,
  onClose,
  currentLetterText,
  currentQuoteText
}: WhatsAppShareModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<'garden' | 'letter' | 'quote' | 'custom'>('garden');
  const [customMessage, setCustomMessage] = useState(
    "Mari mi amor 💗 Te he dedicado un jardín de flores eternas con una rosa azul cósmica y cartas de amor que florecen solo para ti. Míralo aquí:"
  );
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const appUrl = typeof window !== 'undefined' ? window.location.href : '';

  const getActiveText = (): string => {
    switch (selectedPreset) {
      case 'garden':
        return `Mari, mi amor eterno 💗🌹\n\nTe he preparado un regalo muy especial: un jardín interactivo con rosas, girasoles, tulipanes y una rosa azul cósmica que florece al ritmo de música romántica, dedicado con todo mi corazón para ti.\n\n✨ Entra a verlo aquí:\n${appUrl}\n\nTe amo con toda mi alma, mi reina 💍✨`;
      case 'letter':
        return `Mari, mi vida 💌💗\n\nQuiero dedicarte esta carta de amor salida de lo más hondo de mi corazón:\n\n${currentLetterText.slice(0, 700)}...\n\n🌸 Lee la carta completa y mira florecer tu rosa aquí:\n${appUrl}\n\nPor siempre tuyo/a 🌹💍`;
      case 'quote':
        return `Para ti, mi hermosa Mari 💗✨:\n\n"${currentQuoteText}"\n\n🌹 Con todo mi amor eterno. Entra a nuestro jardín:\n${appUrl}`;
      case 'custom':
        return `${customMessage.trim()}\n\n🌸 Abre nuestro jardín de amor aquí:\n${appUrl}`;
    }
  };

  const handleOpenWhatsApp = () => {
    const text = getActiveText();
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = () => {
    const text = getActiveText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Jardín de Amor para Mari 💗',
        text: getActiveText(),
        url: appUrl
      }).catch(() => {
        handleOpenWhatsApp();
      });
    } else {
      handleOpenWhatsApp();
    }
  };

  const addEmojiToCustom = (emoji: string) => {
    setCustomMessage(prev => prev + ' ' + emoji);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="bg-gradient-to-b from-[#140b1e] via-[#0b0612] to-[#050208] border border-emerald-500/40 rounded-3xl p-5 sm:p-7 max-w-xl w-full shadow-[0_0_50px_rgba(16,185,129,0.2)] text-slate-100 relative my-auto overflow-hidden"
        >
          {/* Subtle green/rose ambient aura */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] shadow-[0_0_15px_rgba(37,211,102,0.3)] shrink-0">
              <MessageCircle className="w-6 h-6 fill-[#25D366]" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-black tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-300" /> WhatsApp Directo 💬
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-black text-white leading-tight">
                Compartir con Mari por WhatsApp 💗📲
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-300/80 mb-4 leading-relaxed font-sans">
            Elige qué detalle emotivo deseas enviarle a <strong>Mari</strong> por WhatsApp. Se abrirá automáticamente la app con el mensaje listo para enviar con un solo clic.
          </p>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {[
              { id: 'garden' as const, label: 'Jardín & Rosa Azul 🌌', icon: '🥀' },
              { id: 'letter' as const, label: 'Carta de Amor 💌', icon: '📜' },
              { id: 'quote' as const, label: 'Frase del Día ✨', icon: '💖' },
              { id: 'custom' as const, label: 'Personalizado ✍️', icon: '✏️' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPreset(p.id)}
                className={`px-3 py-2.5 rounded-xl border text-[11px] font-bold font-mono transition-all flex flex-col items-center gap-1 text-center cursor-pointer ${
                  selectedPreset === p.id
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white border-transparent shadow-[0_0_15px_rgba(16,185,129,0.35)] scale-102'
                    : 'bg-slate-950/80 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className="text-base">{p.icon}</span>
                <span className="leading-tight">{p.label}</span>
              </button>
            ))}
          </div>

          {/* Custom message input if 'custom' is active */}
          {selectedPreset === 'custom' && (
            <div className="mb-4 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <label className="text-[11px] font-mono text-emerald-300 font-bold block mb-1">
                Escribe tu mensaje con amor para Mari:
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full h-24 bg-[#09050e] border border-slate-800 p-2.5 rounded-xl text-xs text-slate-100 outline-none focus:border-emerald-500 leading-relaxed transition"
                placeholder="Escribe algo hermoso para Mari..."
              />
              <div className="flex flex-wrap gap-1.5 mt-2 items-center">
                <span className="text-[10px] font-mono text-slate-500">Añadir emojis:</span>
                {['💗', '🌹', '💍', '✨', '💋', '😍', '👑', '🕊️', '🧸'].map(em => (
                  <button
                    key={em}
                    onClick={() => addEmojiToCustom(em)}
                    className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs rounded-md cursor-pointer transition"
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Preview box */}
          <div className="bg-slate-950/90 border border-slate-800/80 rounded-2xl p-3.5 mb-5 max-h-36 overflow-y-auto">
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1 font-bold">
              Vista previa del mensaje a enviar:
            </span>
            <p className="text-xs text-slate-300 font-serif whitespace-pre-wrap leading-relaxed">
              {getActiveText()}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch">
            <button
              onClick={handleOpenWhatsApp}
              className="flex-1 py-3 px-5 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-sm rounded-xl transition duration-200 shadow-[0_0_20px_rgba(37,211,102,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <MessageCircle className="w-5 h-5 fill-black" />
              <span>Enviar a WhatsApp Ahora 💬</span>
            </button>

            <button
              onClick={handleCopy}
              className="py-3 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-mono text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Copiar Texto</span>
                </>
              )}
            </button>

            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
              <button
                onClick={handleNativeShare}
                className="py-3 px-4 bg-pink-950/60 hover:bg-pink-900/60 border border-pink-900/50 text-pink-200 font-mono text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                title="Compartir por otras aplicaciones"
              >
                <Share2 className="w-4 h-4 text-pink-400" />
                <span>Más</span>
              </button>
            )}
          </div>

          <div className="mt-4 text-center">
            <span className="text-[10px] font-mono text-slate-400">
              * Compatible con WhatsApp Web y la app de WhatsApp en celulares Android y iPhone.
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
