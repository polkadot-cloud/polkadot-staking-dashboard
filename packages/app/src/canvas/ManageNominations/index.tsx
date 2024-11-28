// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useApi } from 'contexts/Api';
import { useBonded } from 'contexts/Bonded';
import { useHelp } from 'contexts/Help';
import { useNetwork } from 'contexts/Network';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { usePrompt } from 'contexts/Prompt';
import { Apis } from 'controllers/Apis';
import { Notifications } from 'controllers/Notifications';
import { useSubmitExtrinsic } from 'hooks/useSubmitExtrinsic';
import { useOverlay } from 'kits/Overlay/Provider';
import { GenerateNominations } from 'library/GenerateNominations';
import type {
  NominationSelection,
  NominationSelectionWithResetCounter,
} from 'library/GenerateNominations/types';
import { SubmitTx } from 'library/SubmitTx';
import { Subheading } from 'pages/Nominate/Wrappers';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonHelp, ButtonPrimary, ButtonPrimaryInvert } from 'ui-buttons';
import { CanvasFullScreenWrapper, CanvasSubmitTxFooter } from '../Wrappers';
import { RevertPrompt } from './Prompts/RevertPrompt';

export const ManageNominations = () => {
  const { t } = useTranslation('library');
  const {
    closeCanvas,
    setCanvasStatus,
    config: { options },
  } = useOverlay().canvas;
  const { consts } = useApi();
  const { openHelp } = useHelp();
  const { network } = useNetwork();
  const { activePool } = useActivePool();
  const { getBondedAccount } = useBonded();
  const { activeAccount } = useActiveAccounts();
  const { updatePoolNominations } = useBondedPools();
  const { openPromptWith, closePrompt } = usePrompt();

  const { maxNominations } = consts;
  const controller = getBondedAccount(activeAccount);
  const bondFor = options?.bondFor || 'nominator';
  const isPool = bondFor === 'pool';
  const signingAccount = isPool ? activeAccount : controller;

  // Valid to submit transaction.
  const [valid, setValid] = useState<boolean>(false);

  // Default nominators, from canvas options.
  const [defaultNominations, setDefaultNominations] =
    useState<NominationSelectionWithResetCounter>({
      nominations: [...(options?.nominated || [])],
      reset: 0,
    });

  // Current nominator selection, defaults to defaultNominations.
  const [newNominations, setNewNominations] = useState<NominationSelection>({
    nominations: options?.nominated || [],
  });

  // Handler for updating setup.
  const handleSetupUpdate = (value: NominationSelection) => {
    setNewNominations(value);
  };

  // Handler for reverting nomination updates.
  const handleRevertChanges = () => {
    setNewNominations({ nominations: [...defaultNominations.nominations] });
    setDefaultNominations({
      nominations: defaultNominations.nominations,
      reset: defaultNominations.reset + 1,
    });
    Notifications.emit({
      title: t('nominationsReverted'),
      subtitle: t('revertedToActiveSelection'),
    });
    closePrompt();
  };

  // Check if default nominations match new ones.
  const nominationsMatch = () =>
    newNominations.nominations.every((n) =>
      defaultNominations.nominations.find((d) => d.address === n.address)
    ) &&
    newNominations.nominations.length > 0 &&
    newNominations.nominations.length === defaultNominations.nominations.length;

  // Tx to submit.
  const getTx = () => {
    const api = Apis.getApi(network);
    let tx = null;
    if (!valid || !api) {
      return tx;
    }

    if (isPool) {
      if (activePool) {
        tx = api.tx.NominationPools.nominate({
          pool_id: activePool.id,
          validators: newNominations.nominations.map(
            (nominee) => nominee.address
          ),
        });
      }
    } else {
      tx = api.tx.Staking.nominate({
        targets: newNominations.nominations.map((nominee) => ({
          type: 'Id',
          value: nominee.address,
        })),
      });
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
    callbackInBlock: () => {
      if (isPool && activePool) {
        // Update bonded pool targets if updating pool nominations.
        updatePoolNominations(
          activePool.id,
          newNominations.nominations.map((n) => n.address)
        );
      }
    },
  });

  // Valid if there are between 1 and `maxNominations` nominations.
  useEffect(() => {
    setValid(
      maxNominations.isGreaterThanOrEqualTo(
        newNominations.nominations.length
      ) &&
        newNominations.nominations.length > 0 &&
        !nominationsMatch()
    );
  }, [newNominations]);

  return (
    <>
      <CanvasFullScreenWrapper>
        <div className="head">
          <ButtonPrimaryInvert
            text={t('revertChanges', { ns: 'modals' })}
            lg
            onClick={() => {
              openPromptWith(<RevertPrompt onRevert={handleRevertChanges} />);
            }}
            disabled={
              newNominations.nominations === defaultNominations.nominations
            }
          />
          <ButtonPrimary
            text={t('cancel', { ns: 'library' })}
            lg
            onClick={() => closeCanvas()}
            iconLeft={faTimes}
            style={{ marginLeft: '1.1rem' }}
          />
        </div>
        <h1>{t('manageNominations', { ns: 'modals' })}</h1>

        <Subheading>
          <h3 style={{ marginBottom: '1.5rem' }}>
            {t('chooseValidators', {
              ns: 'library',
              maxNominations: maxNominations.toString(),
            })}
            <ButtonHelp
              onClick={() => openHelp('Nominations')}
              background="none"
              outline
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
          nominations={newNominations}
        />
      </CanvasFullScreenWrapper>
      <CanvasSubmitTxFooter>
        <SubmitTx
          noMargin
          fromController={!isPool}
          valid={valid}
          displayFor="canvas"
          {...submitExtrinsic}
        />
      </CanvasSubmitTxFooter>
    </>
  );
};
