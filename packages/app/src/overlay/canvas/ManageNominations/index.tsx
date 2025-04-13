// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { PoolNominate } from 'api/tx/poolNominate'
import { StakingNominate } from 'api/tx/stakingNominate'
import { useActiveAccounts } from 'contexts/ActiveAccounts'
import { useApi } from 'contexts/Api'
import { useBonded } from 'contexts/Bonded'
import { useHelp } from 'contexts/Help'
import {
  ManageNominationsProvider,
  useManageNominations,
} from 'contexts/ManageNominations'
import { useNetwork } from 'contexts/Network'
import { useActivePool } from 'contexts/Pools/ActivePool'
import { useBondedPools } from 'contexts/Pools/BondedPools'
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic'
import { GenerateNominations } from 'library/GenerateNominations'
import { InlineControls } from 'library/GenerateNominations/Controls/InlineControls'
import { MenuControls } from 'library/GenerateNominations/Controls/MenuControls'
import { SubmitTx } from 'library/SubmitTx'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { DisplayFor, NominationSelection } from 'types'
import { ButtonHelp } from 'ui-buttons'
import {
  Footer,
  FootFullWidth,
  HeadFullWidth,
  Main,
  Title,
} from 'ui-core/canvas'
import { CloseCanvas, useOverlay } from 'ui-overlay'

export const Inner = () => {
  const { t } = useTranslation('app')
  const {
    setCanvasStatus,
    config: { options },
  } = useOverlay().canvas
  const { consts } = useApi()
  const { openHelp } = useHelp()
  const { network } = useNetwork()
  const { activePool } = useActivePool()
  const { getBondedAccount } = useBonded()
  const { activeAddress } = useActiveAccounts()
  const { updatePoolNominations } = useBondedPools()
  const { defaultNominations, nominations, setNominations, method } =
    useManageNominations()

  const { maxNominations } = consts
  const controller = getBondedAccount(activeAddress)
  const bondFor = options?.bondFor || 'nominator'
  const isPool = bondFor === 'pool'
  const signingAccount = isPool ? activeAddress : controller

  // Whether to display revert changes button
  const allowRevert = !!method

  // Canvas content and footer size
  const canvasSize = 'xl'

  // Valid to submit transaction
  const [valid, setValid] = useState<boolean>(false)

  // Handler for updating setup
  const handleSetupUpdate = (value: NominationSelection) => {
    setNominations(value.nominations)
  }

  // Check if default nominations match new ones
  const nominationsMatch = () =>
    nominations.every((n) =>
      defaultNominations.find((d) => d.address === n.address)
    ) &&
    nominations.length > 0 &&
    nominations.length === defaultNominations.length

  const getTx = () => {
    const tx = null
    if (!valid) {
      return tx
    }
    if (!isPool) {
      return new StakingNominate(
        network,
        nominations.map((nominee) => ({
          type: 'Id',
          value: nominee.address,
        }))
      ).tx()
    }
    if (isPool && activePool) {
      return new PoolNominate(
        network,
        activePool.id,
        nominations.map((nominee) => nominee.address)
      ).tx()
    }
    return tx
  }

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: signingAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setCanvasStatus('closing')
    },
    callbackInBlock: () => {
      if (isPool && activePool) {
        // Update bonded pool targets if updating pool nominations
        updatePoolNominations(
          activePool.id,
          nominations.map((n) => n.address)
        )
      }
    },
  })

  // Valid if there are between 1 and `maxNominations` nominations
  useEffect(() => {
    setValid(
      maxNominations.isGreaterThanOrEqualTo(nominations.length) &&
        nominations.length > 0 &&
        !nominationsMatch()
    )
  }, [nominations])

  // Generation component props
  const displayFor: DisplayFor = 'canvas'
  const setters = [
    {
      current: {
        callable: true,
        fn: () => nominations,
      },
      set: handleSetupUpdate,
    },
  ]

  return (
    <>
      <HeadFullWidth>
        <Title fullWidth>
          <h1>
            {t('manageNominations', { ns: 'modals' })}
            <ButtonHelp
              onClick={() => openHelp('Nominations')}
              background="none"
              outline
            />
          </h1>
        </Title>
        <CloseCanvas sm />
      </HeadFullWidth>
      {displayFor === 'canvas' && (
        <MenuControls allowRevert={allowRevert} setters={setters} />
      )}
      <Main size={canvasSize} withMenu>
        {displayFor !== 'canvas' && (
          <InlineControls
            displayFor={displayFor}
            allowRevert={allowRevert}
            setters={setters}
          />
        )}
        <GenerateNominations
          displayFor={displayFor}
          setters={setters}
          allowRevert={allowRevert}
        />
      </Main>
      <FootFullWidth>
        <Footer size={canvasSize}>
          <SubmitTx
            noMargin
            transparent
            fromController={!isPool}
            valid={valid}
            displayFor="modal"
            {...submitExtrinsic}
          />
        </Footer>
      </FootFullWidth>
    </>
  )
}

export const ManageNominations = () => {
  const {
    config: { options },
  } = useOverlay().canvas

  return (
    <ManageNominationsProvider nominations={options?.nominated || []}>
      <Inner />
    </ManageNominationsProvider>
  )
}
