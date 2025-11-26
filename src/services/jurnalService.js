import axiosInstance from "../api/axiosInstance";

/**
 * Get all jurnal transactions with optional filters
 * @param {Object} filters - Filter parameters
 * @param {string} filters.tanggalAwal - Start date (ISO string)
 * @param {string} filters.tanggalAkhir - End date (ISO string)
 * @param {string} filters.akunId - Account ID filter
 * @param {string} filters.tipe - DEBIT or KREDIT filter
 * @returns {Promise<Array>} Array of jurnal transactions with entries
 */
export const getAllJurnals = async (filters = {}) => {
  try {
    const response = await axiosInstance.get("/jurnal", { params: filters });
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching jurnal transactions:", error);
    throw error;
  }
};

/**
 * Get jurnal transaction by ID
 * @param {string} id - Transaction ID
 * @returns {Promise<Object>} Transaction object with entries
 */
export const getJurnalById = async (id) => {
  try {
    const response = await axiosInstance.get(`/jurnal/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching jurnal transaction:", error);
    throw error;
  }
};

/**
 * Create new jurnal transaction (double-entry)
 * @param {Object} transactionData - Transaction data
 * @param {string} transactionData.tanggal - Date (ISO string or date string)
 * @param {string} transactionData.keterangan - Description
 * @param {string} transactionData.referensi - Reference (optional)
 * @param {Array} transactionData.entries - Array of entries [{ akunId, tipe, jumlah }]
 * @returns {Promise<Object>} Created transaction with entries
 */
export const createJurnal = async (transactionData) => {
  try {
    // Convert tanggal to ISO string if needed
    const data = {
      ...transactionData,
      tanggal: transactionData.tanggal.includes("T")
        ? transactionData.tanggal
        : `${transactionData.tanggal}T00:00:00.000Z`,
    };

    const response = await axiosInstance.post("/jurnal", data);
    return response.data.data;
  } catch (error) {
    console.error("Error creating jurnal transaction:", error);
    throw error;
  }
};

/**
 * Update jurnal transaction
 * @param {string} id - Transaction ID
 * @param {Object} transactionData - Updated transaction data
 * @param {string} transactionData.tanggal - Date (optional)
 * @param {string} transactionData.keterangan - Description (optional)
 * @param {string} transactionData.referensi - Reference (optional)
 * @param {Array} transactionData.entries - Array of entries (optional)
 * @returns {Promise<Object>} Updated transaction
 */
export const updateJurnal = async (id, transactionData) => {
  try {
    // Convert tanggal to ISO string if needed
    const data = { ...transactionData };
    if (data.tanggal && !data.tanggal.includes("T")) {
      data.tanggal = `${data.tanggal}T00:00:00.000Z`;
    }

    const response = await axiosInstance.put(`/jurnal/${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error("Error updating jurnal transaction:", error);
    throw error;
  }
};

/**
 * Delete jurnal transaction
 * @param {string} id - Transaction ID
 * @returns {Promise<Object>} Deleted transaction
 */
export const deleteJurnal = async (id) => {
  try {
    const response = await axiosInstance.delete(`/jurnal/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error deleting jurnal transaction:", error);
    throw error;
  }
};

/**
 * Get account balances
 * @param {Object} params - Query parameters
 * @param {string} params.endDate - End date (ISO string, optional)
 * @returns {Promise<Object>} Object with account balances
 */
export const getAccountBalances = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/jurnal/balances", { params });
    return response.data.data || {};
  } catch (error) {
    console.error("Error fetching account balances:", error);
    throw error;
  }
};

/**
 * Get account balances - Public version
 * @param {string} masjidId - Masjid ID
 * @param {Object} params - Query parameters
 * @param {string} params.endDate - End date (ISO string, optional)
 * @returns {Promise<Object>} Object with account balances
 */
export const getAccountBalancesPublic = async (masjidId, params = {}) => {
  try {
    const response = await axiosInstance.get("/jurnal/public/balances", {
      params: { masjidId, ...params },
    });
    return response.data.data || {};
  } catch (error) {
    console.error("Error fetching account balances:", error);
    throw error;
  }
};