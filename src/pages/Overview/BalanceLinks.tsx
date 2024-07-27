// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useStaking } from 'contexts/Staking';
import { MoreWrapper } from './Wrappers';
import { ButtonPrimaryInvert } from 'kits/Buttons/ButtonPrimaryInvert';
import { Separator } from 'kits/Structure/Separator';

export const BalanceLinks = () => {
  const { t } = useTranslation('pages');
  const { network } = useNetwork();
  const { isNominating } = useStaking();
  const { activeAccount } = useActiveAccounts();

  const openDuneDashboard = () => {
    if (activeAccount) {
      const duneUrl = `https://dune.com/substrate/polkadot-staking-pool-member?user_ss58_t300ae=${activeAccount}`;
      window.open(duneUrl, '_blank');
    }
  };

  return (
    <MoreWrapper>
      <Separator />
      <h4>{t('overview.moreResources')}</h4>
      <section>
        <ButtonPrimaryInvert
          lg
          onClick={() =>
            window.open(
              `https://${network}.subscan.io/account/${activeAccount}`,
              '_blank'
            )
          }
          iconRight={faExternalLinkAlt}
          iconTransform="shrink-2"
          text="Subscan"
          marginRight
          disabled={!activeAccount}
        />
        <ButtonPrimaryInvert
          lg
          onClick={() =>
            window.open(
              `https://${network}.polkawatch.app/nomination/${activeAccount}`,
              '_blank'
            )
          }
          iconRight={faExternalLinkAlt}
          iconTransform="shrink-2"
          text="Polkawatch"
          marginRight
          disabled={
            !(
              activeAccount &&
              ['polkadot', 'kusama'].includes(network) &&
              isNominating()
            )
          }
        />
        <ButtonPrimaryInvert
          lg
          onClick={openDuneDashboard}
          iconRight={faExternalLinkAlt}
          iconTransform="shrink-2"
          text="Dune Dashboard"
          marginRight
          disabled={!activeAccount}
        />
      </section>
    </MoreWrapper>
  );
};
