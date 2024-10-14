import { SendOutlined } from '@ant-design/icons';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { parseEther } from '@ethersproject/units';
import { Button, Input, Tooltip } from 'antd';
import { useEnsAddress } from 'eth-hooks/dapps';
import React, { FC, useCallback, useContext, useState } from 'react';
import Blockies from 'react-blockies';

import { Wallet } from '.';

import { transactor } from '~~/functions';
import { EthComponentsContext } from '~~/models';

// improved a bit by converting address to ens if it exists
// added option to directly input ens name
// added placeholder option

interface IFaucetProps {
  address?: string;
  price: number;
  mainnetProvider: StaticJsonRpcProvider;
  placeholder?: string;
  localProvider: StaticJsonRpcProvider;
}

/**
 * Displays a local faucet to send ETH to given address, also wallet is provided
 * 
 * ~ Features ~

  - Provide price={price} of ether and convert between USD and ETH in a wallet
  - Provide localProvider={localProvider} to be able to send ETH to given address
  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth") or you can enter directly ENS name instead of address
              works both in input field & wallet
  - Provide placeholder="Send local faucet" value for the input
 * @param props 
 * @returns (FC)
 */
export const Faucet: FC<IFaucetProps> = (props) => {
  const [address, setAddress] = useState<string>();

  let blockie;
  if (props.address && typeof props.address.toLowerCase === 'function') {
    blockie = <Blockies seed={props.address.toLowerCase()} size={8} scale={4} />;
  } else {
    blockie = <div />;
  }

  const ens = useEnsAddress(props.mainnetProvider, props.address ?? '');
  const context = useContext(EthComponentsContext);

  const updateAddress = useCallback(
    async (newValue: string) => {
      if (typeof newValue !== 'undefined') {
        let tempAddress = newValue;
        if (tempAddress.indexOf('.eth') > 0 || tempAddress.indexOf('.xyz') > 0) {
          try {
            const possibleAddress = await props.mainnetProvider.resolveName(tempAddress);
            if (possibleAddress) {
              tempAddress = possibleAddress;
            }
            // eslint-disable-next-line no-empty
          } catch (e) {}
        }
        setAddress(tempAddress);
      }
    },
    [props.mainnetProvider]
  );

  const localSigner = props.localProvider.getSigner(address);
  const tx = transactor(context, localSigner);

  return (
    <span>
      <Input
        size="large"
        placeholder={props.placeholder ? props.placeholder : 'local faucet'}
        prefix={blockie}
        // value={address}
        value={ens || address}
        onChange={(e): void => {
          // setAddress(e.target.value);
          void updateAddress(e.target.value);
        }}
        suffix={
          <Tooltip title="Faucet: Send local ether to an address.">
            <Button
              onClick={(): void => {
                if (tx) {
                  void tx({
                    to: address,
                    value: parseEther('0.01'),
                  });
                }
                setAddress('');
              }}
              shape="circle"
              icon={<SendOutlined />}
            />
            <Wallet
              color="#888888"
              signer={localSigner}
              localProvider={props.localProvider}
              ensProvider={props.mainnetProvider}
              price={props.price}
            />
          </Tooltip>
        }
      />
    </span>
  );
};
