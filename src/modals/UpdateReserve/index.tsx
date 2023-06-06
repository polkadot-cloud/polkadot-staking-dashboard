// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  ActionItem,
  ButtonHelp,
  ButtonPrimaryInvert,
  ModalPadding,
  ModalWarnings,
} from '@polkadotcloud/core-ui';
import { planckToUnit, unitToPlanck } from '@polkadotcloud/utils';
import BigNumber from 'bignumber.js';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useHelp } from 'contexts/Help';
import { useModal } from 'contexts/Modal';
import { useTransferOptions } from 'contexts/TransferOptions';
import { Warning } from 'library/Form/Warning';
import { Close } from 'library/Modal/Close';
import { WithSliderWrapper } from 'modals/ManagePool/Wrappers';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const UpdateReserve = () => {
  const { t } = useTranslation('modals');
  const { reserve, setReserve, getTransferOptions } = useTransferOptions();
  const { units } = useApi().network;
  const { activeAccount, accountHasSigner } = useConnect();
  const { getLocks, getBalance } = useBalances();
  const balance = getBalance(activeAccount);
  const { network } = useApi();
  const { setStatus } = useModal();
  const allTransferOptions = getTransferOptions(activeAccount);
  const { frozen } = balance;
  const { openHelp } = useHelp();

  // check account non-staking locks
  const locks = getLocks(activeAccount);
  const locksStaking = locks.find(({ id }) => id === 'staking');
  const lockStakingAmount = locksStaking
    ? locksStaking.amount
    : new BigNumber(0);
  // available balance data
  const fundsFree = planckToUnit(
    allTransferOptions.freeBalance.minus(frozen.minus(lockStakingAmount)),
    units
  );

  const warnings = [];
  if (fundsFree.isZero()) {
    warnings.push(<Warning text={t('reserveLimit')} />);
  }
  const ReserveUpdated = !(
    planckToUnit(reserve, units).toString() ===
    localStorage.getItem(`${network.name}_${activeAccount}_reserve`)
  );

  const ReserveFeedback = (() => {
    if (!ReserveUpdated) {
      return undefined;
    }
    return {
      text: t('updated'),
      label: 'neutral',
    };
  })();

  const sliderProps = {
    trackStyle: {
      backgroundColor: 'var(--network-color-primary)',
    },
    handleStyle: {
      backgroundColor: 'var(--background-primary)',
      borderColor: 'var(--network-color-primary)',
      opacity: 1,
    },
  };

  return (
    <>
      <Close />
      <ModalPadding>
        <h2 className="title unbounded" style={{ margin: '0.5rem' }}>
          {t('updateReserve')}
        </h2>
        {warnings.length ? (
          <ModalWarnings>
            {warnings.map((warning, index) => (
              <React.Fragment key={`warning_${index}`}>
                {warning}
              </React.Fragment>
            ))}
          </ModalWarnings>
        ) : null}
        <ActionItem
          text={t('updateReserve')}
          inlineButton={
            <ButtonHelp onClick={() => openHelp('Reserve Balance')} />
          }
        />

        <WithSliderWrapper>
          <h5 className="neutral">
            {t('reserve')}
            {ReserveFeedback && (
              <span className="neutral">{ReserveFeedback.text}</span>
            )}
          </h5>
          <div>
            <h4 className="current">
              {planckToUnit(reserve, units).toString()}{' '}
            </h4>
            <div className="slider">
              <Slider
                max={['polkadot', 'westend'].includes(network.name) ? 3 : 1}
                value={planckToUnit(reserve, units).toNumber()}
                step={0.1}
                onChange={(val) => {
                  if (typeof val === 'number') {
                    setReserve(
                      new BigNumber(unitToPlanck(val.toString(), units))
                    );
                  }
                }}
                {...sliderProps}
              />
            </div>
          </div>
          <div className="confirm">
            <ButtonPrimaryInvert
              text={t('confirm')}
              onClick={() => {
                setStatus(0);
                localStorage.setItem(
                  `${network.name}_${activeAccount}_reserve`,
                  planckToUnit(reserve, units).toString()
                );
              }}
              disabled={
                !accountHasSigner(activeAccount) ||
                planckToUnit(reserve, units).toString() ===
                  localStorage.getItem(
                    `${network.name}_${activeAccount}_reserve`
                  )
              }
            />
          </div>
        </WithSliderWrapper>
      </ModalPadding>
    </>
  );
};
