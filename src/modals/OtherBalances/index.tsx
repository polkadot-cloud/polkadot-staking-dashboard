// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonTertiary, ModalPadding } from '@polkadotcloud/core-ui';
import { Close } from 'library/Modal/Close';
import { Title } from 'library/Modal/Title';
import { ReactComponent as InterlaySVG } from 'config/paras/icons/interlay.svg';
import { ReactComponent as AssetHubSVG } from 'config/paras/icons/assetHub.svg';
import { useParaSync } from 'contexts/ParaSync';
import type { AnyJson } from 'types';
import { getParaMeta } from 'config/paras';
import { greaterThanZero, planckToUnit } from '@polkadotcloud/utils';
import { Token } from 'library/Token';
import { TokenSvgWrapper } from 'library/Token/Wrappers';
import { Wrapper, ItemWrapper, BalanceWrapper } from './Wrapper';

export const OtherBalances = () => {
  const {
    paraBalances,
    getters: { getAssetHubBalance, getInterlayBalance, getInterlaySymbol },
  } = useParaSync();

  const assetHubMeta = getParaMeta('assethub');
  const interlayMeta = getParaMeta('assethub');

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
        <Wrapper>
          {paraAssetHubAssets.length > 0 && (
            <ItemWrapper>
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
                    <BalanceWrapper key={`interlay_asset_${a.symbol}`}>
                      <span className="token">
                        <Token symbol={a.symbol} />
                      </span>
                      <h4>
                        {planckToUnit(
                          getAssetHubBalance(a.symbol),
                          assetHubMeta.units
                        ).toString()}{' '}
                        <span className="symbol">{a.symbol}</span>
                      </h4>
                    </BalanceWrapper>
                  ))}
                </div>
              </div>
            </ItemWrapper>
          )}
          {paraInterlayAssets.length > 0 && (
            <ItemWrapper>
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
                    <BalanceWrapper key={`interlay_asset_${a.symbol}`}>
                      <span className="token">
                        <Token symbol={getInterlaySymbol(a.key, a.symbol)} />
                      </span>
                      <h4>
                        {planckToUnit(
                          getInterlayBalance(a.key, a.symbol),
                          interlayMeta.units
                        ).toString()}{' '}
                        <span className="symbol">
                          {getInterlaySymbol(a.key, a.symbol)}
                        </span>
                      </h4>
                    </BalanceWrapper>
                  ))}
                </div>
              </div>
            </ItemWrapper>
          )}
        </Wrapper>
      </ModalPadding>
    </>
  );
};
