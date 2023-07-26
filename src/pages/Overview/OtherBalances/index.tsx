// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import {
  ButtonHelp,
  ButtonPrimaryInvert,
  Separator,
} from '@polkadotcloud/core-ui';
import { Tokens } from 'library/Tokens/Wrappers';
import { useApi } from 'contexts/Api';
import { useParaSync } from 'contexts/ParaSync';
import { MoreWrapper } from '../Wrappers';
import { TokenSVGs } from './TokenSVGs';

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
          {enabled && paraSyncing === 'synced' && <TokenSVGs />}
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
