// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
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
import { BN } from 'bn.js';
import { PayeeStatus } from 'consts';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useFastUnstake } from 'contexts/FastUnstake';
import { useModal } from 'contexts/Modal';
import { useNetworkMetrics } from 'contexts/Network';
import { useSetup } from 'contexts/Setup';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { useValidators } from 'contexts/Validators';
import { CardWrapper } from 'library/Graphs/Wrappers';
import useUnstaking from 'library/Hooks/useUnstaking';
import Stat from 'library/Stat';
import { useTranslation } from 'react-i18next';
import { planckBnToUnit, rmCommas } from 'Utils';
import { Separator } from 'Wrappers';
import { Controller } from './Controller';

export const Status = ({ height }: { height: number }) => {
  const { t } = useTranslation();
  const { isSyncing } = useUi();
  const { openModalWith } = useModal();
  const { isReady, network } = useApi();
  const { meta, validators } = useValidators();
  const { getAccountNominations, getBondedAccount } = useBalances();
  const { metrics } = useNetworkMetrics();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { setOnNominatorSetup, getStakeSetupProgressPercent }: any = useSetup();
  const { getNominationsStatus, staking, inSetup, eraStakers } = useStaking();
  const { checking, isExposed } = useFastUnstake();
  const { getFastUnstakeText, isUnstaking, isFastUnstaking } = useUnstaking();
  const controller = getBondedAccount(activeAccount);

  const { fastUnstakeErasToCheckPerBlock } = metrics;
  const { stakers } = eraStakers;
  const { payee } = staking;
  const nominations = getAccountNominations(activeAccount);
  // get nomination status
  const nominationStatuses = getNominationsStatus();

  // get active nominations
  const activeNominees = Object.entries(nominationStatuses)
    .map(([k, v]: any) => (v === 'active' ? k : false))
    .filter((v) => v !== false);

  // check if rewards are being earned
  const stake = meta.validators_browse?.stake ?? [];
  const stakeSynced = stake.length > 0 ?? false;

  let earningRewards = false;
  if (stakeSynced) {
    for (const nominee of activeNominees) {
      const validator = validators.find((v: any) => v.address === nominee);
      if (validator) {
        const batchIndex = validators.indexOf(validator);
        const nomineeMeta = stake[batchIndex];
        const { lowestReward } = nomineeMeta;

        const validatorInEra =
          stakers.find((s: any) => s.address === nominee) || null;

        if (validatorInEra) {
          const { others } = validatorInEra;
          const stakedValue =
            others?.find((o: any) => o.who === activeAccount)?.value ?? false;
          if (stakedValue) {
            const stakedValueBase = planckBnToUnit(
              new BN(rmCommas(stakedValue)),
              network.units
            );
            if (stakedValueBase >= lowestReward) {
              earningRewards = true;
              break;
            }
          }
        }
      }
    }
  }

  const payeeStatus = PayeeStatus.find((item) => item === payee);

  const getNominationStatus = () => {
    if (inSetup() || isSyncing) {
      return t('nominate.notNominating', { ns: 'pages' });
    }
    if (!nominations.length) {
      return t('nominate.noNominationsSet', { ns: 'pages' });
    }
    if (activeNominees.length) {
      let str = t('nominate.nominatingAnd', { ns: 'pages' });
      if (earningRewards) {
        str += ` ${t('nominate.earningRewards', { ns: 'pages' })}`;
      } else {
        str += ` ${t('nominate.notEarningRewards', { ns: 'pages' })}`;
      }
      return str;
    }
    return t('nominate.waitingForActiveNominations', { ns: 'pages' });
  };

  const getPayeeStatus = () => {
    if (inSetup()) {
      return t('nominate.notAssigned', { ns: 'pages' });
    }
    if (payeeStatus) {
      return t(`payee.${payeeStatus?.toLowerCase()}`, { ns: 'base' });
    }
    return t('nominate.notAssigned', { ns: 'pages' });
  };

  let startTitle = t('nominate.startNominating', { ns: 'pages' });
  if (inSetup()) {
    const progress = getStakeSetupProgressPercent(activeAccount);
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
        stat={getNominationStatus()}
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
                  onClick: () => setOnNominatorSetup(1),
                },
              ]
        }
      />
      <Separator />
      <Stat
        label={t('nominate.rewardDestination', { ns: 'pages' })}
        helpKey="Reward Destination"
        icon={
          (payee === null
            ? faCircle
            : payee === 'Staked'
            ? faRedoAlt
            : payee === 'None'
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

export default Status;
