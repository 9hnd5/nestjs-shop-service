import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from 'be-core';
import { get as getConfig } from '../../config';
import { GetPartnersResponse } from './dtos/get-partners-response.dto';

const externalServiceConfig = getConfig('externalService');

@Injectable()
export class PartnerService {
    constructor(private httpClient: HttpService) {}

    async getByCode(code: string) {
        try {
            const response = await this.httpClient.get<GetPartnersResponse>(
                `extenal/delivery/integration/v1/partners=${code}`,
                {
                    autoInject: true,
                    config: {
                        baseURL: externalServiceConfig.partnerService,
                        headers: {
                        },

                    },
                }
            );
            return response.data;
        } catch (er) {
            throw new BadRequestException(er);
        }
    }

    async gets() {
        try {
            const response = await this.httpClient.get<GetPartnersResponse>(
                `extenal/delivery/integration/v1/partners`,
                {
                    autoInject: true,
                    config: {
                        baseURL: externalServiceConfig.partnerService,
                    },
                }
            );
            return response.data;
        } catch (er) {
            throw new BadRequestException(er);
        }
    }
}
