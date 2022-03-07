// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const Dropdown = (props: any) => {

  return (
    <ul className='accounts'>
      {props.items}
    </ul>
  )
}

export default Dropdown;