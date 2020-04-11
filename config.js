module.exports = {
    CONFIG_NAME: process.env.CONFIG_NAME || 'default-config',
    START_OVER: true,
    MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/",
    DB_NAME: "stockstore",
    COLLECTION_NAME: "spy",
    DATA_INTERVALS: {week: 5, month: 21, quarter: 63, year: 252, five_year: 1260},
    OPTIONS: {
        useUnifiedTopology: true
    }
};