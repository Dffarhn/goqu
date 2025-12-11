import axiosInstance from "../api/axiosInstance";

/**
 * Get all accounts
 * @param {Object} params - Query parameters
 * @param {string} params.masjidId - Optional masjid ID
 * @param {boolean} params.includeInactive - Include inactive accounts
 * @returns {Promise<Array>} Array of accounts
 */
export const getAllAccounts = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/coa", { params });
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};

/**
 * Get all accounts - Public version
 * @param {string} masjidId - Masjid ID (required)
 * @param {Object} params - Query parameters
 * @param {boolean} params.includeInactive - Include inactive accounts
 * @returns {Promise<Array>} Array of accounts
 */
export const getAllAccountsPublic = async (masjidId, params = {}) => {
  try {
    const response = await axiosInstance.get("/coa/public", {
      params: { masjidId, ...params },
    });
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};

/**
 * Get account tree (hierarchical structure)
 * @param {Object} params - Query parameters
 * @param {string} params.masjidId - Optional masjid ID
 * @returns {Promise<Array>} Tree structure
 */
export const getAccountTree = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/coa/tree", { params });
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching account tree:", error);
    throw error;
  }
};

/**
 * Get account by ID
 * @param {string} id - Account ID
 * @returns {Promise<Object>} Account object
 */
export const getAccountById = async (id) => {
  try {
    const response = await axiosInstance.get(`/coa/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching account:", error);
    throw error;
  }
};

/**
 * Create new account
 * @param {Object} accountData - Account data
 * @param {string} accountData.code - Account code
 * @param {string} accountData.name - Account name
 * @param {string} accountData.parentId - Parent account ID (optional)
 * @param {string} accountData.type - Account type (ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE)
 * @param {boolean} accountData.isGroup - Is group account
 * @param {string} accountData.masjidId - Masjid ID (optional)
 * @returns {Promise<Object>} Created account
 */
export const createAccount = async (accountData) => {
  try {
    const response = await axiosInstance.post("/coa", accountData);
    return response.data.data;
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
};

/**
 * Update account
 * @param {string} id - Account ID
 * @param {Object} accountData - Updated account data
 * @returns {Promise<Object>} Updated account
 */
export const updateAccount = async (id, accountData) => {
  try {
    const response = await axiosInstance.put(`/coa/${id}`, accountData);
    return response.data.data;
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }
};

/**
 * Delete account (soft delete)
 * @param {string} id - Account ID
 * @returns {Promise<Object>} Deleted account
 */
export const deleteAccount = async (id) => {
  try {
    const response = await axiosInstance.delete(`/coa/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};

/**
 * Seed default COA
 * @param {Object} params - Query parameters
 * @param {string} params.masjidId - Optional masjid ID untuk COA custom per masjid
 * @param {boolean} params.general - Jika true, buat general/default COA (masjidId = null) untuk semua masjid
 * @returns {Promise<Object>} Result with count and accounts
 * 
 * @example
 * // Seed general COA (untuk semua masjid)
 * await seedDefaultCOA({ general: true });
 * 
 * // Seed COA untuk masjid tertentu
 * await seedDefaultCOA({ masjidId: 'masjid_123' });
 */
export const seedDefaultCOA = async (params = {}) => {
  try {
    // POST tanpa body, hanya query params
    // Jika params.general = true, akan membuat general COA (masjidId = null)
    const response = await axiosInstance.post("/coa/seed", {}, { params });
    return response.data.data;
  } catch (error) {
    console.error("Error seeding default COA:", error);
    throw error;
  }
};

/**
 * Get next available account code for a parent
 * @param {string} parentId - Parent account ID
 * @param {string} [masjidId] - Optional masjid ID for custom COA
 * @returns {Promise<string>} Next available code
 */
export const getNextAccountCode = async (parentId, masjidId) => {
  try {
    const response = await axiosInstance.get("/coa/next-code", {
      params: { parentId, masjidId },
    });
    return response.data.data.code;
  } catch (error) {
    console.error("Error getting next account code:", error);
    throw error;
  }
};

