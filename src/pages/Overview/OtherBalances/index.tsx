// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  ButtonHelp,
  ButtonPrimaryInvert,
  Separator,
} from '@polkadotcloud/core-ui';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { TokensWrapper } from 'library/Token/Wrappers';
import { useApi } from 'contexts/Api';
import { useParaSync } from 'contexts/ParaSync';
import type { AnyJson } from 'types';
import { RadicalLoaderWrapper } from 'library/Loader/Wrapper';
import { useHelp } from 'contexts/Help';
import { useModal } from 'contexts/Modal';
import { PinnedAssets } from 'config/paras';
import { MoreWrapper } from '../Wrappers';
import { TokenList } from './TokenList';

export const BalanceFooter = () => {
  const {
    network: { name },
  } = useApi();
  const { openHelp } = useHelp();
  const { openModalWith } = useModal();
  const {
    paraSyncing,
    paraBalances,
    paraForeignAssets,
    getters: { getAssetHubBalance },
  } = useParaSync();

  // Other balances are only enabled on Polkadot.
  const enabled = name === 'polkadot';

  // Get tokens
  const interlay = paraBalances?.interlay;
  const assethub = paraBalances?.assethub;

  const assetHubAssets =
    assethub?.tokens
      ?.map((t: AnyJson) => t.symbol)
      .filter((t: AnyJson) => getAssetHubBalance(t).isGreaterThan(0)) || [];

  const interlayLocalAssets =
    interlay?.tokens
      .filter((t: AnyJson) => t.key === 'Token')
      ?.map((t: AnyJson) => t.symbol) || [];

  const interlayForeignAssets =
    interlay?.tokens
      .filter((t: AnyJson) => t.key === 'ForeignAsset')
      ?.map((t: AnyJson) => paraForeignAssets.interlay[t.symbol]?.symbol)
      .filter((t: AnyJson) => !!t) || [];

  const pinnedAssetsArray: string[] = [];
  Object.entries(PinnedAssets).forEach(([, t]) => pinnedAssetsArray.push(...t));

  // Ensure no duplicate symbols are displayed.
  const uniqueAssets = [
    ...new Set(
      assetHubAssets
        .concat(interlayLocalAssets)
        .concat(interlayForeignAssets)
        .concat(pinnedAssetsArray)
    ),
  ];

  // Metadata for UI display.
  const total = uniqueAssets.length || 0;
  const remaining = Math.max(0, total - 3);

  return (
    <MoreWrapper>
      <Separator />
      <h4>
        Other Balances <ButtonHelp onClick={() => openHelp('Other Balances')} />
      </h4>
      <section>
        <TokensWrapper>
          {enabled && (
            <>
              {paraSyncing === 'synced' ? (
                <TokenList tokens={uniqueAssets.splice(0, 3)} />
              ) : (
                <div className="symbols">
                  <div className="token">
                    <RadicalLoaderWrapper className="preload" />{' '}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="text">
            {!enabled ? (
              <h3>Not Available</h3>
            ) : (
              <>
                {paraSyncing === 'synced' ? (
                  <h3
                    className={
                      total === 0
                        ? `noSymbols`
                        : remaining === 0
                        ? `empty`
                        : undefined
                    }
                  >
                    {remaining > 0 && total > 0 ? (
                      `+ ${remaining} Other${remaining === 1 ? '' : 's'}`
                    ) : total === 0 ? (
                      <>No Balances</>
                    ) : (
                      ``
                    )}
                    <span>4 Supported</span>
                  </h3>
                ) : (
                  <h3>Syncing...</h3>
                )}
              </>
            )}
          </div>
        </TokensWrapper>
        <ButtonPrimaryInvert
          lg
          text="Manage"
          iconLeft={faGlobe}
          disabled={!enabled || paraSyncing !== 'synced'}
          onClick={() => openModalWith('OtherBalances', {}, 'large')}
        />
      </section>
    </MoreWrapper>
  );
};
