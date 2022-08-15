import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from 'be-core';
import { get as getConfig } from '../../config';
import { GetAvailablePartnersQuery } from './dtos/get-available-partners-query.dto';
import { GetAvailablePartnersResponse } from './dtos/get-available-partners-response.dto';

const externalServiceConfig = getConfig('externalService');

@Injectable()
export class DeliveryService {
    constructor(private httpClient: HttpService) {}

    async getAvailablePartners(query: GetAvailablePartnersQuery) {
        try {
            const deliveryRs = await this.httpClient.post<GetAvailablePartnersResponse[]>(
                `delivery/integration/v1/documents/partners/available`,
                query,
                {
                    config: {
                        baseURL: externalServiceConfig.deliveryService,
                    },
                }
            );
            return deliveryRs.data;
        } catch (er) {
            throw new BadRequestException(er);
        }
    }
}
