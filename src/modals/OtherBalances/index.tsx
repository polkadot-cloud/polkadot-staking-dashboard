// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  ActionItem,
  ButtonPrimaryInvert,
  ButtonTertiary,
  ModalPadding,
} from '@polkadotcloud/core-ui';
import { Close } from 'library/Modal/Close';
import { Title } from 'library/Modal/Title';
import { ReactComponent as InterlaySVG } from 'config/paras/icons/interlay.svg';
import { ReactComponent as AssetHubSVG } from 'config/paras/icons/assetHub.svg';
import { useParaSync } from 'contexts/ParaSync';
import type { AnyJson } from 'types';
import { greaterThanZero, planckToUnit } from '@polkadotcloud/utils';
import { Token } from 'library/Token';
import { TokenSvgWrapper } from 'library/Token/Wrappers';
import { faRightLeft } from '@fortawesome/free-solid-svg-icons';
import {
  SectionWrapper,
  ChainWrapper,
  ChainBalanceWrapper,
  PinnedBalanceWrapper,
} from './Wrapper';

export const OtherBalances = () => {
  const {
    paraBalances,
    getters: {
      getAssetHubBalance,
      getInterlayBalance,
      getInterlaySymbol,
      getTokenUnits,
    },
  } = useParaSync();

  // Interlay assets fetched already ignore zero balances.
  const paraInterlayAssets = paraBalances?.interlay?.tokens || [];

  let paraAssetHubAssets = paraBalances?.assethub?.tokens || [];
  // Remove zero balances from `paraAssetHubAssets` native DOT.
  paraAssetHubAssets = paraAssetHubAssets.filter((a: AnyJson) =>
    greaterThanZero(getAssetHubBalance(a.symbol))
  );

  return (
    <>
      <Close />
      <ModalPadding>
        <Title
          title="Other Balances"
          helpKey="Other Balances"
          style={{ padding: '0.5rem 0 0 0' }}
        />
        <ActionItem text="Pinned Balances" />
        <SectionWrapper>
          <PinnedBalanceWrapper>
            <div>
              <span className="token">
                <Token symbol="IBTC" />
              </span>
              <h3>
                {planckToUnit(
                  getInterlayBalance('Token', 'IBTC'),
                  getTokenUnits('interlay', 'IBTC')
                ).toString()}{' '}
                <span className="symbol">IBTC</span>
              </h3>
            </div>
            <div>
              <ButtonPrimaryInvert
                iconLeft={faRightLeft}
                disabled={getInterlayBalance('Token', 'IBTC').isZero()}
                text="Swap to DOT"
              />
            </div>
          </PinnedBalanceWrapper>
        </SectionWrapper>

        <ActionItem text="Balances By Chain" />
        <SectionWrapper className="last">
          {paraAssetHubAssets.length > 0 && (
            <ChainWrapper>
              <div className="head">
                <TokenSvgWrapper className="icon">
                  <AssetHubSVG />
                </TokenSvgWrapper>
                <h3>Asset Hub</h3>
                <p>
                  <ButtonTertiary
                    text={`${paraAssetHubAssets.length} Balance${
                      paraAssetHubAssets.length === 1 ? '' : 's'
                    }`}
                  />
                </p>
              </div>
              <div className="assets">
                <div className="inner">
                  {paraAssetHubAssets.map((a: AnyJson) => (
                    <ChainBalanceWrapper key={`assethub_asset_${a.symbol}`}>
                      <span className="token">
                        <Token symbol={a.symbol} />
                      </span>
                      <h4>
                        {planckToUnit(
                          getAssetHubBalance(a.symbol),
                          getTokenUnits('assethub', a.symbol)
                        ).toString()}{' '}
                        <span className="symbol">{a.symbol}</span>
                      </h4>
                    </ChainBalanceWrapper>
                  ))}
                </div>
              </div>
            </ChainWrapper>
          )}
          {paraInterlayAssets.length > 0 && (
            <ChainWrapper>
              <div className="head">
                <TokenSvgWrapper className="icon">
                  <InterlaySVG />
                </TokenSvgWrapper>
                <h3>Interlay</h3>
                <p>
                  <ButtonTertiary
                    text={`${paraInterlayAssets.length} Balance${
                      paraInterlayAssets.length === 1 ? '' : 's'
                    }`}
                  />
                </p>
              </div>
              <div className="assets">
                <div className="inner">
                  {paraInterlayAssets.map((a: AnyJson) => (
                    <ChainBalanceWrapper key={`interlay_asset_${a.symbol}`}>
                      <span className="token">
                        <Token symbol={getInterlaySymbol(a.key, a.symbol)} />
                      </span>
                      <h4>
                        {planckToUnit(
                          getInterlayBalance(a.key, a.symbol),
                          getTokenUnits('interlay', a.symbol)
                        ).toString()}{' '}
                        <span className="symbol">
                          {getInterlaySymbol(a.key, a.symbol)}
                        </span>
                      </h4>
                    </ChainBalanceWrapper>
                  ))}
                </div>
              </div>
            </ChainWrapper>
          )}
        </SectionWrapper>
      </ModalPadding>
    </>
  );
};
