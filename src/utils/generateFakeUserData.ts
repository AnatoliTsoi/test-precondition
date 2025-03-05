import { getRandomGender } from "../models/User";
import { format } from 'date-fns';
import { fakerSV as faker } from "@faker-js/faker";

export function generateFakeUserData() {
    const birthDate = format(faker.date.past({ years: 100, refDate: new Date(new Date().setFullYear(new Date().getFullYear() - 18)) }), 'yyyy-MM-dd');

    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        birth_date: birthDate,
        gender: getRandomGender(),
        address: faker.location.streetAddress(),
        zip_code: faker.location.zipCode(),
        city: faker.location.city(),
        country_code: faker.location.countryCode(),
        country: faker.location.country(),
    };
}
