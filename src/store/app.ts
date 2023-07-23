//add jotai atom

import { atom } from "jotai";

export const codeAtom = atom("" as string);

interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

export const tokenAtom = atom({} as Token);
