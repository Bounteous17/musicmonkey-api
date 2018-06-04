# MusicMonkey

This is a dev NodeJS API for the basic functionality of the APP

## Status

- [x] Create user
- [x] Login user
- [x] Delete user
- [ ] Users login history
- [ ] Upload users songs
- [ ] Change songs info
- [ ] Update/Change profile data
- [ ] User comments

## Usage

Install and run the API:
```
yarn install
yarn start
```

## Examples

- Register
> curl -d "email=test@gmail.com&password=test" -X POST http://localhost:4900/user/signup

- Login
> curl -d "email=test@gmail.com&password=test" -X POST http://localhost:4900/user/login
