/**
 * components/course/VideoPlayer.jsx
 * Embedded video player using HTML5 <video> with fallback messaging
 */
import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

export default function VideoPlayer({ src, poster, title = 'Video', className = '' }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

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
        className="w-full aspect-video object-cover"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
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
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

        {/* Play button (centre) */}
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

        {/* Bottom control bar */}
        <div className="relative z-10 flex items-center gap-3 px-4 pb-3 pt-6">
          <button
            onClick={togglePlay}
            className="text-white hover:text-amber transition-colors"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>

          <button
            onClick={toggleMute}
            className="text-white hover:text-amber transition-colors"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <span className="text-white text-xs flex-1 truncate">{title}</span>

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
