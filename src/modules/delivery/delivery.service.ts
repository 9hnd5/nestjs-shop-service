import { PromotionTypeId } from '@constants/enum';
import { Address } from '@modules/sales-order/dtos/address.dto';
import { SalesOrder } from '@modules/sales-order/entities/sales-order.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService, Paginated } from 'be-core';
import { get as getConfig } from '../../config';
import { AddDocument, DocumentLine } from './dtos/add-document.dto';
import { DeliveryLocation } from './dtos/delivery-location.dto';
import { Dimensions, DimensionsSize } from './dtos/dimensions.dto';
import { GetAvailablePartnersQuery } from './dtos/get-available-partners-query.dto';
import { GetAvailablePartnersResponse } from './dtos/get-available-partners-response.dto';
import { GetDocumentResponse } from './dtos/get-document-response.dto';
import { GetPartnerPricesQuery } from './dtos/get-partner-prices-query.dto';
import { GetPartnerPriceResponse } from './dtos/get-partner-prices-response.dto';
import { GetPartnersQuery } from './dtos/get-partners-query.dto';
import { GetPartnersResponse } from './dtos/get-partners-response.dto';
import { UpdateDocument } from './dtos/update-document.dto';
import { ItemType } from './enums/item-type.enum';
import { PaymentType } from './enums/payment-type.enum';
import { ServiceLevel } from './enums/service-level.enum';

const deliveryServiceConfig = getConfig('deliveryService');
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
            const result = await this.httpClient.post<GetAvailablePartnersResponse[]>(
                `external/delivery/integration/v1/documents/partners/available`,
                data,
                {
                    autoInject: false,
                    config: {
                        baseURL: deliveryServiceConfig.url,
                        headers: {
                            'api-key': deliveryServiceConfig.apiKey,
                            'api-tenant': deliveryServiceConfig.apiTenant,
                        },
                    },
                }
            );
            return result.data;
        } catch (er) {
            throw new BadRequestException(er);
        }
    }

    async getPartners(query: GetPartnersQuery) {
        try {
            const response = await this.httpClient.get<Paginated<GetPartnersResponse>>(
                `external/delivery/integration/v1/partners`,
                {
                    autoInject: false,
                    config: {
                        baseURL: deliveryServiceConfig.url,
                        headers: {
                            'api-key': deliveryServiceConfig.apiKey,
                            'api-tenant': deliveryServiceConfig.apiTenant,
                        },
                        params: {
                            pageIndex: query.pageSize * (query.pageIndex - 1),
                            pageSize: query.pageSize,
                        },
                    },
                }
            );
            return response.data;
        } catch (er) {
            throw new BadRequestException(er);
        }
    }

    async getPartnerPrices(partnerCode: string, query: GetPartnerPricesQuery) {
        try {
            const result = await this.httpClient.get<GetPartnerPriceResponse[]>(
                `delivery/v1/partner-prices/${partnerCode}`,
                {
                    autoInject: false,
                    config: {
                        baseURL: deliveryServiceConfig.url,
                        params: {
                            fromDistrictCode: query.fromDistrictCode,
                            fromProvinceCode: query.fromProvinceCode,
                            toDistrictCode: query.toDistrictCode,
                            toProvinceCode: query.toProvinceCode,
                            skip: query.pageIndex,
                            take: query.pageSize,
                        },
                    },
                }
            );
            return result.data;
        } catch (er) {
            throw new BadRequestException(er);
        }
    }

    async addDocument(salesOrder: SalesOrder, from: Address, to: Address) {
        const orderEntity = salesOrder.toEntity();
        const data = new AddDocument();
        data.partnerCode = orderEntity.deliveryPartner;
        data.email = 'nchi@gmail.com'; // hardcode email if customer's email is empty
        data.webhook = 'https://api.1retail-dev.asia/shop/v1/sales-order/webhook'; // hardcode webhook
        data.serviceLevel = ServiceLevel.STANDARD;
        data.paymentType = PaymentType.SENDER;
        data.itemType = ItemType.NORMAL;
        data.insuranceAmount = orderEntity.totalAmount;
        data.lines = [];
        orderEntity.items
            .filter(
                (t) =>
                    ![
                        PromotionTypeId.DISCOUNT_TOTAL_BILL_PERCENTAGE,
                        PromotionTypeId.DISCOUNT_TOTAL_BILL_VALUE,
                        PromotionTypeId.DISCOUNT_LINE_PERCENTAGE,
                    ].includes(t.itemType)
            )
            .forEach((el) => {
                const line = new DocumentLine();
                line.name = el.itemName ?? '';
                line.code = el.itemCode ?? '';
                line.quantity = el.quantity;
                line.weight = el.weight;
                data.lines.push(line);
            });

        const size = new DimensionsSize(salesOrder.length, salesOrder.width, salesOrder.height);
        data.dimension = new Dimensions(salesOrder.weight, size);
        data.from = new DeliveryLocation(
            from.street,
            from.wardCode,
            from.districtCode,
            from.cityCode,
            from.countryCode,
            from.contactPerson,
            from.phoneNumber
        );
        data.to = new DeliveryLocation(
            to.street,
            to.wardCode,
            to.districtCode,
            to.cityCode,
            to.countryCode,
            to.contactPerson,
            to.phoneNumber
        );

        try {
            const result = await this.httpClient.post<GetDocumentResponse>(
                `external/delivery/integration/v1/documents`,
                { data },
                {
                    config: {
                        baseURL: deliveryServiceConfig.url,
                        headers: {
                            'api-key': deliveryServiceConfig.apiKey,
                            'api-tenant': deliveryServiceConfig.apiTenant,
                        },
                    },
                }
            );
            return result.data;
        } catch (er) {
            throw new BadRequestException(er);
        }
    }

    async confirmedDocument(code: string) {
        const result = await this.httpClient.patch<GetDocumentResponse>(
            `external/delivery/integration/v1/documents/${code}/confirm`,
            {},
            {
                config: {
                    baseURL: deliveryServiceConfig.url,
                    headers: {
                        'api-key': deliveryServiceConfig.apiKey,
                        'api-tenant': deliveryServiceConfig.apiTenant,
                    },
                },
            }
        );
        return result.data;
    }

    async cancelDocument(code: string) {
        try {
            const result = await this.httpClient.patch<GetDocumentResponse>(
                `external/delivery/integration/v1/documents/${code}/cancel`,
                {},
                {
                    config: {
                        baseURL: deliveryServiceConfig.url,
                        headers: {
                            'api-key': deliveryServiceConfig.apiKey,
                            'api-tenant': deliveryServiceConfig.apiTenant,
                        },
                    },
                }
            );
            return result.data;
        } catch (er) {
            throw new BadRequestException(er);
        }
    }

    async updateDocument(code: string, data: UpdateDocument) {
        const body = {
            data,
        };
        try {
            const result = await this.httpClient.patch<GetDocumentResponse>(
                `external/delivery/integration/v1/documents/${code}`,
                body,
                {
                    config: {
                        baseURL: deliveryServiceConfig.url,
                        headers: {
                            'api-key': deliveryServiceConfig.apiKey,
                            'api-tenant': deliveryServiceConfig.apiTenant,
                        },
                    },
                }
            );
            return result.data;
        } catch (er) {
            throw new BadRequestException(er);
        }
    }
}
