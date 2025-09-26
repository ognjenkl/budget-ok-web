import buildApiPrefix from "./buildApiPrefix.ts";
import type CreateEnvelopeDto from "./create.envelope.dto.ts";
import type CreateEnvelopeResponse from "./create.envelope.response.ts";
import axios from "axios";

const apiPrefix = buildApiPrefix();
const api = `${apiPrefix}/envelopes`;

export default async function createEnvelope(data: CreateEnvelopeDto): Promise<CreateEnvelopeResponse> {
  const response = await axios.post(api, data);
  return response.data;
}