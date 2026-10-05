const express = require("express");

const {
    searchFunds,
    getFundDetails,
    getLatestNav,
    getNavHistory,
    getStoredMutualFunds
} = require("../controllers/mutualFundController");

const router = express.Router();


// 1. Search Mutual Funds
router.get("/search", searchFunds);


// 2. Get Scheme Details
router.get("/:schemeCode", getFundDetails);


// 3. Get Latest NAV
router.get("/:schemeCode/latest", getLatestNav);


// 4. Get NAV History
router.get("/:schemeCode/nav-history", getNavHistory);


// 5. Get Stored Mutual Funds
router.get("/", getStoredMutualFunds);


module.exports = router;