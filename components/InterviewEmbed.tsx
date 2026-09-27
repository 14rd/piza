'use client';

import { useState } from 'react';

type Props = {
  id: string;
  title: string;
  poster: string;
};

/**
 * A poster with a play control; the YouTube player is only loaded once the
 * viewer asks for it. Keeps the third-party script off the page until then.
 */
export default function InterviewEmbed({ id, title, poster }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="pz-video">
      {playing ? (
        <iframe
          className="pz-video-frame"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="pz-video-poster"
          onClick={() => setPlaying(true)}
          aria-label={`Play: ${title}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={poster} alt="" width={1280} height={720} />
          <span className="pz-video-play" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
