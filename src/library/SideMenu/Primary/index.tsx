// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUi } from 'contexts/UI';
import { useState } from 'react';
import Lottie from 'react-lottie';
import { registerSaEvent } from 'Utils';
import { Link } from 'react-router-dom';
import { useApi } from 'contexts/Api';
import { Wrapper, MinimisedWrapper } from './Wrappers';
import { PrimaryProps } from '../types';

export const Primary = (props: PrimaryProps) => {
  const { setSideMenu } = useUi();
  const { network } = useApi();

  const { name, active, to, icon, action, minimised } = props;

  const StyledWrapper = minimised ? MinimisedWrapper : Wrapper;

  let Action = null;
  const actionStatus = action?.status ?? null;

  switch (action?.type) {
    case 'text':
      Action = (
        <div className="action text">
          <span className={`${actionStatus}`}>{action?.text ?? ''}</span>
        </div>
      );
      break;
    case 'bullet':
      Action = (
        <div className={`action ${actionStatus}`}>
          <FontAwesomeIcon icon={faCircle as IconProp} transform="shrink-4" />
        </div>
      );
      break;
    default:
      Action = null;
  }

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
    <Link
      to={to}
      onClick={() => {
        if (!active) {
          setSideMenu(0);
          setIsStopped(false);
          registerSaEvent(`${network.name.toLowerCase()}_${name}_page_visit`);
        }
      }}
    >
      <StyledWrapper
        className={`${active ? `active` : `inactive`}${
          action ? ` action-${actionStatus}` : ``
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          duration: 0.1,
        }}
      >
        <div className="icon">
          {animate === undefined ? (
            icon
          ) : (
            <Lottie
              options={animateOptions}
              width={minimised ? '1.5rem' : '1.35rem'}
              height={minimised ? '1.5rem' : '1.35rem'}
              isStopped={isStopped}
              isPaused={isStopped}
              eventListeners={[
                {
                  eventName: 'loopComplete',
                  callback: () => setIsStopped(true),
                },
              ]}
            />
          )}
        </div>
        {!minimised && (
          <>
            <h4 className="name">{name}</h4> {Action}
          </>
        )}
      </StyledWrapper>
    </Link>
  );
};

export default Primary;
