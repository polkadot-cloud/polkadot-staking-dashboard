// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  ButtonHelp,
  ButtonMonoInvert,
  ButtonPrimaryInvert,
} from '@polkadotcloud/core-ui';
import { StatusBarWrapper } from './Wrappers';
import type { StatusBarProps } from './types';

export const StatusBar = ({
  StatusBarIcon,
  text,
  help,
  inProgress,
  handleCancel,
  handleDone,
  t: { tDone, tCancel },
}: StatusBarProps) => {
  const { helpKey, handleHelp } = help || {};

  return (
    <StatusBarWrapper
      initial="hidden"
      animate="show"
      variants={{
        hidden: { bottom: -50 },
        show: {
          bottom: 0,
          transition: {
            staggerChildren: 0.01,
          },
        },
      }}
      transition={{
        duration: 2,
        type: 'spring',
        bounce: 0.4,
      }}
    >
      <div className="inner">
        <div>
          <StatusBarIcon width="24" height="24" className="icon" />
          <div className="text">
            <h3>
              {text}
              {helpKey && (
                <ButtonHelp
                  marginLeft
                  onClick={() => {
                    if (typeof handleHelp === 'function') {
                      handleHelp(helpKey);
                    }
                  }}
                  backgroundSecondary
                />
              )}
            </h3>
          </div>
        </div>
        <div>
          {inProgress ? (
            <ButtonMonoInvert
              text={tCancel}
              onClick={() =>
                typeof handleCancel === 'function' && handleCancel()
              }
            />
          ) : (
            <ButtonPrimaryInvert
              text={tDone}
              onClick={() => {
                if (typeof handleDone === 'function') {
                  handleDone();
                }
              }}
            />
          )}
        </div>
      </div>
    </StatusBarWrapper>
  );
};
