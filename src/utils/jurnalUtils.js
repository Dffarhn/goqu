// Utility functions untuk kalkulasi jurnal dan generate laporan keuangan

import formatCurrency from "./formatCurrency";

/**
 * Hitung saldo akun berdasarkan jurnal sampai tanggal tertentu
 * @param {Array} jurnal - Array jurnal transaksi
 * @param {string} akunId - ID akun yang akan dihitung saldonya
 * @param {string} tanggalAkhir - Tanggal akhir (ISO string), optional
 * @returns {number} - Saldo akun
 */
export const hitungSaldoAkun = (jurnal, akunId, tanggalAkhir = null) => {
  let filteredJurnal = jurnal.filter((j) => j.akunId === akunId);

  if (tanggalAkhir) {
    filteredJurnal = filteredJurnal.filter(
      (j) => new Date(j.tanggal) <= new Date(tanggalAkhir)
    );
  }

  const saldo = filteredJurnal.reduce((total, j) => {
    const { tipeAkun } = j.akun;
    let saldoPerTransaksi = 0;

    if (tipeAkun === "ASET" || tipeAkun === "BEBAN") {
      // Untuk ASET dan BEBAN: DEBIT menambah, KREDIT mengurangi
      saldoPerTransaksi = j.tipe === "DEBIT" ? j.jumlah : -j.jumlah;
    } else {
      // Untuk KEWAJIBAN, EKUITAS, PENDAPATAN: KREDIT menambah, DEBIT mengurangi
      saldoPerTransaksi = j.tipe === "KREDIT" ? j.jumlah : -j.jumlah;
    }

    return total + saldoPerTransaksi;
  }, 0);

  return saldo;
};

/**
 * Hitung saldo semua akun
 * @param {Array} jurnal - Array jurnal transaksi
 * @param {Array} coa - Array Chart of Accounts
 * @param {string} tanggalAkhir - Tanggal akhir (ISO string), optional
 * @returns {Object} - Object dengan key akunId dan value saldo
 */
export const hitungSaldoSemuaAkun = (jurnal, coa, tanggalAkhir = null) => {
  const saldoAkun = {};

  coa.forEach((akun) => {
    saldoAkun[akun.id] = {
      akun,
      saldo: hitungSaldoAkun(jurnal, akun.id, tanggalAkhir),
    };
  });

  return saldoAkun;
};

/**
 * Generate Laporan Posisi Keuangan (Neraca)
 * @param {Array} jurnal - Array jurnal transaksi
 * @param {Array} coa - Array Chart of Accounts
 * @param {string} tanggal - Tanggal laporan (ISO string)
 * @returns {Object} - Object berisi aset, kewajiban, ekuitas
 */
export const generateNeraca = (jurnal, coa, tanggal) => {
  const saldoAkun = hitungSaldoSemuaAkun(jurnal, coa, tanggal);

  const aset = coa
    .filter((akun) => akun.tipeAkun === "ASET" && akun.isActive)
    .map((akun) => ({
      ...akun,
      saldo: saldoAkun[akun.id].saldo,
    }))
    .filter((akun) => akun.saldo !== 0)
    .reduce((acc, akun) => {
      if (!acc[akun.kategori]) {
        acc[akun.kategori] = [];
      }
      acc[akun.kategori].push(akun);
      return acc;
    }, {});

  const kewajiban = coa
    .filter((akun) => akun.tipeAkun === "KEWAJIBAN" && akun.isActive)
    .map((akun) => ({
      ...akun,
      saldo: saldoAkun[akun.id].saldo,
    }))
    .filter((akun) => akun.saldo !== 0)
    .reduce((acc, akun) => {
      if (!acc[akun.kategori]) {
        acc[akun.kategori] = [];
      }
      acc[akun.kategori].push(akun);
      return acc;
    }, {});

  const ekuitas = coa
    .filter((akun) => akun.tipeAkun === "EKUITAS" && akun.isActive)
    .map((akun) => ({
      ...akun,
      saldo: saldoAkun[akun.id].saldo,
    }))
    .filter((akun) => akun.saldo !== 0)
    .reduce((acc, akun) => {
      if (!acc[akun.kategori]) {
        acc[akun.kategori] = [];
      }
      acc[akun.kategori].push(akun);
      return acc;
    }, {});

  const totalAset = Object.values(aset)
    .flat()
    .reduce((sum, akun) => sum + akun.saldo, 0);

  const totalKewajiban = Object.values(kewajiban)
    .flat()
    .reduce((sum, akun) => sum + akun.saldo, 0);

  const totalEkuitas = Object.values(ekuitas)
    .flat()
    .reduce((sum, akun) => sum + akun.saldo, 0);

  return {
    aset,
    kewajiban,
    ekuitas,
    totalAset,
    totalKewajiban,
    totalEkuitas,
  };
};

/**
 * Generate Laporan Penghasilan Komprehensif (Laba Rugi)
 * @param {Array} jurnal - Array jurnal transaksi
 * @param {Array} coa - Array Chart of Accounts
 * @param {string} tanggalAwal - Tanggal awal periode (ISO string)
 * @param {string} tanggalAkhir - Tanggal akhir periode (ISO string)
 * @returns {Object} - Object berisi pendapatan, beban, labaRugi
 */
export const generateLabaRugi = (jurnal, coa, tanggalAwal, tanggalAkhir) => {
  // Filter jurnal dalam periode
  const jurnalPeriode = jurnal.filter((j) => {
    const tanggal = new Date(j.tanggal);
    return (
      tanggal >= new Date(tanggalAwal) && tanggal <= new Date(tanggalAkhir)
    );
  });

  const pendapatan = coa
    .filter((akun) => akun.tipeAkun === "PENDAPATAN" && akun.isActive)
    .map((akun) => {
      const saldo = hitungSaldoAkun(jurnalPeriode, akun.id);
      return {
        ...akun,
        saldo,
      };
    })
    .filter((akun) => akun.saldo !== 0)
    .reduce((acc, akun) => {
      if (!acc[akun.kategori]) {
        acc[akun.kategori] = [];
      }
      acc[akun.kategori].push(akun);
      return acc;
    }, {});

  const beban = coa
    .filter((akun) => akun.tipeAkun === "BEBAN" && akun.isActive)
    .map((akun) => {
      const saldo = hitungSaldoAkun(jurnalPeriode, akun.id);
      return {
        ...akun,
        saldo: Math.abs(saldo), // Beban selalu positif
      };
    })
    .filter((akun) => akun.saldo !== 0)
    .reduce((acc, akun) => {
      if (!acc[akun.kategori]) {
        acc[akun.kategori] = [];
      }
      acc[akun.kategori].push(akun);
      return acc;
    }, {});

  const totalPendapatan = Object.values(pendapatan)
    .flat()
    .reduce((sum, akun) => sum + akun.saldo, 0);

  const totalBeban = Object.values(beban)
    .flat()
    .reduce((sum, akun) => sum + akun.saldo, 0);

  const labaRugi = totalPendapatan - totalBeban;

  return {
    pendapatan,
    beban,
    totalPendapatan,
    totalBeban,
    labaRugi,
  };
};

/**
 * Generate Laporan Perubahan Aset Neto
 * @param {Array} jurnal - Array jurnal transaksi
 * @param {Array} coa - Array Chart of Accounts
 * @param {string} tanggalAwal - Tanggal awal periode (ISO string)
 * @param {string} tanggalAkhir - Tanggal akhir periode (ISO string)
 * @returns {Object} - Object berisi perubahan ekuitas
 */
export const generatePerubahanEkuitas = (
  jurnal,
  coa,
  tanggalAwal,
  tanggalAkhir
) => {
  // Hitung saldo awal ekuitas
  const saldoAwalEkuitas = coa
    .filter((akun) => akun.tipeAkun === "EKUITAS" && akun.isActive)
    .reduce((sum, akun) => {
      return sum + hitungSaldoAkun(jurnal, akun.id, tanggalAwal);
    }, 0);

  // Hitung laba/rugi dalam periode
  const { labaRugi } = generateLabaRugi(jurnal, coa, tanggalAwal, tanggalAkhir);

  // Hitung perubahan modal (jika ada transaksi langsung ke ekuitas dalam periode)
  const jurnalPeriode = jurnal.filter((j) => {
    const tanggal = new Date(j.tanggal);
    return (
      tanggal >= new Date(tanggalAwal) && tanggal <= new Date(tanggalAkhir)
    );
  });

  const perubahanModal = coa
    .filter((akun) => akun.tipeAkun === "EKUITAS" && akun.isActive)
    .reduce((sum, akun) => {
      return sum + hitungSaldoAkun(jurnalPeriode, akun.id);
    }, 0);

  // Saldo akhir ekuitas
  const saldoAkhirEkuitas = coa
    .filter((akun) => akun.tipeAkun === "EKUITAS" && akun.isActive)
    .reduce((sum, akun) => {
      return sum + hitungSaldoAkun(jurnal, akun.id, tanggalAkhir);
    }, 0);

  return {
    saldoAwalEkuitas,
    labaRugi,
    perubahanModal: perubahanModal - labaRugi, // Perubahan modal selain laba/rugi
    saldoAkhirEkuitas,
  };
};

/**
 * Generate Laporan Arus Kas
 * @param {Array} jurnal - Array jurnal transaksi
 * @param {Array} coa - Array Chart of Accounts
 * @param {string} tanggalAwal - Tanggal awal periode (ISO string)
 * @param {string} tanggalAkhir - Tanggal akhir periode (ISO string)
 * @returns {Object} - Object berisi arus kas
 */
export const generateArusKas = (jurnal, coa, tanggalAwal, tanggalAkhir) => {
  // Filter jurnal untuk akun Kas dan Bank dalam periode
  const akunKasBank = coa.filter(
    (akun) =>
      (akun.kodeAkun === "1.1.01" || akun.kodeAkun === "1.1.02") &&
      akun.isActive
  );

  const jurnalPeriode = jurnal.filter((j) => {
    const tanggal = new Date(j.tanggal);
    return (
      tanggal >= new Date(tanggalAwal) && tanggal <= new Date(tanggalAkhir)
    );
  });

  // Saldo awal kas
  const saldoAwal = akunKasBank.reduce((sum, akun) => {
    return sum + hitungSaldoAkun(jurnal, akun.id, tanggalAwal);
  }, 0);

  // Kategorisasi transaksi kas
  const operasional = {
    masuk: 0,
    keluar: 0,
  };

  const investasi = {
    masuk: 0,
    keluar: 0,
  };

  const pendanaan = {
    masuk: 0,
    keluar: 0,
  };

  jurnalPeriode.forEach((j) => {
    if (!akunKasBank.find((akun) => akun.id === j.akunId)) return;

    const jumlah = j.jumlah;
    const isMasuk = j.tipe === "DEBIT";

    // Kategorisasi sederhana berdasarkan akun lawan
    const akunLawan = jurnalPeriode.find(
      (jl) =>
        jl.referensi === j.referensi &&
        jl.id !== j.id &&
        jl.tanggal === j.tanggal
    );

    if (akunLawan) {
      const tipeAkunLawan = akunLawan.akun.tipeAkun;

      if (tipeAkunLawan === "PENDAPATAN" || tipeAkunLawan === "BEBAN") {
        // Operasional
        if (isMasuk) {
          operasional.masuk += jumlah;
        } else {
          operasional.keluar += jumlah;
        }
      } else if (tipeAkunLawan === "ASET" && akunLawan.akun.kodeAkun !== "1.1.01" && akunLawan.akun.kodeAkun !== "1.1.02") {
        // Investasi (aset selain kas/bank)
        if (isMasuk) {
          investasi.masuk += jumlah;
        } else {
          investasi.keluar += jumlah;
        }
      } else if (tipeAkunLawan === "EKUITAS" || tipeAkunLawan === "KEWAJIBAN") {
        // Pendanaan
        if (isMasuk) {
          pendanaan.masuk += jumlah;
        } else {
          pendanaan.keluar += jumlah;
        }
      }
    }
  });

  operasional.netto = operasional.masuk - operasional.keluar;
  investasi.netto = investasi.masuk - investasi.keluar;
  pendanaan.netto = pendanaan.masuk - pendanaan.keluar;

  const saldoAkhir = saldoAwal + operasional.netto + investasi.netto + pendanaan.netto;

  return {
    operasional,
    investasi,
    pendanaan,
    saldoAwal,
    saldoAkhir,
  };
};

/**
 * Filter jurnal berdasarkan kriteria
 * @param {Array} jurnal - Array jurnal transaksi
 * @param {Object} filters - Object filter {tanggalAwal, tanggalAkhir, akunId, tipe}
 * @returns {Array} - Array jurnal yang sudah difilter
 */
export const filterJurnal = (jurnal, filters = {}) => {
  let filtered = [...jurnal];

  if (filters.tanggalAwal) {
    filtered = filtered.filter(
      (j) => new Date(j.tanggal) >= new Date(filters.tanggalAwal)
    );
  }

  if (filters.tanggalAkhir) {
    filtered = filtered.filter(
      (j) => new Date(j.tanggal) <= new Date(filters.tanggalAkhir)
    );
  }

  if (filters.akunId) {
    filtered = filtered.filter((j) => j.akunId === filters.akunId);
  }

  if (filters.tipe) {
    filtered = filtered.filter((j) => j.tipe === filters.tipe);
  }

  return filtered;
};

/**
 * Format saldo untuk display
 * @param {number} saldo - Saldo yang akan diformat
 * @returns {string} - String yang sudah diformat
 */
export const formatSaldo = (saldo) => {
  return formatCurrency(saldo);
};

