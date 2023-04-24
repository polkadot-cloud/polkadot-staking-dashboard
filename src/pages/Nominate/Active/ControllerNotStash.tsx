// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faCircleArrowRight,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { stringUpperFirst } from '@polkadot/util';
import { ButtonPrimary, PageRow } from '@polkadotcloud/core-ui';
import { useBalances } from 'contexts/Accounts/Balances';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { CardHeaderWrapper, CardWrapper } from 'library/Graphs/Wrappers';
import { useTranslation } from 'react-i18next';

export const ControllerNotStash = () => {
  const { t } = useTranslation('pages');
  const { network } = useApi();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { addressDifferentToStash } = useStaking();
  const { getBondedAccount } = useBalances();
  const { openModalWith } = useModal();
  const { isSyncing } = useUi();
  const controller = getBondedAccount(activeAccount);

  return (
    <>
      {addressDifferentToStash(controller)
        ? !isSyncing &&
          !isReadOnlyAccount(activeAccount) && (
            <PageRow>
              <CardWrapper warning>
                <CardHeaderWrapper>
                  <h3>
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    &nbsp; {t('nominate.controllerAccountsDeprecated')}
                  </h3>
                  <h4>
                    {t('nominate.proxyprompt')} {stringUpperFirst(network.name)}
                    .
                  </h4>
                </CardHeaderWrapper>
                <div>
                  <ButtonPrimary
                    text={t('nominate.updateToStash')}
                    iconLeft={faCircleArrowRight}
                    onClick={() =>
                      openModalWith('UpdateController', {}, 'large')
                    }
                  />
                </div>
              </CardWrapper>
            </PageRow>
          )
        : null}
    </>
  );
};
