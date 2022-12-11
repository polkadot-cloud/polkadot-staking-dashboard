// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useUi } from 'contexts/UI';
import usePrices from 'library/Hooks/usePrices';
import OpenHelpIcon from 'library/OpenHelpIcon';
import { useTranslation } from 'react-i18next';
import {
  humanNumber,
  planckBnToUnit,
  toFixedIfNecessary,
  usdFormatter,
} from 'Utils';
import { BalanceChartWrapper } from './Wrappers';

export const BalanceChart = () => {
  const { t } = useTranslation('pages');
  const {
    network: { units, unit },
  } = useApi();
  const prices = usePrices();
  const { services } = useUi();
  const { activeAccount } = useConnect();
  const { getAccountBalance } = useBalances();
  const { getTransferOptions } = useTransferOptions();
  const balance = getAccountBalance(activeAccount);
  const allTransferOptions = getTransferOptions(activeAccount);
  const poolBondOpions = allTransferOptions.pool;
  const unlockingPools = poolBondOpions.totalUnlocking.add(
    poolBondOpions.totalUnlocked
  );
  // user's total balance
  const { free } = balance;
  const freeBase = planckBnToUnit(
    free.add(poolBondOpions.active).add(unlockingPools),
    units
  );
  // convert balance to fiat value
  const freeFiat = toFixedIfNecessary(Number(freeBase * prices.lastPrice), 2);

  return (
    <>
      <div className="head">
        <h4>
          {t('overview.balance')}
          <OpenHelpIcon helpKey="Your Balance" />
        </h4>
        <h2>
          <span className="amount">{humanNumber(freeBase)}</span>&nbsp;
          {unit}
          <span className="fiat">
            {services.includes('binance_spot') && (
              <>&nbsp;{usdFormatter.format(Number(freeFiat))}</>
            )}
          </span>
        </h2>
      </div>
      <BalanceChartWrapper>
        <div className="legend">
          <section>
            <h4>
              <span className="d1" /> Nominating
            </h4>
          </section>
          <section>
            <h4>
              <span className="d2" /> In a Pool
            </h4>
          </section>
          <section>
            <h4>
              <span className="d4" /> Not Staking
            </h4>
          </section>
        </div>
        <div className="chart main">
          <div className="d1" style={{ width: '80%' }}>
            &nbsp;
          </div>
          <div className="d2" style={{ width: '10%' }}>
            &nbsp;
          </div>
        </div>
        <div className="available">
          <div style={{ width: '60%', flex: 1, flexBasis: '66%' }}>
            <h4>
              Free Balance <OpenHelpIcon helpKey="Your Balance" />
            </h4>
            <div className="chart">
              <div className="d4" style={{ width: '100%' }}>
                <span>234.201 DOT</span>
              </div>
            </div>
          </div>
          <div style={{ width: '30%', flex: 1, flexBasis: '33%' }}>
            <h4>
              Locked <OpenHelpIcon helpKey="Your Balance" />
            </h4>
            <div className="chart">
              <div className="d4" style={{ width: '100%' }}>
                <span>28.98 DOT</span>
              </div>
            </div>
          </div>
        </div>
      </BalanceChartWrapper>
    </>
  );
};
