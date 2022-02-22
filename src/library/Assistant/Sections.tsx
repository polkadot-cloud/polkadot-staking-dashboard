import { pageTitleFromUri } from '../../pages';
import Heading from './Heading';
import Definition from './Items/Definition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft as faBack } from '@fortawesome/free-solid-svg-icons';
import { ContentWrapper, ListWrapper, HeaderWrapper } from './Wrappers';
import { useConnect } from '../../contexts/Connect';
import { useLocation } from 'react-router-dom';
import { useAssistant } from '../../contexts/Assistant';
import { useModal } from '../../contexts/Modal';
import External from './Items/External';

export const Sections = (props: any) => {

  const { setActiveSection } = props;

  const connect = useConnect();
  const { pathname } = useLocation();
  const assistant = useAssistant();
  const modal = useModal();

  // connect handler
  const connectOnClick = () => {
    // close assistant
    assistant.toggle();
    // open connect
    modal.setStatus(1);
  }

  return (
    <>
      <ContentWrapper>
        <HeaderWrapper>
          <div className='hold'>
            <h3>{pageTitleFromUri(pathname)} Resources</h3>
            <span>
              <button className='close' onClick={() => { assistant.toggle() }}>
                Close
              </button>
            </span>
          </div>
        </HeaderWrapper>
        <ListWrapper>
          {/* only display if accounts not yet connected */}
          {connect.status === 0 &&
            <External
              width="100%"
              height="120px"
              label='next step'
              title='Connect Your Accounts'
              content="Connect your Polkadot accounts to start staking."
              actionRequired={true}
              onClick={connectOnClick}
            />
          }

          <Heading title="Definitions" />

          <Definition onClick={() => setActiveSection(1)} />
          <Definition onClick={() => setActiveSection(1)} />
          <Definition onClick={() => setActiveSection(1)} />

          <Heading title="Help Articles" />

          <External width="50%" label='tutorials' title='What is Polkadot Staking?' ext />
          <External width="50%" label='tutorials' title='Validators and Nominators' ext />
          <External
            width="66%"
            label='tutorials'
            title='What are Staking Pools?'
            content='The new way to stake on Polakdot'
            ext
          />
          <External width="34%" label='tutorials' title='Choosing Validators: What to Know' ext />
          <External
            width="100%"
            label='tutorials'
            title='Understanding Payouts'
            content="Read about receiving staking rewards and initiating payouts."
            ext
          />
          <External width="50%" label='tutorials' title='Bonding and Unbonding' ext />
          <External width="50%" label='tutorials' title='Slashing and Staking' ext />
        </ListWrapper>
      </ContentWrapper>

      <ContentWrapper>
        <HeaderWrapper>
          <div className='hold'>
            <button onClick={() => setActiveSection(0)}>
              <FontAwesomeIcon
                icon={faBack}
                transform="shrink-4"
                style={{ cursor: 'pointer', marginRight: '0.3rem' }}
              /> Back
            </button>

            <span>
              <button className='close' onClick={() => { assistant.toggle() }}>Close</button>
            </span>
          </div>
        </HeaderWrapper>
        <ListWrapper>
          <h2>Epoch</h2>
          <p className='definition'>
            An epoch is another name for a session in Polkadot. A different set of validators are selected to validate blocks at the beginning of every epoch.
          </p>
          <p className='definition'>
            1 epoch is currently 4 hours in Polkadot.
          </p>
        </ListWrapper>
      </ContentWrapper>
    </>
  )
}

export default Sections;