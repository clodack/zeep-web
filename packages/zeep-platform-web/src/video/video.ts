import { Controller, createScope, Query } from 'rx-effects';

export type VideoController = {
  playVideo: () => void;
  stopVideo: () => void;

  stream$: Query<MediaStream | undefined>;
}

const CONTRAINS = {
  audio: true,
  video: { width: 950, height: 720 },
};

export function createVideoController(): Controller<VideoController> {
  const scope = createScope();

  const stream$ = scope.createStore<MediaStream | undefined>(undefined);
  

  function playVideo(): void {
    navigator.mediaDevices
      .getUserMedia(CONTRAINS)
      .then((mediaStream) => {
        stream$.set(mediaStream);
      })
      .catch((err) => {
        // always check for errors at the end.
        console.error(`${err.name}: ${err.message}`);
        stream$.set(undefined);
      });
  }

  function stopVideo(): void {
    stream$.get()?.getVideoTracks().forEach((track) => {
      track.stop();
    })
  }

  return {
    playVideo,
    stopVideo,

    stream$: stream$.asQuery(),

    destroy: scope.destroy,
  }
}
