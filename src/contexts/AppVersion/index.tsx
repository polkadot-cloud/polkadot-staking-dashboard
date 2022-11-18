import React, { useEffect, useState } from 'react';

export interface AppVersionContextInterface {
  updateVersion: (v: string) => void;
  isVersionUpdated: boolean;
  appVersion: string;
}

export const defaultAppVersionContext: AppVersionContextInterface = {
  updateVersion: (v) => {},
  isVersionUpdated: false,
  appVersion: '',
};

export const AppVersionContext =
  React.createContext<AppVersionContextInterface>(defaultAppVersionContext);

export const useAppVersion = () => React.useContext(AppVersionContext);

export const AppVersionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const localAppVersion = localStorage.getItem('app_version');
  const [appVersion, setAppVersion] = useState('');

  if (!localAppVersion) {
    localStorage.setItem('app_version', appVersion);
  }

  const updateVersion = (v: string) => {
    const ver = v;
    useEffect(() => {
      setAppVersion(ver);
      localStorage.setItem('app_version', ver);
    }, [ver]);
  };

  return (
    <AppVersionContext.Provider
      value={{
        updateVersion,
        isVersionUpdated: false,
        appVersion,
      }}
    >
      {children}
    </AppVersionContext.Provider>
  );
};
