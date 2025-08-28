# ContractorOS

This is a Next.js application for contractors to manage their business, including jobs, scheduling, and invoicing.

## Getting Started

### 1. Set up Firebase
This web app uses Firebase. 
- Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com).
- From your project's settings, get your web app's Firebase configuration.
- Copy `.env.local.example` to `.env.local`.
- Add your Firebase config values to `.env.local`.

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```
The app will be available at [http://localhost:9002](http://localhost:9002).

### 4. Seed the Database
To populate your local Firebase emulators with sample data (customers, jobs, users), run the seed script:
```bash
npm run seed
```
This will set up a demo company and the users listed below.

## Demo Accounts
Once the database is seeded, you can log in with the following accounts. The password for all users is `password`.

- **Owner:** `owner@demo.com`
- **Dispatcher:** `dispatcher@demo.com`
- **Technician:** `tech@demo.com`

## Testing
This project uses Vitest for unit tests. To run the tests:
```bash
npm test
```
