
/**
 * Rituals Module
 * Handles success celebrations and visual feedback rituals.
 * Audio removed to prevent "source not found" errors in restricted environments.
 */

declare const confetti: any;

export const triggerSuccessRitual = () => {
  if (typeof confetti !== 'undefined') {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#6366f1', '#10b981']
    });
  }
};

export const triggerCelestialRitual = () => {
  // Visual pulse logic can be added here if needed
  console.log("Celestial Ritual Triggered");
};

export const triggerWarpRitual = () => {
  console.log("Warp Ritual Triggered");
};

export const triggerMintRitual = () => {
  if (typeof confetti !== 'undefined') {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }
};
