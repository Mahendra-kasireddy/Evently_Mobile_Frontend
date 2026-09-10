import { apiClient } from '../../services/apiClient';
import {
  ACCEPT_QUOTATION_ENDPOINT,
  QUOTE_REQUEST_ENDPOINT,
  REJECT_QUOTATION_ENDPOINT,
} from './constants';
import type { QuoteRequestDTO } from './types';

/**
 * One request and every quote on it.
 *
 * The endpoint already returns the quotations with their line items, and it
 * checks ownership server-side — a request id belonging to somebody else is a
 * 404, not a leak.
 */
export async function fetchQuoteRequest(requestId: string): Promise<QuoteRequestDTO> {
  const { data } = await apiClient.get<QuoteRequestDTO>(`${QUOTE_REQUEST_ENDPOINT}/${requestId}`);
  return data;
}

export async function acceptQuotation(quotationId: string): Promise<void> {
  await apiClient.post(`${ACCEPT_QUOTATION_ENDPOINT}/${quotationId}`);
}

export async function rejectQuotation(quotationId: string): Promise<void> {
  await apiClient.post(`${REJECT_QUOTATION_ENDPOINT}/${quotationId}`);
}
