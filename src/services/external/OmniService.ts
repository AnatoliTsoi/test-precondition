import axios from "axios";
import {User} from "../../models/User";

export const OmniService = {

    async signUp(user: User): Promise<{ memberId: string }> {
        const response = await axios.post(process.env.OMNI_BASE_URL + "/member/signUp", {
            firstName: user.first_name,
            lastName: user.last_name,
            gender: user.gender,
            language: "EN",
            dateOfBirth: user.birth_date,
            phoneNumber: user.phone_number,
            emailAddress: user.email,
            address: user.address,
            password: user.password,
            redCarpetConsent: true,

        },
            {
                headers: {
                    "Authorization": process.env.OMNI_BASIC_AUTH,
                    "x-api-key": process.env.OMNI_API_KEY,
                    "Content-Type": "application/json",
                    "Accept-Language": "en",
                    "request-id": "test-preconditions",
                },
            });

        return { memberId: response.data.memberId };
    },
};