// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { SIDE_MENU_INTERFACE_WIDTH, INTERFACE_MINIMUM_WIDTH, INTERFACE_MAXIMUM_WIDTH } from './constants';

// Highest level wrapper for Entry component
export const EntryWrapper = styled.div`
    width: 100%;
    min-width: ${INTERFACE_MINIMUM_WIDTH}px;
    background: #fbfbfb;
    background: linear-gradient(180deg, rgba(251,251,251,1) 0%, rgba(229,229,229,1) 100%);
    display: flex;
    flex-flow: column nowrap;
    min-height: 100vh;
    flex-grow: 1;
`;

// Body interface wrapper
export const BodyInterfaceWrapper = styled.div`
    display: flex;
    flex-flow: row nowrap;
    position: relative;
    flex-grow: 1;
`;

// Side interface wrapper
export const SideInterfaceWrapper = styled.div`
    height: 100vh;
    min-width: ${SIDE_MENU_INTERFACE_WIDTH}px;
    display: flex;
    flex-flow: column nowrap;
    position: sticky;
    top: 0px;
`;

// Main interface wrapper
export const MainInterfaceWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    h1.title {
        font-size: 1.7rem;
        font-variation-settings: 'wght' 460;
        margin-bottom: 0.3rem;
        color: #333;
    }
`;

// Page wrapper
export const PageWrapper = styled(motion.div)`
    display: flex;
    flex-flow: column nowrap;
    padding: 1.8vh 0 4.5rem 0;
    margin: 0 2rem;
    flex-grow: 1;
    max-width: ${INTERFACE_MAXIMUM_WIDTH}px;
`;

// Page Row wrapper
export const PageRowWrapper = styled.div<any>`
    margin: ${props => props.noVerticalSpacer === true ? `0` : `1rem 0`};
    display: flex;
    flex-shrink: 0;
    flex-flow: row nowrap;
    width: 100%;
    box-sizing: border-box;
    overflow-x: scroll;

    * {
        box-sizing: border-box;
    }

    /* kill heading padding, already applied to wrapper */
    h1, h2, h3, h4 {
        margin-top: 0;
    }
`;