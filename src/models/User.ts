export interface User {
    id: number;
    first_name: string | null;
    last_name: string | null;
    birth_date: string | null;
    gender: Gender | null;
    address: string | null;
    zip_code: string | null;
    city: string | null;
    password: string | null;
    email: string;
    phone_number: number;
    country_code: string;
    country: string | null;
    member_id: string | null;
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
