import axios, { AxiosInstance } from "axios";
import { CustomerResponse } from "./Models";
import { NoEnvironmentVariableException } from "../../../errors/NoEnvironmentVariableException";
import { createLoggerForService } from "../../../logging/logger";

const logger = createLoggerForService("NipClient");

export class NipClient {
    userName: string;
    password: string;
    internalSupportService: AxiosInstance;
    loyaltyService: AxiosInstance;
    cicService: AxiosInstance;

    constructor() {
        if (!process.env.NIP_USERNAME || !process.env.NIP_PASSWORD) {
            throw new NoEnvironmentVariableException("NIP_USERNAME and NIP_PASSWORD");
        }

        this.userName = process.env.NIP_USERNAME;
        this.password = process.env.NIP_PASSWORD;

        this.internalSupportService = axios.create({
            baseURL: process.env.INTERNAL_SUPPORT_SERVICE_BASE_URL,
            auth: { username: this.userName, password: this.password },
            headers: { "Content-Type": "application/json" },
        });

        this.loyaltyService = axios.create({
            baseURL: process.env.LOYALTY_SERVICE_BASE_URL,
            auth: { username: this.userName, password: this.password },
            headers: { "Content-Type": "application/json" },
        });

        this.cicService = axios.create({
            baseURL: process.env.CIC_SERVICE_BASE_URL,
        });

        logger.info("NipClient initialized successfully");
    }

    async deleteMember(memberId: string): Promise<void> {
        logger.info(`Deleting member with ID: ${memberId} from R+`);

        try {
            await this.internalSupportService.delete(`/members/${memberId}`);
            logger.info(`Successfully deleted member ${memberId}`);
        } catch (error: any) {
            logger.error(`Failed to delete member ${memberId}: ${error.message}`, { error });
            throw error;
        }
    }

    async getCustomer(email: string): Promise<{ memberId: string }> {
        logger.info(`Fetching member ID by email: ${email}`);

        try {
            const { data } = await this.loyaltyService.get<CustomerResponse>("/customers", {
                params: { email }
            });

            if (data.Result === "NOT_FOUND") {
                logger.warn(`Customer not found: ${email}`);
                throw new Error("Customer not found");
            }

            logger.info(`Customer found: Member ID: ${data.memberId}`);
            return { memberId: data.memberId.toString() };
        } catch (error: any) {
            logger.error(`Failed to fetch customer by email ${email}: ${error.message}`, { error });
            throw error;
        }
    }

    async deleteCicMember(memberId: string): Promise<void> {
        logger.info(`Deleting member with ID: ${memberId} from Cognito`);

        try {
            await this.cicService.delete(`${memberId}`);
            logger.info(`Successfully deleted member ${memberId} from Cognito`);
        } catch (error: any) {
            logger.warn(`Failed to delete member ${memberId}: ${error.message} from Cognito`, { error });
            throw error;
        }
    }
}
