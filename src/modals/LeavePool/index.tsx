// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Title } from 'library/Modal/Title';
import { useTranslation } from 'react-i18next';
import { UnbondAll } from 'modals/UpdateBond/Forms/UnbondAll';
import { PaddingWrapper } from '../Wrappers';

export const LeavePool = () => {
  const { t } = useTranslation('common');
  return (
    <>
      <Title title={t('modals.leave_pool')} icon={faSignOutAlt} />
      <PaddingWrapper>
        <UnbondAll />
      </PaddingWrapper>
    </>
  );
};
