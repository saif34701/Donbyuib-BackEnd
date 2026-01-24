# DonByUIB Backend

A NestJS-based backend API for managing donation campaigns and charitable associations. This platform enables associations to create and manage fundraising campaigns, process donations, and track donation statistics through an administrative interface.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [ClicToPay Payment Integration](#clictopay-payment-integration)
- [Development](#development)
- [Testing](#testing)

## Features

### Core Functionality
- **Association Management**: Create, update, and manage charitable associations
- **Campaign Management**: Create and manage fundraising campaigns with real-time tracking
- **Donation Processing**: Handle donation submissions with payment gateway integration
- **Admin Dashboard**: Comprehensive administrative interface with statistics and reporting
- **Authentication & Authorization**: JWT-based authentication with role-based access control (ADMIN, SUPER_ADMIN)

### Security
- JWT authentication with Passport strategy
- Password hashing with bcrypt
- Input validation using class-validator
- CORS enabled for cross-origin requests
- Role-based access control

## Tech Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL
- **ORM**: Prisma 6.x
- **Authentication**: JWT (JSON Web Tokens) with Passport
- **Validation**: class-validator & class-transformer
- **Testing**: Jest
- **Payment Gateway**: ClicToPay (integration pending)

## Architecture

The application follows NestJS modular architecture with the following modules:

```
src/
├── admin/              # Admin management & statistics
├── associations/       # Association CRUD operations
├── auth/              # Authentication & authorization
├── campaigns/         # Campaign management
├── donations/         # Donation processing
└── prisma/           # Database service & configuration
```

### Key Modules

- **Admin Module**: Handles admin authentication, campaign oversight, and system-wide statistics
- **Associations Module**: Manages association profiles, contact information, and related campaigns
- **Campaigns Module**: Manages fundraising campaigns with status tracking and amount aggregation
- **Donations Module**: Processes donations and integrates with payment gateway
- **Auth Module**: Provides JWT authentication and route protection

## Database Schema

### Models

**Admin**
- Authentication and role management
- Roles: `ADMIN`, `SUPER_ADMIN`
- Active status tracking

**Association**
- Organization details (name, description, logo)
- Contact information (email, phone)
- Related campaigns

**Campaign**
- Title and description
- Current amount tracking (real-time updates)
- Active/inactive status
- Associated with one Association
- ClicToPay credentials for payment processing
- Multiple donations

**Donation**
- Amount and donor information
- Status tracking: `PENDING`, `PAID`, `FAILED`
- Payment reference and ClicToPay order ID
- Linked to a specific campaign

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd donbyuib-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/donbyuib"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="24h"

# ClicToPay Configuration (to be configured)
CLICTOPAY_API_URL="https://api.clictopay.com"
CLICTOPAY_MERCHANT_ID="your-merchant-id"
CLICTOPAY_API_KEY="your-api-key"
```

4. Run Prisma migrations:
```bash
npx prisma migrate deploy
npx prisma generate
```

5. Seed the database (optional):
```bash
npx prisma db seed
```

6. Start the application:
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /auth/login` - Admin login
- `POST /auth/register` - Register new admin (protected)

### Associations
- `GET /associations` - Get all associations
- `GET /associations/:id` - Get association by ID
- `POST /associations` - Create new association (protected)
- `PATCH /associations/:id` - Update association (protected)
- `DELETE /associations/:id` - Delete association (protected)

### Campaigns
- `GET /campaigns` - Get all active campaigns
- `GET /campaigns/:id` - Get campaign details with donations
- `POST /campaigns` - Create new campaign (protected)
- `PATCH /campaigns/:id` - Update campaign (protected)
- `DELETE /campaigns/:id` - Delete campaign (protected)

### Donations
- `POST /donations` - Create new donation
- `GET /donations/:id` - Get donation details
- `PATCH /donations/:id/status` - Update donation status (protected)

### Admin
- `GET /admin/campaigns` - Get all campaigns (including inactive)
- `GET /admin/stats` - Get system-wide statistics
- `GET /admin/stats/campaigns/:id` - Get specific campaign statistics

## ClicToPay Payment Integration

### Overview
The application is designed to integrate with ClicToPay, a Tunisian payment gateway, for processing donations. The integration structure is in place but requires implementation by the development team.

### How It Should Work

#### 1. Payment Flow
```
User fills donation form → Backend creates donation (PENDING) 
→ Redirect to ClicToPay → User completes payment 
→ ClicToPay callback → Update donation status (PAID/FAILED)
→ Update campaign currentAmount
```

#### 2. Database Structure
The schema includes ClicToPay-specific fields:
- **Campaign Model**:
  - `clictopayUserName`: Campaign-specific ClicToPay merchant username
  - `clictopayPassword`: Campaign-specific ClicToPay merchant password
  
- **Donation Model**:
  - `clictopayOrderId`: Unique order identifier from ClicToPay
  - `status`: Tracks payment status (PENDING → PAID/FAILED)
  - `paymentRef`: General payment reference

#### 3. Implementation Tasks for Dev Team

**Step 1: ClicToPay API Client**
Create a service to handle ClicToPay API calls:
```typescript
// src/payments/clictopay.service.ts
- initiatePayment(): Create payment order and get redirect URL
- handleCallback(): Process payment confirmation webhook
- verifyPayment(): Verify payment status
- refundPayment(): Handle refund requests (if needed)
```

**Step 2: Donation Flow Updates**
Modify the donations service to:
1. Create donation with `PENDING` status
2. Call ClicToPay to initiate payment
3. Store `clictopayOrderId` in donation record
4. Return redirect URL to frontend
5. Handle ClicToPay webhook/callback to update status
6. Update campaign's `currentAmount` when payment is `PAID`

**Step 3: Webhook Endpoint**
Create a public endpoint for ClicToPay callbacks:
```typescript
POST /payments/clictopay/callback
- Verify callback signature
- Update donation status based on payment result
- Update campaign currentAmount
- Send confirmation email (optional)
```

**Step 4: Configuration**
Add ClicToPay environment variables:
- API endpoint URL
- Merchant credentials (global or per-campaign)
- API keys and secrets
- Callback URL for webhook

#### 4. Security Considerations
- Validate all ClicToPay callbacks using signature verification
- Store credentials securely (environment variables or secrets manager)
- Use HTTPS for all payment-related communications
- Implement idempotency for callback processing
- Log all payment transactions for audit trail

#### 5. Testing Strategy
- Use ClicToPay sandbox/test environment
- Test all payment states: success, failure, timeout
- Test webhook reliability and idempotency
- Verify amount calculations and currency handling
- Test concurrent donation scenarios

### Additional Payment Features to Implement
- Payment confirmation emails
- Donation receipts generation
- Refund processing workflow
- Payment retry mechanism for failed transactions
- Real-time payment status updates via websockets

### Note on Payment Module Status
The payment module structure has been implemented with all necessary database models, controllers, and service scaffolding in place. However, due to lack of access to ClicToPay API credentials and testing environment, the actual payment integration has not been fully tested. The development team will need to:
- Obtain ClicToPay API credentials (sandbox and production)
- Complete the payment flow implementation in the payment service
- Test the full payment cycle including callbacks and webhooks
- Verify the donation status updates and campaign amount calculations
- Ensure proper error handling and retry mechanisms

The current implementation provides a solid foundation, but requires hands-on testing and refinement with actual ClicToPay API access.

## Development

### Project Structure
```
donbyuib-backend/
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts           # Database seeding
│   └── migrations/       # Migration history
├── src/
│   ├── main.ts          # Application entry point
│   ├── app.module.ts    # Root module
│   └── [modules]/       # Feature modules
├── test/                # E2E tests
└── uploads/            # File uploads directory
```

### Available Scripts

```bash
# Development
npm run start          # Start application
npm run start:dev      # Start with watch mode
npm run start:debug    # Start with debugging

# Building
npm run build          # Build for production

# Database
npx prisma studio      # Open Prisma Studio GUI
npx prisma migrate dev # Create new migration
npx prisma generate    # Generate Prisma Client
npx prisma db seed     # Seed database

# Code Quality
npm run format         # Format code with Prettier
npm run lint           # Lint code with ESLint

# Testing
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Generate coverage report
npm run test:e2e       # Run e2e tests
```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/donbyuib"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"

# Application
PORT=3000
NODE_ENV="development"

# ClicToPay (to be configured)
CLICTOPAY_API_URL="https://api.clictopay.com"
CLICTOPAY_MERCHANT_ID=""
CLICTOPAY_API_KEY=""
CLICTOPAY_CALLBACK_URL="http://localhost:3000/payments/clictopay/callback"
```

## Testing

The application includes comprehensive test coverage:

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
```bash
npm run test:cov
```

### Test Files
- `*.spec.ts`: Unit tests for services and controllers
- `test/app.e2e-spec.ts`: End-to-end tests

## API Documentation

To view interactive API documentation:
1. Start the application in development mode
2. Access Swagger UI at `http://localhost:3000/api` (if configured)
3. Or use tools like Postman with the provided collection

## Deployment

### Production Build
```bash
npm run build
npm run start:prod
```

### Docker Support (Future)
Consider creating a Dockerfile and docker-compose.yml for containerized deployment.

### Environment Setup
Ensure production environment variables are properly set:
- Secure JWT_SECRET
- Production DATABASE_URL
- ClicToPay production credentials
- Enable HTTPS
- Configure CORS for production domains

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

This project is private and proprietary.
