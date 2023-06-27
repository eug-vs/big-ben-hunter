import { useEffect, useState } from 'react';
import * as openpgp from 'openpgp';

// Extract Public Key from env and read it into openPGP data structure
export default function usePublicKey() {
  const [key, setKey] = useState<openpgp.Key>();

  useEffect(() => {
    const armoredKey = atob(process.env.NEXT_PUBLIC_PUBLIC_KEY || '');
    openpgp.readKey({ armoredKey }).then(setKey).catch(console.error);
  }, []);

  return key;
}
