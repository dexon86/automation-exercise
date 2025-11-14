import { faker } from '@faker-js/faker';

export interface UserData {
  name: string;
  email: string;
  password: string;
  title: string;
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
}

export function generateUserData(): UserData {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  
  return {
    name: `${firstName} ${lastName}`,
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password({ length: 10 }),
    title: faker.helpers.arrayElement(['Mr', 'Mrs', 'Miss']),
    birth_date: faker.number.int({ min: 1, max: 28 }).toString(),
    birth_month: faker.number.int({ min: 1, max: 12 }).toString(),
    birth_year: faker.number.int({ min: 1950, max: 2000 }).toString(),
    firstname: firstName,
    lastname: lastName,
    company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: 'United States',
    zipcode: faker.location.zipCode(),
    state: faker.location.state(),
    city: faker.location.city(),
    mobile_number: faker.phone.number(),
  };
}
