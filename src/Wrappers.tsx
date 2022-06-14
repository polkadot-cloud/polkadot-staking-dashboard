// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  SIDE_MENU_INTERFACE_WIDTH,
  INTERFACE_MAXIMUM_WIDTH,
  SIDE_MENU_STICKY_THRESHOLD,
  SHOW_SIDE_BAR_WIDTH_THRESHOLD,
  SECTION_FULL_WIDTH_THRESHOLD,
} from 'consts';
import {
  textPrimary,
  backgroundGradient,
  backgroundPrimary,
  borderPrimary,
} from 'theme';

/* EntryWrapper
 *
 * Highest level app component.
 * Provides global styling for headers and other global
 * classes used throughout the app and possibly the library.
 */
export const EntryWrapper = styled.div`
  background: ${backgroundGradient};
  box-sizing: border-box;
  width: 100%;
  background-attachment: fixed;
  display: flex;
  flex-flow: column nowrap;
  min-height: 100vh;
  flex-grow: 1;

  h1 {
    color: ${textPrimary};
  }
  h2 {
    color: ${textPrimary};
  }
  h3 {
    color: ${textPrimary};
  }
  h4 {
    color: ${textPrimary};
  }
  h5 {
    color: ${textPrimary};
  }
  a {
    color: ${textPrimary};
  }
  input {
    color: ${textPrimary};
  }

  path.primary {
    fill: ${textPrimary};
  }
  .page-padding {
    padding-left: 1.25rem;
    padding-right: 1.25rem;

    @media (min-width: ${SHOW_SIDE_BAR_WIDTH_THRESHOLD + 1}px) {
      padding-left: 1.75rem;
      padding-right: 1.75rem;
    }
    @media (min-width: ${SIDE_MENU_STICKY_THRESHOLD + 1}px) {
      padding: 0 3rem 0 1rem;
    }
    @media (min-width: 1500px) {
      padding: 0 5rem 0 1.5rem;
    }
  }
`;

/* BodyInterfaceWrapper
 *
 * An element that houses SideInterface and MainInterface.
 * Used once in Router.
 */
export const BodyInterfaceWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  position: relative;
  flex-grow: 1;
`;

/* SideInterfaceWrapper
 *
 * An element that houses the side menu and handles resizing
 * on smaller screens.
 * Used once in Router.
 */
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
  min-width: ${(props) =>
    props.minimised ? '75px' : `${SIDE_MENU_INTERFACE_WIDTH}px`};
  max-width: ${(props) =>
    props.minimised ? '75px' : `${SIDE_MENU_INTERFACE_WIDTH}px`};

  margin-right: ${(props) => (!props.minimised ? 0 : '1.25rem')};

  @media (max-width: ${SIDE_MENU_STICKY_THRESHOLD}px) {
    position: fixed;
    transition: all 0.15s ease-in-out;
    top: 0;
    left: ${(props) => (props.open ? 0 : `-${SIDE_MENU_INTERFACE_WIDTH}px`)};
  }
`;

/* MainInterfaceWrapper
 *
 * A column flex wrapper that hosts the main page content.
 * Used once in Router.
 */
export const MainInterfaceWrapper = styled.div`
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  position: relative;
`;

/* PageWrapper
 *
 * A motion.div that wraps every page.
 * Transitions can be applied to this wrapper that will
 * affect the entire page.
 */
export const PageWrapper = styled(motion.div)`
  max-width: ${INTERFACE_MAXIMUM_WIDTH}px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
  padding-bottom: 4.5rem;
  width: 100%;
  margin: 0 auto;
`;

/* PageTitleWrapper
 *
 * The element that wraps a page title. Determines the padding
 * and position relative to top of screen when the element
 * is stuck.
 */
export const PageTitleWrapper = styled.header<any>`
  box-sizing: border-box;
  background: ${backgroundPrimary};
  position: sticky;
  top: 0px;
  padding-top: 1.5rem;
  padding-bottom: 0.5rem;
  @media (max-width: ${SIDE_MENU_STICKY_THRESHOLD}px) {
    top: 4rem;
    padding-top: 0.25rem;
  }
  width: 100%;
  z-index: 4;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-end;
  transition: padding 0.3s ease-out;

  h1 {
    font-size: ${(props) => (props.sticky ? '1.4rem ' : '1.8rem')};
    @media (max-width: ${SIDE_MENU_STICKY_THRESHOLD}px) {
      font-size: 1.5rem;
    }
    transition: font 0.5s;
  }
`;

/* MenuPaddingWrapper
 *
 * A fixed block that is used to hide scrollable content
 * on smaller screens when a PageTitle is fixed.
 * Purely cosmetic. Applied in Pagetitle.
 */
export const MenuPaddingWrapper = styled.div`
  background: ${backgroundPrimary};
  box-sizing: border-box;
  position: fixed;
  top: 0px;
  width: 100%;
  height: 4rem;
  z-index: 4;
  display: none;
  @media (max-width: ${SIDE_MENU_STICKY_THRESHOLD}px) {
    display: block;
  }
`;

/* PageRowWrapper
 *
 * Used to separate page content based on rows.
 * Commonly used with RowPrimaryWrapper and RowSecondaryWrapper.
 */
export const PageRowWrapper = styled.div<any>`
  box-sizing: border-box;
  margin-top: ${(props) => (props.noVerticalSpacer === true ? '0' : '1rem')};
  margin-bottom: ${(props) => (props.noVerticalSpacer === true ? '0' : '1rem')};
  display: flex;
  flex-shrink: 0;
  flex-flow: row wrap;
  width: 100%;
  * {
    box-sizing: border-box;
  }
  /* kill heading padding, already applied to wrapper */
  h1,
  h2,
  h3,
  h4 {
    margin-top: 0;
  }
`;

/* RowPrimaryWrapper
 *
 * The primary module in a PageRow.
 */
export const RowPrimaryWrapper = styled.div<any>`
  order: ${(props) => props.vOrder};
  box-sizing: border-box;
  flex: 1;
  flex-basis: 100%;
  max-width: 100%;

  @media (min-width: ${SIDE_MENU_STICKY_THRESHOLD + 1}px) {
    ${(props) => props.hOrder === 0 && ' padding-right: 0.5rem;'}
    ${(props) => props.hOrder === 1 && 'padding-left: 0.5rem;'}
    order: ${(props) => props.hOrder};
    flex-basis: 50%;
    width: 50%;
    flex: 1;
  }

  @media (min-width: ${SECTION_FULL_WIDTH_THRESHOLD + 400}px) {
    flex-basis: 62%;
    width: 62%;
  }
`;

/* RowSecondaryWrapper
 *
 * The secondary module in a PageRow.
 */
export const RowSecondaryWrapper = styled.div<any>`
  order: ${(props) => props.vOrder};
  box-sizing: border-box;
  flex-basis: 100%;
  width: 100%;
  border-radius: 1rem;

  @media (min-width: ${SIDE_MENU_STICKY_THRESHOLD + 1}px) {
    ${(props) => props.hOrder === 1 && ' padding-left: 0.5rem;'}
    ${(props) => props.hOrder === 0 && 'padding-right: 0.5rem;'}
    order: ${(props) => props.hOrder};
    flex-basis: 50%;
    width: 50%;
    flex: 1;
  }

  @media (min-width: ${SECTION_FULL_WIDTH_THRESHOLD + 400}px) {
    flex-basis: 38%;
    max-width: 38%;
  }
`;

/* Separator
 *
 * A horizontal spacer with a bottom border.
 * General spacer for separating content by row.
 */
export const Separator = styled.div`
  border-bottom: 1px solid ${borderPrimary};
  width: 100%;
  margin: 0.75rem 0;
`;
