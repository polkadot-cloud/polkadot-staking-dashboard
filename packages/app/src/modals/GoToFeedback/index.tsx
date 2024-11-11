// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import ForumSVG from 'img/forum.svg?react';
import { Title } from 'library/Modal/Title';
import { ModalPadding } from 'kits/Overlay/structure/ModalPadding';

export const GoToFeedback = () => {
  const { t } = useTranslation('modals');
  return (
    <>
      <Title title={t('helpAndSupport')} Svg={ForumSVG} />
      <ModalPadding verticalOnly>
        <div
          style={{
            padding: '0 1.75rem 0.5rem 1.75rem',
            width: '100%',
          }}
        >
          <h4 style={{ paddingBottom: '0.75rem' }}>{t('feedbackPage')}</h4>
          <h2 style={{ marginTop: '0.75rem' }}>
            <a
              href="https://support.polkadot.network/support/home"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--accent-color-primary' }}
            >
              {t('openSupport')} &nbsp;
              <FontAwesomeIcon icon={faExternalLinkAlt} transform="shrink-3" />
            </a>
          </h2>
        </div>
      </ModalPadding>
    </>
  );
};
