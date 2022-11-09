// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonPrimary } from '@rossbulat/polkadot-dashboard-ui';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import React from 'react';
import { StatProps } from './types';
import { Wrapper } from './Wrapper';

export const Stat = (props: StatProps) => {
  const { label, stat, buttons, helpKey, icon } = props;

  return (
    <Wrapper>
      <h4>
        {label} {helpKey !== undefined && <OpenHelpIcon helpKey={helpKey} />}
      </h4>
      <h2 className="stat">
        {icon && (
          <>
            <FontAwesomeIcon icon={icon} transform="shrink-4" />
            &nbsp;
          </>
        )}
        {stat}
        {buttons && (
          <span>
            &nbsp;&nbsp;&nbsp;
            {buttons.map((btn: any, index: number) => (
              <React.Fragment key={`stat_${index}`}>
                <ButtonPrimary
                  key={`btn_${index}_${Math.random()}`}
                  text={btn.title}
                  lg={!btn.small ?? undefined}
                  iconLeft={btn.icon ?? undefined}
                  iconTransform={btn.transform ?? undefined}
                  disabled={btn.disabled ?? false}
                  onClick={() => btn.onClick()}
                />
                &nbsp;&nbsp;
              </React.Fragment>
            ))}
          </span>
        )}
      </h2>
    </Wrapper>
  );
};

export default Stat;
