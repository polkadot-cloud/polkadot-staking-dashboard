import { forwardRef } from 'react';
import { BondSome } from './BondSome';
import { BondAll } from './BondAll';
import { UnbondSome } from './UnbondSome';
import { UnbondAll } from './UnbondAll';

export const Forms = forwardRef((props: any, ref: any) => {
  const { task } = props;
  return (
    <>
      {task === 'bond_some' && <BondSome {...props} ref={ref} />}
      {task === 'bond_all' && <BondAll {...props} ref={ref} />}
      {task === 'unbond_some' && <UnbondSome {...props} ref={ref} />}
      {task === 'unbond_all' && <UnbondAll {...props} ref={ref} />}
    </>
  );
});
