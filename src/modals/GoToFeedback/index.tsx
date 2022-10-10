// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { Title } from 'library/Modal/Title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactComponent as ForumSVG } from 'img/forum.svg';
import { useTranslation } from 'react-i18next';
import { NotesWrapper, PaddingWrapper } from '../Wrappers';

export const GoToFeedback = () => {
  const { t } = useTranslation('common');
  return (
    <>
      <Title title={t('modals.feedback')} Svg={ForumSVG} />
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
              {t('modals.feedback_page')}{' '}
              <a href="https://canny.io/" target="_blank" rel="noreferrer">
                Canny.io
              </a>
              {t('modals.welcome_to_report')}
            </p>
          </NotesWrapper>
          <h2 style={{ marginTop: 0 }}>
            <a
              href="https://polkadot-staking-dashboard.canny.io/feature-requests"
              target="_blank"
              rel="noreferrer"
            >
              {t('modals.open_feedback')} &nbsp;
              <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-3" />
            </a>
          </h2>
        </div>
      </PaddingWrapper>
    </>
  );
};

export default GoToFeedback;
