# Lighthouse Labs Midterm Project: Food Pick-up Ordering App

## Project Description

Food ordering application that uses Twilio to connect customers to the restaurant. Hungry customers
of a ficticious restaurant can visit it's website, select one or more dishes and place an order for pick-up. The customer will receive a notification when their order is ready. The restaurant will receive the order via SMS and will notify the client how long it will take to fulfill it.

* Hungry clients of a fictitious restaurant can visit its website, Select one or more dishes and place an order for pick-up.
* They will receive a notification when their order is ready.
* When an order is placed the restaurant receives the order via SMS. The restaurant can then specify how long it will take to fulfill it. Once they provide this information, the website updates for the client and also notifies them via SMS.

## Final Product
!["Homepage"]()
!["Shopping-cart"]()
!["Restaurant Admin page"]()
<!-- ![""]()
![""]() -->

### User stories
!["User Stories"](https://github.com/kmunirpm/FoodOrderPickup/blob/master/docs/user-stories.png?raw=true)

### Database Design
!["Entity Relation Diagram"](https://github.com/kmunirpm/FoodOrderPickup/blob/master/docs/erd.png?raw=true)


## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
- Express
- EJS
- Morgan
- Dotenv
- Node-sass-middleware
- Nodemon
- Twilio (trial version of telecomm API service used to implement SMS communication between the client and the restaurant)


## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information 
  - username: `labber` 
  - password: `labber` 
  - database: `midterm`
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`
  - Check the db folder to see what gets created and seeded in the SDB
6. Run the server: `npm run local`
  - Note: nodemon is used, so you should not have to restart your server
7. Visit `http://localhost:8080/`

### Future additions

- Login/Registration
- Payment processing
- Notes from the client
- Customization of orders


## Developers Team

[Kashif Munir](https://github.com/kmunirpm), [Morsal Niyaz](https://github.com/MorsalN), [Anastassia Tsvetkova](https://github.com/Nastik2021)

