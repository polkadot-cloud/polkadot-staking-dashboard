// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { ParaValidator } from 'library/ListItem/Labels/ParaValidator'
import { Quartile } from 'library/ListItem/Labels/Quartile'
import { Labels, Wrapper } from 'library/ListItem/Wrappers'
import { LabelRow, Separator } from 'ui-core/list'
import { useList } from '../../List/context'
import { Blocked } from '../../ListItem/Labels/Blocked'
import { Commission } from '../../ListItem/Labels/Commission'
import { CopyAddress } from '../../ListItem/Labels/CopyAddress'
import { FavoriteValidator } from '../../ListItem/Labels/FavoriteValidator'
import { Identity } from '../../ListItem/Labels/Identity'
import { Metrics } from '../../ListItem/Labels/Metrics'
import { NominationStatus } from '../../ListItem/Labels/NominationStatus'
import { Select } from '../../ListItem/Labels/Select'
import { Pulse } from './Pulse'
import { getIdentityDisplay } from './Utils'
import type { ValidatorItemProps } from './types'

export const Nomination = ({
  validator,
  nominator,
  toggleFavorites,
  bondFor,
  displayFor,
  nominationStatus,
}: ValidatorItemProps) => {
  const { selectActive } = useList()
  const { validatorIdentities, validatorSupers } = useValidators()
  const { address, prefs } = validator
  const commission = prefs?.commission ?? null

  // Whether buttons should be styled as outline.
  const outline = displayFor === 'canvas'

  return (
    <Wrapper>
      <div className={`inner ${displayFor}`}>
        <div className="row top">
          {selectActive && <Select item={validator} />}
          <Identity address={address} />
          <div>
            <Labels>
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
            </Labels>
          </div>
        </div>
        <Separator />
        <div className="row bottom lg">
          <div>
            <Pulse address={address} displayFor={displayFor} />
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
