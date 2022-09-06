export interface DeliveryLocation {
    countryCode: string;
    provinceCode: string;
    districtCode: string;
    wardCode: string;
    street: string;
    phoneNumber: string;
    fullName: string;
    postCode: string | null;
    email?: string | null;
}
