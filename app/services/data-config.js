const data_config = {
    default_projection : {
        _id: 0,
        date: {$dateToString: {format: "%Y-%m-%d", date: "$lastTradedDate"}},
        open: {$round: [{$toDouble: "$open"}, 2]},
        high: {$round: [{$toDouble: "$high"}, 2]},
        low: {$round: [{$toDouble: "$low"}, 2]},
        close: {$round: [{$toDouble: "$close"}, 2]},
        volume: {$round: [{$toLong: "$volume"}, 2]}
    },
    week : {
        week_low: {$round: [{$toDouble: "$week_low"}, 2]},
        week_high: {$round: [{$toDouble: "$week_high"}, 2]}
    },
    month : {
        month_low: {$round: [{$toDouble: "$month_low"}, 2]},
        month_high: {$round: [{$toDouble: "$month_high"}, 2]}
    },
    quarter : {
        quarter_low: {$round: [{$toDouble: "$quarter_low"}, 2]},
        quarter_high: {$round: [{$toDouble: "$quarter_high"}, 2]}
    },
    year : {
        year_low: {$round: [{$toDouble: "$year_low"}, 2]},
        year_high: {$round: [{$toDouble: "$year_high"}, 2]}
    },
    five_year : {
        five_year_low: {$round: [{$toDouble: "$five_year_low"}, 2]},
        five_year_high: {$round: [{$toDouble: "$five_year_high"}, 2]}
    }
};
module.exports = data_config;