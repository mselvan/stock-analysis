const MongoClient = require('mongodb').MongoClient;
const config = require('../../app-config.json');
const _ = require('lodash');

const pType = "monthly";

const DataService = {
    getPlots: async (ticker, startDate, endDate) => {
        const client = new MongoClient(config.MONGO_URL, config.MONGO_OPTIONS);
        await client.connect();
        const db = client.db(config.DB_NAME);
        db.collection = await db.collection(ticker.toLowerCase());
        let p = {
            _id: 0,
            date: {$dateToString: {format: "%Y-%m-%d", date: "$lastTradedDate"}},
            open: {$round: [{$toDouble: "$open"}, 2]},
            high: {$round: [{$toDouble: "$high"}, 2]},
            low: {$round: [{$toDouble: "$low"}, 2]},
            close: {$round: [{$toDouble: "$close"}, 2]},
        };

        /* $project: {
            _id: 0,
                date: {$dateToString: {format: "%Y-%m-%d", date: "$lastTradedDate"}},
            open: {$round: [{$toDouble: "$open"}, 2]},
            high: {$round: [{$toDouble: "$high"}, 2]},
            low: {$round: [{$toDouble: "$low"}, 2]},
            close: {$round: [{$toDouble: "$close"}, 2]},
            week_low: {$round: [{$toDouble: "$week_low"}, 2]},
            week_high: {$round: [{$toDouble: "$week_high"}, 2]},
            month_low: {$round: [{$toDouble: "$month_low"}, 2]},
            month_high: {$round: [{$toDouble: "$month_high"}, 2]},
            quarter_low: {$round: [{$toDouble: "$quarter_low"}, 2]},
            quarter_high: {$round: [{$toDouble: "$quarter_high"}, 2]},
            year_low: {$round: [{$toDouble: "$year_low"}, 2]},
            year_high: {$round: [{$toDouble: "$year_high"}, 2]},
            five_year_low: {$round: [{$toDouble: "$five_year_low"}, 2]},
            five_year_high: {$round: [{$toDouble: "$five_year_high"}, 2]},
            week_low_percent_change: {$toDouble: {$divide: [{$subtract: ["$close", "$week_low"]}, "$close"]}},
            week_high_percent_change: {$toDouble: {$divide: [{$subtract: ["$close", "$week_high"]}, "$close"]}},
            month_low_percent_change: {$toDouble: {$divide: [{$subtract: ["$close", "$month_low"]}, "$close"]}},
            month_high_percent_change: {$toDouble: {$divide: [{$subtract: ["$close", "$month_high"]}, "$close"]}},
            quarter_low_percent_change: {$toDouble: {$divide: [{$subtract: ["$close", "$quarter_low"]}, "$close"]}},
            quarter_high_percent_change: {$toDouble: {$divide: [{$subtract: ["$close", "$quarter_high"]}, "$close"]}},
            year_low_percent_change: {$toDouble: {$divide: [{$subtract: ["$close", "$year_low"]}, "$close"]}},
            year_high_percent_change: {$toDouble: {$divide: [{$subtract: ["$close", "$year_high"]}, "$close"]}},
            five_year_low_percent_change: {$toDouble: {$divide: [{$subtract: ["$close", "$five_year_low"]}, "$close"]}},
            five_year_high_percent_change: {$toDouble: {$divide: [{$subtract: ["$close", "$five_year_high"]}, "$close"]}}
        }
        */
         

        switch (pType) {
            case "monthly":
                monthPrjection = {
                    month_low: {$round: [{$toDouble: "$month_low"}, 2]},
                    month_high: {$round: [{$toDouble: "$month_high"}, 2]},
                    month_low_percent_change: {$toDouble: {$divide: [{$subtract: ["$close", "$month_low"]}, "$close"]}},
                    month_high_percent_change: {$toDouble: {$divide: [{$subtract: ["$close", "$month_high"]}, "$close"]}}
                };
                p = _.defaults(p, monthPrjection)
        }
        let result = await db.collection.aggregate([
            {$match: {lastTradedDate: {$gt: startDate, $lt: endDate}}},
            {
                $project: p
            }
        ]).toArray();
        let response = {};
        response[ticker] = result;
        return response;
    }
};
module.exports = DataService;