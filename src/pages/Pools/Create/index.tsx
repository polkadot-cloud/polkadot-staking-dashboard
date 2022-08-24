// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useUi } from 'contexts/UI';
import { PageRowWrapper, GoBackWrapper } from 'Wrappers';
import { PageTitle } from 'library/PageTitle';
import Button from 'library/Button';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

export const Create = () => {
  const { setOnPoolSetup } = useUi();

  return (
    <>
      <PageTitle title="Create a Pool" />
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <GoBackWrapper>
          <Button
            inline
            title="Go Back"
            icon={faChevronLeft}
            transform="shrink-3"
            onClick={() => setOnPoolSetup(0)}
          />
        </GoBackWrapper>
      </PageRowWrapper>
    </>
  );
};
