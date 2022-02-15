import { PageProps } from '../types';
import { Wrapper, StakeSections, Section } from './Wrapper';

export const Stake = (props: PageProps) => {

  const { page } = props;
  const { title } = page;

  // maxNominatorsCount

  // minNominatorBond

  return (
    <Wrapper>
      <h2>{title}</h2>
      <StakeSections>
        <Section>
          <div>
            <h3>Nominate</h3>
          </div>
        </Section>
        <Section>
          <div>
            <h3>Delegate to Pools</h3>
          </div>
        </Section>
      </StakeSections>
    </Wrapper>
  );
}

export default Stake;