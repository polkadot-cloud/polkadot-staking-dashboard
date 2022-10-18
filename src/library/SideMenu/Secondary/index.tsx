// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import Lottie from 'react-lottie';

import { SecondaryProps } from '../types';
import { IconWrapper, MinimisedWrapper, Wrapper } from './Wrappers';

export const Secondary = (props: SecondaryProps) => {
  const { action, name, icon, minimised, onClick, borderColor } = props;
  const { Svg, size } = icon || {};

  const StyledWrapper = minimised ? MinimisedWrapper : Wrapper;

  // animate icon config
  const { animate } = props;
  const [isStopped, setIsStopped] = useState(true);

  const animateOptions = {
    loop: true,
    autoplay: false,
    animationData: animate,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <StyledWrapper
      onClick={() => {
        onClick();
        setIsStopped(false);
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.1,
      }}
      style={{
        borderColor: minimised ? borderColor || undefined : undefined,
      }}
    >
      {animate === undefined ? (
        <IconWrapper
          minimised={minimised}
          className="icon"
          style={{ width: size, height: size }}
        >
          {Svg && <Svg width={size} height={size} />}
        </IconWrapper>
      ) : (
        <IconWrapper minimised={minimised}>
          <Lottie
            options={animateOptions}
            width={minimised ? '1.6rem' : '1.35rem'}
            height={minimised ? '1.6rem' : '1.35rem'}
            isStopped={isStopped}
            isPaused={isStopped}
            eventListeners={[
              {
                eventName: 'loopComplete',
                callback: () => setIsStopped(true),
              },
            ]}
          />
        </IconWrapper>
      )}
      {!minimised && (
        <>
          <div className="name">{name}</div>
          {action && <div className="action">{action}</div>}
        </>
      )}
    </StyledWrapper>
  );
};

export default Secondary;
