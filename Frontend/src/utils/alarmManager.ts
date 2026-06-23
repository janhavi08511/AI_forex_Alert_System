let audio: HTMLAudioElement | null = null;
let fallbackAudioContext: AudioContext | null = null;
let fallbackOscillator: OscillatorNode | null = null;
let fallbackGain: GainNode | null = null;

function ensureAudio() {
  if (typeof window === "undefined") return null;
  if (!audio) {
    audio = new Audio("/sounds/alarm.mp3");
    audio.loop = true;
  }
  return audio;
}

function ensureFallbackAudio() {
  if (typeof window === "undefined") return;
  if (!fallbackAudioContext) {
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    fallbackAudioContext = new AudioContextClass();
    fallbackOscillator = fallbackAudioContext.createOscillator();
    fallbackGain = fallbackAudioContext.createGain();
    fallbackOscillator.type = "sawtooth";
    fallbackOscillator.frequency.value = 880;
    fallbackGain.gain.value = 0;
    fallbackOscillator.connect(fallbackGain);
    fallbackGain.connect(fallbackAudioContext.destination);
    fallbackOscillator.start();
  }
}

export function playAlarm() {
  const alarm = ensureAudio();
  if (!alarm) return;

  alarm.currentTime = 0;
  alarm.play().catch(() => {
    ensureFallbackAudio();
    if (fallbackAudioContext && fallbackGain && fallbackOscillator) {
      if (fallbackAudioContext.state === "suspended") {
        fallbackAudioContext.resume();
      }
      fallbackGain.gain.cancelScheduledValues(fallbackAudioContext.currentTime);
      fallbackGain.gain.setValueAtTime(0.03, fallbackAudioContext.currentTime);
      fallbackGain.gain.linearRampToValueAtTime(0.03, fallbackAudioContext.currentTime + 0.1);
    }
  });
}

export function stopAlarm() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }

  if (fallbackGain && fallbackAudioContext) {
    fallbackGain.gain.cancelScheduledValues(fallbackAudioContext.currentTime);
    fallbackGain.gain.setValueAtTime(0, fallbackAudioContext.currentTime);
  }
}
