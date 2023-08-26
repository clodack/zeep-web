import { Query } from 'rx-effects';

export type VideoController = {
  playVideo: () => void;
  stopVideo: () => void;

  stream$: Query<MediaStream | undefined>;
}
