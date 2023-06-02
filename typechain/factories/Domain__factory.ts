/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Domain, DomainInterface } from "../Domain";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
];

const _bytecode =
  "0x60c0604052348015600f57600080fd5b504660a0819052601d816025565b60805250607e565b604080517f47e79534a245952e8b16893a336b85a3d9ea9fa8c573f3d803afb92a794692186020808301919091528183019390935230606080830191909152825180830390910181526080909101909152805191012090565b60805160a051603f60946000395050603f6000f3fe6080604052600080fdfea26469706673582212203e9072e86f5dcd05d5547b2acfb912ca1f6d1479abfa15a8c82d2dda85cd6a1664736f6c634300060c0033";

export class Domain__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Domain> {
    return super.deploy(overrides || {}) as Promise<Domain>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Domain {
    return super.attach(address) as Domain;
  }
  connect(signer: Signer): Domain__factory {
    return super.connect(signer) as Domain__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DomainInterface {
    return new utils.Interface(_abi) as DomainInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Domain {
    return new Contract(address, _abi, signerOrProvider) as Domain;
  }
}
