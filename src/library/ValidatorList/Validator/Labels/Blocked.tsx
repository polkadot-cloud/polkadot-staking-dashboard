// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserSlash } from '@fortawesome/free-solid-svg-icons';

export const Blocked = (props: any) => {
  const { prefs } = props;
  const blocked = prefs?.blocked ?? null;

  return (
    <>
      {blocked && (
        <div className="label">
          <FontAwesomeIcon
            icon={faUserSlash}
            color="#d2545d"
            transform="shrink-1"
          />
        </div>
      )}
    </>
  );
};

export default Blocked;
