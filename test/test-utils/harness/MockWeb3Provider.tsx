import { Web3ReactProvider } from '@web3-react/core';
import { TEthersProvider } from 'eth-hooks/models';
import { MockProvider } from 'ethereum-waffle';
import React, { FC, useEffect, useState } from 'react';

import { useEthersProvider } from '~test-utils/hooks/useEthersProvider';

export interface IMockEthersWrapper {
  mockProvider: MockProvider | TEthersProvider;
}
const ActivateWrapper: FC = (props) => {
  const { activate, library, deactivate } = useEthersProvider();

  useEffect(() => {
    if (library && activate) {
      // const connector = new MockConnector(library);
      // void activate(connector, console.error);
    }
  }, [activate, library]);

  useEffect(() => {
    () => {
      return (): void => {
        deactivate && deactivate();
      };
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{props.children}</>;
};

export const MockEthersWrapper: FC<IMockEthersWrapper> = (props) => {
  const [setupMock, setSetupMock] = useState<() => MockProvider | TEthersProvider>();
  useEffect(() => {
    setSetupMock((): MockProvider | TEthersProvider => {
      return props.mockProvider;
    });
  }, []);

  return (
    <>
      {setupMock != null && (
        <Web3ReactProvider getLibrary={setupMock}>
          <ActivateWrapper>{props.children}</ActivateWrapper>
        </Web3ReactProvider>
      )}
    </>
  );
};
