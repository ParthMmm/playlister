//add jotai atom

import { atom } from "jotai";

export const codeAtom = atom("" as string);

type Token = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
};

export const tokenAtom = atom({
  access_token: "",
  token_type: "",
  expires_in: 0,
  refresh_token: "",
  scope: "",
} as Token);

type Length = {
  good: number;
  bad: number;
};

export const lengthAtom = atom({
  good: 0,
  bad: 0,
} as Length);
