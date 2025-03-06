import axios, { AxiosInstance } from "axios";
import {CustomerResponse } from "./Models";
import {NoEnvironmentVariableException} from "../../../errors/NoEnvironmentVariableException";

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
            auth: {
                username: this.userName,
                password: this.password,
            },
            headers: {
                "Content-Type": "application/json",
            },
        })

        this.loyaltyService = axios.create({
            baseURL: process.env.LOYALTY_SERVICE_BASE_URL,
            auth: {
                username: this.userName,
                password: this.password,
            },
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.cicService = axios.create({
            baseURL: process.env.CIC_SERVICE_BASE_URL,
        });
    }

    async deleteMember(memberId: string): Promise<void> {
        return this.internalSupportService.delete(`/members/${memberId}`);
    }

    async getCustomer(email: string): Promise<{ memberId: string }> {

        const { data } = await this.loyaltyService.get<CustomerResponse>("/customers", {
            params: {email: email}}
        );

        if (data.Result === "NOT_FOUND") throw new Error("Not found");

        return { memberId: data.memberId.toString() };
    }

    async deleteCicMember(memberId: string): Promise<void> {
        return this.cicService.delete(`${memberId}`);
    }
}
