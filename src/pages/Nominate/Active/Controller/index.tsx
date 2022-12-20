// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonPrimary } from '@rossbulat/polkadot-dashboard-ui';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useNotifications } from 'contexts/Notifications';
import { NotificationText } from 'contexts/Notifications/types';
import { useStaking } from 'contexts/Staking';
import useUnstaking from 'library/Hooks/useUnstaking';
import { Identicon } from 'library/Identicon';
import OpenHelpIcon from 'library/OpenHelpIcon';
import { Wrapper as StatWrapper } from 'library/Stat/Wrapper';
import { useTranslation } from 'react-i18next';
import { clipAddress } from 'Utils';
import { Wrapper } from './Wrapper';

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
      <Wrapper paddingLeft={hasController()} paddingRight>
        <h2 className="hide-with-padding">
          <div className="icon">
            <Identicon value={controller || ''} size={26} />
          </div>
          {displayName || display}&nbsp;
          <div className="btn">
            <ButtonPrimary
              text={t('nominate.change')}
              iconLeft={faExchangeAlt}
              disabled={
                !isReady ||
                !hasController() ||
                isReadOnlyAccount(activeAccount) ||
                isFastUnstaking
              }
              onClick={() => openModalWith('UpdateController', {}, 'large')}
              style={{ minWidth: '7.5rem' }}
            />
          </div>
        </h2>
      </Wrapper>
    </StatWrapper>
  );
};
