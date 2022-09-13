export class DeliveryLocation {
    constructor(
        street: string,
        wardCode: string,
        districtCode: string,
        provinceCode: string,
        countryCode: string,
        fullName: string,
        phoneNumber: string,
        postCode?: string,
        email?: string
    ) {
        this.street = street;
        this.wardCode = wardCode;
        this.districtCode = districtCode;
        this.provinceCode = provinceCode;
        this.countryCode = countryCode;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.postCode = postCode;
        this.email = email;
    }
    countryCode: string;
    provinceCode: string;
    districtCode: string;
    wardCode: string;
    street: string;
    phoneNumber: string;
    fullName: string;
    postCode?: string | null;
    email?: string | null;
}
