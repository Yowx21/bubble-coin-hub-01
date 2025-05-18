
import { useState, useEffect, useRef } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';

const SONG_URL = 'https://audio.jukehost.co.uk/xKwFtvNv93rtoHMFDvKHTfaoTE9NQmbvtiktok.com';
const SONG_NAME = 'the cut that always bleeds';

export const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(SONG_URL);
    audio.loop = true;
    audio.volume = volume / 100;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Play audio when the page loads
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch((error) => {
      // Auto-play was prevented by browser
      console.error('Audio autoplay failed:', error);
      setIsPlaying(false);
    });

    // Cleanup on unmount
    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Update volume when slider changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Audio Control Button */}
      <motion.div
        className="bg-spdm-dark border border-spdm-green/40 rounded-full p-3 shadow-lg cursor-pointer hover:bg-spdm-gray transition-colors flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowControls(!showControls)}
      >
        <Music className="w-5 h-5 text-spdm-green" />
      </motion.div>

      {/* Expanded Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div 
            initial={{ opacity: 0, y: 10, width: 0 }}
            animate={{ opacity: 1, y: 0, width: 'auto' }}
            exit={{ opacity: 0, y: 10, width: 0 }}
            className="absolute bottom-full right-0 mb-3 bg-spdm-dark border border-spdm-green/30 rounded-lg p-4 shadow-xl"
            style={{ minWidth: '250px' }}
          >
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-spdm-green">
                  {/* Song Title with Animation */}
                  <div className="overflow-hidden w-40">
                    <motion.span 
                      className="inline-block"
                      animate={{ 
                        x: SONG_NAME.length > 15 ? [0, -100, 0] : 0 
                      }}
                      transition={{ 
                        duration: SONG_NAME.length > 15 ? 8 : 0, 
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "linear"
                      }}
                    >
                      {SONG_NAME}
                    </motion.span>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="hover:bg-spdm-green/20 p-1.5 rounded-full transition-colors"
                >
                  {isPlaying ? (
                    <VolumeX className="w-4 h-4 text-spdm-green" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-spdm-green" />
                  )}
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Volume</span>
                  <span>{volume}%</span>
                </div>
                <Slider
                  value={[volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioPlayer;
