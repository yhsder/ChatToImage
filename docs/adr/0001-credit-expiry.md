# Credit expiry follows Pixmira rollover, not a flat 365-day calendar

Paid subscription Credits stay usable for the whole active Plan period. Each renewal extends existing subscription Grants to the new `currentPeriodEnd`, so unused Credits roll over instead of resetting at the month boundary. After cancel, those Grants expire when the paid period ends. Credit Packs expire 365 days from purchase regardless of Plan status. Free Trial Grants expire in 7 days.

We rejected “every Grant lasts 365 days” because that keeps subscription Credits alive after the customer stops paying. We rejected “expire at the issuing period end with no extension” because that would wipe unused monthly Credits and contradict Pixmira’s published rollover.
