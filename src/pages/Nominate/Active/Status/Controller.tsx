// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonPrimary } from '@rossbulat/polkadot-dashboard-ui';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useNotifications } from 'contexts/Notifications';
import { NotificationText } from 'contexts/Notifications/types';
import { useStaking } from 'contexts/Staking';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { Identicon } from 'library/Identicon';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { Wrapper as StatWrapper } from 'library/Stat/Wrapper';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { applyWidthAsPadding, clipAddress } from 'Utils';
import { ControllerWrapper } from './Wrappers';

export const Controller = ({ label }: { label: string }) => {
  const { t } = useTranslation('pages');
  const { isReady } = useApi();
  const { activeAccount, isReadOnlyAccount, getAccount } = useConnect();
  const { openModalWith } = useModal();
  const { hasController } = useStaking();
  const { getBondedAccount } = useBalances();
  const controller = getBondedAccount(activeAccount);
  const { addNotification } = useNotifications();
  const { isFastUnstaking } = useUnstaking();

  let display = t('nominate.none');
  if (hasController() && controller) {
    display = clipAddress(controller);
  }

  const displayName = getAccount(controller)?.name;

  // copy address notification
  let notificationCopyAddress: NotificationText | null = null;
  if (controller !== null) {
    notificationCopyAddress = {
      title: t('nominate.addressCopied'),
      subtitle: controller,
    };
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<HTMLDivElement>(null);

  const handleAdjustLayout = () => {
    applyWidthAsPadding(subjectRef, containerRef);
  };

  useLayoutEffect(() => {
    handleAdjustLayout();
  });

  useEffect(() => {
    window.addEventListener('resize', handleAdjustLayout);
    return () => {
      window.removeEventListener('resize', handleAdjustLayout);
    };
  }, []);

  return (
    <StatWrapper>
      <h4>
        {label} <OpenHelpIcon helpKey="Stash and Controller Accounts" />
        {controller !== null ? (
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (notificationCopyAddress) {
                addNotification(notificationCopyAddress);
              }
              navigator.clipboard.writeText(controller || '');
            }}
          >
            <FontAwesomeIcon icon={faCopy as IconProp} transform="shrink-4" />
          </button>
        ) : null}
      </h4>
      <ControllerWrapper paddingLeft={hasController()} paddingRight>
        <h2 className="hide-with-padding" ref={containerRef}>
          <div className="icon">
            <Identicon value={controller || ''} size={26} />
          </div>
          {displayName || display}
          <div className="btn" ref={subjectRef}>
            <ButtonPrimary
              text={t('nominate.change')}
              iconLeft={faGear}
              disabled={
                !isReady ||
                !hasController() ||
                isReadOnlyAccount(activeAccount) ||
                isFastUnstaking
              }
              onClick={() => openModalWith('UpdateController', {}, 'large')}
            />
          </div>
        </h2>
      </ControllerWrapper>
    </StatWrapper>
  );
};
