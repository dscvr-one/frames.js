import {
  type DscvrFramesRequest,
  type DscvrClientProtocol,
  type DscvrValidationResponse,
  validateClientProtocol,
  validateFramesPost,
} from "@dscvr-one/frames-adapter";
import { FrameActionPayload } from "..";

export const isDscvrFrameActionPayload = (
  frameActionPayload: FrameActionPayload,
): frameActionPayload is DscvrFramesRequest => {
  return (
    !!frameActionPayload.clientProtocol &&
    validateClientProtocol(frameActionPayload.clientProtocol)
  );
};

export const validateDscvrFrameMessage = async (
  frameActionPayload: DscvrFramesRequest,
  apiUrl?: string,
): Promise<DscvrValidationResponse> => {
  const result = await validateFramesPost(
    {
      ...frameActionPayload,
      clientProtocol: frameActionPayload.clientProtocol as DscvrClientProtocol,
    },
    apiUrl,
  );

  return result;
};
