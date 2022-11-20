// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useOverlay } from 'contexts/Overlay';
import { Title } from './Title';
import { ContentWrapper, HeightWrapper, OverlayWrapper } from './Wrappers';

export const Overlay = () => {
  const { closeOverlay, status } = useOverlay();

  if (status === 0) {
    return <></>;
  }

  return (
    <OverlayWrapper>
      <div>
        <HeightWrapper>
          <ContentWrapper>
            <Title title="Filter Validators" />

            <div className="body">
              <h4>Order By:</h4>
              <button
                type="button"
                className="item"
                onClick={() => {
                  /* TODO: add filter */
                }}
              >
                <FontAwesomeIcon transform="grow-3" icon={faCheckCircle} />
                <h3>Low Commission</h3>
              </button>
              <h4>Exclude:</h4>
              <button
                type="button"
                className="item"
                onClick={() => {
                  /* TODO: add filter */
                }}
              >
                <FontAwesomeIcon transform="grow-3" icon={faCircle} />
                <h3>Inactive Validators</h3>
              </button>
              <button
                type="button"
                className="item"
                onClick={() => {
                  /* TODO: add filter */
                }}
              >
                <FontAwesomeIcon transform="grow-3" icon={faCircle} />
                <h3>Over Subscribed</h3>
              </button>
              <button
                type="button"
                className="item"
                onClick={() => {
                  /* TODO: add filter */
                }}
              >
                <FontAwesomeIcon transform="grow-3" icon={faCircle} />
                <h3>100% Commission</h3>
              </button>
              <button
                type="button"
                className="item"
                onClick={() => {
                  /* TODO: add filter */
                }}
              >
                <FontAwesomeIcon transform="grow-3" icon={faCircle} />
                <h3>Blocked Nominations</h3>
              </button>
              <button
                type="button"
                className="item"
                onClick={() => {
                  /* TODO: add filter */
                }}
              >
                <FontAwesomeIcon transform="grow-3" icon={faCircle} />
                <h3>Missing Identity</h3>
              </button>
            </div>
          </ContentWrapper>
        </HeightWrapper>
        <button type="button" className="close" onClick={() => closeOverlay()}>
          &nbsp;
        </button>
      </div>
    </OverlayWrapper>
  );
};
