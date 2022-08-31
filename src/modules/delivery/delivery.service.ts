import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from 'be-core';
import { get as getConfig } from '../../config';
import { GetAvailablePartnersQuery } from './dtos/get-available-partners-query.dto';
import { GetAvailablePartnersResponse } from './dtos/get-available-partners-response.dto';
import { GetPartnersResponse } from './dtos/get-list-partners-response.dto';
import { GetListPartnerQuery } from './dtos/get-list-partner-query.dto';
import { GetPartnerPriceResponse } from './dtos/get-partner-price-response.dto';

const externalServiceConfig = getConfig('externalService');
@Injectable()
export class DeliveryService {
    constructor(private httpClient: HttpService) {}

    async getAvailablePartners(query: GetAvailablePartnersQuery) {
        const data = {
            from: {
                countryCode: query.fromCountryCode,
                provinceCode: query.fromProvinceCode,
                districtCode: query.fromDistrictCode,
                wardCode: query.fromWardCode,
                street: query.fromStreet,
                phoneNumber: query.fromPhoneNumber,
                fullName: query.fromFullName,
                postCode: query.fromPostCode,
                email: query.fromEmail,
            },
            to: {
                countryCode: query.toCountryCode,
                provinceCode: query.toProvinceCode,
                districtCode: query.toDistrictCode,
                wardCode: query.toWardCode,
                street: query.toStreet,
                phoneNumber: query.toPhoneNumber,
                fullName: query.toFullName,
                postCode: query.toPostCode,
                email: query.toEmail,
            },
        };
        try {
            const deliveryRs = await this.httpClient.post<GetAvailablePartnersResponse[]>(
                `https://api.1retail-dev.asia/external/delivery/integration/v1/documents/partners/available`,
                data,
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

    async getListPartner(skip: number, take: number) {
        try {
            const response = await this.httpClient.get<GetPartnersResponse>(
                `https://api.1retail-dev.asia/delivery/v1/partners?skip=${skip}&take=${take}`,
                {
                    autoInject: true,
                    config: {
                        baseURL: externalServiceConfig.deliveryService,
                    },
                }
            );
            return response.data;
        } catch (er) {
            throw new BadRequestException(er);
        }
    }

    async getPartnerPrice(partnerCode: string, query: GetListPartnerQuery) {
        try {
            const deliveryRs = await this.httpClient.get<GetPartnerPriceResponse[]>(
                `https://api.1retail-dev.asia/delivery/v1/partner-prices/${partnerCode}?fromDistrictCode=${query.fromDistrictCode}&fromProvinceCode=${query.fromProvinceCode}&toDistrictCode=${query.toDistrictCode}&toProvinceCode=${query.toProvinceCode}`,
                {
                    autoInject: true,
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
