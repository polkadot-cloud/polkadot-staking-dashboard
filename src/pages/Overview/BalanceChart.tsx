// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { ButtonInvertRounded } from '@rossbulat/polkadot-dashboard-ui';
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
import { Separator } from 'Wrappers';
import { BalanceChartWrapper } from './Wrappers';

export const BalanceChart = () => {
  const { t } = useTranslation('pages');
  const {
    network: { units, unit },
  } = useApi();
  const prices = usePrices();
  const { services } = useUi();
  const { activeAccount } = useConnect();
  const { getAccountBalance, existentialAmount } = useBalances();
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
            <h4 className="l">
              <span className="d1" /> Nominating
            </h4>
          </section>
          <section>
            <h4 className="l">
              <span className="d2" /> In a Pool
            </h4>
          </section>
          <section>
            <h4 className="l">
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
          <div style={{ flex: 1, flexBasis: '66%' }}>
            <h4 className="l">
              Free Balance <OpenHelpIcon helpKey="Your Balance" />
            </h4>
            <div className="chart">
              <div className="d4" style={{ width: '100%' }}>
                <span>234.201 DOT</span>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, flexBasis: '24%' }}>
            <h4 className="l">
              Locked <OpenHelpIcon helpKey="Your Balance" />
            </h4>
            <div className="chart">
              <div className="d4" style={{ width: '100%' }}>
                <span>28.98 DOT</span>
              </div>
            </div>
          </div>
          <div
            style={{
              width: '10%',
              flex: 1,
              flexBasis: '10%',
              minWidth: '100px',
            }}
          >
            <h4 className="l">
              Reserved <OpenHelpIcon helpKey="Reserve Balance" />
            </h4>
            <div className="chart">
              <div className="d4" style={{ width: '100%' }}>
                <span>{`${toFixedIfNecessary(
                  planckBnToUnit(existentialAmount, units),
                  5
                )} ${unit}`}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="more">
          <Separator />
          <h4>
            More Resources <OpenHelpIcon helpKey="Reserve Balance" />
          </h4>

          <section>
            <div>
              <ButtonInvertRounded
                onClick={() =>
                  window.open(
                    `https://polkadot.subscan.io/account/${activeAccount}`,
                    '_blank'
                  )
                }
                lg
                iconRight={faExternalLinkAlt}
                iconTransform="shrink-2"
                text="Subscan"
              />
            </div>
          </section>
        </div>
      </BalanceChartWrapper>
    </>
  );
};
