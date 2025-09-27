import axios from 'axios';
import buildApiPrefix from './buildApiPrefix';

export interface Envelope {
  id: string;
  name: string;
  budget: number;
  createdAt: string;
  updatedAt: string;
}

export default async function getEnvelopes(): Promise<Envelope[]> {
  const response = await axios.get(`${buildApiPrefix()}/envelopes`);
  return response.data;
}
