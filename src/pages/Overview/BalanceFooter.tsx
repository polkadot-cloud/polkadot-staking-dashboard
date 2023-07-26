// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import {
  ButtonHelp,
  ButtonPrimaryInvert,
  Separator,
} from '@polkadotcloud/core-ui';
import { ReactComponent as IBTCSVG } from 'config/tokens/ibtc.svg';
import { ReactComponent as DOTSVG } from 'config/tokens/dot.svg';
import { ReactComponent as INTRSVG } from 'config/tokens/intr.svg';
import { ReactComponent as USDTSVG } from 'config/tokens/usdt.svg';
import { Tokens } from 'library/Tokens/Wrappers';
import { useApi } from 'contexts/Api';
import { useParaSync } from 'contexts/ParaSync';
import { MoreWrapper } from './Wrappers';

export const BalanceFooter = () => {
  const {
    network: { name },
  } = useApi();
  const { paraSyncing } = useParaSync();

  const enabled = name === 'polkadot';

  return (
    <MoreWrapper>
      <Separator />
      <h4>
        Other Balances <ButtonHelp />
      </h4>
      <section>
        <Tokens>
          {enabled && paraSyncing === 'synced' && (
            <div className="svgs">
              <div className="token">
                <USDTSVG style={{ height: '100%' }} />
              </div>
              <div className="token">
                <INTRSVG style={{ height: '100%' }} />
              </div>
              <div className="token">
                <IBTCSVG style={{ height: '100%' }} />
              </div>
              <div className="token">
                <DOTSVG style={{ height: '100%' }} />
              </div>
            </div>
          )}
          <div className="text">
            {!enabled ? (
              <h3>Not Available</h3>
            ) : (
              <>
                {paraSyncing === 'synced' ? (
                  <h3>+ 9 Others</h3>
                ) : (
                  <h3>Syncing...</h3>
                )}
              </>
            )}
          </div>
        </Tokens>
        <ButtonPrimaryInvert
          lg
          text="Manage"
          iconLeft={faGlobe}
          disabled={!enabled}
        />
      </section>
    </MoreWrapper>
  );
};
