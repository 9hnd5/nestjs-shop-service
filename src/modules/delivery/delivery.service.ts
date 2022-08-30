import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from 'be-core';
import { get as getConfig } from '../../config';
import { GetAvailablePartnersQuery } from './dtos/get-available-partners-query.dto';
import { GetAvailablePartnersResponse } from './dtos/get-available-partners-response.dto';
import { GetDocumentByCodeResponse } from './dtos/get-document-by-code-response.dto';
import { GetDocumentsQuery } from './dtos/get-document-query.dto';
import { GetDocumentResponse } from './dtos/get-document-response.dto';

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
                        headers: {},
                    },
                }
            );
            return deliveryRs.data;
        } catch (er) {
            throw new BadRequestException(er);
        }
    }

    async getByCode(code: string) {
        try {
            const response = await this.httpClient.get<GetDocumentByCodeResponse>(
                `https://api.1retail-dev.asia/external/delivery/integration/v1/documents/${code}`,
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

    async getDocumentConfirmed(code: string, query: GetDocumentsQuery) {
        const data = {
            code: query.code,
            status: query.status,
            partnerCode: query.partnerCode,
            userId: query.userId,
            from: query.from,
            to: query.to,
            dimension: query.dimension,
            fromNote: query.fromNote,
            toNote: query.toNote,
            isPickup: query.isPickup,
            insuranceAmount: query.insuranceAmount,
            insuranceFee: query.insuranceFee,
            isCOD: query.isCOD,
            codAmount: query.codAmount,
            allowTrial: query.allowTrial,
            paymentType: query.paymentType,
            serviceLevel: query.serviceLevel,
            itemType: query.itemType,
            deliveryFee: query.deliveryFee,
            totalFee: query.totalFee,
            email: query.email,
            lines: query.lines,
            webhook: query.webhook,
            totalFeeUpdated: query.totalFeeUpdated,
        };
        try {
            const deliveryRs = await this.httpClient.post<GetDocumentResponse>(
                `https://api.1retail-dev.asia/external/delivery/integration/v1/documents/${code}`,
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

    async getDocumentCanceled(code: string, query: GetDocumentsQuery) {
        const data = {
            code: query.code,
            status: query.status,
            partnerCode: query.partnerCode,
            userId: query.userId,
            from: query.from,
            to: query.to,
            dimension: query.dimension,
            fromNote: query.fromNote,
            toNote: query.toNote,
            isPickup: query.isPickup,
            insuranceAmount: query.insuranceAmount,
            insuranceFee: query.insuranceFee,
            isCOD: query.isCOD,
            codAmount: query.codAmount,
            allowTrial: query.allowTrial,
            paymentType: query.paymentType,
            serviceLevel: query.serviceLevel,
            itemType: query.itemType,
            deliveryFee: query.deliveryFee,
            totalFee: query.totalFee,
            email: query.email,
            lines: query.lines,
            webhook: query.webhook,
            totalFeeUpdated: query.totalFeeUpdated,
        };
        try {
            const deliveryRs = await this.httpClient.put<GetDocumentResponse>(
                `https://api.1retail-dev.asia/external/delivery/integration/v1/documents/${code}`,
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

    async getDocumentUpdate(code: string, query: GetDocumentsQuery) {
        const data = {
            code: query.code,
            status: query.status,
            partnerCode: query.partnerCode,
            userId: query.userId,
            from: query.from,
            to: query.to,
            dimension: query.dimension,
            fromNote: query.fromNote,
            toNote: query.toNote,
            isPickup: query.isPickup,
            insuranceAmount: query.insuranceAmount,
            insuranceFee: query.insuranceFee,
            isCOD: query.isCOD,
            codAmount: query.codAmount,
            allowTrial: query.allowTrial,
            paymentType: query.paymentType,
            serviceLevel: query.serviceLevel,
            itemType: query.itemType,
            deliveryFee: query.deliveryFee,
            totalFee: query.totalFee,
            email: query.email,
            lines: query.lines,
            webhook: query.webhook,
            totalFeeUpdated: query.totalFeeUpdated,
        };
        try {
            const deliveryRs = await this.httpClient.patch<GetDocumentResponse>(
                `https://api.1retail-dev.asia/external/delivery/integration/v1/documents/${code}`,
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
}
