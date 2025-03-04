// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useStaking } from 'contexts/Staking'
import type { Validator } from 'contexts/Validators/types'
import { useValidators } from 'contexts/Validators/ValidatorEntries'
import { CardWrapper } from 'library/Card/Wrappers'
import { getIdentityDisplay } from 'library/List/Utils'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ButtonPrimary } from 'ui-buttons'
import { Page } from 'ui-core/base'
import { useOverlay } from 'ui-overlay'

export const ValidatorInvitePage = () => {
  const { address } = useParams()
  const navigate = useNavigate()
  const { openCanvas } = useOverlay().canvas
  const { activeAccount } = useActiveAccounts()
  const { isBonding } = useStaking()
  const { getValidators, validatorIdentities, validatorSupers } =
    useValidators()
  const [validatorData, setValidatorData] = useState<Validator | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (address) {
      const validators = getValidators()
      const validator = validators.find((v) => v.address === address)
      setValidatorData(validator || null)
      setLoading(false)
    }
  }, [address, getValidators])

  const handleNominate = () => {
    if (validatorData) {
      navigate(`/nominate?validator=${validatorData.address}`)
    }
  }

  if (loading) {
    return (
      <Page.Container>
        <Page.Title title="Loading Validator Invite..." />
      </Page.Container>
    )
  }

  if (!validatorData) {
    return (
      <Page.Container>
        <Page.Title title="Validator Not Found" />
        <Page.Row>
          <CardWrapper>
            <h3>This validator invite link appears to be invalid.</h3>
            <ButtonPrimary
              text="Browse Available Validators"
              onClick={() => navigate('/nominate')}
            />
          </CardWrapper>
        </Page.Row>
      </Page.Container>
    )
  }

  const identity = getIdentityDisplay(
    validatorIdentities[validatorData.address],
    validatorSupers[validatorData.address]
  ).node

  return (
    <Page.Container>
      <Page.Title title="You've Been Invited to Nominate a Validator" />
      <Page.Row>
        <CardWrapper>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2>{identity || validatorData.address}</h2>
            {isBonding() && (
              <div className="warning" style={{ marginTop: '1rem' }}>
                Note: You are already staking. Adding this validator will update
                your nominations.
              </div>
            )}
          </div>

          {activeAccount ? (
            <ButtonPrimary
              text="Nominate Validator"
              onClick={handleNominate}
              iconRight={faArrowRight}
            />
          ) : (
            <div>
              <p>Please connect your wallet to nominate this validator.</p>
              <ButtonPrimary
                text="Connect Wallet"
                onClick={() => openCanvas({ key: 'Accounts' })}
              />
            </div>
          )}
        </CardWrapper>
      </Page.Row>
    </Page.Container>
  )
}

export default ValidatorInvitePage
