"use client";

import { useEffect, useState } from "react";
import { LOCAL_STORAGE_KEYS } from "../constants";
import { convertKeypairToHex, createKeypair } from "../lib/crypto";
import {
  FarcasterSigner,
  FrameActionBodyPayload,
  FrameContext,
  SignerStateInstance,
} from "frames.js/render";
import { signFrameAction } from "frames.js/render";
import { FrameButton } from "frames.js";

export interface DscvrIdentity {
  dscvrId?: string;
  contentId?: bigint;
}

export interface DscvrSigner extends FarcasterSigner, DscvrIdentity {}

interface DscvrFrameActionBodyPayload extends FrameActionBodyPayload {}
interface DscvrSignerState
  extends SignerStateInstance<
    DscvrSigner | null,
    DscvrFrameActionBodyPayload
  > {}

const getSignerFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEYS.DSCVR_USER);
    if (storedData) {
      const identity: DscvrSigner = JSON.parse(storedData);

      if (identity.contentId) {
        try {
          identity.contentId = BigInt(identity.contentId);
        } catch (e) {
          identity.contentId = undefined;
          console.error("Failed to parse contentId", e);
        }
      }

      return identity;
    }
    return null;
  }

  return null;
};

export const useDscvrIdentity = (): DscvrSignerState & {
  impersonateUser: (value: DscvrIdentity) => void;
} => {
  const [dscvrSigner, setDscvrSigner] = useState<DscvrSigner | null>(
    getSignerFromLocalStorage()
  );

  const impersonateUser = async (value: DscvrIdentity) => {
    const keypair = await createKeypair();
    const { privateKey, publicKey } = convertKeypairToHex(keypair);
    const signer: DscvrSigner = {
      ...value,
      status: "impersonating",
      fid: 1,
      privateKey,
      publicKey,
    };
    setDscvrSigner(signer);
  };

  useEffect(() => {
    const identity = getSignerFromLocalStorage();
    if (identity) setDscvrSigner(identity);
  }, []);

  const logout = () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.DSCVR_USER, "");
    setDscvrSigner(null);
  };

  const onSignerlessFramePress = () => {
    alert("You must be logged in to use this feature");
  };

  const dscvrSignFrameAction = async (context: {
    target?: string | undefined;
    frameButton: FrameButton;
    buttonIndex: number;
    url: string;
    signer: DscvrSigner | null | undefined;
    inputText?: string | undefined;
    state?: string | undefined;
    frameContext: FrameContext;
  }) => {
    const result = await signFrameAction(context);

    const body = result.body as any;
    return {
      ...result,
      body: {
        ...body,
        clientProtocol: "dscvr@test",
        untrustedData: {
          ...body.untrustedData,
          dscvrId: context.signer?.dscvrId,
          contentId: context.signer?.contentId?.toString(),
        },
      },
    };
  };

  return {
    signer: dscvrSigner,
    hasSigner: !!dscvrSigner?.dscvrId,
    signFrameAction: dscvrSignFrameAction,
    onSignerlessFramePress,
    impersonateUser,
    logout,
  };
};
