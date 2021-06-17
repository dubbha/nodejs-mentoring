# In-memory CRUD REST service with validation

In-memory CRUD REST service with validation using [Nest](https://nestjs.com/) instead of [Express](https://expressjs.com/)

<a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>

## Installation

```bash
$ npm i
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Description

- All fields are required in UserCreateDto, using PartialType() mapped type in UserUpdateDto, update using PATCH
- Using OpenAPI (@nestjs/swagger), importing PartialType() from it; access `/api` for description of endpoints, body, params, can also send test requests from the interface instead of Postman
- Validating the Nest way, using ValidationPipe and class-validator instead of joi; class-validator provides out-of-the-box validators like @IsUUID(4)
- Custom ContainsLettersAndNumbers ValidatorConstraint used as @Validate(ContainsLettersAndNumbers)
- Custom async LoginNotUsed validator used on creation, it uses service method, so LoginNotUsedConstraint needs to be added to module providers; using custom @LoginNotUsed() decorator for the ease of use
- Not using LoginNotUsed on update, because the logic needs to account for the ID of the user being updated, which is not part of the DTO, using the same service method in the controller and BadRequestException
- Testing controller and service with unit tests
- Testing validation with e2e tests

**Trying to create user with empty request body:**
![image](https://user-images.githubusercontent.com/16776066/113509345-ba002180-955d-11eb-9f3a-4a5c82995e8d.png)

**Trying to create user with bad props:**
![image](https://user-images.githubusercontent.com/16776066/113509368-d69c5980-955d-11eb-958e-7cea4ebe240a.png)

**Successful user creation:**
![image](https://user-images.githubusercontent.com/16776066/113509380-e9af2980-955d-11eb-8fc2-ccd64bfc651f.png)

**Trying to create another user with the login:**
![image](https://user-images.githubusercontent.com/16776066/113509434-3561d300-955e-11eb-8915-39782bebb537.png)

**Creating another user:**
![image](https://user-images.githubusercontent.com/16776066/113509446-4d395700-955e-11eb-8ccf-119ec16b803f.png)

**Getting the full list of users (no limit or loginSubstring query params passed:**
![image](https://user-images.githubusercontent.com/16776066/113509503-a0aba500-955e-11eb-9c67-5437dab3e853.png)

**Passing non-numeric limit query param:**
![image](https://user-images.githubusercontent.com/16776066/113509521-c0db6400-955e-11eb-97f6-c215242180e1.png)

**Getting the list of users with limit and loginSubstring query params passed:**
![image](https://user-images.githubusercontent.com/16776066/113509535-d94b7e80-955e-11eb-8661-4e6adc8b6ee2.png)

**Getting the user by id:**
![image](https://user-images.githubusercontent.com/16776066/113509566-0dbf3a80-955f-11eb-8fa1-9bea202777cb.png)

**Trying to modify user's login to the one already used by another user:**
![image](https://user-images.githubusercontent.com/16776066/113509549-f54f2000-955e-11eb-91cb-2c74f75cb071.png)

**Deleting the user:**
![image](https://user-images.githubusercontent.com/16776066/113509598-24fe2800-955f-11eb-8387-88173e17f523.png)

**OpenAPI doc describing the API:**
![image](https://user-images.githubusercontent.com/16776066/113509666-8de5a000-955f-11eb-8fd1-bdc8dc86493b.png)
