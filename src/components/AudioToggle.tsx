import { useBoundStore } from '../store/useBoundStore'
import { AudioEngine } from '../utils/audioManager'

export default function AudioToggle() {
  const isMuted = useBoundStore((s) => s.isAudioMuted)
  const toggleAudio = useBoundStore((s) => s.toggleAudio)

  const handleClick = () => {
    AudioEngine.init()
    AudioEngine.playTick()
    toggleAudio()
    AudioEngine.setMute(!isMuted)
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-2 py-1.5 rounded-lg hover:bg-zinc-900/50"
      aria-label={isMuted ? 'Unmute ambient audio' : 'Mute ambient audio'}
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {isMuted ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        )}
      </svg>
      {isMuted ? 'Unmute' : 'Muted'}
    </button>
  )
}
