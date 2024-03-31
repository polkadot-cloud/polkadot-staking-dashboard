// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useTranslation } from 'react-i18next';
import { Title } from 'library/Modal/Title';
import { ValidatorList } from 'library/ValidatorList';
import { useOverlay } from 'kits/Overlay/Provider';
import { ListWrapper } from './Wrappers';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';

export const PoolNominations = () => {
  const { t } = useTranslation('modals');
  const {
    config: { options },
  } = useOverlay().modal;
  const { nominator, targets } = options;

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
