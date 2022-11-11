// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useModal } from 'contexts/Modal';
import { Title } from 'library/Modal/Title';
import { ValidatorList } from 'library/ValidatorList';
import { useTranslation } from 'react-i18next';
import { PaddingWrapper } from '../Wrappers';
import { ListWrapper } from './Wrappers';

export const PoolNominations = () => {
  const { config } = useModal();
  const { nominator, targets } = config;
  const batchKey = 'pool_nominations';
  const { t } = useTranslation('common');

  return (
    <>
      <Title title={t('modals.pool_nominations')} />
      <PaddingWrapper>
        <ListWrapper>
          {targets.length > 0 ? (
            <ValidatorList
              bondType="pool"
              validators={targets}
              nominator={nominator}
              batchKey={batchKey}
              title={t('modals.pool_nominations')}
              showMenu={false}
              inModal
              refetchOnListUpdate
            />
          ) : (
            <h3>{t('modals.pool_is_not_nominating')}</h3>
          )}
        </ListWrapper>
      </PaddingWrapper>
    </>
  );
};

export default PoolNominations;
