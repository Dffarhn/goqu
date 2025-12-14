# API Dokumentasi - List Masjid Terdaftar

## Endpoint: GET /masjid

Endpoint ini digunakan untuk mendapatkan daftar semua masjid yang terdaftar di sistem. Endpoint ini bersifat public dan dapat diakses tanpa autentikasi.

### Request

**Method:** `GET`

**URL:** `/masjid`

**Headers:**
```
Content-Type: application/json
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| limit | integer | No | - | Jumlah maksimal data yang dikembalikan |
| offset | integer | No | 0 | Offset untuk pagination |
| search | string | No | - | Pencarian berdasarkan nama, deskripsi, atau alamat masjid |

**Contoh Request:**
```bash
GET /masjid
GET /masjid?limit=10
GET /masjid?limit=10&offset=0
GET /masjid?search=Al-Falah
```

### Response

**Success Response (200 OK):**

```json
{
  "status": "success",
  "message": "Data masjid berhasil diambil",
  "data": [
    {
      "id": "uuid-string",
      "Nama": "Masjid Al-Falah",
      "Deskripsi": "Masjid yang terletak di pusat kota dengan fasilitas lengkap",
      "Alamat": "Jl. Merdeka No. 123, Jakarta Pusat",
      "FotoMasjid": "https://example.com/images/masjid-al-falah.jpg",
      "NoTelepon": "021-12345678",
      "Email": "info@masjidalfalah.com",
      "Website": "https://masjidalfalah.com",
      "Latitude": -6.2088,
      "Longitude": 106.8456,
      "CreatedAt": "2024-01-15T10:30:00Z",
      "UpdatedAt": "2024-01-20T14:45:00Z"
    },
    {
      "id": "uuid-string-2",
      "Nama": "Masjid Al-Hikmah",
      "Deskripsi": "Masjid dengan arsitektur modern",
      "Alamat": "Jl. Sudirman No. 456, Jakarta Selatan",
      "FotoMasjid": "https://example.com/images/masjid-al-hikmah.jpg",
      "NoTelepon": "021-87654321",
      "Email": "contact@masjidalhikmah.com",
      "Website": null,
      "Latitude": -6.2297,
      "Longitude": 106.7997,
      "CreatedAt": "2024-02-01T08:15:00Z",
      "UpdatedAt": "2024-02-05T16:20:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 10,
    "offset": 0,
    "totalPages": 5,
    "currentPage": 1
  }
}
```

**Error Response (500 Internal Server Error):**

```json
{
  "status": "error",
  "message": "Gagal memuat data masjid",
  "error": "Internal server error"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Unique identifier masjid |
| Nama | string | Nama masjid |
| Deskripsi | string | Deskripsi tentang masjid |
| Alamat | string | Alamat lengkap masjid |
| FotoMasjid | string (URL) | URL foto masjid (nullable) |
| NoTelepon | string | Nomor telepon masjid (nullable) |
| Email | string | Email masjid (nullable) |
| Website | string (URL) | Website masjid (nullable) |
| Latitude | float | Koordinat latitude masjid (nullable) |
| Longitude | float | Koordinat longitude masjid (nullable) |
| CreatedAt | string (ISO 8601) | Tanggal dan waktu pembuatan data |
| UpdatedAt | string (ISO 8601) | Tanggal dan waktu terakhir update |

### Pagination Fields

| Field | Type | Description |
|-------|------|-------------|
| total | integer | Total jumlah data masjid |
| limit | integer | Jumlah data per halaman |
| offset | integer | Offset data |
| totalPages | integer | Total jumlah halaman |
| currentPage | integer | Halaman saat ini |

### Contoh Implementasi Backend

#### Node.js/Express dengan Sequelize

```javascript
// routes/masjid.js
const express = require('express');
const router = express.Router();
const { Masjid } = require('../models');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
  try {
    const { limit, offset = 0, search } = req.query;
    
    // Build where clause for search
    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { Nama: { [Op.like]: `%${search}%` } },
        { Deskripsi: { [Op.like]: `%${search}%` } },
        { Alamat: { [Op.like]: `%${search}%` } }
      ];
    }

    // Build query options
    const queryOptions = {
      where: whereClause,
      order: [['CreatedAt', 'DESC']],
      attributes: [
        'id',
        'Nama',
        'Deskripsi',
        'Alamat',
        'FotoMasjid',
        'NoTelepon',
        'Email',
        'Website',
        'Latitude',
        'Longitude',
        'CreatedAt',
        'UpdatedAt'
      ]
    };

    // Add pagination if limit is provided
    if (limit) {
      queryOptions.limit = parseInt(limit);
      queryOptions.offset = parseInt(offset);
    }

    // Get total count for pagination
    const total = await Masjid.count({ where: whereClause });

    // Fetch masjid data
    const masjidList = await Masjid.findAll(queryOptions);

    // Calculate pagination info
    const limitNum = limit ? parseInt(limit) : total;
    const offsetNum = parseInt(offset);
    const totalPages = limit ? Math.ceil(total / limitNum) : 1;
    const currentPage = limit ? Math.floor(offsetNum / limitNum) + 1 : 1;

    res.json({
      status: 'success',
      message: 'Data masjid berhasil diambil',
      data: masjidList,
      pagination: {
        total,
        limit: limitNum,
        offset: offsetNum,
        totalPages,
        currentPage
      }
    });
  } catch (error) {
    console.error('Error fetching masjid:', error);
    res.status(500).json({
      status: 'error',
      message: 'Gagal memuat data masjid',
      error: error.message
    });
  }
});

module.exports = router;
```

#### Go dengan GORM

```go
// handlers/masjid.go
package handlers

import (
    "net/http"
    "strconv"
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
)

type Masjid struct {
    ID          string  `json:"id" gorm:"primaryKey"`
    Nama        string  `json:"Nama"`
    Deskripsi   string  `json:"Deskripsi"`
    Alamat      string  `json:"Alamat"`
    FotoMasjid  *string `json:"FotoMasjid"`
    NoTelepon   *string `json:"NoTelepon"`
    Email       *string `json:"Email"`
    Website     *string `json:"Website"`
    Latitude    *float64 `json:"Latitude"`
    Longitude   *float64 `json:"Longitude"`
    CreatedAt   string  `json:"CreatedAt"`
    UpdatedAt   string  `json:"UpdatedAt"`
}

type Pagination struct {
    Total      int `json:"total"`
    Limit      int `json:"limit"`
    Offset     int `json:"offset"`
    TotalPages int `json:"totalPages"`
    CurrentPage int `json:"currentPage"`
}

type MasjidResponse struct {
    Status     string      `json:"status"`
    Message    string      `json:"message"`
    Data       []Masjid    `json:"data"`
    Pagination Pagination  `json:"pagination"`
}

func GetMasjidList(c *gin.Context) {
    db := c.MustGet("db").(*gorm.DB)
    
    var masjidList []Masjid
    var total int64
    
    // Get query parameters
    limitStr := c.Query("limit")
    offsetStr := c.DefaultQuery("offset", "0")
    search := c.Query("search")
    
    // Build query
    query := db.Model(&Masjid{})
    
    // Add search filter
    if search != "" {
        query = query.Where("Nama LIKE ? OR Deskripsi LIKE ? OR Alamat LIKE ?", 
            "%"+search+"%", "%"+search+"%", "%"+search+"%")
    }
    
    // Get total count
    query.Count(&total)
    
    // Apply pagination
    offset, _ := strconv.Atoi(offsetStr)
    if limitStr != "" {
        limit, _ := strconv.Atoi(limitStr)
        query = query.Limit(limit).Offset(offset)
        
        totalPages := int((total + int64(limit) - 1) / int64(limit))
        currentPage := (offset / limit) + 1
        
        query.Find(&masjidList)
        
        c.JSON(http.StatusOK, MasjidResponse{
            Status:  "success",
            Message: "Data masjid berhasil diambil",
            Data:    masjidList,
            Pagination: Pagination{
                Total:      int(total),
                Limit:      limit,
                Offset:     offset,
                TotalPages: totalPages,
                CurrentPage: currentPage,
            },
        })
    } else {
        query.Find(&masjidList)
        
        c.JSON(http.StatusOK, MasjidResponse{
            Status:  "success",
            Message: "Data masjid berhasil diambil",
            Data:    masjidList,
            Pagination: Pagination{
                Total:      int(total),
                Limit:      int(total),
                Offset:     offset,
                TotalPages: 1,
                CurrentPage: 1,
            },
        })
    }
}
```

### Testing dengan cURL

```bash
# Get all masjid
curl -X GET http://localhost:3000/masjid

# Get masjid with limit
curl -X GET http://localhost:3000/masjid?limit=10

# Get masjid with pagination
curl -X GET http://localhost:3000/masjid?limit=10&offset=0

# Search masjid
curl -X GET http://localhost:3000/masjid?search=Al-Falah
```

### Testing dengan Postman

1. **Method:** GET
2. **URL:** `http://localhost:3000/masjid`
3. **Query Params:**
   - `limit`: 10 (optional)
   - `offset`: 0 (optional)
   - `search`: "Al-Falah" (optional)

### Catatan Penting

1. **Public Endpoint:** Endpoint ini tidak memerlukan autentikasi, sehingga dapat diakses oleh semua user.

2. **Performance:** Untuk performa yang lebih baik, disarankan:
   - Menggunakan pagination dengan limit maksimal (misalnya 100)
   - Menambahkan index pada kolom `Nama`, `Deskripsi`, dan `Alamat` untuk pencarian yang lebih cepat
   - Menggunakan caching untuk data yang jarang berubah

3. **Data Privacy:** Pastikan hanya menampilkan data masjid yang sudah terverifikasi dan diizinkan untuk ditampilkan secara public.

4. **Error Handling:** Pastikan semua error ditangani dengan baik dan mengembalikan response yang konsisten.

5. **Validation:** Validasi query parameters (limit, offset) untuk mencegah error:
   - `limit` harus berupa angka positif
   - `offset` harus berupa angka non-negatif
   - `search` harus berupa string (sanitize untuk mencegah SQL injection)

### Database Schema (Contoh)

```sql
CREATE TABLE masjid (
    id VARCHAR(36) PRIMARY KEY,
    Nama VARCHAR(255) NOT NULL,
    Deskripsi TEXT,
    Alamat TEXT,
    FotoMasjid VARCHAR(500),
    NoTelepon VARCHAR(20),
    Email VARCHAR(100),
    Website VARCHAR(255),
    Latitude DECIMAL(10, 8),
    Longitude DECIMAL(11, 8),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nama (Nama),
    INDEX idx_alamat (Alamat(255))
);
```

### Changelog

- **v1.0.0** (2024-01-15): Initial release
  - Endpoint GET /masjid
  - Support pagination dengan limit dan offset
  - Support search berdasarkan nama, deskripsi, dan alamat
