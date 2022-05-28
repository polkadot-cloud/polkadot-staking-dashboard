// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faUserSlash,
  faChartLine,
  faThumbtack,
} from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useUi } from 'contexts/UI';
import { useStaking } from 'contexts/Staking';
import { Wrapper, Labels, Identity } from './Wrappers';
import Identicon from '../Identicon';
import { clipAddress } from '../../Utils';
import { useApi } from '../../contexts/Api';
import { useModal } from '../../contexts/Modal';
import { useValidators } from '../../contexts/Validators';
import { getIdentityDisplay } from './Utils';
import { useNotifications } from '../../contexts/Notifications';
import { APIContextInterface } from '../../types/api';

export const ValidatorInner = (props: any) => {
  const { consts, network } = useApi() as APIContextInterface;
  const { openModalWith } = useModal();
  const { addNotification } = useNotifications();
  const { favourites, addFavourite, removeFavourite, meta } = useValidators();
  const { listFormat }: any = useUi();
  const { getNominationsStatus } = useStaking();

  const { validator, toggleFavourites, batchIndex, batchKey, showStatus } =
    props;

  const identities = meta[batchKey]?.identities ?? [];
  const supers = meta[batchKey]?.supers ?? [];
  const stake = meta[batchKey]?.stake ?? [];

  // aggregate synced status
  const identitiesSynced = identities.length > 0 ?? false;
  const supersSynced = supers.length > 0 ?? false;

  const synced = {
    identities: identitiesSynced && supersSynced,
    stake: stake.length > 0 ?? false,
  };

  const { address, prefs } = validator;
  const eraStakers = stake[batchIndex];

  const nominationStatuses = getNominationsStatus();
  const nominationStatus = nominationStatuses[address];

  const display = getIdentityDisplay(
    identities[batchIndex],
    supers[batchIndex]
  );
  const commission = prefs?.commission ?? null;
  const blocked = prefs?.blocked ?? null;

  const total_nominations = eraStakers?.total_nominations ?? 0;
  const lowestReward = eraStakers?.lowestReward ?? 0;

  // copy address notification
  const notificationCopyAddress =
    address == null
      ? {}
      : {
          title: 'Address Copied to Clipboard',
          subtitle: address,
        };

  // favourite toggle notification
  const notificationFavourite = !favourites.includes(address)
    ? {
        title: 'Favourite Validator Added',
        subtitle: address,
      }
    : {
        title: 'Favourite Validator Removed',
        subtitle: address,
      };

  const displayOversubscribed =
    synced.stake &&
    total_nominations >= consts.maxNominatorRewardedPerValidator;

  return (
    <Wrapper format={listFormat}>
      <div>
        <div className="row">
          <Identicon value={address} size={26} />
          <Identity
            className="identity"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {synced.identities && display !== null ? (
              <h4>{display}</h4>
            ) : (
              <h4>{clipAddress(address)}</h4>
            )}
            {showStatus && (
              <div className={`label status ${nominationStatus}`}>
                {nominationStatus}
              </div>
            )}
          </Identity>

          <Labels>
            {displayOversubscribed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
              >
                <div className="label warning">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    transform="shrink-2"
                  />
                  &nbsp;
                  {lowestReward} {network.unit}
                </div>
              </motion.div>
            )}
            {blocked && (
              <div className="label">
                <FontAwesomeIcon
                  icon={faUserSlash}
                  color="#d2545d"
                  transform="shrink-1"
                />
              </div>
            )}
            <div className="label">{commission}%</div>
            <div className="label">
              <button
                type="button"
                onClick={() =>
                  openModalWith(
                    'ValidatorMetrics',
                    {
                      address,
                      identity: display,
                    },
                    'large'
                  )
                }
              >
                <FontAwesomeIcon icon={faChartLine} />
              </button>
            </div>
            <div className="label">
              <button
                type="button"
                onClick={() => addNotification(notificationCopyAddress)}
              >
                <CopyToClipboard text={address}>
                  <FontAwesomeIcon icon={faCopy as IconProp} />
                </CopyToClipboard>
              </button>
            </div>
            {toggleFavourites && (
              <div className="label">
                <button
                  type="button"
                  className={
                    favourites.includes(address) ? 'active' : undefined
                  }
                  onClick={() => {
                    if (favourites.includes(address)) {
                      removeFavourite(address);
                    } else {
                      addFavourite(address);
                    }
                    addNotification(notificationFavourite);
                  }}
                >
                  <FontAwesomeIcon icon={faThumbtack} />
                </button>
              </div>
            )}
          </Labels>
        </div>
      </div>
    </Wrapper>
  );
};

export class Validator extends React.Component<any, any> {
  shouldComponentUpdate(nextProps: any, nextState: any) {
    return (
      this.props.validator.address !== nextProps.validator.address ||
      this.props.batchIndex !== nextProps.batchIndex ||
      this.props.batchKey !== nextProps.batchKey
    );
  }

  render() {
    return <ValidatorInner {...this.props} />;
  }
}

export default Validator;
