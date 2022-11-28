// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import {
  faChevronCircleRight,
  faRedoAlt,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';
import { BN } from 'bn.js';
import { PayeeStatus } from 'consts';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { useValidators } from 'contexts/Validators';
import { CardWrapper } from 'library/Graphs/Wrappers';
import Stat from 'library/Stat';
import { useTranslation } from 'react-i18next';
import { planckBnToUnit, rmCommas } from 'Utils';
import { Separator } from 'Wrappers';
import { Controller } from './Controller';

export const Status = ({ height }: { height: number }) => {
  const { isReady, network } = useApi();
  const { setOnNominatorSetup, getStakeSetupProgressPercent }: any = useUi();
  const { openModalWith } = useModal();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { isSyncing } = useUi();
  const { getNominationsStatus, staking, inSetup, eraStakers } = useStaking();
  const { getAccountNominations } = useBalances();
  const { stakers } = eraStakers;
  const { payee } = staking;
  const { meta, validators } = useValidators();
  const nominations = getAccountNominations(activeAccount);
  const { t } = useTranslation();

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

  const payeeStatus = PayeeStatus.find((item) => item.key === payee);
  const name = payeeStatus?.name;

  let startTitle = t('nominate.start_nominating', { ns: 'pages' });
  if (inSetup()) {
    const progress = getStakeSetupProgressPercent(activeAccount);
    if (progress > 0) {
      startTitle += `: ${progress}%`;
    }
  }
  return (
    <CardWrapper height={height}>
      <Stat
        label={t('nominate.status', { ns: 'pages' })}
        helpKey="Nomination Status"
        stat={
          inSetup() || isSyncing
            ? t('nominate.not_nominating', { ns: 'pages' })
            : !nominations.length
            ? t('nominate.no_nominations_set', { ns: 'pages' })
            : activeNominees.length
            ? `${t('nominate.nominating_and', { ns: 'pages' })} ${
                earningRewards
                  ? t('nominate.earning_rewards', { ns: 'pages' })
                  : t('nominate.not_earning_rewards', { ns: 'pages' })
              }`
            : t('nominate.waiting_for_active_nominations', { ns: 'pages' })
        }
        buttons={
          !inSetup()
            ? []
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
        label={t('nominate.reward_destination', { ns: 'pages' })}
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
        stat={
          inSetup()
            ? t('nominate.not_assigned', { ns: 'pages' })
            : t(`${name}`, { ns: 'base' }) ??
              t('nominate.not_assigned', { ns: 'pages' })
        }
        buttons={
          !inSetup()
            ? [
                {
                  title: t('nominate.update', { ns: 'pages' }),
                  icon: faWallet,
                  small: true,
                  disabled:
                    inSetup() || isSyncing || isReadOnlyAccount(activeAccount),
                  onClick: () => openModalWith('UpdatePayee', {}, 'small'),
                },
              ]
            : []
        }
      />
      <Separator />
      <Controller label={t('nominate.controller_account', { ns: 'pages' })} />
    </CardWrapper>
  );
};

export default Status;
