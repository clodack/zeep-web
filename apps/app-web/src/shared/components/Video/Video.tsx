import { FC, useRef, useEffect, useState } from 'react';
import styled from 'styled-components/macro';
import { getPlatformModule } from 'zeep-sdk-core/src';
import { backgroundPrimary } from '@salutejs/plasma-tokens-b2c';
import { handleEvent } from 'zeep-common/src/query';

import { useGlobalContext } from '../../contexts/globalContext';

import { Actions } from './Actions';

const Wrapper = styled.div<{
  'data-visible'?: boolean;
}>`
  height: 100%;
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  background: ${backgroundPrimary};
  display: flex;
  justify-content: center;
  align-items: center;
  display: none;

  &[data-visible] {
    display: block;
  }

  > video {
    height: 100%;
    point-events: none;
    min-width: 100%;
    object-fit: contain;
    transform: scaleX(-1);
  }
`;

export const VideoElement: FC = () => {
  const { sdk, event$ } = useGlobalContext();

  const ref = useRef<HTMLVideoElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = handleEvent(event$, 'toggleCamera', ({ payload }) => {
      setIsOpen(payload.isOpen);
    });

    return () => {
      unsubscribe();
    }
  }, [event$]);


  useEffect(() => {
    if (!sdk || !ref.current) return;
    const { video } = getPlatformModule(sdk);

    if (isOpen) {
      video.playVideo();

      const node = ref.current;

      video.stream$.value$.subscribe((stream) => {
        node.srcObject = stream as MediaStream;
        node.load();
        node.play().catch(() => {})
      })
    } else {
      video.stopVideo();
    }

    return () => {
      video.stopVideo();
    }
  }, [sdk, ref, isOpen]);

  return (
    <Wrapper data-visible={isOpen || undefined}>
      <video ref={ref}/>
      <Actions />
    </Wrapper>
  );
}
