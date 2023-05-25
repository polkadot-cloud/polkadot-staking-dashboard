// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  ButtonHelp,
  ButtonMonoInvert,
  ButtonPrimaryInvert,
} from '@polkadotcloud/core-ui';
import { useHelp } from 'contexts/Help';
import { useModal } from 'contexts/Modal';
import { useTranslation } from 'react-i18next';
import { StatusBarWrapper } from './Wrappers';
import type { StatusBarProps } from './types';

export const StatusBar = ({
  StatusBarIcon,
  text,
  helpKey,
  inProgress,
  handleCancel,
}: StatusBarProps) => {
  const { t } = useTranslation('library');
  const { openHelp } = useHelp();
  const { replaceModalWith } = useModal();

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
              {helpKey ? (
                <ButtonHelp
                  marginLeft
                  onClick={() => openHelp(helpKey)}
                  backgroundSecondary
                />
              ) : null}
            </h3>
          </div>
        </div>
        <div>
          {inProgress ? (
            <ButtonMonoInvert
              text={t('cancel')}
              onClick={() =>
                typeof handleCancel === 'function' && handleCancel()
              }
            />
          ) : (
            <ButtonPrimaryInvert
              text={t('done')}
              onClick={() => {
                replaceModalWith('Connect', { disableScroll: true }, 'large');
              }}
            />
          )}
        </div>
      </div>
    </StatusBarWrapper>
  );
};
