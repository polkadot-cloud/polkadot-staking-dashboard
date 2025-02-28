// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { usePrompt } from 'contexts/Prompt';
import { ContentWrapper, HeightWrapper, PromptWrapper } from './Wrappers';

export const Prompt = () => {
  const { closePrompt, size, status, Prompt: PromptInner } = usePrompt();

  if (status === 0) {
    return null;
  }

  return (
    <PromptWrapper>
      <div>
        <HeightWrapper size={size}>
          <ContentWrapper>{PromptInner}</ContentWrapper>
        </HeightWrapper>
        <button type="button" className="close" onClick={() => closePrompt()}>
          &nbsp;
        </button>
      </div>
    </PromptWrapper>
  );
};
