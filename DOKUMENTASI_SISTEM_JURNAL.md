# Dokumentasi Sistem Jurnal Akuntansi

## 📋 Daftar Isi

1. [Overview](#overview)
2. [Struktur Data](#struktur-data)
3. [API Specification](#api-specification)
4. [Business Logic](#business-logic)
5. [Contoh Data](#contoh-data)
6. [Validasi](#validasi)

---

## Overview

Sistem jurnal akuntansi ini dirancang untuk menghasilkan laporan keuangan otomatis dari transaksi jurnal. Sistem menggunakan single-entry bookkeeping dimana setiap transaksi dicatat sebagai satu entri jurnal (bukan double-entry).

### Fitur Utama

- **Chart of Accounts (COA)**: Manajemen akun-akun akuntansi
- **Input Jurnal**: Pencatatan transaksi keuangan
- **Generate Laporan**: Otomatis menghasilkan laporan keuangan dari jurnal
  - Laporan Posisi Keuangan (Neraca)
  - Laporan Penghasilan Komprehensif (Laba Rugi)
  - Laporan Perubahan Aset Neto
  - Laporan Arus Kas

---

## Struktur Data

### 1. Chart of Accounts (COA)

```typescript
interface ChartOfAccount {
  id: string;                    // CUID - Unique identifier
  masjidId: string;              // Foreign key ke Masjid
  kodeAkun: string;              // Contoh: "1.1.01", "4.1.01"
  namaAkun: string;              // Nama akun
  tipeAkun: "ASET" | "KEWAJIBAN" | "EKUITAS" | "PENDAPATAN" | "BEBAN";
  kategori: string;              // Grouping: "Aset Lancar", "Pendapatan Operasional", dll
  isActive: boolean;             // Status aktif/nonaktif
  createdAt: string;             // ISO DateTime
  updatedAt: string;             // ISO DateTime
}
```

**Contoh:**
```json
{
  "id": "coa_1234567890_abc123",
  "masjidId": "masjid_001",
  "kodeAkun": "1.1.01",
  "namaAkun": "Kas",
  "tipeAkun": "ASET",
  "kategori": "Aset Lancar",
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Jurnal

```typescript
interface Jurnal {
  id: string;                    // CUID - Unique identifier
  masjidId: string;              // Foreign key ke Masjid
  tanggal: string;                // ISO DateTime
  akunId: string;                 // Foreign key ke ChartOfAccount
  akun: ChartOfAccount;           // Populated data akun (untuk response)
  tipe: "DEBIT" | "KREDIT";
  jumlah: number;                 // Decimal, contoh: 1000000.00
  keterangan: string;             // Deskripsi transaksi
  referensi?: string;             // Opsional: link ke donasi/pengeluaran
  createdAt: string;              // ISO DateTime
  updatedAt: string;              // ISO DateTime
}
```

**Contoh:**
```json
{
  "id": "jurnal_1234567890_xyz789",
  "masjidId": "masjid_001",
  "tanggal": "2024-01-15T10:30:00.000Z",
  "akunId": "coa_1234567890_abc123",
  "akun": {
    "id": "coa_1234567890_abc123",
    "kodeAkun": "1.1.01",
    "namaAkun": "Kas",
    "tipeAkun": "ASET"
  },
  "tipe": "DEBIT",
  "jumlah": 5000000,
  "keterangan": "Donasi dari jamaah untuk renovasi",
  "referensi": "donasi_001",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## API Specification

### Base URL
```
/api/v1
```

### Authentication
Semua endpoint memerlukan JWT token di header:
```
Authorization: Bearer <token>
```

---

### 1. Chart of Accounts (COA)

#### GET `/coa`
Mendapatkan semua COA untuk masjid yang login.

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": "coa_123",
      "masjidId": "masjid_001",
      "kodeAkun": "1.1.01",
      "namaAkun": "Kas",
      "tipeAkun": "ASET",
      "kategori": "Aset Lancar",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET `/coa/:id`
Mendapatkan detail COA berdasarkan ID.

#### POST `/coa`
Membuat COA baru.

**Request Body:**
```json
{
  "kodeAkun": "1.1.03",
  "namaAkun": "Kas Kecil",
  "tipeAkun": "ASET",
  "kategori": "Aset Lancar",
  "isActive": true
}
```

#### PUT `/coa/:id`
Update COA.

**Request Body:**
```json
{
  "kodeAkun": "1.1.03",
  "namaAkun": "Kas Kecil",
  "tipeAkun": "ASET",
  "kategori": "Aset Lancar",
  "isActive": false
}
```

#### DELETE `/coa/:id`
Soft delete COA (set isActive = false).

#### POST `/coa/seed`
Seed default COA untuk masjid.

---

### 2. Jurnal

#### GET `/jurnal`
Mendapatkan semua jurnal dengan filter opsional.

**Query Parameters:**
- `tanggalAwal` (optional): ISO date string
- `tanggalAkhir` (optional): ISO date string
- `akunId` (optional): Filter by akun ID
- `tipe` (optional): "DEBIT" | "KREDIT"

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": [
    {
      "id": "jurnal_123",
      "masjidId": "masjid_001",
      "tanggal": "2024-01-15T10:30:00.000Z",
      "akunId": "coa_123",
      "akun": {
        "id": "coa_123",
        "kodeAkun": "1.1.01",
        "namaAkun": "Kas",
        "tipeAkun": "ASET"
      },
      "tipe": "DEBIT",
      "jumlah": 5000000,
      "keterangan": "Donasi dari jamaah",
      "referensi": "donasi_001",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### GET `/jurnal/:id`
Mendapatkan detail jurnal berdasarkan ID.

#### POST `/jurnal`
Membuat jurnal baru.

**Request Body:**
```json
{
  "tanggal": "2024-01-15T10:30:00.000Z",
  "akunId": "coa_123",
  "tipe": "DEBIT",
  "jumlah": 5000000,
  "keterangan": "Donasi dari jamaah untuk renovasi",
  "referensi": "donasi_001"
}
```

#### PUT `/jurnal/:id`
Update jurnal.

#### DELETE `/jurnal/:id`
Hapus jurnal.

---

### 3. Laporan Keuangan

#### GET `/laporan-keuangan/jurnal/posisi-keuangan`
Generate Neraca dari jurnal.

**Query Parameters:**
- `tanggal` (required): ISO date string - Tanggal laporan

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "aset": {
      "Aset Lancar": [
        {
          "kodeAkun": "1.1.01",
          "namaAkun": "Kas",
          "saldo": 15000000
        }
      ]
    },
    "kewajiban": {
      "Kewajiban Lancar": []
    },
    "ekuitas": {
      "Ekuitas": [
        {
          "kodeAkun": "3.1.01",
          "namaAkun": "Modal Awal",
          "saldo": 10000000
        }
      ]
    },
    "totalAset": 15000000,
    "totalKewajiban": 0,
    "totalEkuitas": 15000000
  }
}
```

#### GET `/laporan-keuangan/jurnal/penghasilan-komprehensif`
Generate Laba Rugi.

**Query Parameters:**
- `tanggalAwal` (required): ISO date string
- `tanggalAkhir` (required): ISO date string

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "pendapatan": {
      "Pendapatan Operasional": [
        {
          "kodeAkun": "4.1.01",
          "namaAkun": "Pendapatan Donasi",
          "saldo": 10000000
        }
      ]
    },
    "beban": {
      "Beban Operasional": [
        {
          "kodeAkun": "5.1.01",
          "namaAkun": "Beban Operasional",
          "saldo": 2000000
        }
      ]
    },
    "totalPendapatan": 10000000,
    "totalBeban": 2000000,
    "labaRugi": 8000000
  }
}
```

#### GET `/laporan-keuangan/jurnal/perubahan-aset-neto`
Generate Laporan Perubahan Ekuitas.

**Query Parameters:**
- `tanggalAwal` (required): ISO date string
- `tanggalAkhir` (required): ISO date string

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "saldoAwalEkuitas": 10000000,
    "labaRugi": 8000000,
    "perubahanModal": 0,
    "saldoAkhirEkuitas": 18000000
  }
}
```

#### GET `/laporan-keuangan/jurnal/arus-kas`
Generate Laporan Arus Kas.

**Query Parameters:**
- `tanggalAwal` (required): ISO date string
- `tanggalAkhir` (required): ISO date string

**Response:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "operasional": {
      "masuk": 10000000,
      "keluar": 2000000,
      "netto": 8000000
    },
    "investasi": {
      "masuk": 0,
      "keluar": 0,
      "netto": 0
    },
    "pendanaan": {
      "masuk": 0,
      "keluar": 0,
      "netto": 0
    },
    "saldoAwal": 10000000,
    "saldoAkhir": 18000000
  }
}
```

---

## Business Logic

### 1. Perhitungan Saldo Akun

Saldo akun dihitung berdasarkan tipe akun:

- **ASET & BEBAN**: 
  - DEBIT menambah saldo (+)
  - KREDIT mengurangi saldo (-)
  - Formula: `Saldo = Total DEBIT - Total KREDIT`

- **KEWAJIBAN, EKUITAS, PENDAPATAN**:
  - KREDIT menambah saldo (+)
  - DEBIT mengurangi saldo (-)
  - Formula: `Saldo = Total KREDIT - Total DEBIT`

### 2. Generate Neraca (Posisi Keuangan)

1. Filter jurnal sampai tanggal tertentu
2. Group jurnal by tipe akun (ASET, KEWAJIBAN, EKUITAS)
3. Hitung saldo per akun
4. Group akun by kategori
5. Validasi: `Total Aset = Total Kewajiban + Total Ekuitas`

### 3. Generate Laba Rugi

1. Filter jurnal dalam periode (tanggalAwal - tanggalAkhir)
2. Group jurnal by tipe akun (PENDAPATAN, BEBAN)
3. Hitung total pendapatan dan beban
4. Laba/Rugi = Total Pendapatan - Total Beban

### 4. Generate Perubahan Ekuitas

1. Hitung saldo awal ekuitas (sampai tanggalAwal)
2. Hitung laba/rugi dalam periode
3. Hitung perubahan modal (transaksi langsung ke ekuitas)
4. Saldo Akhir = Saldo Awal + Laba/Rugi + Perubahan Modal

### 5. Generate Arus Kas

1. Filter jurnal untuk akun Kas dan Bank dalam periode
2. Kategorisasi transaksi:
   - **Operasional**: Transaksi dengan akun PENDAPATAN atau BEBAN
   - **Investasi**: Transaksi dengan akun ASET (selain kas/bank)
   - **Pendanaan**: Transaksi dengan akun EKUITAS atau KEWAJIBAN
3. Hitung kas masuk (KREDIT) dan keluar (DEBIT) per kategori
4. Saldo Akhir = Saldo Awal + Netto Operasional + Netto Investasi + Netto Pendanaan

---

## Contoh Data

### Default COA Structure

```javascript
const defaultCOA = [
  // ASET
  { kodeAkun: "1.1.01", namaAkun: "Kas", tipeAkun: "ASET", kategori: "Aset Lancar" },
  { kodeAkun: "1.1.02", namaAkun: "Bank", tipeAkun: "ASET", kategori: "Aset Lancar" },
  { kodeAkun: "1.2.01", namaAkun: "Piutang", tipeAkun: "ASET", kategori: "Aset Lancar" },
  { kodeAkun: "1.3.01", namaAkun: "Persediaan", tipeAkun: "ASET", kategori: "Aset Lancar" },
  { kodeAkun: "1.4.01", namaAkun: "Aset Tetap", tipeAkun: "ASET", kategori: "Aset Tetap" },
  
  // KEWAJIBAN
  { kodeAkun: "2.1.01", namaAkun: "Hutang Usaha", tipeAkun: "KEWAJIBAN", kategori: "Kewajiban Lancar" },
  { kodeAkun: "2.1.02", namaAkun: "Hutang Bank", tipeAkun: "KEWAJIBAN", kategori: "Kewajiban Lancar" },
  
  // EKUITAS
  { kodeAkun: "3.1.01", namaAkun: "Modal Awal", tipeAkun: "EKUITAS", kategori: "Ekuitas" },
  { kodeAkun: "3.2.01", namaAkun: "Saldo Laba", tipeAkun: "EKUITAS", kategori: "Ekuitas" },
  
  // PENDAPATAN
  { kodeAkun: "4.1.01", namaAkun: "Pendapatan Donasi", tipeAkun: "PENDAPATAN", kategori: "Pendapatan Operasional" },
  { kodeAkun: "4.1.02", namaAkun: "Pendapatan Lainnya", tipeAkun: "PENDAPATAN", kategori: "Pendapatan Operasional" },
  
  // BEBAN
  { kodeAkun: "5.1.01", namaAkun: "Beban Operasional", tipeAkun: "BEBAN", kategori: "Beban Operasional" },
  { kodeAkun: "5.1.02", namaAkun: "Beban Administrasi", tipeAkun: "BEBAN", kategori: "Beban Operasional" },
  { kodeAkun: "5.1.03", namaAkun: "Beban Lainnya", tipeAkun: "BEBAN", kategori: "Beban Operasional" },
];
```

### Contoh Transaksi Jurnal

**Donasi Masuk:**
```json
[
  {
    "tanggal": "2024-01-15T10:30:00.000Z",
    "akunId": "coa_kas",
    "tipe": "DEBIT",
    "jumlah": 5000000,
    "keterangan": "Donasi dari jamaah untuk renovasi",
    "referensi": "donasi_001"
  },
  {
    "tanggal": "2024-01-15T10:30:00.000Z",
    "akunId": "coa_pendapatan_donasi",
    "tipe": "KREDIT",
    "jumlah": 5000000,
    "keterangan": "Donasi dari jamaah untuk renovasi",
    "referensi": "donasi_001"
  }
]
```

**Pengeluaran:**
```json
[
  {
    "tanggal": "2024-01-20T14:00:00.000Z",
    "akunId": "coa_beban_operasional",
    "tipe": "DEBIT",
    "jumlah": 500000,
    "keterangan": "Biaya listrik dan air bulanan",
    "referensi": "pengeluaran_001"
  },
  {
    "tanggal": "2024-01-20T14:00:00.000Z",
    "akunId": "coa_kas",
    "tipe": "KREDIT",
    "jumlah": 500000,
    "keterangan": "Biaya listrik dan air bulanan",
    "referensi": "pengeluaran_001"
  }
]
```

---

## Validasi

### COA Validation

1. **kodeAkun**: 
   - Required
   - Format: String dengan pattern seperti "1.1.01"
   - Unique per masjid

2. **namaAkun**: 
   - Required
   - Min length: 3 characters
   - Max length: 100 characters

3. **tipeAkun**: 
   - Required
   - Enum: ["ASET", "KEWAJIBAN", "EKUITAS", "PENDAPATAN", "BEBAN"]

4. **kategori**: 
   - Required
   - Min length: 3 characters
   - Max length: 100 characters

### Jurnal Validation

1. **tanggal**: 
   - Required
   - Valid ISO date string
   - Tidak boleh lebih dari tanggal hari ini (opsional, tergantung business rule)

2. **akunId**: 
   - Required
   - Must exist in COA
   - Akun harus aktif (isActive = true)

3. **tipe**: 
   - Required
   - Enum: ["DEBIT", "KREDIT"]

4. **jumlah**: 
   - Required
   - Number
   - Must be > 0
   - Max: sesuai dengan business rule (misal: 999,999,999,999.99)

5. **keterangan**: 
   - Required
   - Min length: 5 characters
   - Max length: 500 characters

### Business Rules

1. **COA tidak bisa dihapus** jika sudah ada jurnal yang menggunakan akun tersebut
2. **COA bisa di-nonaktifkan** (soft delete) dengan set isActive = false
3. **Jurnal tidak bisa dihapus** jika sudah digunakan untuk generate laporan yang sudah dipublish (opsional, tergantung business rule)
4. **Validasi balance** untuk Neraca: Total Aset harus sama dengan Total Kewajiban + Total Ekuitas

---

## Catatan Implementasi

1. **Single-Entry vs Double-Entry**: 
   - Sistem ini menggunakan single-entry, dimana setiap transaksi dicatat sebagai satu entri jurnal
   - Untuk transaksi yang memerlukan double-entry (contoh: donasi masuk memerlukan Debit Kas dan Kredit Pendapatan), user harus membuat 2 jurnal terpisah

2. **Storage**: 
   - Frontend menggunakan localStorage untuk menyimpan data (prototype)
   - Backend nanti akan menggunakan database PostgreSQL

3. **Date Handling**: 
   - Semua tanggal menggunakan ISO 8601 format
   - Timezone: WIB (UTC+7)

4. **Currency**: 
   - Semua jumlah dalam Rupiah (IDR)
   - Format display: "Rp 1.000.000"

---

**Dibuat**: 2024
**Versi**: 1.0.0 (Prototype Frontend)

