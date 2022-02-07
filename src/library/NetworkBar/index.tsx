import { useState } from 'react';
import Wrapper from './Wrapper';

export const NetworkBar = () => {

  const [open, setOpen] = useState(false);

  return (
    <Wrapper open={open}>
      <button
        className='open'
        onClick={() => { setOpen(!open) }}>
      </button>

      <div className='row'>
        <section>
          [Network Icon]: [Name]
        </section>
        <section>
          [Live Block Number] [Connection Symbol]
        </section>
      </div>
    </Wrapper>
  )
}

export default NetworkBar;