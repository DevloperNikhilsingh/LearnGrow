/**
 * components/course/VideoPlayer.jsx
 * Embedded video player using HTML5 <video> with fallback messaging
 */
import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, RotateCw } from 'lucide-react';

export default function VideoPlayer({
  src,
  poster,
  title = 'Video',
  className = '',
  onTimeUpdate,
  onSeeking,
  onError,
}) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const formatTime = (t) => {
    if (!t || isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.pause();
    else videoRef.current.play();
    setPlaying(!playing);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const goFullscreen = () => {
    if (videoRef.current?.requestFullscreen) videoRef.current.requestFullscreen();
  };

  const skipForward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration || videoRef.current.duration);
  };

  const skipBackward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
  };

  const handleTimeUpdateInternal = (e) => {
    setCurrentTime(e.target.currentTime);
    if (onTimeUpdate) onTimeUpdate(e);
  };

  const handleLoadedMetadata = (e) => {
    setDuration(e.target.duration);
  };

  if (!src) {
    return (
      <div className={`bg-navy rounded-card flex items-center justify-center aspect-video ${className}`}>
        <p className="text-white/60 text-sm">No video available</p>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-black rounded-card overflow-hidden group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls={false}
        className="w-full aspect-video object-cover"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={handleTimeUpdateInternal}
        onLoadedMetadata={handleLoadedMetadata}
        onSeeking={onSeeking}
        onError={onError}
        title={title}
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>

      {/* Controls overlay */}
      <div
        className={`absolute inset-0 flex flex-col justify-end transition-opacity duration-300
          ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

        {!playing && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center"
            aria-label="Play video"
          >
            <div className="bg-white/90 rounded-full p-4 shadow-lg hover:scale-110 transition-transform">
              <Play size={28} className="text-primary ml-1" fill="currentColor" />
            </div>
          </button>
        )}

        {/* Progress bar - visual only, no click/drag seek */}
        <div className="relative z-10 px-4">
          <div
            className="w-full h-1.5 bg-white/25 rounded-full overflow-hidden"
            style={{ pointerEvents: 'none' }}
          >
            <div
              className="h-full bg-amber transition-all"
              style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
            />
          </div>
        </div>

        {/* Bottom control bar */}
        <div className="relative z-10 flex items-center gap-3 px-4 pb-3 pt-2">
          <button
            onClick={skipBackward}
            className="text-white hover:text-amber transition-colors"
            aria-label="Rewind 10 seconds"
          >
            <RotateCcw size={18} />
          </button>

          <button
            onClick={togglePlay}
            className="text-white hover:text-amber transition-colors"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>

          <button
            onClick={skipForward}
            className="text-white hover:text-amber transition-colors"
            aria-label="Forward 10 seconds"
          >
            <RotateCw size={18} />
          </button>

          <button
            onClick={toggleMute}
            className="text-white hover:text-amber transition-colors"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <span className="text-white text-xs font-medium whitespace-nowrap">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <span className="text-white text-xs flex-1 truncate text-white/50">{title}</span>

          <button
            onClick={goFullscreen}
            className="text-white hover:text-amber transition-colors"
            aria-label="Fullscreen"
          >
            <Maximize size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}