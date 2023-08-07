// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useUi } from 'contexts/UI';
import { useDotLottieButton } from 'library/Hooks/useDotLottieButton';
import type { PrimaryProps } from '../types';
import { Wrapper } from './Wrappers';

export const Primary = ({
  name,
  active,
  to,
  action,
  minimised,
  lottie,
}: PrimaryProps) => {
  const { setSideMenu } = useUi();

  const { icon, play } = useDotLottieButton(lottie);

  let Action = null;
  const actionStatus = action?.status ?? null;

  switch (action?.type) {
    case 'text':
      Action = (
        <div className="action text">
          <span className={actionStatus || undefined}>
            {action?.text ?? ''}
          </span>
        </div>
      );
      break;
    case 'bullet':
      Action = (
        <div className={`action ${actionStatus}`}>
          <FontAwesomeIcon icon={faCircle} transform="shrink-4" />
        </div>
      );
      break;
    default:
      Action = null;
  }

  return (
    <Link
      to={to}
      onClick={() => {
        if (!active) {
          play();
          setSideMenu(false);
        }
      }}
    >
      <Wrapper
        className={`${active ? `active` : `inactive`}${
          minimised ? ` minimised` : ``
        }${action ? ` ${actionStatus}` : ``}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          duration: 0.1,
        }}
      >
        <div className={`dotlottie${minimised ? ` minimised` : ``}`}>
          {icon}
        </div>
        {!minimised && (
          <>
            <h4 className="name">{name}</h4> {Action}
          </>
        )}
      </Wrapper>
    </Link>
  );
};
