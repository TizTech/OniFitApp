# OniFit - Fitness App with Subscription System

OniFit is a fitness application that offers personalized workout plans, meal planning, and progress tracking with a subscription-based model.

## Features

- User authentication with Supabase Auth
- Subscription plans with free trials
- Stripe integration for payment processing
- Dashboard with workout plans, meal plans, and progress tracking
- Responsive design for all devices

## Subscription System

The app includes a complete subscription system with:

- Multiple subscription tiers (Basic, Pro, Elite)
- Monthly and yearly billing options
- Free trial periods
- Stripe Checkout integration
- Subscription management

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Supabase account
- Stripe account

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_API_URL=your_stripe_api_url
```

For the server (if deploying separately):

```
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
CLIENT_URL=your_client_url
PORT=3000
```

### Database Setup

1. Run the SQL migration in `src/db/migrations/01_create_subscription_tables.sql` in your Supabase SQL editor.
2. This will create the necessary tables and sample subscription plans.

### Stripe Setup

1. Create products and prices in your Stripe dashboard that match the plans in your database.
2. Update the `stripe_price_id` field in the `subscription_plans` table with the corresponding Stripe price IDs.
3. Set up a webhook in your Stripe dashboard pointing to your server's `/webhook` endpoint.
4. Add the webhook secret to your environment variables.

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Server Deployment (Optional)

The server component (`src/server`) can be deployed separately to handle Stripe webhooks and checkout sessions. This is required for a production environment.

```bash
# Navigate to server directory
cd src/server

# Install dependencies
npm install

# Start server
npm start
```

## How Subscriptions Work

1. Users browse available subscription plans on the Subscription page.
2. After selecting a plan, they're directed to a payment form.
3. For free trials, the subscription is created immediately.
4. For paid plans, they're redirected to Stripe Checkout.
5. After successful payment, they're redirected back to the app.
6. Stripe webhooks handle subscription lifecycle events (payment success, subscription updates, etc.).
7. Users with active subscriptions get access to premium features.

## Development Notes

- The current implementation includes a simulated checkout process for development purposes.
- For production, uncomment the real Stripe API calls in `src/lib/stripe.ts`.
- The server component is included for reference but is not required for local development.

## License

MIT
