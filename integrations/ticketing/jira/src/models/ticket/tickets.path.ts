/** Copyright (c) 2023, Poozle, all rights reserved. **/

import { BasePath, Config } from '@poozle/engine-idk';
import axios, { AxiosHeaders } from 'axios';
import { formatDateForSince, getBaseUrl, getMetaParams } from 'common';

import { CreateTicketParams, FetchTicketsParams } from './ticket.interface';
import { convertTicket, JIRATicketBody } from './ticket.utils';

export class TicketsPath extends BasePath {
  async fetchTickets(
    url: string,
    headers: AxiosHeaders,
    { queryParams, pathParams }: FetchTicketsParams,
    config: Config,
  ) {
    const page = queryParams.cursor ? parseInt(queryParams.cursor) : 0;
    const startAt = page * queryParams.limit;
    const since = queryParams.created_after
      ? ` AND updatedDate>"${formatDateForSince(queryParams.created_after)}"`
      : '';

    const final_params = {
      maxResults: queryParams.limit,
      startAt,
    };

    const response = await axios({
      url: `${url}${since}`,
      headers,
      params: final_params,
    });

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: response.data.issues.map((data: any) =>
        convertTicket(data, pathParams?.collection_id as string | null, config),
      ),
      meta: getMetaParams(response.data.issues, queryParams.limit as number, page),
    };
  }

  async createTickets(
    url: string,
    headers: AxiosHeaders,
    params: CreateTicketParams,
    config: Config,
  ) {
    try {
      const body = params.requestBody;

      const collectionId = params.pathParams.collection_id as string;

      const createBody: JIRATicketBody = {
        fields: {
          project: {
            id: !Number.isNaN(Number(collectionId)) ? collectionId : undefined,
            key: Number.isNaN(Number(collectionId)) ? collectionId : undefined,
          },
          summary: body.name,
          description: body.description,
          issuetype: {
            id: !Number.isNaN(Number(body.type)) ? body.type : undefined,
            name: Number.isNaN(Number(body.type)) ? body.type : undefined,
          },
          assignee: body.assignees?.[0]
            ? {
                accountId: body.assignees?.[0]?.id,
              }
            : undefined,
          reporter: body.created_by
            ? {
                id: body.created_by,
              }
            : undefined,
          labels: body.tags?.map((tag) => tag.name) || [],
          ...(params.customFields || {}),
        },
      };

      const cleanedCreateBody = {
        fields: Object.fromEntries(
          Object.entries(createBody.fields).filter(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ([_, value]) => value !== undefined && value !== null,
          ),
        ),
      };
      config

      const createResponse = await axios.post(url, cleanedCreateBody, { headers });

      const response = await axios.get(createResponse.data.self, { headers });

      return {
        data: convertTicket(response.data, params.pathParams.collection_id, config),
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  async run(
    method: string,
    headers: AxiosHeaders,
    params: FetchTicketsParams | CreateTicketParams,
    config: Config,
  ) {
    let url = '';
    const baseURL = await getBaseUrl(config, headers);

    switch (method) {
      case 'GET':
        url = `${baseURL}/search?jql=project=${params.pathParams.collection_id}`;
        return this.fetchTickets(url, headers, params, config);

      case 'POST':
        url = `${baseURL}/issue`;
        const createTicketParams = params as CreateTicketParams;
        if (config.custom_fields) {
          createTicketParams.customFields = config.custom_fields;
        }
        return this.createTickets(url, headers, createTicketParams, config);

      default:
        throw new Error('Method not found');
    }
  }
}
