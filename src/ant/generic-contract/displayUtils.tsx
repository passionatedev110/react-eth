import { TransactionResponse } from '@ethersproject/providers';
import { formatUnits } from '@ethersproject/units';
import { BigNumber } from 'ethers';
import React, { ReactElement } from 'react';

import { Address } from '~~/ant/Address';

export const tryToDisplay = (
  thing: string | BigNumber | Record<string, any> | TransactionResponse | undefined
): string | ReactElement | number | BigInt => {
  if (thing == null) return '';
  if (thing && thing instanceof BigNumber) {
    try {
      return thing.toBigInt();
    } catch (e) {
      return 'Ξ' + formatUnits(thing, 'ether');
    }
  }
  if (thing && typeof thing === 'string' && thing.indexOf('0x') === 0 && thing.length === 42) {
    return <Address address={thing} fontSize={22} />;
  }
  return JSON.stringify(thing);
};
