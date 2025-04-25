// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Polkicon } from '@w3ux/react-polkicon'
import { ellipsisFn } from '@w3ux/utils'
import BigNumber from 'bignumber.js'
import { getIdentityDisplay } from 'library/List/Utils'
import { CopyAddress } from 'library/ListItem/Buttons/CopyAddress'
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { AnyJson, Identity, Validator, ValidatorPrefs } from 'types'
import { Stat } from 'ui-core/base'
import { planckToUnitBn } from 'utils'
import { AverageCommission } from '../pages/Stats/AverageCommission'
import { SelectedValidators } from '../pages/Stats/SelectedValidators'
import {
  CommissionDisplay,
  StatusDisplay,
  StepDescription,
  ValidatorActions,
  ValidatorCardHeader,
  ValidatorIdentity,
  ValidatorInfo,
  ValidatorListContainer,
} from '../pages/Wrappers'

export interface ValidatorWithPrefs {
  address: string
  prefs?: {
    commission: number
  }
}

// Define a union type for the getValidatorTotalStake function
type GetValidatorTotalStake = (address: string) => BigNumber | bigint

interface NominateValidatorsStepProps {
  selectedValidators: string[]
  setSelectedValidators: (validators: string[]) => void
  validValidators: ValidatorWithPrefs[]
  validatorIdentities: Record<string, Identity>
  validatorSupers: Record<string, AnyJson>
  getValidatorTotalStake: GetValidatorTotalStake
  stakers: Array<{ address: string }>
  units: string | number
  unit: string | number
}

export const NominateValidatorsStep: React.FC<NominateValidatorsStepProps> = ({
  selectedValidators,
  setSelectedValidators,
  validValidators,
  validatorIdentities,
  validatorSupers,
  getValidatorTotalStake,
  stakers,
  units,
  unit,
}) => {
  const { t } = useTranslation('invite')

  // Convert ValidatorWithPrefs to Validator type for AverageCommission component
  const convertToValidatorType = (
    validators: ValidatorWithPrefs[]
  ): Validator[] =>
    validators.map((v) => {
      // Create a properly typed ValidatorPrefs object
      const prefs: ValidatorPrefs = {
        commission: v.prefs?.commission ?? 0,
        blocked: false,
      }

      return {
        address: v.address,
        prefs,
      }
    })

  // Filter and convert validators for AverageCommission
  const filteredValidators = validValidators.filter((v) =>
    selectedValidators.includes(v.address)
  )
  const validatorsForCommission = convertToValidatorType(filteredValidators)

  return (
    <>
      <StepDescription>{t('validatorInviteDescription')}</StepDescription>
      <Stat.Row>
        <SelectedValidators count={selectedValidators.length} hideHelp />
        <AverageCommission validators={validatorsForCommission} hideHelp />
      </Stat.Row>

      <ValidatorListContainer>
        <div className="validator-grid">
          {validValidators.map(({ address, prefs }) => {
            const identityDisplay = getIdentityDisplay(
              validatorIdentities[address] || null,
              validatorSupers[address] || null
            )

            // Format stake and commission values
            const commissionValue = prefs?.commission ?? 0
            const commissionPercent = commissionValue.toFixed(2)

            // Get validator's total stake and format to 2 decimal places
            const totalStake = getValidatorTotalStake(address)
            const formattedStake = planckToUnitBn(
              new BigNumber(totalStake.toString()),
              typeof units === 'string' ? parseInt(units, 10) || 0 : units
            ).toFormat(2)

            // Check if validator is active
            const isActive = stakers.some((s) => s.address === address)

            return (
              <div
                key={address}
                className={`validator-item ${
                  selectedValidators.includes(address) ? 'selected' : ''
                }`}
                data-testid={`validator-card-${address}`}
                onClick={(e) => {
                  e.preventDefault()
                  const newSelection = selectedValidators.includes(address)
                    ? selectedValidators.filter((a) => a !== address)
                    : [...selectedValidators, address]
                  setSelectedValidators(newSelection)
                }}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
              >
                <ValidatorCardHeader>
                  <ValidatorIdentity>
                    <Polkicon address={address} />
                    <span className="name">
                      {identityDisplay.node || ellipsisFn(address)}
                    </span>
                  </ValidatorIdentity>
                  <ValidatorInfo>
                    <CommissionDisplay>
                      <span className="label">{t('commission')}:</span>
                      <span className="value">{commissionPercent}%</span>
                    </CommissionDisplay>
                    <StatusDisplay>
                      <span className={`status ${isActive ? 'active' : ''}`}>
                        {isActive ? t('active') : t('inactive')}
                      </span>
                      <span className="dot-amount">
                        {formattedStake} {unit}
                      </span>
                    </StatusDisplay>
                  </ValidatorInfo>
                  <ValidatorActions>
                    <CopyAddress address={address} />
                  </ValidatorActions>
                </ValidatorCardHeader>
              </div>
            )
          })}
        </div>
      </ValidatorListContainer>
    </>
  )
}
