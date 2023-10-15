// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import {
  ButtonHelp,
  ButtonPrimary,
  ButtonPrimaryInvert,
} from '@polkadot-cloud/react';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import type { Validator } from 'contexts/Validators/types';
import { GenerateNominations } from 'library/GenerateNominations';
import { useEffect, useState } from 'react';
import { Subheading } from 'pages/Nominate/Wrappers';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { usePrompt } from 'contexts/Prompt';
import { useHelp } from 'contexts/Help';
import { useNotifications } from 'contexts/Notifications';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useBonded } from 'contexts/Bonded';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { SubmitTx } from 'library/SubmitTx';
import type { NewNominations } from './types';
import { RevertPrompt } from './RevertPrompt';

export const ManageNominations = () => {
  const { t } = useTranslation('library');
  const {
    closeCanvas,
    setCanvasStatus,
    config: { options },
  } = useOverlay().canvas;
  const { openHelp } = useHelp();
  const { consts, api } = useApi();
  const { getBondedAccount } = useBonded();
  const { activeAccount } = useActiveAccounts();
  const { addNotification } = useNotifications();
  const { selectedActivePool } = useActivePools();
  const { openPromptWith, closePrompt } = usePrompt();
  const controller = getBondedAccount(activeAccount);
  const { maxNominations } = consts;
  const bondFor = options?.bondFor || 'nominator';
  const isPool = bondFor === 'pool';
  const signingAccount = isPool ? activeAccount : controller;

  // Valid to submit transaction.
  const [valid, setValid] = useState<boolean>(false);

  // Default nominators, from canvas options.
  const [defaultNominations] = useState<Validator[]>(options?.nominated || []);

  // Current nominator selection, defaults to defaultNominations.
  const [newNominations, setNewNominations] = useState<NewNominations>({
    nominations: options?.nominated || [],
  });

  // Handler for updating setup.
  const handleSetupUpdate = (value: NewNominations) => {
    setNewNominations(value);
  };

  // Handler for reverting nomination updates.
  const handleRevertChanges = () => {
    setNewNominations({ nominations: defaultNominations });
    addNotification({
      title: 'Nominations Reverted',
      subtitle: 'Nominations have been reverted to your active selection.',
    });
    closePrompt();
  };

  // Tx to submit.
  const getTx = () => {
    let tx = null;
    if (!valid || !api) {
      return tx;
    }

    // Note: `targets` structure differs between staking and pools.
    const targetsToSubmit = newNominations.nominations.map((nominee) =>
      isPool
        ? nominee.address
        : {
            Id: nominee.address,
          }
    );

    if (isPool) {
      tx = api.tx.nominationPools.nominate(
        selectedActivePool?.id || 0,
        targetsToSubmit
      );
    } else {
      tx = api.tx.staking.nominate(targetsToSubmit);
    }
    return tx;
  };

  const submitExtrinsic = useSubmitExtrinsic({
    tx: getTx(),
    from: signingAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setCanvasStatus('closing');
    },
    callbackInBlock: () => {},
  });

  // Valid if there are between 1 and `maxNominations` nominations.
  useEffect(() => {
    setValid(
      maxNominations.isGreaterThanOrEqualTo(
        newNominations.nominations.length
      ) && newNominations.nominations.length > 0
    );
  }, [newNominations]);

  return (
    <>
      <div
        style={{
          paddingTop: '5rem',
          minHeight: 'calc(100vh - 12rem)',
          paddingBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ButtonPrimaryInvert
            text="Revert Changes"
            lg
            onClick={() => {
              openPromptWith(<RevertPrompt onRevert={handleRevertChanges} />);
            }}
            disabled={newNominations.nominations === defaultNominations}
          />
          <ButtonPrimary
            text="Cancel"
            lg
            onClick={() => closeCanvas()}
            iconLeft={faTimes}
            style={{ marginLeft: '1.1rem' }}
          />
        </div>
        <h1
          style={{
            marginTop: '1.5rem',
            marginBottom: '1.25rem',
          }}
        >
          Manage Nominations
        </h1>

        <Subheading>
          <h3 style={{ marginBottom: '1.5rem' }}>
            {t('chooseValidators', {
              maxNominations: maxNominations.toString(),
            })}
            <ButtonHelp
              onClick={() => openHelp('Nominations')}
              backgroundSecondary
            />
          </h3>
        </Subheading>

        <GenerateNominations
          displayFor="canvas"
          setters={[
            {
              current: {
                callable: true,
                fn: () => newNominations,
              },
              set: handleSetupUpdate,
            },
          ]}
          nominations={newNominations.nominations}
        />
      </div>
      <div
        style={{
          borderRadius: '1rem',
          overflow: 'hidden',
          marginBottom: '2rem',
        }}
      >
        <SubmitTx
          noMargin
          fromController={!isPool}
          valid={valid}
          {...submitExtrinsic}
        />
      </div>
    </>
  );
};
