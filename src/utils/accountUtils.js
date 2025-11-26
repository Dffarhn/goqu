/**
 * Menentukan normal balance - prioritas: normalBalance dari account > accountType
 * @param {Object|string} accountOrType - Account object (dengan normalBalance) atau accountType string
 * @param {string} accountType - Optional: accountType jika parameter pertama adalah object
 * @returns {string} "DEBIT" atau "KREDIT"
 */
export function getNormalBalance(accountOrType, accountType = null) {
  // Jika parameter pertama adalah object (account), gunakan normalBalance langsung
  if (accountOrType && typeof accountOrType === "object") {
    const account = accountOrType;
    // Prioritas: normalBalance dari account > fallback ke type
    if (account.normalBalance) {
      return account.normalBalance.toUpperCase();
    }
    // Fallback ke accountType
    accountType = account.type || account.tipeAkun || accountType;
  } else {
    // Parameter pertama adalah string (accountType)
    accountType = accountOrType || accountType;
  }
  
  if (!accountType) return "DEBIT"; // Default
  
  // Normalize account type (handle both backend and frontend format)
  const normalizedType = accountType.toUpperCase();
  
  // ASSET dan EXPENSE memiliki normal balance DEBIT
  if (
    normalizedType === "ASSET" || 
    normalizedType === "ASET" ||
    normalizedType === "EXPENSE" || 
    normalizedType === "BEBAN"
  ) {
    return "DEBIT";
  }
  
  // LIABILITY, EQUITY, dan REVENUE memiliki normal balance KREDIT
  if (
    normalizedType === "LIABILITY" || 
    normalizedType === "KEWAJIBAN" ||
    normalizedType === "EQUITY" || 
    normalizedType === "EKUITAS" ||
    normalizedType === "REVENUE" || 
    normalizedType === "PENDAPATAN"
  ) {
    return "KREDIT";
  }
  
  // Default fallback
  return "DEBIT";
}

/**
 * Menentukan apakah tipe jurnal sesuai dengan normal balance akun
 * @param {Object|string} accountOrType - Account object atau accountType string
 * @param {string} jurnalTipe - DEBIT atau KREDIT
 * @returns {boolean}
 */
export function isNormalBalance(accountOrType, jurnalTipe) {
  if (!accountOrType || !jurnalTipe) return false;
  return getNormalBalance(accountOrType) === jurnalTipe.toUpperCase();
}

/**
 * Mendapatkan label untuk normal balance
 * @param {Object|string} accountOrType - Account object atau accountType string
 * @returns {string} Label seperti "Normal: Debit" atau "Normal: Kredit"
 */
export function getNormalBalanceLabel(accountOrType) {
  const normal = getNormalBalance(accountOrType);
  return `Normal: ${normal === "DEBIT" ? "Debit" : "Kredit"}`;
}

/**
 * Helper untuk membuat jurnal entry dengan auto-set tipe berdasarkan normal balance
 * @param {string} akunId - ID akun
 * @param {number|string} jumlah - Jumlah transaksi
 * @param {Array} coaList - List COA
 * @param {string} overrideTipe - Optional: override tipe (DEBIT/KREDIT)
 * @returns {Object|null} Entry object atau null jika akun tidak ditemukan
 */
export function createJurnalEntry(akunId, jumlah, coaList, overrideTipe = null) {
  const akun = coaList.find((coa) => coa.id === akunId);
  if (!akun) return null;
  
  // Gunakan normalBalance langsung dari account jika ada, baru fallback ke getNormalBalance
  const tipe = overrideTipe || getNormalBalance(akun);
  
  return {
    id: Date.now() + Math.random(),
    akunId,
    tipe,
    jumlah: jumlah.toString(),
    hasRestriction: false,
    keterangan: "",
  };
}

