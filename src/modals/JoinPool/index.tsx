// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { Title } from 'library/Modal/Title';
import { useTranslation } from 'react-i18next';
import { PaddingWrapper } from '../Wrappers';
import { Forms } from './Forms';

export const JoinPool = () => {
  const { t } = useTranslation('common');
  return (
    <>
      <Title title={t('modals.join_pool')} icon={faUserPlus} />
      <PaddingWrapper>
        <Forms />
      </PaddingWrapper>
    </>
  );
};
