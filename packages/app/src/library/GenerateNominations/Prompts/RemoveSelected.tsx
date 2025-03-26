// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Title } from 'library/Prompt/Title'
import { FooterWrapper } from 'library/Prompt/Wrappers'
import { ButtonPrimary } from 'ui-buttons'
import type { RevertPromptProps } from '../../../overlay/canvas/ManageNominations/types'

export const RemoveSelected = ({ onRevert }: RevertPromptProps) => (
  <>
    <Title title={'Remove Selected'} />
    <div className="body">
      <h4 className="subheading">
        Are you sure you want to remove the selected validators?
      </h4>
      <FooterWrapper>
        <ButtonPrimary marginRight text={'Remove'} onClick={() => onRevert()} />
      </FooterWrapper>
    </div>
  </>
)
