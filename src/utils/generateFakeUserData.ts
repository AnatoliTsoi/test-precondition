import { getRandomGender } from "../models/User";
import { format } from 'date-fns';
import { fakerSV as faker } from "@faker-js/faker";

export function generateFakeUserData() {
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        birth_date: format(faker.date.past({ years: 100, refDate: new Date(new Date().setFullYear(new Date().getFullYear() - 18)) }), 'yyyy-MM-dd'),
        gender: getRandomGender(),
        address: faker.location.streetAddress(),
        zip_code: faker.location.zipCode(),
        city: faker.location.city(),
        countryCode: faker.location.countryCode(),
        country: faker.location.country(),
    };
}
