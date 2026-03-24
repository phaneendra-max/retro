import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Terminal } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'ERR_01: NEON_DRIVE', artist: 'AI_SYNTH.EXE', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '6:12' },
  { id: 2, title: 'ERR_02: CYBER_CITY', artist: 'AI_DARK.EXE', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: '7:05' },
  { id: 3, title: 'ERR_03: SUNSET_SIM', artist: 'AI_RETRO.EXE', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: '5:44' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("AUDIO.SYS_FAIL:", e));
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const handleNext = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setProgress(0); };
  const handlePrev = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setProgress(0); };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100 || 0);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (audioRef.current) audioRef.current.currentTime = (newProgress / 100) * audioRef.current.duration;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-black border-4 border-cyan-500 shadow-[8px_8px_0px_#ff00c1] p-6 flex flex-col gap-6 relative">
      <div className="absolute top-0 right-0 bg-cyan-500 text-black px-2 py-1 text-sm font-bold">AUDIO.SYS_v2.4</div>
      
      <audio ref={audioRef} src={currentTrack.url} onTimeUpdate={handleTimeUpdate} onEnded={handleNext} />

      {/* Track Info */}
      <div className="flex items-center gap-4 mt-4">
        <div className="w-20 h-20 border-2 border-fuchsia-500 bg-black flex items-center justify-center relative overflow-hidden">
          <Terminal className={`w-10 h-10 text-fuchsia-500 z-10 ${isPlaying ? 'animate-pulse' : ''}`} />
          {isPlaying && (
            <div className="absolute inset-0 flex justify-between items-end opacity-50 px-1">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-1 bg-cyan-400" style={{ height: `${Math.random() * 100}%`, animation: `pulse ${0.2 + Math.random() * 0.5}s infinite alternate` }} />
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <h3 className="text-cyan-400 font-bold text-2xl truncate uppercase glitch-text" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-fuchsia-500 text-xl uppercase tracking-widest">
            &gt; {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2">
        <input
          type="range" min="0" max="100" value={progress} onChange={handleProgressChange}
          className="w-full h-4 bg-black border-2 border-cyan-500 appearance-none cursor-pointer rounded-none"
          style={{ background: `linear-gradient(to right, #ff00c1 ${progress}%, #000 ${progress}%)` }}
        />
        <div className="flex justify-between text-lg text-cyan-400 uppercase">
          <span>[{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}]</span>
          <span>[{currentTrack.duration}]</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between border-t-2 border-dashed border-cyan-500/50 pt-4">
        <div className="flex items-center gap-2 text-fuchsia-500">
          <button onClick={() => setIsMuted(!isMuted)} className="p-2 hover:bg-fuchsia-500 hover:text-black transition-colors border-2 border-transparent hover:border-fuchsia-500">
            {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
          <input
            type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume}
            onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }}
            className="w-24 h-2 bg-black border border-fuchsia-500 appearance-none cursor-pointer rounded-none"
            style={{ background: `linear-gradient(to right, #ff00c1 ${(isMuted ? 0 : volume) * 100}%, #000 ${(isMuted ? 0 : volume) * 100}%)` }}
          />
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="p-2 text-cyan-400 border-2 border-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors">
            <SkipBack size={24} />
          </button>
          <button onClick={togglePlay} className="p-3 bg-fuchsia-500 text-black border-2 border-fuchsia-500 hover:bg-black hover:text-fuchsia-500 transition-colors">
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
          </button>
          <button onClick={handleNext} className="p-2 text-cyan-400 border-2 border-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors">
            <SkipForward size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
