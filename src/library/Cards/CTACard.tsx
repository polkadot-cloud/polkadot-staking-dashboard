import { ButtonPrimary } from '@rossbulat/polkadot-dashboard-ui';
import styled from 'styled-components';

const CTACard = () => {
  const CTA = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-grow: 1;
    padding: 1.5rem;
    background: radial-gradient(
      98.42% 1255.31% at 98.42% 3.27%,
      #e6007a 0%,
      #e60890 53.18%,
      #952cc7 100%
    );
    color: #fff;
    box-shadow: 0px -1px 2px rgba(0, 0, 0, 0.05),
      0px 2px 4px rgba(0, 0, 0, 0.08);
    border-radius: 16px;

    h3 {
      color: #fff;
      font-size: 20px;
      font-family: 'Unbounded', 'sans-serif', sans-serif;
    }

    #btn-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      padding: 32px 0px 0px;
    }
  `;

  return (
    <CTA>
      <h3>Get Started with Staking</h3>
      <div>
        Joining a pool of nominators is the easiest way to start staking on
        Polkadot. Stake thorugh a pool to secure the Polkadot neetwork and earn
        rewards.
      </div>
      <div id="btn-wrapper">
        <ButtonPrimary
          text="Start Staking"
          style={{
            backgroundColor: '#fff',
            color: '#E6007A',
            fontSize: '1.25rem',
            padding: '0.75rem 1.5rem',
          }}
        />
      </div>
    </CTA>
  );
};

export default CTACard;
