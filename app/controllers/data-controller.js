const dataService = require("../services/data-service");

const DataController = {
    plots: async (req, res, next) => {
        let ticker = req.query.ticker;
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;
        let result = await dataService.getPlots(ticker, new Date(startDate), new Date(endDate));
        return res.json({
            success: true,
            data: result,
        });
    }
}
module.exports = DataController;