// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import {
  faBolt,
  faChevronCircleRight,
  faRedoAlt,
  faSignOutAlt,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useFastUnstake } from 'contexts/FastUnstake';
import { useModal } from 'contexts/Modal';
import { useNetworkMetrics } from 'contexts/Network';
import { useSetup } from 'contexts/Setup';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { useNominationStatus } from 'library/Hooks/useNominationStatus';
import { PayeeItem, usePayeeConfig } from 'library/Hooks/usePayeeConfig';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { Stat } from 'library/Stat';
import { useTranslation } from 'react-i18next';
import { Separator } from 'Wrappers';
import { Controller } from './Controller';

export const Status = ({ height }: { height: number }) => {
  const { t } = useTranslation();
  const { isSyncing } = useUi();
  const { openModalWith } = useModal();
  const { isReady } = useApi();
  const { getBondedAccount } = useBalances();
  const { metrics } = useNetworkMetrics();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { setOnNominatorSetup, getNominatorSetupPercent }: any = useSetup();
  const { getNominationsStatus, staking, inSetup } = useStaking();
  const { checking, isExposed } = useFastUnstake();
  const { getFastUnstakeText, isUnstaking, isFastUnstaking } = useUnstaking();
  const controller = getBondedAccount(activeAccount);
  const { getNominationStatus } = useNominationStatus();
  const { getPayeeItems } = usePayeeConfig();
  const { fastUnstakeErasToCheckPerBlock } = metrics;
  const { payee } = staking;

  // get nomination status
  const nominationStatuses = getNominationsStatus();

  // get active nominations
  const activeNominees = Object.entries(nominationStatuses)
    .map(([k, v]: any) => (v === 'active' ? k : false))
    .filter((v) => v !== false);

  const getPayeeStatus = () => {
    if (inSetup()) {
      return t('nominate.notAssigned', { ns: 'pages' });
    }
    const status = getPayeeItems(true).find(
      (p: PayeeItem) => p.value === payee.destination
    )?.activeTitle;

    if (status) {
      return status;
    }
    return t('nominate.notAssigned', { ns: 'pages' });
  };

  let startTitle = t('nominate.startNominating', { ns: 'pages' });
  if (inSetup()) {
    const progress = getNominatorSetupPercent(activeAccount);
    if (progress > 0) {
      startTitle += `: ${progress}%`;
    }
  }

  const fastUnstakeText = getFastUnstakeText();
  const regularUnstakeButton = {
    title: t('nominate.unstake', { ns: 'pages' }),
    icon: faSignOutAlt,
    disabled: !isReady || isReadOnlyAccount(controller) || !activeAccount,
    onClick: () => openModalWith('Unstake', {}, 'small'),
  };

  const fastUnstakeButton = {
    disabled: checking,
    title: fastUnstakeText,
    icon: faBolt,
    onClick: () => {
      openModalWith('ManageFastUnstake', {}, 'small');
    },
  };

  const unstakeButton =
    fastUnstakeErasToCheckPerBlock > 0 &&
    !activeNominees.length &&
    (checking || !isExposed)
      ? fastUnstakeButton
      : regularUnstakeButton;

  return (
    <CardWrapper height={height}>
      <Stat
        label={t('nominate.status', { ns: 'pages' })}
        helpKey="Nomination Status"
        stat={getNominationStatus(activeAccount, 'nominator').message}
        buttons={
          !inSetup()
            ? !isUnstaking && !isReadOnlyAccount(controller)
              ? [unstakeButton]
              : []
            : [
                {
                  title: startTitle,
                  icon: faChevronCircleRight,
                  transform: 'grow-1',
                  large: true,
                  disabled:
                    !isReady ||
                    isReadOnlyAccount(activeAccount) ||
                    !activeAccount,
                  onClick: () => setOnNominatorSetup(true),
                },
              ]
        }
      />
      <Separator />
      <Stat
        label="Payout Destination"
        helpKey="Reward Destination"
        icon={
          (payee === null
            ? faCircle
            : payee.destination === 'Staked'
            ? faRedoAlt
            : payee.destination === 'None'
            ? faCircle
            : faWallet) as IconProp
        }
        stat={getPayeeStatus()}
        buttons={
          !inSetup()
            ? [
                {
                  title: t('nominate.update', { ns: 'pages' }),
                  icon: faWallet,
                  small: true,
                  disabled:
                    inSetup() ||
                    isSyncing ||
                    isReadOnlyAccount(activeAccount) ||
                    isFastUnstaking,
                  onClick: () => openModalWith('UpdatePayee', {}, 'small'),
                },
              ]
            : []
        }
      />
      <Separator />
      <Controller label={t('nominate.controllerAccount', { ns: 'pages' })} />
    </CardWrapper>
  );
};
