# Paddle Billing Setup for Doubtster

## Subscription Plans

Doubtster uses a subscription model with two variants: **Monthly** and **Annual**. Both include an initial paid 7-day trial for $1.99. Returning users who have already exhausted their trial are offered standard subscriptions without the trial phase.

### Creating the Prices in Paddle

You will need to create 4 total subscription prices in your Paddle dashboard (or via API):

#### 1. Monthly (with Trial)
- **Billing Period:** 1 Month
- **Price:** $7.99
- **Trial Period:** 7 days
- **Trial Price (`trial_period.unit_price`):** $1.99

#### 2. Annual (with Trial)
- **Billing Period:** 1 Year
- **Price:** $59.00
- **Trial Period:** 7 days
- **Trial Price (`trial_period.unit_price`):** $1.99

#### 3. Monthly (No Trial, for returning users)
- **Billing Period:** 1 Month
- **Price:** $7.99
- **Trial Period:** None

#### 4. Annual (No Trial, for returning users)
- **Billing Period:** 1 Year
- **Price:** $59.00
- **Trial Period:** None

## Top-ups (One-time purchases)

You will also need to create 2 non-recurring (one-time) prices:

#### 1. 10 Credits Top-up
- **Price:** $4.99
- **Type:** One-time

#### 2. 25 Credits Top-up
- **Price:** $9.99
- **Type:** One-time

## Environment Variables

Once these prices are created, map their IDs to the following environment variables in your `.env` file:

```env
NEXT_PUBLIC_PADDLE_PRICE_MONTHLY_TRIAL=pri_xxx...
NEXT_PUBLIC_PADDLE_PRICE_ANNUAL_TRIAL=pri_xxx...
NEXT_PUBLIC_PADDLE_PRICE_MONTHLY=pri_xxx...
NEXT_PUBLIC_PADDLE_PRICE_ANNUAL=pri_xxx...
NEXT_PUBLIC_PADDLE_PRICE_TOPUP_10=pri_xxx...
NEXT_PUBLIC_PADDLE_PRICE_TOPUP_25=pri_xxx...
```

## Webhook Handling (Billing Lifecycle)

Your webhook handler must verify Paddle signatures and be idempotent. Handle the following events:

- `subscription.trialing` (status = trial): 
  Grant 3 credits with an expiration matching the trial end date.
- `subscription.activated` (status = active): 
  The trial converted and charged. Expire any leftover trial credits. Grant 30 credits valid until the next monthly reset. For Annual plans, setup a scheduled job to grant 30 credits each month on the billing anniversary while the subscription remains active.
- `subscription.canceled`: 
  If canceled during trial, the customer incurs no plan charge, but keeps their 3 trial credits until the end of the 7 days. If canceled while active, the customer keeps access and their current monthly credits until the current billing period ends.
- `subscription.past_due`: 
  Failed charge. Show a banner in the app allowing a short grace period, then pause video generation. Chat remains free.

**Note:** Top-ups should only be permitted if the user's subscription status is `active`. When spending credits, deduct from the bucket that expires soonest.
