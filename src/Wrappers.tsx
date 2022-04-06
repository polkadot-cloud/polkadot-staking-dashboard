// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { SIDE_MENU_INTERFACE_WIDTH, INTERFACE_MAXIMUM_WIDTH, SIDE_MENU_STICKY_THRESHOLD } from './constants';

// Highest level wrapper for Entry component
export const EntryWrapper = styled.div`
    box-sizing: border-box;
    width: 100%;
    background: #fbfbfb;
    background: linear-gradient(180deg, rgba(247,247,247,1) 0%, rgba(247,247,247,1) 100px, rgba(229,229,229,1) 100%);
    background-attachment: fixed;
    display: flex;
    flex-flow: column nowrap;
    min-height: 100vh;
    flex-grow: 1;
`;

// Body interface wrapper
export const BodyInterfaceWrapper = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-flow: row nowrap;
    position: relative;
    flex-grow: 1;
`;

// Side interface wrapper
export const SideInterfaceWrapper = styled.div<any>`
    box-sizing: border-box;
    height: 100vh;
    display: flex;
    flex-flow: column nowrap;
    position: sticky;
    top: 0px;
    z-index: 6;
    flex: 0;
    overflow: hidden;
    min-width: ${SIDE_MENU_INTERFACE_WIDTH}px;
    max-width: ${SIDE_MENU_INTERFACE_WIDTH}px;
    transition: all 0.15s ease-in-out;

    @media(max-width: ${SIDE_MENU_STICKY_THRESHOLD}px) {
        position: fixed;
        top: 0;
        left: ${props => props.open ? 0 : `-${SIDE_MENU_INTERFACE_WIDTH}px`};
    }
`;

// Main interface wrapper
export const MainInterfaceWrapper = styled.div`
    box-sizing: border-box;
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
`;

// Page wrapper
export const PageWrapper = styled(motion.div)`
    box-sizing: border-box;
    display: flex;
    flex-flow: column nowrap;
    padding-bottom: 4.5rem;
    max-width: ${INTERFACE_MAXIMUM_WIDTH}px;
    flex: 1;
`;

// Sticky page title wrapper
export const PageTitleWrapper = styled.header<any>` 
    box-sizing: border-box;
    position: sticky;
    top: 0px;
    padding-top: ${props => props.isSticky ? '4.5vh ' : '1.4vh '};
    @media(max-width: ${SIDE_MENU_STICKY_THRESHOLD}px) {
        padding-top: ${props => props.isSticky ? '7vh ' : '2vh '};
    }
    padding-bottom: ${props => props.isSticky ? '1rem ' : '0.25vh '};
    width: 100%;
    background: ${props => props.isSticky ? 'rgba(247,247,247,1) ' : 'none'};
    z-index: 4;
    display: flex;
    flex-flow: column wrap;
    justify-content: flex-end;
    min-height: ${props => props.isSticky ? '30px ' : 'none'};
    transition: padding 0.3s ease-out, background-color 0.2s;

    h1 {
     font-size: ${props => props.isSticky ? '1.4rem ' : '1.7rem'};
     transition: font-size 0.5s;
     font-variation-settings: 'wght' 440;
     padding-left: 2rem;
     padding-right: 2rem;
    }
`;

// Page Row wrapper
export const PageRowWrapper = styled.div<any>`
    box-sizing: border-box;
    margin-top: ${props => props.noVerticalSpacer === true ? `0` : `1rem`};
    margin-bottom: ${props => props.noVerticalSpacer === true ? `0` : `1rem`};
    display: flex;
    flex-shrink: 0;
    flex-flow: row nowrap;
    width: 100%;
    padding-left: 1.5rem;
    padding-right: 3rem;

    @media(max-width: ${SIDE_MENU_STICKY_THRESHOLD}px) {
        padding-left: 2.5rem;
        padding-right: 2.5rem;
    }
    * {
        box-sizing: border-box;
    }

    /* kill heading padding, already applied to wrapper */
    h1, h2, h3, h4 {
        margin-top: 0;
    }
`;