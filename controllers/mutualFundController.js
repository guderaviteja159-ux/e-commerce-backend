const MutualFund = require("../models/mutualFund");

const {
    searchMutualFunds,
    getMutualFundDetails,
    getLatestNAV,
    getNAVHistory
} = require("../services/mfapiService");


// TASK 1: Search Mutual Funds
const searchFunds = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                message: "Search keyword is required"
            });
        }

        const data = await searchMutualFunds(q);

        res.status(200).json(data);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "MFAPI error",
            error: error.message
        });
    }
};


// TASK 2: Get Scheme Details and Store
const getFundDetails = async (req, res) => {
    try {
        const { schemeCode } = req.params;

        if (!schemeCode) {
            return res.status(400).json({
                message: "Scheme code is required"
            });
        }

        const data = await getMutualFundDetails(schemeCode);

        // Check if mutual fund exists
        if (
            !data.meta ||
            !data.meta.scheme_code ||
            !data.meta.scheme_name
        ) {
            return res.status(404).json({
                message: "Mutual fund not found"
            });
        }

        const meta = data.meta;

        const mutualFund = await MutualFund.findOneAndUpdate(
            { schemeCode: String(meta.scheme_code) },
            {
                schemeCode: String(meta.scheme_code),
                schemeName: meta.scheme_name,
                fundHouse: meta.fund_house,
                schemeType: meta.scheme_type,
                schemeCategory: meta.scheme_category,
                isinGrowth: meta.isin_growth,
                isinDivReinvestment: meta.isin_div_reinvestment
            },
            {
                new: true,
                upsert: true
            }
        );

        res.status(200).json({
            message: "Mutual fund details fetched and stored",
            mutualFund: mutualFund
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "MFAPI error",
            error: error.message
        });
    }
};


// TASK 3: Get Latest NAV and Store
const getLatestNav = async (req, res) => {
    try {
        const { schemeCode } = req.params;

        if (!schemeCode) {
            return res.status(400).json({
                message: "Scheme code is required"
            });
        }

        const data = await getLatestNAV(schemeCode);

        const nav = Number(data.data[0].nav);
        const navDate = data.data[0].date;

        const mutualFund = await MutualFund.findOneAndUpdate(
            { schemeCode: String(data.meta.scheme_code) },
            {
                latestNav: nav,
                latestNavDate: navDate
            },
            {
                new: true
            }
        );

        res.status(200).json({
            message: "Latest NAV fetched and stored",
            data: data,
            mutualFund: mutualFund
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "MFAPI error",
            error: error.message
        });
    }
};


// TASK 4: Get NAV History
const getNavHistory = async (req, res) => {
    try {
        const { schemeCode } = req.params;

        if (!schemeCode) {
            return res.status(400).json({
                message: "Scheme code is required"
            });
        }

        const data = await getNAVHistory(schemeCode);

        res.status(200).json(data);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "MFAPI error",
            error: error.message
        });
    }
};


// TASK 5: Get Stored Mutual Funds
const getStoredMutualFunds = async (req, res) => {
    try {
        const mutualFunds = await MutualFund.find();

        res.status(200).json({
            message: "Mutual funds fetched successfully",
            mutualFunds: mutualFunds
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Database error",
            error: error.message
        });
    }
};


module.exports = {
    searchFunds,
    getFundDetails,
    getLatestNav,
    getNavHistory,
    getStoredMutualFunds
};