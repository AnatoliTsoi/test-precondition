import { faker } from '@faker-js/faker';
import { getRandomGender } from "../models/User";

export function generateFakeUserData() {
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        birth_date: faker.date.past({ years: 100, refDate: new Date(new Date().setFullYear(new Date().getFullYear() - 18)) }),
        gender: getRandomGender(),
        address: faker.location.streetAddress(),
        zip_code: faker.location.zipCode(),
        city: faker.location.city(),
    };
}