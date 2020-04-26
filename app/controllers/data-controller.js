const dataService = require("../services/data-service");

const DataController = {
    plots: async (req, res, next) => {
        let tickers = req.query.tickers.split(",")
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        let lowHigh = req.query.lowHigh;
        let result = await dataService.getPlots(tickers, new Date(startDate), new Date(endDate), lowHigh);
        return res.json({
            success: true,
            data: result,
        });
    }
}
module.exports = DataController;