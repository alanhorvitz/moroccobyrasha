'use client'

import { useEffect, useRef } from 'react'

export function VideoBackground() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // Add YouTube API script
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div className="relative w-full h-full">
        {/* <iframe
          ref={iframeRef}
          className="absolute w-[300%] h-[300%] -top-[100%] -left-[100%]"
          src="https://www.youtube.com/embed/nvrJhP-EX2w?autoplay=1&mute=1&enablejsapi=1&controls=0&autohide=1&wmode=opaque&loop=1&modestbranding=1&vq=hd720&rel=0&playlist=nvrJhP-EX2w&playsinline=1"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        /> */}
        {/* Overlay to prevent iframe interaction and add dimming effect */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>
    </div>
  )
} 