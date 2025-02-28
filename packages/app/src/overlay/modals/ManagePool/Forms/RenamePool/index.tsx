// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { u8aToString, u8aUnwrapBytes } from '@polkadot/util';
import type { Dispatch, FormEvent, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { Warning } from 'library/Form/Warning';
import { useSignerWarnings } from 'hooks/useSignerWarnings';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { SubmitTx } from 'library/SubmitTx';
import { useOverlay } from 'kits/Overlay/Provider';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { ButtonSubmitInvert } from 'kits/Buttons/ButtonSubmitInvert';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';
import { ModalWarnings } from 'kits/Overlay/structure/ModalWarnings';

export const RenamePool = ({
  setSection,
  section,
}: {
  setSection: Dispatch<SetStateAction<number>>;
  section: number;
}) => {
  const { t } = useTranslation('modals');
  const { api } = useApi();
  const { setModalStatus } = useOverlay().modal;
  const { activeAccount } = useActiveAccounts();
  const { isOwner, activePool } = useActivePool();
  const { getSignerWarnings } = useSignerWarnings();
  const { bondedPools, poolsMetaData } = useBondedPools();

  const poolId = activePool?.id;

  // Valid to submit transaction
  const [valid, setValid] = useState<boolean>(false);

  // Updated metadata value
  const [metadata, setMetadata] = useState<string>('');

  // Determine current pool metadata and set in state.
  useEffect(() => {
    const pool = bondedPools.find(
      ({ addresses }) => addresses.stash === activePool?.addresses.stash
    );
    if (pool) {
      setMetadata(u8aToString(u8aUnwrapBytes(poolsMetaData[Number(pool.id)])));
    }
  }, [section]);

  useEffect(() => {
    setValid(isOwner());
  }, [isOwner()]);

  // tx to submit
  const getTx = () => {
    if (!valid || !api) {
      return null;
    }
    return api.tx.nominationPools.setMetadata(poolId, metadata);
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: activeAccount,
    shouldSubmit: true,
    callbackSubmit: () => {
      setModalStatus('closing');
    },
  });

  const handleMetadataChange = (e: FormEvent<HTMLInputElement>) => {
    setMetadata(e.currentTarget.value);
    setValid(true);
  };

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
        <input
          className="underline"
          style={{ width: '100%' }}
          placeholder={t('poolName')}
          type="text"
          onChange={(e: FormEvent<HTMLInputElement>) => handleMetadataChange(e)}
          value={metadata ?? ''}
        />
        <p>{t('storedOnChain')}</p>
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
