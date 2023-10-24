// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ModalPadding } from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import ForumSVG from 'img/forum.svg?react';
import { Title } from 'library/Modal/Title';

export const GoToFeedback = () => {
  const { t } = useTranslation('modals');
  return (
    <>
      <Title title={t('feedback')} Svg={ForumSVG} />
      <ModalPadding verticalOnly>
        <div
          style={{
            padding: '0 1.75rem 0.5rem 1.75rem',
            width: '100%',
          }}
        >
          <h4 style={{ paddingBottom: '0.75rem' }}>
            {t('feedbackPage')}{' '}
            <a href="https://canny.io/" target="_blank" rel="noreferrer">
              Canny.io
            </a>
            . {t('welcomeToReport')}
          </h4>
          <h2 style={{ marginTop: '0.75rem' }}>
            <a
              href="https://polkadot-staking-dashboard.canny.io/feedback"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--accent-color-primary' }}
            >
              {t('openFeedback')} &nbsp;
              <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-3" />
            </a>
          </h2>
        </div>
      </ModalPadding>
    </>
  );
};
