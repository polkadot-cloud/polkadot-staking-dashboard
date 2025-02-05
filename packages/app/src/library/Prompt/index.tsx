// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { usePrompt } from 'contexts/Prompt'
import { ContentWrapper, HeightWrapper, PromptWrapper } from './Wrappers'

export const Prompt = () => {
  const {
    size,
    status,
    closePrompt,
    Prompt: PromptInner,
    closeOnOutsideClick,
  } = usePrompt()

  if (status === 0) {
    return null
  }

  return (
    <PromptWrapper>
      <div>
        <HeightWrapper size={size}>
          <ContentWrapper>{PromptInner}</ContentWrapper>
        </HeightWrapper>
        <button
          type="button"
          className="close"
          onClick={() => {
            if (closeOnOutsideClick) {
              closePrompt()
            }
          }}
        >
          &nbsp;
        </button>
      </div>
    </PromptWrapper>
  )
}
