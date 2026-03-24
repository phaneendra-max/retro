import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 flex flex-col items-center justify-center p-4 relative overflow-hidden font-digital screen-tear">
      <div className="bg-noise" />
      <div className="scanlines" />
      
      <div className="z-10 w-full max-w-6xl flex flex-col xl:flex-row gap-12 items-start justify-center">
        {/* Left Side: Music Player & Title */}
        <div className="flex flex-col gap-8 w-full xl:w-1/3 mt-8 xl:mt-0">
          <div className="text-left border-l-8 border-fuchsia-500 pl-4 bg-fuchsia-500/10 py-2">
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-2 text-cyan-400 glitch-text uppercase" data-text="SYS.OP//SNAKE">
              SYS.OP//SNAKE
            </h1>
            <p className="text-fuchsia-500 text-2xl tracking-widest uppercase glitch-text" data-text="[AUDIO_SYNC_ENGAGED]">
              [AUDIO_SYNC_ENGAGED]
            </p>
          </div>
          <MusicPlayer />
        </div>

        {/* Right Side: Game */}
        <div className="w-full xl:w-2/3 flex justify-center xl:justify-end">
          <SnakeGame />
        </div>
      </div>
    </div>
  );
}
