# Implementasi Penambahan Akun di Frontend

Dokumen ini menjelaskan implementasi penambahan akun di frontend berdasarkan dokumentasi backend.

---

## 📍 Lokasi File

- **Service:** `src/services/coaService.js`
- **Page Component:** `src/pages/takmir/coa_page/coa.jsx`
- **Transform Utils:** `src/utils/dataTransform.js`

---

## 🔧 Endpoint yang Digunakan

### 1. GET `/coa/valid-parents` ⭐ **RECOMMENDED**

**Service Function:**
```javascript
import { getValidParents } from '../../../services/coaService';

// Fetch valid parents
const validParents = await getValidParents({ masjidId });
```

**Implementasi:**
- Dipanggil saat form create account dibuka
- Menggunakan endpoint backend yang sudah memfilter parent yang valid
- Lebih akurat daripada filter manual di frontend

**Response Format:**
```json
{
  "statusCode": 200,
  "message": "Valid parents fetched successfully",
  "data": [
    {
      "id": "cmb6vlo570001vgzgsq1p0c42",
      "code": "1.1.1",
      "name": "Kas dan Setara Kas",
      "type": "ASSET",
      "isGroup": true,
      "pathCode": "1.1.1"
    }
  ]
}
```

---

### 2. GET `/coa/next-code?parentId=xxx`

**Service Function:**
```javascript
import { getNextAccountCode } from '../../../services/coaService';

// Get next code untuk preview
const nextCode = await getNextAccountCode(parentId, masjidId);
```

**Implementasi:**
- Dipanggil saat user memilih parent account
- Auto-fill field `kodeAkun` dengan kode yang di-generate
- Optional: bisa dikosongkan untuk auto-generate saat submit

---

### 3. POST `/coa`

**Service Function:**
```javascript
import { createAccount } from '../../../services/coaService';

// Create account
const accountData = {
  parentId: "cmb6vlo570001vgzgsq1p0c42",
  name: "Kas Kecil",
  type: "ASSET",
  code: "", // Optional: kosong = auto-generate
  restriction: "TANPA_PEMBATASAN",
  report: "NERACA",
  category: "ASET_LANCAR"
};

const newAccount = await createAccount(accountData);
```

**Request Body:**
```json
{
  "parentId": "cmb6vlo570001vgzgsq1p0c42",
  "name": "Kas Kecil",
  "type": "ASSET",
  "code": "",
  "restriction": "TANPA_PEMBATASAN",
  "report": "NERACA",
  "category": "ASET_LANCAR"
}
```

---

## 💻 Implementasi di Frontend

### Component: `COAFormModal`

**Location:** `src/pages/takmir/coa_page/coa.jsx`

**Key Features:**

1. **Load Valid Parents:**
   ```javascript
   useEffect(() => {
     if (!coa) {
       loadValidParents();
     }
   }, [coa]);

   const loadValidParents = async () => {
     try {
       setLoadingParents(true);
       const validParents = await getValidParents({ masjidId });
       const transformed = transformAccounts(validParents);
       setParentOptions(transformed);
     } catch (error) {
       console.error("Error loading valid parents:", error);
       toast.error("Gagal memuat daftar parent account");
       setParentOptions([]);
     } finally {
       setLoadingParents(false);
     }
   };
   ```

2. **Auto-generate Code saat Parent Dipilih:**
   ```javascript
   const handleParentChange = async (parentId) => {
     if (!parentId) {
       setFormData({
         ...formData,
         parentId: "",
         kodeAkun: "",
         kategori: "",
       });
       return;
     }

     const parentAccount = parentOptions.find((acc) => acc.id === parentId);
     const parentName = parentAccount?.namaAkun || "";

     setGeneratingCode(true);
     try {
       const nextCode = await getNextAccountCode(parentId, masjidId);
       setFormData({
         ...formData,
         parentId,
         kodeAkun: nextCode,
         kategori: parentName,
         category: parentName,
       });
     } catch (error) {
       console.error("Error generating code:", error);
       toast.error("Gagal generate kode akun");
     } finally {
       setGeneratingCode(false);
     }
   };
   ```

3. **Form Validation:**
   ```javascript
   const validate = () => {
     const newErrors = {};

     // ParentId wajib untuk create baru
     if (!coa && !formData.parentId) {
       newErrors.parentId = "Parent account harus dipilih";
     }

     // Kode akun wajib (akan di-generate otomatis jika parent dipilih)
     if (!formData.kodeAkun.trim()) {
       newErrors.kodeAkun = "Kode akun harus diisi";
     }

     // Nama akun wajib
     if (!formData.namaAkun.trim()) {
       newErrors.namaAkun = "Nama akun harus diisi";
     }

     // Category wajib
     if (!formData.category.trim()) {
       newErrors.category = "Category wajib diisi";
     }

     // Restriction wajib
     if (!formData.restriction.trim()) {
       newErrors.restriction = "Restriction wajib diisi";
     }

     // Report wajib
     if (!formData.report.trim()) {
       newErrors.report = "Report wajib diisi";
     }

     setErrors(newErrors);
     return Object.keys(newErrors).length === 0;
   };
   ```

4. **Submit Handler:**
   ```javascript
   const handleSave = async (formData) => {
     try {
       const backendData = transformAccountForBackend(formData);
       backendData.masjidId = formData.masjidId || masjidId || null;

       if (editingCOA) {
         await updateAccount(editingCOA.id, backendData);
         toast.success("Akun berhasil diupdate");
       } else {
         await createAccount(backendData);
         toast.success("Akun berhasil ditambahkan");
       }

       setShowForm(false);
       setEditingCOA(null);
       await loadAccounts();
     } catch (error) {
       console.error("Error saving account:", error);
       toast.error(
         error.response?.data?.message || "Gagal menyimpan akun"
       );
     }
   };
   ```

---

## 🔄 Data Transformation

### Frontend → Backend

**Function:** `transformAccountForBackend()` di `src/utils/dataTransform.js`

```javascript
export const transformAccountForBackend = (accountData) => {
  const typeMap = {
    ASET: "ASSET",
    KEWAJIBAN: "LIABILITY",
    EKUITAS: "EQUITY",
    PENDAPATAN: "REVENUE",
    BEBAN: "EXPENSE",
  };

  return {
    code: accountData.kodeAkun || accountData.code || "",
    name: accountData.namaAkun || accountData.name,
    parentId: accountData.parentId || null,
    type: typeMap[accountData.tipeAkun] || accountData.type,
    isGroup: false, // Always false - hanya bisa create non-group account
    masjidId: accountData.masjidId || null,
    restriction: accountData.restriction || null,
    report: accountData.report || null,
    category: accountData.category || accountData.kategori || null,
    isActive: accountData.isActive !== undefined ? accountData.isActive : true,
  };
};
```

**Mapping:**
- `kodeAkun` → `code`
- `namaAkun` → `name`
- `tipeAkun` → `type` (dengan mapping ASET → ASSET, dll)
- `kategori` → `category`
- `restriction` → `restriction`
- `report` → `report`

---

## 📋 Form Fields

### Required Fields

| Field | Backend Field | Type | Description |
|-------|---------------|------|-------------|
| Parent Account | `parentId` | string | ID dari valid parent (wajib untuk create) |
| Nama Akun | `name` | string | Nama akun |
| Tipe Akun | `type` | enum | ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE |

### Optional Fields (Recommended)

| Field | Backend Field | Type | Valid Values |
|-------|---------------|------|--------------|
| Kode Akun | `code` | string | Auto-generate jika kosong |
| Restriction | `restriction` | enum | TANPA_PEMBATASAN, DENGAN_PEMBATASAN |
| Report | `report` | enum | NERACA, LAPORAN_PENGHASILAN_KOMPREHENSIF |
| Category | `category` | enum | ASET_LANCAR, ASET_TIDAK_LANCAR, dll |

### Auto-Set Fields

| Field | Value | Description |
|-------|-------|-------------|
| `isGroup` | `false` | Selalu false untuk account baru |
| `normalBalance` | Auto dari `type` | DEBIT untuk ASSET/EXPENSE, KREDIT untuk lainnya |
| `isActive` | `true` | Selalu true saat create |

---

## ⚠️ Error Handling

### Common Errors

1. **"Parent must be a group account"**
   - **Penyebab:** Parent yang dipilih bukan group account
   - **Solusi:** Gunakan endpoint `/coa/valid-parents` (sudah diimplementasi)

2. **"Parent account not found"**
   - **Penyebab:** `parentId` tidak valid
   - **Solusi:** Refresh valid parents sebelum submit

3. **"Account with code XXX already exists"**
   - **Penyebab:** Kode akun sudah digunakan
   - **Solusi:** Kosongkan field `code` untuk auto-generate

4. **"Invalid restriction/report/category value"**
   - **Penyebab:** Nilai enum tidak valid
   - **Solusi:** Gunakan dropdown dengan nilai enum yang valid

---

## 🎨 UI/UX Features

1. **Loading States:**
   - Loading indicator saat fetch valid parents
   - Loading indicator saat generate next code
   - Disabled state saat loading

2. **Auto-fill:**
   - Auto-fill kode akun saat parent dipilih
   - Auto-fill kategori dari parent name

3. **Validation:**
   - Real-time validation
   - Error messages yang jelas
   - Required field indicators

4. **User Feedback:**
   - Toast notifications untuk success/error
   - Loading states
   - Disabled states saat processing

---

## ✅ Checklist Implementasi

- [x] Fetch valid parents menggunakan `/coa/valid-parents`
- [x] Tampilkan valid parents di dropdown
- [x] Fetch next code saat parent dipilih (optional, untuk preview)
- [x] Auto-generate code jika kosong
- [x] Validasi form: parentId, name, type wajib diisi
- [x] Handle error dengan pesan yang jelas
- [x] Tampilkan loading state saat fetch data
- [x] Reset form setelah create berhasil
- [x] Transform data frontend → backend
- [x] Toast notifications untuk feedback

---

## 🔄 Flow Diagram

```
User klik "Tambah Akun"
    ↓
Form Modal dibuka
    ↓
useEffect trigger → loadValidParents()
    ↓
GET /coa/valid-parents
    ↓
Tampilkan dropdown parent options
    ↓
User pilih parent account
    ↓
handleParentChange() → GET /coa/next-code
    ↓
Auto-fill kode akun dan kategori
    ↓
User isi form (nama, type, dll)
    ↓
User klik "Simpan"
    ↓
validate() → check required fields
    ↓
transformAccountForBackend() → convert format
    ↓
POST /coa → create account
    ↓
Success → toast + reload data + close modal
```

---

## 📝 Notes

1. **Endpoint `/coa/valid-parents` lebih direkomendasikan** daripada filter manual di frontend karena:
   - Backend sudah memfilter parent yang valid (tidak punya group children)
   - Lebih akurat dan konsisten
   - Mengurangi logic di frontend

2. **Auto-generate code:**
   - Jika field `code` kosong saat submit, backend akan auto-generate
   - User bisa preview code dengan memilih parent (optional)

3. **Category field:**
   - Saat ini menggunakan text input (bisa diubah ke dropdown)
   - Harus sesuai dengan enum backend

4. **Type mapping:**
   - Frontend menggunakan format: ASET, KEWAJIBAN, dll
   - Backend menggunakan format: ASSET, LIABILITY, dll
   - Transform function handle mapping ini

---

## 🔗 Related Files

- `src/services/coaService.js` - API service functions
- `src/pages/takmir/coa_page/coa.jsx` - Main page component
- `src/utils/dataTransform.js` - Data transformation utilities
- `src/utils/accountUtils.js` - Account helper functions

---

**Last Updated:** 2024
**Version:** 1.0

