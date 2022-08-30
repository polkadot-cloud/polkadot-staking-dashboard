// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { useUi } from 'contexts/UI';
import { Wrapper, MinimisedWrapper } from './Wrappers';
import { PrimaryProps } from '../types';

export const Primary = (props: PrimaryProps) => {
  const { setSideMenu } = useUi();

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

  return (
    <Link to={to} onClick={() => setSideMenu(0)}>
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
        <div className="icon">{icon}</div>
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
