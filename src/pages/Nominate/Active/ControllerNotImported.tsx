// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ButtonPrimary } from '@rossbulat/polkadot-dashboard-ui';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useSetup } from 'contexts/Setup';
import { useStaking } from 'contexts/Staking';
import { useTheme } from 'contexts/Themes';
import { CardHeaderWrapper, CardWrapper } from 'library/Graphs/Wrappers';
import { useTranslation } from 'react-i18next';
import { defaultThemes } from 'theme/default';
import { PageRowWrapper } from 'Wrappers';

export const ControllerNotImported = () => {
  const { openModalWith } = useModal();
  const { isSyncing } = useSetup();
  const { mode } = useTheme();
  const { getControllerNotImported } = useStaking();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { getBondedAccount } = useBalances();
  const controller = getBondedAccount(activeAccount);
  const { t } = useTranslation('pages');

  return (
    <>
      {getControllerNotImported(controller) &&
        !isSyncing &&
        !isReadOnlyAccount(activeAccount) && (
          <PageRowWrapper className="page-padding" noVerticalSpacer>
            <CardWrapper
              style={{
                border: `1px solid ${defaultThemes.status.warning.transparent[mode]}`,
              }}
            >
              <CardHeaderWrapper>
                <h4>{t('nominate.controllerNotImported')}</h4>
              </CardHeaderWrapper>
              <ButtonPrimary
                text={t('nominate.setNewController')}
                onClick={() => openModalWith('UpdateController', {}, 'large')}
              />
            </CardWrapper>
          </PageRowWrapper>
        )}
    </>
  );
};
