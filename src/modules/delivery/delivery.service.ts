import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from 'be-core';
import { get as getConfig } from '../../config';
import { GetAvailablePartnersQuery } from './dtos';

const externalServiceConfig = getConfig('externalService');

interface FormField {
    label: string;
    value: string | number | null | undefined;
    fieldName: string;
}

interface PartnerInformation {
    host?: FormField;
    countryCode?: FormField;
    version?: FormField;
    protocol?: FormField;
    accessToken?: FormField;
    isUseStore?: FormField;
    isUsePriceList?: FormField;
    clientId?: FormField;
    clientSecret?: FormField;
    tokenExpiresTime?: FormField;
}

export interface DeliveryPartner {
    _id: string;
    code: string;
    name: string;
    description: string;
    partnerInformation: PartnerInformation;
    isActive: boolean;
    price: number;
}

@Injectable()
export class DeliveryService {
    constructor(private httpClient: HttpService) {}

    async getAvailablePartners(query: GetAvailablePartnersQuery) {
        try {
            const deliveryRs = await this.httpClient.post<DeliveryPartner[]>(
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
