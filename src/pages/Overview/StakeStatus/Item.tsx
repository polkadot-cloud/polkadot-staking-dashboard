// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronRight, faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonInvertRounded } from '@rossbulat/polkadot-dashboard-ui';
import { ItemProps } from './types';
import { StatusRowWrapper } from './Wrappers';

export const Item = ({ text, ctaText, onClick, leftIcon }: ItemProps) => {
  return (
    <StatusRowWrapper leftIcon={leftIcon?.show}>
      <div>
        <div className="content">
          <div className="text">
            {leftIcon ? (
              leftIcon.show ? (
                <FontAwesomeIcon
                  icon={faCircle}
                  transform="shrink-6"
                  className="bull"
                  style={{
                    opacity: leftIcon.active ? 1 : 0.1,
                    color: leftIcon.active ? 'green' : 'inherit',
                  }}
                />
              ) : null
            ) : null}
            {text}
            <span className="cta">
              {ctaText ? (
                <ButtonInvertRounded
                  text={ctaText}
                  iconRight={faChevronRight}
                  iconTransform="shrink-4"
                  lg
                  onClick={() => {
                    if (typeof onClick === 'function') onClick();
                  }}
                />
              ) : null}
            </span>
          </div>
        </div>
      </div>
    </StatusRowWrapper>
  );
};
