import { Controller, createScope, Query } from 'rx-effects';
import { Logger } from 'zeep-common/src/logger';

export type VideoController = {
  playVideo: () => void;
  stopVideo: () => void;

  stream$: Query<MediaStream | undefined>;
}

const CONTRAINS = {
  audio: true,
  video: { width: 950, height: 720 },
};

export type VideoControllerProps = {
  logger: Logger;
}

export function createVideoController({ logger }: VideoControllerProps): Controller<VideoController> {
  const scope = createScope();

  const stream$ = scope.createStore<MediaStream | undefined>(undefined);
  

  function playVideo(): void {
    logger.info('Run play video');
    navigator.mediaDevices
      .getUserMedia(CONTRAINS)
      .then((mediaStream) => {
        stream$.set(mediaStream);
      })
      .catch((err) => {
        logger.error('Error get permichins', err);
        // always check for errors at the end.
        console.error(`${err.name}: ${err.message}`);
        stream$.set(undefined);
      });
  }

  function stopVideo(): void {
    logger.info('stop video stream');

    stream$.get()?.getVideoTracks().forEach((track) => {
      track.stop();
    })
    stream$.get()?.getAudioTracks().forEach((track) => {
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
