const axios = require("axios");

const MFAPI_BASE_URL = "https://api.mfapi.in/mf";

const searchMutualFunds = async (keyword) => {
    const response = await axios.get(
        `${MFAPI_BASE_URL}/search?q=${keyword}`
    );

    return response.data;
};

const getMutualFundDetails = async (schemeCode) => {
    const response = await axios.get(
        `${MFAPI_BASE_URL}/${schemeCode}`
    );

    return response.data;
};

const getLatestNAV = async (schemeCode) => {
    const response = await axios.get(
        `${MFAPI_BASE_URL}/${schemeCode}/latest`
    );

    return response.data;
};

const getNAVHistory = async (schemeCode) => {
    const response = await axios.get(
        `${MFAPI_BASE_URL}/${schemeCode}`
    );

    return response.data;
};

const getAllMutualFunds = async () => {
    const response = await axios.get(MFAPI_BASE_URL);

    return response.data;
};

module.exports = {
    searchMutualFunds,
    getMutualFundDetails,
    getLatestNAV,
    getNAVHistory,
    getAllMutualFunds
};