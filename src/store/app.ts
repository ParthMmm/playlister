//add jotai atom

import { type PrimitiveAtom, atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

const storage = createJSONStorage(() => sessionStorage);
export const codeAtom = atom("" as string);

export type Token = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
};

export const tokenAtom = atomWithStorage(
  "x",
  {
    access_token: "",
    token_type: "",
    expires_in: 0,
    refresh_token: "",
    scope: "",
  } as Token,
  storage
) as PrimitiveAtom<Token>;

type Length = {
  good: number;
  bad: number;
};

export const lengthAtom = atom({
  good: 0,
  bad: 0,
} as Length);

export const playingTrackIdAtom = atom<string | null>(null);
export const playingAtom = atom<boolean | null | string>(false);

export const removedTracksAtom = atom<string[]>([]);
export const addedTracksAtom = atom<(string | undefined)[]>([]);
export const formattedAtom = atom<boolean>(false);
export const promptAtom = atom<string>("");
