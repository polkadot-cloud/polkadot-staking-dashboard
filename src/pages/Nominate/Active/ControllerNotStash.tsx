// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  faCircleArrowRight,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { stringUpperFirst } from '@polkadot/util';
import { PageRow } from '@polkadot-cloud/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBonded } from 'contexts/Bonded';
import { useStaking } from 'contexts/Staking';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useSyncing } from 'hooks/useSyncing';
import { ButtonPrimary } from 'library/Buttons/ButtonPrimary';

export const ControllerNotStash = () => {
  const { t } = useTranslation('pages');
  const { network } = useNetwork();
  const { getBondedAccount } = useBonded();
  const { openModal } = useOverlay().modal;
  const { activeAccount } = useActiveAccounts();
  const { addressDifferentToStash } = useStaking();
  const { isReadOnlyAccount } = useImportedAccounts();
  const controller = getBondedAccount(activeAccount);
  const { syncing } = useSyncing(['initialization', 'balances']);

  const [showPrompt, setShowPrompt] = useState<boolean>(
    addressDifferentToStash(controller)
  );

  useEffect(() => {
    setShowPrompt(addressDifferentToStash(controller));
  }, [controller]);

  return showPrompt
    ? !syncing && !isReadOnlyAccount(activeAccount) && (
        <PageRow>
          <CardWrapper className="warning">
            <CardHeaderWrapper>
              <h3 style={{ marginBottom: '0.75rem' }}>
                <FontAwesomeIcon icon={faExclamationTriangle} />
                &nbsp; {t('nominate.controllerAccountsDeprecated')}
              </h3>
              <h4>
                {t('nominate.proxyprompt')} {stringUpperFirst(network)}.
              </h4>
            </CardHeaderWrapper>
            <div>
              <ButtonPrimary
                text={t('nominate.updateToStash')}
                iconLeft={faCircleArrowRight}
                onClick={() => openModal({ key: 'UpdateController' })}
              />
            </div>
          </CardWrapper>
        </PageRow>
      )
    : null;
};
