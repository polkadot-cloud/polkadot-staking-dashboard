import { useEffect, useState } from 'react';
import { useAssistant } from '../../contexts/Assistant';
import { Wrapper, SectionsWrapper, ContentWrapper, ListWrapper, HeaderWrapper } from './Wrappers';
import Item from './Item';
import { pageTitleFromUri } from '../../pages';
import { useLocation } from 'react-router-dom';
import { useConnect } from '../../contexts/Connect';
import { useModal } from '../../contexts/Modal';
import Heading from './Heading';
import Definition from './Definition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft as faBack } from '@fortawesome/free-solid-svg-icons';


export const Assistant = () => {

  const assistant = useAssistant();
  const { pathname } = useLocation();
  const connect = useConnect();
  const modal = useModal();

  // container variants
  const containerVariants = {
    hidden: {
      opacity: 1,
      right: '-600px',
    },
    visible: {
      opacity: 1,
      right: '0px',
    },
  };

  const [activeSection, setActiveSection] = useState(0);


  useEffect(() => {
    console.log('refetch assistant items');
  }, [pathname]);

  // animate assistant container default
  const animate = assistant.open ? `visible` : `hidden`;

  // connect handler
  const connectOnClick = () => {
    // close assistant
    assistant.toggle();
    // open connect
    modal.setStatus(1);
  }

  return (
    <>
      <Wrapper
        initial={false}
        animate={animate}
        transition={{
          duration: 0.5,
          type: "spring",
          bounce: 0.22
        }}
        variants={containerVariants}
      >
        <SectionsWrapper style={{ left: activeSection === 0 ? 0 : '-100%' }}>
          <ContentWrapper>
            <HeaderWrapper>
              <h3>
                {pageTitleFromUri(pathname)} Resources
                <span>
                  <button onClick={() => { assistant.toggle() }}>
                    Close
                  </button>
                </span>
              </h3>
            </HeaderWrapper>
            <ListWrapper>
              {/* only display if accounts not yet connected */}
              {connect.status === 0 &&
                <Item
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

              <Item width="50%" label='tutorials' title='What is Polkadot Staking?' ext />
              <Item width="50%" label='tutorials' title='Validators and Nominators' ext />
              <Item
                width="66%"
                label='tutorials'
                title='What are Staking Pools?'
                content='The new way to stake on Polakdot'
                ext
              />
              <Item width="34%" label='tutorials' title='Choosing Validators: What to Know' ext />
              <Item
                width="100%"
                label='tutorials'
                title='Understanding Payouts'
                content="Read about receiving staking rewards and initiating payouts."
                ext
              />
              <Item width="50%" label='tutorials' title='Bonding and Unbonding' ext />
              <Item width="50%" label='tutorials' title='Slashing and Staking' ext />
            </ListWrapper>
          </ContentWrapper>
          <ContentWrapper>
            <HeaderWrapper>
              <h3>
                <FontAwesomeIcon icon={faBack} transform="grow-6" style={{ cursor: 'pointer' }} onClick={() => { setActiveSection(0) }} />
                &nbsp; Inner Information
                <span>
                  <button onClick={() => { assistant.toggle() }}>Close</button>
                </span>
              </h3>
            </HeaderWrapper>
          </ContentWrapper>
        </SectionsWrapper>
      </Wrapper>
    </>
  );
}

export default Assistant;