# Shop catalogue: decisions, prices and readiness

Owner-approval-required. Every amount below is a **recommendation** made on the owner's behalf after UK market research (`docs/shop-research.md`, all sources accessed 2026-10-14). The catalogue lives in one file, `src/data/shop.ts` (`PRICING_STATUS = "owner-approval-required"`), which the browser reads to display and the API reads to price. **Nothing can be bought until the owner approves these amounts and configures real Stripe Price IDs** (`docs/shop-launch.md`).

## What we changed after research

| Brief | Decision | Why |
|---|---|---|
| NFC + QR review cards | Launch (1 / 5 / 10) | Core product; the most crowded category, so we compete on honest terms, not price |
| Countertop review stands | Launch (1 / set of 3) | Clear demand; priced in the upper-middle of the market |
| (new) Review kit: stand + cards | Launch | Research shows sellers bundle card + stand; one order, one set of details; saves the customer money |
| Smart NFC/QR business cards | Launch (1 / 3), **no subscription** | Competitors' pricing is £19.99 to £39.99 and many push app subscriptions; ours is a one-off link you choose |
| Wi-Fi connect signs **and** menu/services/booking QR stands | **Merged** into one "QR Table Sign" with a "what should it do?" choice | Same object, same print, same QR; fewer SKUs; the form asks only for the fields the choice needs |
| Window/van QR sticker packs | Keep, **lowest confidence** | No comparable GBP price was found and print supplier is unconfirmed. Each variant has its own readiness switch, so it can stay closed |
| Digital QR starter pack | Launch, automated | We generate static QR files (SVG + 1200 px PNG) and email them with the order; no supplier needed |

Not added: gadgets, keyrings, trackers, "smart" subscriptions, analytics dashboards. Anything that would need a platform we don't run is out of scope.

## Launch prices (GBP, as charged)

| Product | Variants | Price | Market evidence (seen 2026-10-14) | Rationale | Confidence |
|---|---|---|---|---|---|
| NFC + QR Review Card | 1 card | £14.99 | Singles £6.99 to £28; typical £12 to £16 | Inside the typical band | Medium |
| | Pack of 5 | £59.00 (£11.80 ea) | 5-packs £9.60 to £21 per card | Above the cheapest bulk sellers, below OneTap | Medium |
| | Pack of 10 | £99.00 (£9.90 ea) | 10-packs £7.90 to £19.60 per card | As above | Medium |
| Countertop Review Stand | 1 stand | £24.99 | Stands £14.99 to £40; typical £15 to £22 | Slightly above typical; personalised | Medium |
| | Set of 3 | £64.99 (£21.66 ea) | 3 stands £92 at one seller | Modest multi-buy saving | Low |
| Review Kit | 1 stand + 1 card | £34.00 | Competitor card + stand bundle £60 | Saves £5.98 against buying separately | Medium |
| | 1 stand + 5 cards | £79.00 | | Saves £4.99 | Low |
| Smart NFC + QR Business Card | 1 card | £19.99 | PVC NFC cards £19.99 to £39.99 | Entry of the PVC band, no subscription | Medium |
| | Pack of 3 | £49.99 (£16.66 ea) | | Modest multi-buy saving | Low |
| QR Table Sign | A6 stand | £15.99 | Wi-Fi sign £14.99 at the nearest comparator; QR holders £2 to £35 | Just above the nearest comparator | Medium |
| | A5 stand | £21.99 | | Larger size, inference | Low |
| Window & Van QR Sticker Pack | Window 4 x 100 mm | £14.99 | No GBP comparator found | Placeholder to be replaced with real print costs | **Very low** |
| | Van 2 x 200 mm | £24.99 | | As above | **Very low** |
| Digital QR Starter Pack | up to 3 codes | £9.99 | Only a USD 6 template comparator; free generators exist | Value is print-ready files plus a placement guide | Low |

## Shipping, VAT and lead time (all PROVISIONAL)

- **Delivery:** UK mainland only. Flat **£3.95** for orders with posted items, **free** when the posted items total **£50.00** or more. Digital products: no delivery charge, no address. Royal Mail Tracked 48 small parcel was seen at £3.65 (search summary only), so £3.95 is a small cushion, not a margin.
- **Lead time:** we do **not** publish a number of days, because supplier capacity is unconfirmed. Copy says: made to order; we email a dispatch date after you order; by law we deliver within 30 days unless we agree otherwise (Consumer Rights Act 2015 s.28). Replace with a real estimate only once production is confirmed.
- **VAT:** the owner's VAT status is unknown. Prices are shown as "the amount you pay" with no separate VAT line, and the site says VAT treatment is still to be confirmed. If the business is VAT-registered, consumer prices must include VAT; confirm with an accountant before opening (see the ledger).
- **Returns:** personalised goods are exempt from the 14-day cancellation right (Consumer Contracts Regulations 2013 reg. 28(1)(b), consumers only); statutory rights for faulty goods remain. Wording is a draft pending legal review.

## Per-variant switches

Each variant needs three environment variables (see `.env.example`). Ordering of a variant opens only when its Price ID is a real one-time GBP Stripe Price whose amount equals the catalogue price, its readiness flag is `true`, it isn't sold out, and the global gates are met (physical items also need `SHOP_FULFILMENT_CONFIRMED=true`).

| Product | Variant | Catalogue price | Fulfilment | Environment variables |
|---|---|---|---|---|
| NFC + QR Review Card | 1 card | £14.99 | physical | `SHOP_PRICE_REVIEW_CARD_X1` / `SHOP_READY_REVIEW_CARD_X1` / `SHOP_STOCK_REVIEW_CARD_X1` |
| NFC + QR Review Card | Pack of 5 | £59.00 | physical | `SHOP_PRICE_REVIEW_CARD_X5` / `SHOP_READY_REVIEW_CARD_X5` / `SHOP_STOCK_REVIEW_CARD_X5` |
| NFC + QR Review Card | Pack of 10 | £99.00 | physical | `SHOP_PRICE_REVIEW_CARD_X10` / `SHOP_READY_REVIEW_CARD_X10` / `SHOP_STOCK_REVIEW_CARD_X10` |
| Countertop Review Stand | 1 stand | £24.99 | physical | `SHOP_PRICE_REVIEW_STAND_X1` / `SHOP_READY_REVIEW_STAND_X1` / `SHOP_STOCK_REVIEW_STAND_X1` |
| Countertop Review Stand | Set of 3 | £64.99 | physical | `SHOP_PRICE_REVIEW_STAND_X3` / `SHOP_READY_REVIEW_STAND_X3` / `SHOP_STOCK_REVIEW_STAND_X3` |
| Review Kit | 1 stand + 1 card | £34.00 | physical | `SHOP_PRICE_REVIEW_KIT_S1C1` / `SHOP_READY_REVIEW_KIT_S1C1` / `SHOP_STOCK_REVIEW_KIT_S1C1` |
| Review Kit | 1 stand + 5 cards | £79.00 | physical | `SHOP_PRICE_REVIEW_KIT_S1C5` / `SHOP_READY_REVIEW_KIT_S1C5` / `SHOP_STOCK_REVIEW_KIT_S1C5` |
| Smart NFC + QR Business Card | 1 card | £19.99 | physical | `SHOP_PRICE_SMART_BUSINESS_CARD_X1` / `SHOP_READY_SMART_BUSINESS_CARD_X1` / `SHOP_STOCK_SMART_BUSINESS_CARD_X1` |
| Smart NFC + QR Business Card | Pack of 3 | £49.99 | physical | `SHOP_PRICE_SMART_BUSINESS_CARD_X3` / `SHOP_READY_SMART_BUSINESS_CARD_X3` / `SHOP_STOCK_SMART_BUSINESS_CARD_X3` |
| QR Table Sign | A6 stand (105 x 148 mm) | £15.99 | physical | `SHOP_PRICE_QR_TABLE_SIGN_A6` / `SHOP_READY_QR_TABLE_SIGN_A6` / `SHOP_STOCK_QR_TABLE_SIGN_A6` |
| QR Table Sign | A5 stand (148 x 210 mm) | £21.99 | physical | `SHOP_PRICE_QR_TABLE_SIGN_A5` / `SHOP_READY_QR_TABLE_SIGN_A5` / `SHOP_STOCK_QR_TABLE_SIGN_A5` |
| Window & Van QR Sticker Pack | Window pack: 4 x 100 mm | £14.99 | physical | `SHOP_PRICE_STICKER_PACK_WINDOW4` / `SHOP_READY_STICKER_PACK_WINDOW4` / `SHOP_STOCK_STICKER_PACK_WINDOW4` |
| Window & Van QR Sticker Pack | Van pack: 2 x 200 mm | £24.99 | physical | `SHOP_PRICE_STICKER_PACK_VAN2` / `SHOP_READY_STICKER_PACK_VAN2` / `SHOP_STOCK_STICKER_PACK_VAN2` |
| Digital QR Starter Pack | Up to 3 QR codes | £9.99 | digital | `SHOP_PRICE_DIGITAL_QR_PACK_PACK` / `SHOP_READY_DIGITAL_QR_PACK_PACK` / `SHOP_STOCK_DIGITAL_QR_PACK_PACK` |

Default state: **no variant is ready**; the shop shows "Ordering isn't open yet" and a one-message notify form.
