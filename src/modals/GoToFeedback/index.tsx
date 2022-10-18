// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactComponent as ForumSVG } from 'img/forum.svg';
import { Title } from 'library/Modal/Title';

import { NotesWrapper, PaddingWrapper } from '../Wrappers';

export const GoToFeedback = () => {
  return (
    <>
      <Title title="Feedback" Svg={ForumSVG} />
      <PaddingWrapper verticalOnly>
        <div
          style={{
            padding: '0 1.75rem',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <NotesWrapper style={{ paddingTop: 0 }}>
            <p>
              We host a feedback page on{' '}
              <a href="https://canny.io/" target="_blank" rel="noreferrer">
                Canny.io
              </a>
              . Bug reports, feature requests and improvements are all welcome.
            </p>
          </NotesWrapper>
          <h2 style={{ marginTop: 0 }}>
            <a
              href="https://polkadot-staking-dashboard.canny.io/feature-requests"
              target="_blank"
              rel="noreferrer"
            >
              Open Feedback on Canny.io &nbsp;
              <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-3" />
            </a>
          </h2>
        </div>
      </PaddingWrapper>
    </>
  );
};

export default GoToFeedback;
