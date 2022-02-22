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
import Action from './Items/Action';

export const Sections = (props: any) => {

  const { setActiveSection, pageMeta } = props;

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

  // resources to display
  const { definitions, external } = pageMeta;

  // external width patterns
  let curFlexWidth = 0;
  const flexWidths = [66, 34, 100, 50, 50,];

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
            <Action
              height="120px"
              label='next step'
              title='Connect Your Accounts'
              subtitle="Connect your Polkadot accounts to start staking."
              onClick={connectOnClick}
            />
          }

          {/* Display definitions */}
          {definitions.length > 0 &&
            <>
              <Heading title="Definitions" />
              {definitions.map((item: any, index: number) =>
                <Definition
                  key={`def_${index}`}
                  onClick={() => setActiveSection(1)}
                  title={item.title}
                  description={item.description}
                />
              )}
            </>
          }

          {/* Display external */}
          {external.length > 0 &&
            <>
              <Heading title="Articles" />
              {external.map((item: any, index: number) => {

                const thisRteturn: any = <External
                  key={`ext_${index}`}
                  width={flexWidths[curFlexWidth]}
                  label={item.label}
                  title={item.title}
                  subtitle={item.subtitle}
                  url={item.url}
                />;

                curFlexWidth = curFlexWidth > (flexWidths.length - 1)
                  ? 0
                  : curFlexWidth + 1;

                return thisRteturn;
              })}
            </>
          }

          {/* 
          <Heading title="Articles" />

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
          <External width="50%" label='tutorials' title='Slashing and Staking' ext /> */}

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