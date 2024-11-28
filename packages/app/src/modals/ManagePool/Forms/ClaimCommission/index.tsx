// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { rmCommas } from '@w3ux/utils';
import BigNumber from 'bignumber.js';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useNetwork } from 'contexts/Network';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { ApiController } from 'controllers/Api';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { useOverlay } from 'kits/Overlay/Provider';
import { ModalNotes } from 'kits/Overlay/structure/ModalNotes';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { ModalWarnings } from 'kits/Overlay/structure/ModalWarnings';
import { ActionItem } from 'library/ActionItem';
import { Warning } from 'library/Form/Warning';
import { SubmitTx } from 'library/SubmitTx';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonSubmitInvert } from 'ui-buttons';
import { planckToUnitBn } from 'utils';

export const ClaimCommission = ({
  setSection,
}: {
  setSection: Dispatch<SetStateAction<number>>;
}) => {
  const { t } = useTranslation('modals');
  const {
    network,
    networkData: { units, unit },
  } = useNetwork();
  const { setModalStatus } = useOverlay().modal;
  const { activeAccount } = useActiveAccounts();
  const { isOwner, activePool } = useActivePool();
  const { getSignerWarnings } = useSignerWarnings();

  const poolId = activePool?.id;
  const pendingCommission = new BigNumber(
    rmCommas(activePool?.rewardPool?.totalCommissionPending || '0')
  );

  // valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  useEffect(() => {
    setValid(isOwner() && pendingCommission.isGreaterThan(0));
  }, [activePool, pendingCommission]);

  // tx to submit
  const getTx = () => {
    const api = ApiController.getApi(network);
    if (!valid || !api || poolId === undefined) {
      return null;
    }
    return api.tx.NominationPools.claim_commission({ pool_id: poolId });
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
        <ActionItem
          text={`${t('claim')} ${planckToUnitBn(
            pendingCommission,
            units
          ).toString()} ${unit} `}
        />
        <ModalNotes>
          <p>{t('sentToCommissionPayee')}</p>
        </ModalNotes>
      </ModalPadding>
      <SubmitTx
        valid={valid}
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
