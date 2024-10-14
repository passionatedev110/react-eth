import { Button } from 'antd';
import { TEthersProvider, TProviderAndSigner } from 'eth-hooks/models';
import React, { FC } from 'react';
import { useThemeSwitcher } from 'react-css-theme-switcher';

import { Address, Balance, Wallet } from '.';

export interface IAccountProps {
  currentProviderAndSinger: TProviderAndSigner;
  mainnetProvider: TEthersProvider;
  price: number;
  minimized?: string;
  loadWeb3Modal?: () => void;
  logoutOfWeb3Modal?: () => void;
  blockExplorer: string;
}

/**
  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

    ~ Features ~
  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
 * @param props
 * @returns (FC)
 */
export const Account: FC<IAccountProps> = (props: IAccountProps) => {
  const {
    currentProviderAndSinger,
    mainnetProvider,
    price,
    minimized,
    loadWeb3Modal,
    logoutOfWeb3Modal,
    blockExplorer,
  } = props;

  const modalButtons = [];
  if (loadWeb3Modal && logoutOfWeb3Modal) {
    modalButtons.push(
      <Button
        key="logoutbutton"
        style={{ verticalAlign: 'top', marginLeft: 8, marginTop: 4 }}
        shape="round"
        size="large"
        onClick={logoutOfWeb3Modal}>
        logout
      </Button>
    );
  } else {
    modalButtons.push(
      <Button
        key="loginbutton"
        style={{ verticalAlign: 'top', marginLeft: 8, marginTop: 4 }}
        shape="round"
        size="large"
        /* type={minimized ? "default" : "primary"}     too many people just defaulting to MM and having a bad time */
        onClick={loadWeb3Modal}>
        connect
      </Button>
    );
  }

  const { currentTheme } = useThemeSwitcher();
  const address = currentProviderAndSinger.address;

  const display = minimized ? (
    ''
  ) : (
    <span>
      {address ? (
        <Address punkBlockie address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} />
      ) : (
        'Connecting...'
      )}
      <Balance address={address ?? ''} provider={currentProviderAndSinger.provider} price={price} />
      <Wallet
        address={address ?? ''}
        signer={currentProviderAndSinger.signer}
        ensProvider={mainnetProvider}
        price={price}
        color={currentTheme === 'light' ? '#1890ff' : '#2caad9'}
      />
    </span>
  );

  return (
    <div>
      {display}
      {modalButtons}
    </div>
  );
};
