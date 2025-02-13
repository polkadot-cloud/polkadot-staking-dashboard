// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useStaking } from 'contexts/Staking'
import { useTranslation } from 'react-i18next'

export const EasyStakeStatus = () => {
  const { t } = useTranslation('pages')
  const { isNominating } = useStaking()

  return (
    <>
      <h3>{t('easyMode.stakeHeading', 'Staking Status')}</h3>
      {isNominating() ? (
        <p>
          {t('easyMode.nominating', 'You are actively nominating validators.')}
        </p>
      ) : (
        <p>
          {t(
            'easyMode.notNominating',
            'You are currently not nominating any validators.'
          )}
        </p>
      )}
      <p>
        {t(
          'easyMode.stakeDescription',
          'View your staking details and rewards in a clear, easy to understand format.'
        )}
      </p>
    </>
  )
}
