import * as fs from "fs"
import * as path from "path"
import { extractPrice } from "./playstation"

// Import HTML files from fixtures
const fixturesDir = path.join(__dirname, "../../fixtures/playstation")
const freeHTML = fs.readFileSync(
  path.join(fixturesDir, "ps-free.html"),
  "utf-8"
)
const discountHTML = fs.readFileSync(
  path.join(fixturesDir, "ps-discount.html"),
  "utf-8"
)
const extraHTML = fs.readFileSync(
  path.join(fixturesDir, "ps-extra.html"),
  "utf-8"
)
const premiumHTML = fs.readFileSync(
  path.join(fixturesDir, "ps-premium.html"),
  "utf-8"
)
const standardHTML = fs.readFileSync(
  path.join(fixturesDir, "ps-standard.html"),
  "utf-8"
)

const price = extractPrice(premiumHTML)

console.log("price :>>", price)

const free = {
  __typename: "Price",
  basePrice: "Free",
  discountedPrice: "Free",
  discountText: null,
  serviceBranding: ["NONE"],
  endTime: null,
  upsellText: null,
  basePriceValue: 0,
  discountedValue: 0,
  currencyCode: "CAD",
  qualifications: [],
  applicability: "APPLICABLE",
  campaignId: null,
  rewardId: "",
  isFree: true,
  isExclusive: false,
  isTiedToSubscription: false,
  history: null
}

const psplusDiscount = {
  __typename: "Price",
  basePrice: "$33.49",
  discountedPrice: "$10.04",
  discountText: "-70%",
  serviceBranding: ["PS_PLUS"],
  endTime: "1766476740000",
  upsellText: "Save 10% more with PlayStation Plus",
  basePriceValue: 3349,
  discountedValue: 1004,
  currencyCode: "CAD",
  qualifications: [
    {
      __typename: "Qualification",
      type: "ENTITLEMENT_IN_CART",
      value: "IP9101-NPIA90005_00-PLUS00"
    }
  ],
  applicability: "UPSELL",
  campaignId: "PROMO-PROD-00014266,PROMO-PROD-00014266",
  rewardId: "OFFER-PROD-14266_60,OFFER-PROD-14266-PSP_10",
  isFree: false,
  isExclusive: false,
  isTiedToSubscription: false,
  history: {
    __typename: "PriceHistory",
    launchPrice: null,
    lowestRecentPrice: "Lowest price in last 30 days: $13.39"
  }
}

const psplusExtra = {
  __typename: "Price",
  basePrice: "$26.99",
  discountedPrice: "Included",
  discountText: "Included",
  serviceBranding: ["PS_PLUS"],
  endTime: null,
  upsellText:
    "Subscribe to PlayStation Plus Extra to access this game and hundreds more in the Game Catalogue",
  basePriceValue: 2699,
  discountedValue: 0,
  currencyCode: "CAD",
  qualifications: [
    {
      __typename: "Qualification",
      type: "ENTITLEMENT_IN_CART",
      value: "SUB001-SUBC00002_00-7CMQKDWFK0KWV63Z"
    }
  ],
  applicability: "UPSELL",
  campaignId: null,
  rewardId: "SUB001-SUBC00002_00-7CMQKDWFK0KWV63Z",
  isFree: true,
  isExclusive: false,
  isTiedToSubscription: true,
  history: null
}

const psplusPremium = {
  __typename: "Price",
  basePrice: "$29.99",
  discountedPrice: "Included",
  discountText: "Included",
  serviceBranding: ["PS_PLUS"],
  endTime: null,
  upsellText:
    "Subscribe to PlayStation Plus Premium to access this game and more",
  basePriceValue: 2999,
  discountedValue: 0,
  currencyCode: "CAD",
  qualifications: [
    {
      __typename: "Qualification",
      type: "ENTITLEMENT_IN_CART",
      value: "SUB001-SUBC00002_00-PBJ490HY1ZXGMFRV"
    }
  ],
  applicability: "UPSELL",
  campaignId: null,
  rewardId: "SUB001-SUBC00002_00-PBJ490HY1ZXGMFRV",
  isFree: true,
  isExclusive: false,
  isTiedToSubscription: true,
  history: null
}

const standardDiscount = {
  __typename: "Price",
  basePrice: "$59.99",
  discountedPrice: "$47.99",
  discountText: "-20%",
  serviceBranding: ["NONE"],
  endTime: "1766476740000",
  upsellText: "Save 20%",
  basePriceValue: 5999,
  discountedValue: 4799,
  currencyCode: "CAD",
  qualifications: [],
  applicability: "APPLICABLE",
  campaignId: "PROMO-PROD-00013983",
  rewardId: "OFFER-PROD-13983_20",
  isFree: false,
  isExclusive: false,
  isTiedToSubscription: false,
  history: {
    __typename: "PriceHistory",
    launchPrice: null,
    lowestRecentPrice: "Lowest price in last 30 days: $47.99"
  }
}
