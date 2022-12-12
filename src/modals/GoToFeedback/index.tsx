// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactComponent as ForumSVG } from 'img/forum.svg';
import { Title } from 'library/Modal/Title';
import { useTranslation } from 'react-i18next';
import { NotesWrapper, PaddingWrapper } from '../Wrappers';

export const GoToFeedback = () => {
  const { t } = useTranslation('modals');
  return (
    <>
      <Title title={t('feedback')} Svg={ForumSVG} />
      <PaddingWrapper verticalOnly>
        <div
          style={{
            padding: '0 1.75rem',
            width: '100%',
          }}
        >
          <NotesWrapper style={{ paddingTop: 0 }}>
            <p>
              {t('feedback_page')}{' '}
              <a href="https://canny.io/" target="_blank" rel="noreferrer">
                Canny.io
              </a>
              . {t('welcome_to_report')}
            </p>
          </NotesWrapper>
          <h2 style={{ marginTop: 0 }}>
            <a
              href="https://polkadot-staking-dashboard.canny.io/feedback"
              target="_blank"
              rel="noreferrer"
            >
              {t('open_feedback')} &nbsp
              <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-3" />
            </a>
          </h2>
        </div>
      </PaddingWrapper>
    </>
  );
};

export default GoToFeedback;
