import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Skull, Trophy, Power } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 80;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setHasStarted(true);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) {
        if (e.key === 'Enter') resetGame();
        return;
      }

      if (!hasStarted && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        setHasStarted(true);
      }

      if (e.key === ' ' || e.key === 'Escape') {
        setIsPaused((prev) => !prev);
        return;
      }

      const { x, y } = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, hasStarted]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            if (newScore > highScore) setHighScore(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(30, INITIAL_SPEED - Math.floor(score / 50) * 5);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, isPaused, hasStarted, score, highScore, generateFood]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-6 bg-black border-4 border-fuchsia-500 shadow-[8px_8px_0px_#00fff9] relative">
      <div className="absolute top-0 left-0 bg-fuchsia-500 text-black px-2 py-1 text-sm font-bold">BIOMASS_COLLECTOR.EXE</div>
      
      {/* Header / Scoreboard */}
      <div className="flex justify-between w-full mb-6 px-2 mt-6">
        <div className="flex flex-col border-l-4 border-cyan-400 pl-2">
          <span className="text-cyan-400 text-lg uppercase tracking-widest">DATA_YIELD</span>
          <span 
            className="text-6xl text-white glitch-text"
            data-text={score.toString().padStart(4, '0')}
          >
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end border-r-4 border-fuchsia-500 pr-2">
          <span className="text-fuchsia-500 text-lg uppercase tracking-widest">MAX_YIELD</span>
          <span 
            className="text-6xl text-white glitch-text"
            data-text={highScore.toString().padStart(4, '0')}
          >
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board */}
      <div 
        className="relative bg-[#050505] border-2 border-cyan-500 overflow-hidden"
        style={{
          width: '100%',
          maxWidth: '500px',
          aspectRatio: '1 / 1',
        }}
      >
        {/* Grid lines */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, #00fff9 1px, transparent 1px), linear-gradient(to bottom, #00fff9 1px, transparent 1px)',
            backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          const trailPercent = index / snake.length;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${
                isHead 
                  ? 'bg-fuchsia-500 z-10' 
                  : 'bg-cyan-400'
              }`}
              style={{
                left: `${(segment.x / GRID_SIZE) * 100}%`,
                top: `${(segment.y / GRID_SIZE) * 100}%`,
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                transform: `scale(${isHead ? 1 : Math.max(0.4, 1 - trailPercent * 0.5)})`,
                opacity: isHead ? 1 : Math.max(0.2, 1 - trailPercent),
                boxShadow: isHead ? '0 0 10px #ff00c1' : 'none',
              }}
            />
          );
        })}

        {/* Food */}
        <div
          className="absolute bg-yellow-400 shadow-[0_0_15px_#eab308] animate-pulse"
          style={{
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            transform: 'scale(0.8)',
          }}
        />

        {/* Overlays */}
        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center border-2 border-cyan-400 p-6 bg-black shadow-[4px_4px_0px_#ff00c1]">
              <p className="text-cyan-400 text-3xl mb-2 animate-pulse glitch-text" data-text="AWAITING_INPUT">AWAITING_INPUT</p>
              <p className="text-fuchsia-500 text-xl">[PRESS ARROW KEYS]</p>
            </div>
          </div>
        )}

        {isPaused && hasStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="border-2 border-yellow-400 p-6 bg-black">
              <p className="text-yellow-400 text-4xl tracking-widest animate-pulse glitch-text" data-text="SYSTEM_PAUSED">SYSTEM_PAUSED</p>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 gap-6">
            <div className="flex flex-col items-center border-b-4 border-red-500 pb-4 w-full">
              <Skull className="w-24 h-24 text-red-500 animate-pulse mb-4" />
              <p className="text-red-500 text-5xl tracking-widest glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</p>
            </div>
            
            <div className="flex items-center gap-4 bg-black px-8 py-4 border-2 border-fuchsia-500">
              <Trophy className="w-10 h-10 text-fuchsia-500" />
              <span className="text-white text-5xl">{score}</span>
            </div>

            <button
              onClick={resetGame}
              className="group flex items-center gap-3 px-8 py-4 bg-black border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors shadow-[4px_4px_0px_#ff00c1] hover:shadow-[6px_6px_0px_#ff00c1]"
            >
              <Power className="w-8 h-8 group-hover:animate-pulse" />
              <span className="text-3xl tracking-wider">EXECUTE_REBOOT</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Controls Hint */}
      <div className="mt-6 flex gap-6 text-lg text-cyan-400 uppercase">
        <span className="flex items-center gap-2">
          <span className="bg-cyan-400 text-black px-2 py-1 font-bold">WASD/ARROWS</span> 
          <span>DIRECT_UNIT</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="bg-fuchsia-500 text-black px-2 py-1 font-bold">SPACE</span> 
          <span>HALT_PROCESS</span>
        </span>
      </div>
    </div>
  );
}
