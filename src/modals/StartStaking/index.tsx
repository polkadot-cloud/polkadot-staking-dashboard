// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronRight, faCog } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useModal } from 'contexts/Modal';
import { useSetup } from 'contexts/Setup';
import { Title } from 'library/Modal/Title';
import { PaddingWrapper } from 'modals/Wrappers';
import { useNavigate } from 'react-router-dom';

export const StartStaking = () => {
  const navigate = useNavigate();
  const { setOnNominatorSetup } = useSetup();
  const { setStatus } = useModal();
  return (
    <>
      <Title title="Start Staking" icon={faCog} />
      <PaddingWrapper>
        <button
          type="button"
          className="action-button"
          disabled={false}
          onClick={() => {
            setOnNominatorSetup(true);
            navigate('/nominate');
            setStatus(2);
          }}
        >
          <div>
            <h3>Directly Nominate</h3>
            <p>Have full control over your nominations.</p>
          </div>
          <div>
            <FontAwesomeIcon transform="shrink-2" icon={faChevronRight} />
          </div>
        </button>
        <button
          type="button"
          className="action-button"
          disabled={false}
          onClick={() => {
            navigate('/pools'); // TODO: support tab switching
            setStatus(2);
          }}
        >
          <div>
            <h3>Join a Nomination Pool</h3>
            <p>Easy staking with competitive rewards.</p>
          </div>
          <div>
            <FontAwesomeIcon transform="shrink-2" icon={faChevronRight} />
          </div>
        </button>
      </PaddingWrapper>
    </>
  );
};
