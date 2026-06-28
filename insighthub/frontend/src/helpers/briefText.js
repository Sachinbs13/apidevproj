export function stripMarkdownForSpeech(text = '') {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\[Update \d+\]\s*/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export const SPEECH_LANG_MAP = {
  English: 'en-IN',
  Hindi: 'hi-IN',
  Kannada: 'kn-IN',
  Tamil: 'ta-IN',
  Telugu: 'te-IN',
  Malayalam: 'ml-IN',
};
