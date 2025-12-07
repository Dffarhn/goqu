# Solusi Optimasi Performa - Input Jurnal, Buku Besar, dan Laporan Jurnal

## 📋 Daftar Isi
1. [Solusi Frontend (Tanpa Backend)](#solusi-frontend)
2. [Solusi dengan Kerja Sama Backend](#solusi-dengan-backend)
3. [Implementasi Step-by-Step](#implementasi)
4. [Prioritas Implementasi](#prioritas)

---

## 🎯 Solusi Frontend (Tanpa Perlu Backend)

### 1. **Optimasi Buku Besar dengan useMemo**

**Masalah:** Transform dilakukan di setiap render tanpa caching.

**Solusi:** Gunakan `useMemo` untuk semua transform yang berat.

**File:** `src/pages/takmir/buku_besar_page/buku_besar.jsx`

**Perubahan yang diperlukan:**
- Import `useMemo` dari React
- Wrap semua transform dengan `useMemo`
- Tambahkan dependency array yang tepat

**Impact:** Mengurangi waktu render dari ~1.6s menjadi ~200ms (87% improvement)

---

### 2. **Cache Transform di Laporan Jurnal**

**Masalah:** Transform data dilakukan setiap kali generate laporan.

**Solusi:** Cache hasil transform berdasarkan parameter (tanggal, tab).

**File:** `src/pages/takmir/laporan_keuangan_jurnal_page/laporan_keuangan_jurnal.jsx`

**Perubahan yang diperlukan:**
- Gunakan `useRef` untuk menyimpan cache
- Check cache sebelum transform
- Invalidate cache saat parameter berubah

**Impact:** Mengurangi waktu transform dari ~300ms menjadi ~50ms (83% improvement)

---

### 3. **Debounce Generate Laporan**

**Masalah:** Generate laporan setiap kali tanggal berubah (terlalu sering).

**Solusi:** Tunggu user selesai input sebelum generate (debounce 500ms).

**File:** `src/pages/takmir/laporan_keuangan_jurnal_page/laporan_keuangan_jurnal.jsx`

**Perubahan yang diperlukan:**
- Install atau buat utility debounce
- Wrap `generateLaporan` dengan debounce
- Atau tambahkan tombol "Generate" manual

**Impact:** Mengurangi API calls yang tidak perlu (90% reduction)

---

### 4. **Virtual Scrolling atau Pagination di Buku Besar**

**Masalah:** Render semua entries sekaligus (bisa ribuan rows).

**Solusi:** 
- **Opsi A:** Pagination (50-100 entries per halaman)
- **Opsi B:** Virtual scrolling (render hanya yang terlihat)

**File:** `src/pages/takmir/buku_besar_page/buku_besar.jsx`

**Perubahan yang diperlukan:**
- Tambahkan state untuk current page
- Slice data untuk pagination
- Atau gunakan library seperti `react-window` untuk virtual scrolling

**Impact:** Mengurangi waktu render dari ~400ms menjadi ~50ms (87% improvement)

---

### 5. **Optimasi Transform Account dengan Caching**

**Masalah:** Transform account dilakukan berulang-ulang.

**Solusi:** Cache hasil transform account.

**File:** `src/utils/dataTransform.js`

**Perubahan yang diperlukan:**
- Buat Map untuk cache transform
- Check cache sebelum transform
- Clear cache saat data berubah

**Impact:** Mengurangi waktu transform dari ~150ms menjadi ~20ms (87% improvement)

---

## 🤝 Solusi dengan Kerja Sama Backend

### 1. **Filter & Sort di Backend untuk Buku Besar**

**Masalah:** Load semua jurnal, lalu filter di frontend.

**Solusi:** Backend filter berdasarkan tanggal dan return data yang sudah di-sort.

**API Endpoint yang perlu diubah:**
```
GET /api/v1/jurnal
```

**Query Parameters yang perlu ditambahkan:**
- `tanggalAwal` (sudah ada)
- `tanggalAkhir` (sudah ada)
- `sortBy` (optional: "tanggal", "akun", dll)
- `sortOrder` (optional: "asc", "desc")
- `page` (optional: untuk pagination)
- `limit` (optional: jumlah data per page)

**Backend perlu:**
1. Filter jurnal berdasarkan `tanggalAwal` dan `tanggalAkhir`
2. Sort data di database (lebih cepat dari sort di frontend)
3. Return data yang sudah di-sort
4. Support pagination jika diperlukan

**Frontend perubahan:**
- Kirim `tanggalAwal` dan `tanggalAkhir` ke API
- Hapus filter dan sort di frontend
- Terima data yang sudah ready

**Impact:** Mengurangi data transfer dan waktu processing (70% improvement)

---

### 2. **Pagination di Backend untuk Buku Besar**

**Masalah:** Load semua jurnal sekaligus (bisa ribuan).

**Solusi:** Backend support pagination.

**API Response format:**
```json
{
  "statusCode": 200,
  "message": "Success",
  "data": {
    "transactions": [...],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1000,
      "totalPages": 20
    }
  }
}
```

**Backend perlu:**
1. Support `page` dan `limit` query parameters
2. Hitung total records
3. Return pagination metadata

**Frontend perubahan:**
- Kirim `page` dan `limit` ke API
- Handle pagination UI
- Load data per page

**Impact:** Mengurangi data transfer dari ~5MB menjadi ~250KB (95% reduction)

---

### 3. **Lazy Load Accounts di Input Jurnal**

**Masalah:** Load semua accounts sekaligus saat form dibuka.

**Solusi:** Backend support search accounts dengan pagination.

**API Endpoint baru:**
```
GET /api/v1/coa/search
```

**Query Parameters:**
- `search` (optional: search by kode/nama)
- `tipeAkun` (optional: filter by tipe)
- `isActive` (optional: filter active only)
- `restriction` (optional: filter by restriction)
- `page` (optional)
- `limit` (optional)

**Backend perlu:**
1. Endpoint search accounts
2. Support filter dan pagination
3. Return data yang sudah di-filter

**Frontend perubahan:**
- Load accounts hanya saat dropdown dibuka
- Search dengan debounce
- Load per page jika banyak

**Impact:** Mengurangi initial load dari ~200ms menjadi ~50ms (75% improvement)

---

### 4. **Optimasi Generate Laporan di Backend**

**Masalah:** Frontend transform data yang sudah di-process backend.

**Solusi:** Backend return data dalam format yang sudah siap pakai.

**API Response format saat ini:**
```json
{
  "aset": {
    "Aset Lancar": [
      {
        "kodeAkun": "1.1.01",
        "namaAkun": "Kas",
        "tanpaPembatasan": "15000000",  // String
        "denganPembatasan": "0",        // String
        "saldo": "15000000"             // String
      }
    ]
  }
}
```

**API Response format yang diinginkan:**
```json
{
  "aset": {
    "Aset Lancar": [
      {
        "kodeAkun": "1.1.01",
        "namaAkun": "Kas",
        "tanpaPembatasan": 15000000,  // Number
        "denganPembatasan": 0,        // Number
        "saldo": 15000000             // Number
      }
    ]
  }
}
```

**Backend perlu:**
1. Return number (bukan string) untuk semua nilai
2. Format data sesuai kebutuhan frontend
3. Kurangi transform yang perlu dilakukan frontend

**Frontend perubahan:**
- Hapus atau simplify transform function
- Langsung pakai data dari backend

**Impact:** Mengurangi waktu transform dari ~300ms menjadi ~10ms (97% improvement)

---

### 5. **Caching di Backend untuk Laporan**

**Masalah:** Generate laporan yang sama berulang-ulang.

**Solusi:** Backend cache hasil generate laporan.

**Backend perlu:**
1. Cache hasil generate berdasarkan parameter (tanggal, jenis laporan)
2. Return cached data jika ada (dengan TTL misalnya 5 menit)
3. Invalidate cache saat ada transaksi baru

**Frontend perubahan:**
- Tidak perlu perubahan (transparent)

**Impact:** Mengurangi waktu generate dari ~800ms menjadi ~50ms (94% improvement)

---

## 📝 Implementasi Step-by-Step

### **Phase 1: Frontend Only (Tanpa Backend) - 1-2 hari**

#### Step 1.1: Optimasi Buku Besar dengan useMemo
- [ ] Import `useMemo` dari React
- [ ] Wrap `allEntries` dengan `useMemo`
- [ ] Wrap `filteredEntries` dengan `useMemo`
- [ ] Wrap `sortedEntries` dengan `useMemo`
- [ ] Wrap `totals` dengan `useMemo`
- [ ] Test performa

#### Step 1.2: Cache Transform di Laporan Jurnal
- [ ] Buat `useRef` untuk cache
- [ ] Implementasi cache key berdasarkan parameter
- [ ] Check cache sebelum transform
- [ ] Test performa

#### Step 1.3: Debounce Generate Laporan
- [ ] Install atau buat utility debounce
- [ ] Wrap `generateLaporan` dengan debounce
- [ ] Atau tambahkan tombol "Generate" manual
- [ ] Test performa

#### Step 1.4: Pagination di Buku Besar (Frontend)
- [ ] Tambahkan state untuk current page
- [ ] Slice `sortedEntries` untuk pagination
- [ ] Tambahkan pagination UI
- [ ] Test performa

**Total waktu: 1-2 hari**
**Impact: 70-80% improvement tanpa backend**

---

### **Phase 2: Dengan Backend - 3-5 hari**

#### Step 2.1: Filter & Sort di Backend untuk Buku Besar
**Backend:**
- [ ] Update endpoint `GET /api/v1/jurnal`
- [ ] Support filter `tanggalAwal` dan `tanggalAkhir`
- [ ] Support sort di database
- [ ] Test API

**Frontend:**
- [ ] Update `getAllJurnals` untuk kirim parameter
- [ ] Hapus filter dan sort di frontend
- [ ] Test performa

#### Step 2.2: Pagination di Backend
**Backend:**
- [ ] Support `page` dan `limit` di endpoint jurnal
- [ ] Return pagination metadata
- [ ] Test API

**Frontend:**
- [ ] Update untuk handle pagination
- [ ] Update UI pagination
- [ ] Test performa

#### Step 2.3: Lazy Load Accounts
**Backend:**
- [ ] Buat endpoint `GET /api/v1/coa/search`
- [ ] Support search, filter, dan pagination
- [ ] Test API

**Frontend:**
- [ ] Update form untuk lazy load
- [ ] Implementasi search dengan debounce
- [ ] Test performa

#### Step 2.4: Optimasi Format Response Laporan
**Backend:**
- [ ] Update semua endpoint laporan
- [ ] Return number (bukan string)
- [ ] Format sesuai kebutuhan frontend
- [ ] Test API

**Frontend:**
- [ ] Simplify atau hapus transform function
- [ ] Test performa

#### Step 2.5: Caching di Backend (Optional)
**Backend:**
- [ ] Implementasi cache untuk generate laporan
- [ ] Set TTL (misalnya 5 menit)
- [ ] Invalidate cache saat ada transaksi baru
- [ ] Test API

**Frontend:**
- [ ] Tidak perlu perubahan

**Total waktu: 3-5 hari (tergantung backend)**
**Impact: 90-95% improvement total**

---

## 🎯 Prioritas Implementasi

### **PRIORITAS TINGGI (Lakukan Sekarang - Frontend Only)**

1. ✅ **Optimasi Buku Besar dengan useMemo**
   - Waktu: 2-3 jam
   - Impact: 87% improvement
   - Tidak perlu backend

2. ✅ **Cache Transform di Laporan Jurnal**
   - Waktu: 1-2 jam
   - Impact: 83% improvement
   - Tidak perlu backend

3. ✅ **Debounce Generate Laporan**
   - Waktu: 1 jam
   - Impact: 90% reduction API calls
   - Tidak perlu backend

4. ✅ **Pagination di Buku Besar (Frontend)**
   - Waktu: 3-4 jam
   - Impact: 87% improvement render
   - Tidak perlu backend

**Total waktu: 1 hari**
**Total impact: 70-80% improvement**

---

### **PRIORITAS SEDANG (Setelah Prioritas Tinggi - Perlu Backend)**

1. ⚠️ **Filter & Sort di Backend untuk Buku Besar**
   - Waktu: Backend 1 hari, Frontend 2 jam
   - Impact: 70% improvement
   - Perlu backend

2. ⚠️ **Pagination di Backend**
   - Waktu: Backend 1 hari, Frontend 2 jam
   - Impact: 95% reduction data transfer
   - Perlu backend

3. ⚠️ **Optimasi Format Response Laporan**
   - Waktu: Backend 4 jam, Frontend 1 jam
   - Impact: 97% improvement transform
   - Perlu backend

**Total waktu: 2-3 hari (tergantung backend)**
**Total impact: 90-95% improvement**

---

### **PRIORITAS RENDAH (Nice to Have)**

1. 💡 **Lazy Load Accounts**
   - Waktu: Backend 1 hari, Frontend 3 jam
   - Impact: 75% improvement initial load
   - Perlu backend

2. 💡 **Caching di Backend untuk Laporan**
   - Waktu: Backend 1 hari
   - Impact: 94% improvement generate
   - Perlu backend

---

## 📊 Summary: Kerja Sama dengan Backend

### **Yang BISA dilakukan di Frontend saja (TIDAK perlu backend):**
- ✅ Optimasi dengan `useMemo`
- ✅ Cache transform di frontend
- ✅ Debounce generate laporan
- ✅ Pagination di frontend
- ✅ Virtual scrolling

**Impact: 70-80% improvement tanpa backend**

---

### **Yang PERLU kerja sama Backend:**

1. **Filter & Sort di Backend untuk Buku Besar**
   - Backend: Update endpoint `GET /api/v1/jurnal` untuk support filter dan sort
   - Frontend: Kirim parameter dan hapus filter/sort di frontend

2. **Pagination di Backend**
   - Backend: Support `page` dan `limit`, return pagination metadata
   - Frontend: Handle pagination dan load data per page

3. **Lazy Load Accounts**
   - Backend: Buat endpoint `GET /api/v1/coa/search` dengan search, filter, pagination
   - Frontend: Load accounts saat dropdown dibuka dengan search

4. **Optimasi Format Response Laporan**
   - Backend: Return number (bukan string) dan format sesuai kebutuhan
   - Frontend: Simplify atau hapus transform function

5. **Caching di Backend untuk Laporan**
   - Backend: Cache hasil generate laporan dengan TTL
   - Frontend: Tidak perlu perubahan

**Impact: 90-95% improvement total dengan backend**

---

## 🚀 Rekomendasi

### **Lakukan Sekarang (Frontend Only):**
1. Optimasi Buku Besar dengan `useMemo` (2-3 jam)
2. Cache transform di Laporan Jurnal (1-2 jam)
3. Debounce generate laporan (1 jam)
4. Pagination di Buku Besar frontend (3-4 jam)

**Total: 1 hari kerja**
**Hasil: 70-80% improvement langsung**

### **Diskusikan dengan Backend:**
1. Filter & Sort di Backend untuk Buku Besar
2. Pagination di Backend
3. Optimasi Format Response Laporan

**Total: 2-3 hari kerja (tergantung backend)**
**Hasil: 90-95% improvement total**

---

## 📞 Checklist untuk Diskusi dengan Backend

Saat diskusi dengan backend, pastikan membahas:

- [ ] Endpoint `GET /api/v1/jurnal` perlu support:
  - Filter `tanggalAwal` dan `tanggalAkhir`
  - Sort di database
  - Pagination (`page`, `limit`)
  - Return pagination metadata

- [ ] Endpoint baru `GET /api/v1/coa/search` untuk:
  - Search accounts
  - Filter by tipe, restriction, dll
  - Pagination

- [ ] Endpoint laporan (`/laporan-keuangan/jurnal/*`) perlu:
  - Return number (bukan string)
  - Format sesuai kebutuhan frontend
  - Optional: Caching dengan TTL

- [ ] Timeline implementasi
- [ ] Testing bersama

---

**Kesimpulan:** 
- **70-80% improvement bisa dicapai tanpa backend** (1 hari kerja)
- **90-95% improvement dengan backend** (2-3 hari kerja)
- **Prioritas: Lakukan frontend optimization dulu, lalu diskusikan dengan backend**

