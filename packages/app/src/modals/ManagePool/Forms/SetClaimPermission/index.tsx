// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { ClaimPermissionInput } from 'library/Form/ClaimPermissionInput';
import { Warning } from 'library/Form/Warning';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { SubmitTx } from 'library/SubmitTx';
import { useOverlay } from 'kits/Overlay/Provider';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import type { ClaimPermission } from 'contexts/Pools/types';
import { useBalances } from 'contexts/Balances';
import { ButtonSubmitInvert } from 'ui-buttons';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { ModalWarnings } from 'kits/Overlay/structure/ModalWarnings';
import { defaultClaimPermission } from 'controllers/ActivePools/defaults';
import { ApiController } from 'controllers/Api';
import { useNetwork } from 'contexts/Network';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';

export const SetClaimPermission = ({
  setSection,
  section,
}: {
  section: number;
  setSection: Dispatch<SetStateAction<number>>;
}) => {
  const { t } = useTranslation('modals');
  const { network } = useNetwork();
  const { getPoolMembership } = useBalances();
  const { activeAccount } = useActiveAccounts();
  const { setModalStatus } = useOverlay().modal;
  const { isOwner, isMember } = useActivePool();
  const { getSignerWarnings } = useSignerWarnings();

  const membership = getPoolMembership(activeAccount);

  // Valid to submit transaction.
  const [valid, setValid] = useState<boolean>(false);

  // Updated claim permission value.
  const [claimPermission, setClaimPermission] = useState<
    ClaimPermission | undefined
  >(membership?.claimPermission);

  // Determine current pool metadata and set in state.
  useEffect(() => {
    const current = membership?.claimPermission;
    if (current) {
      setClaimPermission(membership?.claimPermission);
    }
  }, [section, membership]);

  useEffect(() => {
    setValid(isOwner() || (isMember() && claimPermission !== undefined));
  }, [isOwner(), isMember()]);

  // tx to submit.
  const getTx = () => {
    const { pApi } = ApiController.get(network);
    if (!valid || !pApi || !claimPermission) {
      return null;
    }
    return pApi.tx.NominationPools.set_claim_permission({
      permission: {
        type: claimPermission,
        value: undefined,
      },
    });
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
  });

  const warnings = getSignerWarnings(
    activeAccount,
    false,
    submitExtrinsic.proxySupported
  );

  return (
    <>
      <ModalPadding horizontalOnly>
        {warnings.length > 0 ? (
          <ModalWarnings withMargin>
            {warnings.map((text, i) => (
              <Warning key={`warning${i}`} text={text} />
            ))}
          </ModalWarnings>
        ) : null}

        <ClaimPermissionInput
          current={membership?.claimPermission || defaultClaimPermission}
          onChange={(val: ClaimPermission | undefined) => {
            setClaimPermission(val);
          }}
        />
      </ModalPadding>
      <SubmitTx
        valid={valid && claimPermission !== membership?.claimPermission}
        buttons={[
          <ButtonSubmitInvert
            key="button_back"
            text={t('back')}
            iconLeft={faChevronLeft}
            iconTransform="shrink-1"
            onClick={() => setSection(0)}
          />,
        ]}
        {...submitExtrinsic}
      />
    </>
  );
};
