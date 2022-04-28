// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Wrapper } from './Wrapper';
import { HeadingWrapper, FooterWrapper } from '../Wrappers';
import { useModal } from '../../contexts/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';

export const UpdateBond = () => {

  const { config }: any = useModal();

  const { fn } = config;

  // TODO: submit extrinsic
  const submitTx = () => {
  }

  return (
    <Wrapper>
      <HeadingWrapper>
        <FontAwesomeIcon transform='grow-2' icon={fn === 'add' ? faPlus : faMinus} />
        {fn == 'add' ? 'Add To' : 'Remove'} Bond
      </HeadingWrapper>
      <FooterWrapper>
        <div>
          <button className='submit' onClick={() => submitTx()}>
            <FontAwesomeIcon transform='grow-2' icon={faArrowAltCircleUp} />
            Submit
          </button>
        </div>
      </FooterWrapper>
    </Wrapper>
  )
}

export default UpdateBond;