// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ModalPadding } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useModal } from 'contexts/Modal';
import { Title } from 'library/Modal/Title';
import { ValidatorList } from 'library/ValidatorList';
import { ListWrapper } from './Wrappers';

export const PoolNominations = () => {
  const { config } = useModal();
  const { nominator, targets } = config;
  const batchKey = 'pool_nominations';
  const { t } = useTranslation('modals');

  return (
    <>
      <Title title={t('poolNominations')} />
      <ModalPadding>
        <ListWrapper>
          {targets.length > 0 ? (
            <ValidatorList
              format="nomination"
              bondFor="pool"
              validators={targets}
              nominator={nominator}
              batchKey={batchKey}
              title={t('poolNominations')}
              showMenu={false}
              inModal
              refetchOnListUpdate
            />
          ) : (
            <h3>{t('poolIsNotNominating')}</h3>
          )}
        </ListWrapper>
      </ModalPadding>
    </>
  );
};
