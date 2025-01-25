// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { getIdentityDisplay } from 'library/List/Utils'
import { ParaValidator } from 'library/ListItem/Labels/ParaValidator'
import { Quartile } from 'library/ListItem/Labels/Quartile'
import { Wrapper } from 'library/ListItem/Wrappers'
import { HeaderButtonRow, LabelRow, Separator } from 'ui-core/list'
import { EraPoints } from '../List/EraPoints'
import { Blocked } from '../ListItem/Labels/Blocked'
import { Commission } from '../ListItem/Labels/Commission'
import { CopyAddress } from '../ListItem/Labels/CopyAddress'
import { FavoriteValidator } from '../ListItem/Labels/FavoriteValidator'
import { Identity } from '../ListItem/Labels/Identity'
import { Metrics } from '../ListItem/Labels/Metrics'
import { NominationStatus } from '../ListItem/Labels/NominationStatus'
import type { ItemProps } from './types'

export const Item = ({
  validator,
  nominator,
  toggleFavorites,
  bondFor,
  displayFor,
  nominationStatus,
  eraPoints,
}: ItemProps) => {
  const { validatorIdentities, validatorSupers } = useValidators()
  const { address, prefs } = validator
  const commission = prefs?.commission ?? null

  // Whether buttons should be styled as outline.
  const outline = displayFor === 'canvas'

  return (
    <Wrapper>
      <div className={`inner ${displayFor}`}>
        <div className="row top">
          <Identity address={address} />
          <div>
            <HeaderButtonRow>
              <CopyAddress address={address} outline={outline} />
              {toggleFavorites && (
                <FavoriteValidator address={address} outline={outline} />
              )}
              {displayFor !== 'canvas' && (
                <Metrics
                  address={address}
                  display={getIdentityDisplay(
                    validatorIdentities[address],
                    validatorSupers[address]
                  )}
                  outline={outline}
                />
              )}
            </HeaderButtonRow>
          </div>
        </div>
        <Separator />
        <div className="row bottom lg">
          <div>
            <EraPoints
              address={address}
              displayFor={displayFor}
              eraPoints={eraPoints}
            />
          </div>
          <div>
            <LabelRow inline>
              <Quartile address={address} />
              <Blocked prefs={prefs} />
              <Commission commission={commission} />
              <ParaValidator address={address} />
            </LabelRow>
            <NominationStatus
              address={address}
              bondFor={bondFor}
              nominator={nominator}
              status={nominationStatus}
              noMargin
            />
          </div>
        </div>
      </div>
    </Wrapper>
  )
}
