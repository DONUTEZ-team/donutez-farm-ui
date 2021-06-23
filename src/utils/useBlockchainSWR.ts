import useSWR, {
  ConfigInterface,
  keyInterface,
  responseInterface,
} from 'swr';
import { useOnBlock, useTezos } from './dapp';

type SWRArgs<Data = any, Error = any> =
  | [keyInterface, ConfigInterface<Data, Error>?]
  | [
    keyInterface,
    ((...args: any[]) => Data | Promise<Data>)?,
    ConfigInterface<Data, Error>?,
  ];

function useBlockchainSWR<Data = any, Error = any>(
  key: keyInterface,
): responseInterface<Data, Error>;
function useBlockchainSWR<Data = any, Error = any>(
  key: keyInterface,
  config?: ConfigInterface<Data, Error>,
): responseInterface<Data, Error>;
function useBlockchainSWR<Data = any, Error = any>(
  key: keyInterface,
  fn?: (...args: any[]) => Data | Promise<Data>,
  config?: ConfigInterface<Data, Error>
): responseInterface<Data, Error>;
function useBlockchainSWR<Data = any, Error = any>(...args: SWRArgs<Data, Error>) {
  const {
    revalidate,
    ...restProps
    // @ts-ignore
  } = useSWR(...args);
  const tezos = useTezos();

  useOnBlock(tezos, revalidate);

  return {
    revalidate,
    ...restProps,
  };
}

export default useBlockchainSWR;
