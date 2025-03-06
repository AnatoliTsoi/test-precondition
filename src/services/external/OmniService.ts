import axios from "axios";
import {User} from "../../models/User";

export const OmniService = {

    async signUp(user: User, redCarpetConsent: Boolean): Promise<{ message: string }> {

        const body = {
            firstName: user.first_name,
            lastName: user.last_name,
            gender: user.gender,
            language: "EN",
            dateOfBirth: user.birth_date,
            phoneNumber: {
                countryPrefix: "+49",
                subscriberNumber: 1713920054,
            },
            emailAddress: "dcea6780-f590-4b9f-93aa-cb92e3223340@mailslurp.net",
            address: {
                streetAddress: user.address,
                postalCode: user.zip_code,
                city: user.city,
                country: user.country
            },
            password: user.password,
            redCarpetConsent: redCarpetConsent,
        }

        const response = await axios.post(process.env.OMNI_BASE_URL + "/member/signup", body, {
            headers: {
                "Authorization": process.env.OMNI_BASIC_AUTH,
                "x-api-key": process.env.OMNI_API_KEY,
                "Content-Type": "application/json",
                "Accept-Language": "en",
                "request-id": "test-preconditions",
            },
        });
        return {message: response.data.message};
    }
};