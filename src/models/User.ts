export interface User {
    id: number;
    first_name?: string;
    last_name?: string;
    birth_date?: string;
    gender?: Gender;
    address?: string;
    zip_code?: string;
    city?: string;
    password?: string;
    email: string;
    phone_number: string;
    country_code: string;
    country?: string;
    member_id?: string;
    reserved: boolean;
    registered: boolean;
}

export enum Gender {
    Male = "Male",
    Female = "Female",
    Other = "Other",
}

export function getRandomGender(): Gender {
    const genders = Object.values(Gender);
    const randomIndex = Math.floor(Math.random() * genders.length);
    return genders[randomIndex];
}
