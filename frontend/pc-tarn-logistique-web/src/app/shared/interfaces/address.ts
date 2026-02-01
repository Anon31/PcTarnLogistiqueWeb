export interface IAddressDto {
    id: number;
    number: number;
    street: string;
    city: string;
    zipcode: string;
    state: string;
    userId: number;
}

export type IAddressPayload = Omit<IAddressDto, 'id' | 'userId'>;
