import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Play,
  Award,
  Sparkles,
  ArrowLeft,
  Fuel,
  Info
} from 'lucide-react';
import contentData from '../data/contentData.json';

// Declare global callbacks for Window
declare global {
  interface Window {
    onFlappyVoucherWin?: (data: {
      score: number;
      voucherCode: string;
      reward: string;
      timestamp: string;
    }) => void;
    onFlappyVoucherLose?: (data: {
      score: number;
      timestamp: string;
    }) => void;
  }
}

// Configuration variables as specified in technical requirement
const WIN_SCORE = 20;
const GRAVITY = 0.35;
const JUMP_FORCE = -6.5;
const PIPE_SPEED = 2.0;
const PIPE_GAP = 165;
const VOUCHER_TEXT = "Voucher 2 lít xăng";
const BRAND_NAME = "VietinBank";
const GAME_TITLE = "Chờ vui – Chơi hay – Nhận quà liền tay";

interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  passed: boolean;
}

interface FlappyGameSectionProps {
  onReturnToMainMenu?: () => void;
}

export const FlappyGameSection: React.FC<FlappyGameSectionProps> = ({ onReturnToMainMenu }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Game state
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'WIN' | 'GAMEOVER'>('START');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [currentVoucher, setCurrentVoucher] = useState<string>('');
  const [latestVoucher, setLatestVoucher] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Audio Context Ref (lazy init for browser autoplay policy)
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Game physics variables ref
  const gameLoopRef = useRef<number | null>(null);
  const birdRef = useRef({
    x: 70,
    y: 180,
    vy: 0,
    width: 36,
    height: 26,
    rotation: 0
  });
  const pipesRef = useRef<Pipe[]>([]);
  const frameCountRef = useRef<number>(0);
  const isWonRef = useRef<boolean>(false);
  const isGameOverRef = useRef<boolean>(false);
  const scoreRef = useRef<number>(0);

  // Web Audio synth beeps
  const playSound = useCallback((type: 'jump' | 'score' | 'win' | 'hit') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'jump') {
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'score') {
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.setValueAtTime(780, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'win') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.1);
        osc.frequency.setValueAtTime(659.25, now + 0.2);
        osc.frequency.setValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'hit') {
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.15);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch {
      // Audio not supported or blocked
    }
  }, [soundEnabled]);

  // Load saved high score and latest voucher
  useEffect(() => {
    try {
      const savedHigh = localStorage.getItem('vb_flappy_high_score');
      if (savedHigh) setHighScore(parseInt(savedHigh, 10));

      const savedVoucher = localStorage.getItem('vb_flappy_latest_voucher');
      if (savedVoucher) setLatestVoucher(savedVoucher);
    } catch {
      // localStorage disabled
    }
  }, []);

  // Voucher generator: VB-XXXXXX
  const generateVoucherCode = (): string => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `VB-${randomNum}`;
  };

  // Copy voucher
  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Motivation text selector based on score
  const getMotivationText = (curScore: number): string => {
    if (curScore < 5) return contentData.gameConfig.motivations.under5;
    if (curScore < 10) return contentData.gameConfig.motivations.under10;
    if (curScore < 15) return contentData.gameConfig.motivations.under15;
    if (curScore < 20) return contentData.gameConfig.motivations.under20;
    return contentData.gameConfig.motivations.win;
  };

  // Reset Game
  const resetGame = useCallback(() => {
    birdRef.current = {
      x: 70,
      y: 180,
      vy: 0,
      width: 36,
      height: 26,
      rotation: 0
    };
    pipesRef.current = [];
    frameCountRef.current = 0;
    isWonRef.current = false;
    isGameOverRef.current = false;
    scoreRef.current = 0;
    setScore(0);
  }, []);

  // Win Game handler
  const winGame = useCallback(() => {
    if (isWonRef.current) return;
    isWonRef.current = true;
    playSound('win');

    const newCode = generateVoucherCode();
    setCurrentVoucher(newCode);
    setLatestVoucher(newCode);

    try {
      localStorage.setItem('vb_flappy_latest_voucher', newCode);
      localStorage.setItem('vb_flappy_high_score', '20');
      setHighScore(20);
    } catch {
      // ignore
    }

    setGameState('WIN');

    // Trigger Confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    // Call window callback as required
    if (typeof window.onFlappyVoucherWin === 'function') {
      window.onFlappyVoucherWin({
        score: WIN_SCORE,
        voucherCode: newCode,
        reward: VOUCHER_TEXT,
        timestamp: new Date().toISOString()
      });
    }
  }, [playSound]);

  // End Game (Lose) handler
  const endGame = useCallback((finalScore: number) => {
    if (isGameOverRef.current) return;
    isGameOverRef.current = true;
    playSound('hit');

    // Gentle vibration if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 30, 40]);
      } catch {
        // ignore
      }
    }

    try {
      const currentHigh = parseInt(localStorage.getItem('vb_flappy_high_score') || '0', 10);
      if (finalScore > currentHigh) {
        localStorage.setItem('vb_flappy_high_score', finalScore.toString());
        setHighScore(finalScore);
      }
    } catch {
      // ignore
    }

    setGameState('GAMEOVER');

    // Call window callback as required
    if (typeof window.onFlappyVoucherLose === 'function') {
      window.onFlappyVoucherLose({
        score: finalScore,
        timestamp: new Date().toISOString()
      });
    }
  }, [playSound]);

  // Jump action
  const jump = useCallback(() => {
    if (isWonRef.current || isGameOverRef.current) return;
    birdRef.current.vy = JUMP_FORCE;
    playSound('jump');
  }, [playSound]);

  // Start Game
  const startGame = useCallback(() => {
    resetGame();
    setGameState('PLAYING');
  }, [resetGame]);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // 1. Draw Background: Sky with subtle bank gradient & city clouds
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#bae6fd');
      skyGrad.addColorStop(0.7, '#e0f2fe');
      skyGrad.addColorStop(1, '#ffffff');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Clouds & VietinBank tower silhouettes in background
      ctx.fillStyle = 'rgba(0, 85, 150, 0.06)';
      ctx.fillRect(40, height - 120, 50, 80);
      ctx.fillRect(110, height - 160, 60, 120);
      ctx.fillRect(200, height - 100, 40, 60);
      ctx.fillRect(270, height - 140, 55, 100);
      ctx.fillRect(350, height - 110, 45, 70);

      // Ground
      const groundH = 40;
      ctx.fillStyle = '#005596';
      ctx.fillRect(0, height - groundH, width, groundH);
      ctx.fillStyle = '#e31b23';
      ctx.fillRect(0, height - groundH, width, 4);

      if (gameState === 'PLAYING') {
        frameCountRef.current += 1;

        // Spawn Pipes
        if (frameCountRef.current % 110 === 0) {
          const minPipeH = 40;
          const maxPipeH = height - groundH - PIPE_GAP - minPipeH;
          const topH = Math.floor(minPipeH + Math.random() * (maxPipeH - minPipeH));
          pipesRef.current.push({
            x: width,
            topHeight: topH,
            bottomY: topH + PIPE_GAP,
            passed: false
          });
        }

        // Update Bird
        const bird = birdRef.current;
        bird.vy += GRAVITY;
        bird.y += bird.vy;
        bird.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 6, bird.vy * 0.08));

        // Check ground and ceiling collision
        if (bird.y + bird.height / 2 >= height - groundH) {
          bird.y = height - groundH - bird.height / 2;
          endGame(scoreRef.current);
          return;
        }
        if (bird.y - bird.height / 2 <= 0) {
          bird.y = bird.height / 2;
          bird.vy = 0;
        }

        // Update Pipes & Collisions
        for (let i = pipesRef.current.length - 1; i >= 0; i--) {
          const p = pipesRef.current[i];
          p.x -= PIPE_SPEED;

          // Check Score
          if (!p.passed && p.x + 48 < bird.x - bird.width / 2) {
            p.passed = true;
            scoreRef.current += 1;
            setScore(scoreRef.current);
            playSound('score');

            // Check Win Condition: 20 points
            if (scoreRef.current >= WIN_SCORE) {
              winGame();
              return;
            }
          }

          // Check Collision with top pipe or bottom pipe
          const birdLeft = bird.x - bird.width / 2 + 4;
          const birdRight = bird.x + bird.width / 2 - 4;
          const birdTop = bird.y - bird.height / 2 + 4;
          const birdBottom = bird.y + bird.height / 2 - 4;
          const pipeWidth = 48;

          const collidesWithTop =
            birdRight > p.x && birdLeft < p.x + pipeWidth && birdTop < p.topHeight;
          const collidesWithBottom =
            birdRight > p.x && birdLeft < p.x + pipeWidth && birdBottom > p.bottomY;

          if (collidesWithTop || collidesWithBottom) {
            endGame(scoreRef.current);
            return;
          }

          // Remove off-screen pipes
          if (p.x + pipeWidth < -10) {
            pipesRef.current.splice(i, 1);
          }
        }
      }

      // Draw Pipes (Styled as modern bank pillars with gold trim)
      const pipeW = 48;
      pipesRef.current.forEach((p) => {
        // Top pipe
        const topGrad = ctx.createLinearGradient(p.x, 0, p.x + pipeW, 0);
        topGrad.addColorStop(0, '#005596');
        topGrad.addColorStop(0.5, '#0284c7');
        topGrad.addColorStop(1, '#004277');
        ctx.fillStyle = topGrad;
        ctx.fillRect(p.x, 0, pipeW, p.topHeight);

        // Top pipe rim cap
        ctx.fillStyle = '#f59e0b'; // Gold trim
        ctx.fillRect(p.x - 3, p.topHeight - 12, pipeW + 6, 12);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(p.x, p.topHeight - 10, pipeW, 2);

        // Bottom pipe
        const bottomH = height - groundH - p.bottomY;
        ctx.fillStyle = topGrad;
        ctx.fillRect(p.x, p.bottomY, pipeW, bottomH);

        // Bottom pipe rim cap
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(p.x - 3, p.bottomY, pipeW + 6, 12);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(p.x, p.bottomY + 2, pipeW, 2);
      });

      // Draw Bird (Bank Card Mascot with Wings)
      const bird = birdRef.current;
      ctx.save();
      ctx.translate(bird.x, bird.y);
      ctx.rotate(bird.rotation);

      // Card Body
      const cW = 34;
      const cH = 22;
      ctx.fillStyle = '#005596';
      ctx.beginPath();
      ctx.roundRect(-cW / 2, -cH / 2, cW, cH, 4);
      ctx.fill();

      // Card Chip (gold)
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-cW / 2 + 5, -cH / 2 + 5, 7, 5);

      // Card Red Stripe
      ctx.fillStyle = '#e31b23';
      ctx.fillRect(-cW / 2, cH / 2 - 4, cW, 3);

      // Flapping Wing
      const wingFlap = Math.sin(frameCountRef.current * 0.25) * 6;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-2, wingFlap, 11, 6, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Cute Mascot Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cW / 2 - 6, -4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(cW / 2 - 5, -4, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [gameState, endGame, winGame, playSound]);

  // Global key / tap listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === 'PLAYING') {
          jump();
        } else if (gameState === 'START') {
          startGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, jump, startGame]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (gameState === 'PLAYING') {
      jump();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-[#005596] text-white rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold mb-2">
            <Fuel className="w-3.5 h-3.5 text-amber-200" />
            <span>Thưởng quà tại quầy VietinBank</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {GAME_TITLE}
          </h2>
          <p className="text-white/90 text-xs sm:text-sm mt-1">
            Vượt qua 20 thử thách để nhận {VOUCHER_TEXT} trao tay trực tiếp tại quầy!
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-lg text-xs font-semibold backdrop-blur-md transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-300" /> : <VolumeX className="w-4 h-4 text-slate-300" />}
            <span>{soundEnabled ? 'Bật âm thanh' : 'Tắt âm thanh'}</span>
          </button>
          {onReturnToMainMenu && (
            <button
              onClick={onReturnToMainMenu}
              className="flex items-center gap-1 px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold shadow-xs hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Menu chính</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Game Container */}
      <div
        id="flappy-voucher-game"
        ref={containerRef}
        className="relative bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden max-w-xl mx-auto"
      >
        {/* Game Stats & Motivation Bar */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-amber-400 text-sm">
              Điểm: {score}/{WIN_SCORE}
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-xs text-blue-200 font-medium">
              {getMotivationText(score)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300 text-[11px]">Kỷ lục: {highScore}/20</span>
          </div>
        </div>

        {/* Progress Bar 0 to 20 */}
        <div className="w-full bg-slate-800 h-1.5">
          <div
            className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-150"
            style={{ width: `${Math.min(100, (score / WIN_SCORE) * 100)}%` }}
          />
        </div>

        {/* Canvas Display */}
        <div
          onPointerDown={handlePointerDown}
          className="relative w-full h-[400px] cursor-pointer touch-none select-none flex items-center justify-center bg-sky-100"
        >
          <canvas
            ref={canvasRef}
            width={480}
            height={400}
            className="w-full h-full object-cover"
          />

          {/* Screen 1: Start Screen Overlay */}
          {gameState === 'START' && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#005596] to-sky-600 flex items-center justify-center shadow-lg mb-4 animate-bounce">
                <Fuel className="w-8 h-8 text-amber-300" />
              </div>

              <h3 className="text-xl sm:text-2xl font-black mb-2 text-amber-400">
                {GAME_TITLE}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 max-w-xs mb-4">
                Vượt qua 20 thử thách để nhận voucher 2 lít xăng
              </p>

              <button
                onClick={startGame}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/30 transform active:scale-95 transition-all flex items-center gap-2 cursor-pointer mb-3"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Bắt đầu chơi</span>
              </button>

              <p className="text-[11px] text-slate-300">
                Chạm màn hình hoặc nhấn Space để bay
              </p>

              {latestVoucher && (
                <div className="mt-5 p-2.5 bg-white/10 rounded-xl border border-white/20 text-xs">
                  <span className="text-slate-400">Mã gần nhất: </span>
                  <strong className="text-amber-300 font-mono">{latestVoucher}</strong>
                </div>
              )}
            </div>
          )}

          {/* Screen 2: Win Screen Overlay */}
          {gameState === 'WIN' && (
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white">
              <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xl mb-3 animate-pulse">
                <Trophy className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl font-black text-amber-400 mb-1">
                Chúc mừng!
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mb-4 max-w-sm">
                Bạn đã vượt qua 20 thử thách và đủ điều kiện nhận {VOUCHER_TEXT}.
              </p>

              {/* Prominent Voucher Code Box */}
              <div className="w-full max-w-xs bg-gradient-to-r from-amber-400/20 to-red-500/20 border-2 border-amber-400 rounded-2xl p-4 mb-4 text-center">
                <span className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold block mb-1">
                  MÃ VOUCHER NHẬN QUÀ
                </span>
                <span className="text-3xl font-black tracking-widest font-mono text-white select-all">
                  {currentVoucher}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 mb-4 max-w-xs leading-relaxed">
                Vui lòng chụp màn hình hoặc đưa mã này cho nhân viên để nhận quà.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => copyVoucherCode(currentVoucher)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Đã sao chép!' : 'Sao chép mã'}</span>
                </button>
                <button
                  onClick={startGame}
                  className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi lại</span>
                </button>
              </div>
            </div>
          )}

          {/* Screen 3: Game Over Overlay */}
          {gameState === 'GAMEOVER' && (
            <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white">
              <div className="w-14 h-14 rounded-full bg-rose-600/30 border border-rose-500 text-rose-400 flex items-center justify-center mb-3">
                <Award className="w-7 h-7" />
              </div>

              <h3 className="text-xl font-bold text-white mb-1">
                Rất tiếc, bạn đã vượt qua {score}/20 thử thách
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xs mb-6">
                Chỉ còn một chút nữa thôi, hãy thử lại nhé!
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-[#005596] hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi lại</span>
                </button>
                {onReturnToMainMenu && (
                  <button
                    onClick={onReturnToMainMenu}
                    className="px-5 py-3 bg-white/10 hover:bg-white/20 text-slate-200 font-medium text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Về màn hình chính
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Game Tips and Verification */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Mẹo: Nhấn nhẹ tay, giữ nhịp đều đặn để thẻ bay qua giữa các cột mốc.</span>
          </div>
          {latestVoucher && (
            <div className="text-[11px] text-slate-500 font-medium shrink-0">
              Mã quà gần nhất: <strong className="text-blue-700 font-mono">{latestVoucher}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
