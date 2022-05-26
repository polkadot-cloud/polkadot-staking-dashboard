// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useModal } from '../../contexts/Modal';
import { usePools } from '../../contexts/Pools';
import { Wrapper } from './Wrapper';
import Identicon from '../Identicon';
import { clipAddress } from '../../Utils';

export const Pool = (props: any) => {
  const { pool, batchKey, batchIndex } = props;
  const { memberCounter, addresses, id } = pool;
  const { openModalWith } = useModal();
  const { isBonding } = usePools();
  const { meta } = usePools();

  const metadata = meta[batchKey]?.metadata ?? [];

  // aggregate synced status
  const metadataSynced = metadata.length > 0 ?? false;

  // display value
  const defaultDisplay = clipAddress(addresses.stash);

  // fallback to address on empty metadata string
  let display = metadata[batchIndex] ?? defaultDisplay;
  if (display === '') {
    display = defaultDisplay;
  }

  return (
    <Wrapper>
      <div>
        <h3>{id}</h3>
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

        <div className="labels">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
          >
            <div className="label">
              <FontAwesomeIcon icon={faUsers} />
              &nbsp; {memberCounter}
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
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default Pool;
