export interface OmniSignUpRequestBody {
    firstName: string | null;
    lastName: string | null;
    gender: string | null;
    language: string | null;
    dateOfBirth: string | null;
    phoneNumber: {
        countryPrefix: string;
        subscriberNumber: number;
    };
    emailAddress: string;
    address: {
        streetAddress: string | null;
        postalCode: string | null;
        city: string | null;
        country: string | null;
    };
    password: string | null;
    redCarpetConsent: boolean;
}