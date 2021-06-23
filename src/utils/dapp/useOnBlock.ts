import {
  useEffect,
  useRef,
} from 'react';
import { TezosToolkit } from '@taquito/taquito';

export const useOnBlock = (tezos: TezosToolkit | null, callback: (hash: string) => void) => {
  const blockHashRef = useRef<string | undefined>();

  useEffect(() => {
    if (tezos) {
      let sub: any; // Which type do I have to set here?

      const spawnSub = () => {
        sub = tezos.stream.subscribe('head');

        sub.on('data', (hash: string) => {
          if (blockHashRef.current && blockHashRef.current !== hash) {
            callback(hash);
          }
          blockHashRef.current = hash;
        });
        sub.on('error', (err: Error) => {
          if (process.env.NODE_ENV === 'development') {
            console.error(err);
          }
          sub.close();
          spawnSub();
        });
      };

      spawnSub();
      return () => sub.close();
    }

    // close error: Expected to return a value
    return () => undefined;
  }, [tezos, callback]);
};
