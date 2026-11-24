import { apiClient } from '../../services/apiClient';
import {
  INCOMING_ENDPOINT,
  respondEndpoint,
  updateEndpoint,
  withdrawEndpoint,
} from './constants';
import type { QuotationDTO, QuoteBody, QuoteRequestDTO } from './types';

/**
 * Every enquiry this organizer can see. There is no single-request endpoint
 * for organizers, so the screen finds its enquiry in this list by id.
 */
export async function getIncomingRequests(): Promise<QuoteRequestDTO[]> {
  const { data } = await apiClient.get<QuoteRequestDTO[]>(INCOMING_ENDPOINT);
  return data;
}

/** First quote for an enquiry — sent, or parked as a draft (`asDraft`). */
export async function respondToRequest(
  requestId: string,
  body: QuoteBody,
): Promise<QuotationDTO> {
  const { data } = await apiClient.post<QuotationDTO>(
    respondEndpoint(requestId),
    body,
  );
  return data;
}

/** Revise a quote; a draft sent with `asDraft: false` goes to the customer. */
export async function updateQuotation(
  quotationId: string,
  body: QuoteBody,
): Promise<QuotationDTO> {
  const { data } = await apiClient.patch<QuotationDTO>(
    updateEndpoint(quotationId),
    body,
  );
  return data;
}

export async function withdrawQuotation(
  quotationId: string,
): Promise<QuotationDTO> {
  const { data } = await apiClient.patch<QuotationDTO>(
    withdrawEndpoint(quotationId),
  );
  return data;
}
