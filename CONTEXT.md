# ChatToImage

Overseas self-serve SaaS for AI image generation, sold in USD Credits.

## Language

**Credit**:
The prepaid usage unit consumed by a generation. Cost depends on model and resolution.
_Avoid_: token, point, 次数

**Plan**:
A named recurring subscription: Starter, Creator, or Pro. It is not a one-time purchase.
_Avoid_: membership, tier (as the product name), lifetime

**Credit Pack**:
A one-time purchase of Credits that does not create a Plan and does not auto-renew.
_Avoid_: lifetime, one-time plan

**Pricing Catalog**:
The server-side list of purchasable products. Checkout honors only `product_id` from this catalog.
_Avoid_: 价格表 (the strategy document), price list (the marketing page)

**Grant**:
One batch of Credits issued together, with its own remaining amount and expiry.
_Avoid_: balance (when meaning a single undifferentiated pile)

**Free Trial**:
A signup Grant of Credits. It is not a Plan and cannot be purchased.
_Avoid_: free plan, free tier

**Rollover**:
Unused subscription Credits remaining available while the Plan is active, by extending those Grants to the current period end.
_Avoid_: never expire, lifetime credits
