import { useCallback, useEffect, useRef, useState } from 'react';
import { stripMarkdownForSpeech, SPEECH_LANG_MAP } from '../helpers/briefText.js';

function pickVoice(speechLang) {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const langPrefix = speechLang.split('-')[0];
  return (
    voices.find((v) => v.lang === speechLang)
    || voices.find((v) => v.lang.startsWith(langPrefix))
    || voices.find((v) => v.default)
    || voices[0]
  );
}

export function useBriefSpeech(text, lang) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [supported] = useState(() => typeof window !== 'undefined' && 'speechSynthesis' in window);
  const startTimeRef = useRef(0);
  const durationRef = useRef(0);

  const plainText = stripMarkdownForSpeech(text);

  useEffect(() => {
    if (!supported) return undefined;

    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
  }, [supported]);

  const stop = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setProgress(0);
  }, [supported]);

  const speak = useCallback(() => {
    if (!supported || !plainText) return;

    window.speechSynthesis.cancel();

    const speechLang = SPEECH_LANG_MAP[lang] || 'en-IN';
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.lang = speechLang;
    utterance.rate = 0.95;

    const voice = pickVoice(speechLang);
    if (voice) utterance.voice = voice;

    const wordCount = plainText.split(/\s+/).filter(Boolean).length;
    durationRef.current = Math.max(8000, (wordCount / 140) * 60 * 1000);

    utterance.onstart = () => {
      setIsPlaying(true);
      startTimeRef.current = Date.now();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
      setTimeout(() => setProgress(0), 400);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    window.speechSynthesis.speak(utterance);
    window.speechSynthesis.resume();
  }, [supported, plainText, lang]);

  useEffect(() => {
    if (!isPlaying) return undefined;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      setProgress(Math.min(99, (elapsed / durationRef.current) * 100));
    }, 150);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    stop();
  }, [text, lang, stop]);

  useEffect(() => () => stop(), [stop]);

  function toggle() {
    if (isPlaying) {
      stop();
    } else {
      speak();
    }
  }

  return { isPlaying, progress, supported, toggle, stop, plainText };
}
