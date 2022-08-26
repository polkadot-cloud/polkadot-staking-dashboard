// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useModal } from 'contexts/Modal';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

export const JoinPool = (props: { id: number; setActiveTab: any }) => {
  const { id, setActiveTab } = props;
  const { openModalWith } = useModal();

  return (
    <div className="label button-with-text">
      <button
        type="button"
        onClick={() => {
          openModalWith(
            'JoinPool',
            {
              id,
              setActiveTab,
            },
            'small'
          );
        }}
      >
        Join
        <FontAwesomeIcon icon={faCaretRight} transform="shrink-2" />
      </button>
    </div>
  );
};
