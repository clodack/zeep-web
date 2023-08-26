import { FC, useRef, useEffect } from 'react';
import styled from 'styled-components/macro';
import { useGlobalContext } from '../contexts/globalContext';
import { getPlatformModule } from 'zeep-sdk-core/src';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  z-index: 10;
  posiotion: absolute;
  top: 0;
  left: 0;

  > video {
    width: 100%;
    height: 100%;
  }
`;

export const VideoElement: FC = () => {
  const { sdk } = useGlobalContext();

  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!sdk || !ref.current) return;
    const { video } = getPlatformModule(sdk);

    video.playVideo();

    const node = ref.current;

    video.stream$.value$.subscribe((stream) => {
      node.srcObject = stream as MediaStream;
      node.load();
      node.play().catch(() => {})
    })

    return () => {
      video.stopVideo()
    }
  }, [sdk, ref]);

  return (
    <Wrapper>
      <video ref={ref}/>
    </Wrapper>
  )
}