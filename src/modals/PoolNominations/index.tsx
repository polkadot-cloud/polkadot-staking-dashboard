// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ModalPadding } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { Title } from 'library/Modal/Title';
import { ValidatorList } from 'library/ValidatorList';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { ListWrapper } from './Wrappers';

export const PoolNominations = () => {
  const {
    config: { options },
  } = useOverlay().modal;
  const { nominator, targets } = options;
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
              showMenu={false}
              displayFor="modal"
              allowListFormat={false}
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
