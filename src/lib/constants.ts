
export const CATEGORIES_WITH_TAGS = {
    FIXED: [
        "RENT",
        "ELECTRICITY",
        "INTERNET",
        "COOK",
        "CLEANER",
        "DAIRY",
        "FURNITURE_RENT",
    ],
    VARIABLE: [
        "PETROL",
        "GROCERIES",
        "ZOMATO_BLINKIT_BIGBASKET",
        "CHAI_NASHTA",
        "SHOPPING",
        "DRY_FRUITS",
        "BIKE_WASH",
    ],
    INVESTMENT: ["SIP_LONG_TERM", "SIP_SHORT_TERM"],
    INSURANCE: ["TERM_LIFE"],
    MISCELLANEOUS: [
        "TRAIN_TICKET",
        "FLIGHT_TICKET",
        "CYLINDER",
        "GROOMING",
        "URBAN_CLAP",
        "SEND_ME",
        "UDHAR",
        "CUSTOM",
    ],
};

export type Category = keyof typeof CATEGORIES_WITH_TAGS;

export const CATEGORIES = Object.keys(CATEGORIES_WITH_TAGS) as Category[];
