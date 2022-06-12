// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHashtag,
  faPlusCircle,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { useModal } from 'contexts/Modal';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { clipAddress } from 'Utils';
import Identicon from 'library/Identicon';
import { u8aToString, u8aUnwrapBytes } from '@polkadot/util';
import { BondedPoolsContextState, ActivePoolContextState } from 'types/pools';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { Wrapper } from './Wrapper';

export const Pool = (props: any) => {
  const { pool, batchKey, batchIndex } = props;
  const { memberCounter, addresses, id } = pool;
  const { openModalWith } = useModal();
  const { meta } = useBondedPools() as BondedPoolsContextState;
  const { isBonding } = useActivePool() as ActivePoolContextState;

  const metadata = meta[batchKey]?.metadata ?? [];

  // aggregate synced status
  const metadataSynced = metadata.length > 0 ?? false;

  // display value
  const defaultDisplay = clipAddress(addresses.stash);

  // fallback to address on empty metadata string
  let display = metadata[batchIndex] ?? defaultDisplay;
  // check if super identity has been byte encoded
  const displayAsBytes = u8aToString(u8aUnwrapBytes(display));
  if (displayAsBytes !== '') {
    display = displayAsBytes;
  }
  // if still empty string, default to clipped address
  if (display === '') {
    display = defaultDisplay;
  }

  return (
    <Wrapper>
      <div>
        <Identicon value={addresses.stash} size={26} />
        {!metadataSynced ? (
          <motion.div
            className="identity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h4>{clipAddress(addresses.stash)}</h4>
          </motion.div>
        ) : (
          <motion.div
            className="identity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h4>{display}</h4>
          </motion.div>
        )}

        <div>
          <div className="labels">
            <div className="label stat">
              <FontAwesomeIcon icon={faHashtag} />
              &nbsp;{id}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
            >
              <div className="label">
                <FontAwesomeIcon icon={faUsers} className="icon" />
                {memberCounter}
              </div>
            </motion.div>
            {!isBonding() && (
              <div className="label">
                <button
                  type="button"
                  onClick={() =>
                    openModalWith(
                      'JoinPool',
                      {
                        id,
                      },
                      'small'
                    )
                  }
                >
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    transform="grow-4"
                    className="join"
                  />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Pool;
