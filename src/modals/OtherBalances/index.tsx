// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonTertiary, ModalPadding } from '@polkadotcloud/core-ui';
import { Close } from 'library/Modal/Close';
import { Title } from 'library/Modal/Title';
import { ReactComponent as InterlaySVG } from 'config/paras/icons/interlay.svg';
import { ReactComponent as AssetHubSVG } from 'config/paras/icons/assetHub.svg';
import { useParaSync } from 'contexts/ParaSync';
import { Wrapper, ItemWrapper } from './Wrapper';

export const OtherBalances = () => {
  const { paraBalances } = useParaSync();

  const paraAssetHubAssets = paraBalances?.assethub?.tokens || [];
  const paraInterlayAssets = paraBalances?.interlay?.tokens || [];

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
                <AssetHubSVG className="icon" />
                <h3>Asset Hub</h3>
                <p>
                  <ButtonTertiary
                    text={`${paraAssetHubAssets.length} Balance${
                      paraAssetHubAssets.length === 1 ? '' : 's'
                    }`}
                  />
                </p>
              </div>
            </ItemWrapper>
          )}
          {paraInterlayAssets.length > 0 && (
            <ItemWrapper>
              <div className="head">
                <InterlaySVG className="icon" />
                <h3>Interlay</h3>
                <p>
                  <ButtonTertiary
                    text={`${paraInterlayAssets.length} Balance${
                      paraInterlayAssets.length === 1 ? '' : 's'
                    }`}
                  />
                </p>
              </div>
            </ItemWrapper>
          )}
        </Wrapper>
      </ModalPadding>
    </>
  );
};
