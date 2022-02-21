import styled from 'styled-components';
import { motion } from 'framer-motion';
import { SIDE_MENU_INTERFACE_WIDTH, INTERFACE_MINIMUM_HEIGHT, INTERFACE_MINIMUM_WIDTH } from './constants';

// Highest level wrapper for Entry component
export const EntryWrapper = styled.div`
    width: 100%;
    min-width: ${INTERFACE_MINIMUM_WIDTH}px;
    background: #fbfbfb;
    background: linear-gradient(300deg, rgba(235,235,235,1) 0%, rgba(252,252,252,1) 100%);
    display: flex;
    flex-flow: column nowrap;
    height: 100vh;
`;

// Body interface wrapper
export const BodyInterfaceWrapper = styled.div`
    display: flex;
    position: relative;
    flex: 1;
    min-height: ${INTERFACE_MINIMUM_HEIGHT}px;
`;

// Side interface wrapper
export const SideInterfaceWrapper = styled.div`
    height: 100%;
    min-width: ${SIDE_MENU_INTERFACE_WIDTH}px;
    display: flex;
    flex-flow: column nowrap;
`;

// Main interface wrapper
export const MainInterfaceWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-flow: row nowrap;
    overflow: auto;
`;

// Page wrapper
export const PageWrapper = styled(motion.div)`
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    padding: 3.75rem 1rem;
    overflow: hidden;
`;

// Page Row wrapper
export const PageRowWrapper = styled.div<any>`
    margin: 1rem 0;
    display: flex;
    flex-shrink: 0;
    flex-flow: row nowrap;
    width: 100%;
    padding-right: 6rem;
    box-sizing: border-box;
    overflow-x: scroll;
    * {
        box-sizing: border-box;
    }
`;