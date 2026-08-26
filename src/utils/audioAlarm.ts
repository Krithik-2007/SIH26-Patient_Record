// Synthesizes a medical chime alarm using Web Audio API
export const playMedicationAlarmSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Pleasant 4-note ascending chord chime: C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz), C6 (1046.50Hz)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    const duration = 0.14;

    // First sequence
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * duration);
      
      gain.gain.setValueAtTime(0.35, ctx.currentTime + idx * duration);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (idx + 1) * duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + idx * duration);
      osc.stop(ctx.currentTime + (idx + 1) * duration);
    });

    // Echo repeat sequence 0.7s later
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + 0.7 + idx * duration);
      
      gain.gain.setValueAtTime(0.35, ctx.currentTime + 0.7 + idx * duration);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7 + (idx + 1) * duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + 0.7 + idx * duration);
      osc.stop(ctx.currentTime + 0.7 + (idx + 1) * duration);
    });
  } catch (e) {
    console.error('Audio alarm playback error:', e);
  }
};
