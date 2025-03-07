import axios, { AxiosInstance } from "axios";
import { User } from "../../../models/User";
import { OmniSignUpRequestBody } from "./Models";
import { createLoggerForService } from "../../../logging/logger";

const logger = createLoggerForService("OmniService");

const omniApiClient: AxiosInstance = axios.create({
    baseURL: process.env.OMNI_BASE_URL,
    headers: {
        "Authorization": process.env.OMNI_BASIC_AUTH || "",
        "x-api-key": process.env.OMNI_API_KEY || "",
        "Content-Type": "application/json",
        "Accept-Language": "en",
        "request-id": "test-preconditions"
    },
});

export const OmniService = {
    async signUp(user: User, redCarpetConsent: boolean): Promise<{ message: string }> {
        const requestBody: OmniSignUpRequestBody = {
            firstName: user.first_name,
            lastName: user.last_name,
            gender: user.gender,
            language: "EN",
            dateOfBirth: user.birth_date,
            phoneNumber: {
                countryPrefix: user.country_code,
                subscriberNumber: user.phone_number,
            },
            emailAddress: user.email,
            address: {
                streetAddress: user.address,
                postalCode: user.zip_code,
                city: user.city,
                country: user.country,
            },
            password: user.password,
            redCarpetConsent: redCarpetConsent,
        };

        logger.info(`Signing up user: ${user.email}`);

        try {
            const response = await omniApiClient.post("/member/signup", requestBody);
            logger.info(`Successfully signed up user ${user.email}`);
            return { message: response.data.message };
        } catch (error: any) {
            logger.error(`Failed to sign up user ${user.email}: ${error.message}`, { error });
            throw error;
        }
    },
};
