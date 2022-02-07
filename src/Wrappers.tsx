import styled from 'styled-components';
import { SIDE_MENU_INTERFACE_WIDTH, INTERFACE_MINIMUM_HEIGHT } from './constants';

// Highest level wrapper for Entry component
export const EntryWrapper = styled.div`
    width: 100%;
    background: #fbfbfb;
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
    flex-grow: 1;
    height: 100%;
    display: flex;
    flex-flow: row nowrap;
`;
