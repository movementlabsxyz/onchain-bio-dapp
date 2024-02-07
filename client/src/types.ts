import {
    InputGenerateTransactionOptions,
    AccountAddressInput,
    InputGenerateTransactionPayloadData,
  } from "@aptos-labs/ts-sdk";

  export type InputTransactionData = {
    sender?: AccountAddressInput;
    data: InputGenerateTransactionPayloadData;
    options?: InputGenerateTransactionOptions;
  };