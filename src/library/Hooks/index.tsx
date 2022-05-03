// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect } from "react";

/*
 * A hook that alerts clicks outside of the passed ref.
 */
export const useOutsideAlerter = (ref: any, callback: any, ignore: any = []) => {
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        let invalid = ignore.find((i: any) => event.target.classList.contains(i));
        invalid ?? callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

/*
 * A hook that wraps multiple context providers to a component and makes each parent context accessible.
 */
export const withProviders = (...providers: any) => (WrappedComponent: any) => (props: any) =>
  providers.reduceRight((acc: any, prov: any) => {
    let Provider = prov;
    if (Array.isArray(prov)) {
      Provider = prov[0];
      return <Provider {...prov[1]}>{acc}</Provider>;
    }

    return <Provider>{acc}</Provider>;
  }, <WrappedComponent {...props} />);
