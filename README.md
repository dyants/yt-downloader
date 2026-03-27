# Youtube Downloader API

API sederhana untuk mengunduh video dan audio dari YouTube.

## Cara Menjalankan

1.  **Install dependencies** (jika belum):

    ```bash
    npm install
    ```

2.  **Jalankan server** (mode development):
    ```bash
    npm run start:dev
    ```
    Server akan berjalan di `http://localhost:3000`.

## Endpoint API

Berikut adalah cara menggunakan endpoint yang tersedia. Anda bisa membukanya langsung di browser atau menggunakan tools seperti Postman/Curl.

### 1. Mendapatkan Informasi Video

Mendapatkan detail video seperti judul, thumbnail, dan format yang tersedia.

- **URL:** `/api/youtube/info`
- **Method:** `GET`
- **Query Param:** `url` (Link video YouTube)
- **Contoh:**
  ```
  http://localhost:3000/api/youtube/info?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
  ```

### 2. Download Video (MP4)

Mengunduh video dalam format MP4.

- **URL:** `/api/youtube/download`
- **Method:** `GET`
- **Query Param:** `url` (Link video YouTube)
- **Contoh:**
  ```
  http://localhost:3000/api/youtube/download?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
  ```
  _Browser akan otomatis mendownload file `.mp4`._

### 3. Download Audio (MP3)

Mengunduh audio saja dalam format MP3.

- **URL:** `/api/youtube/download-mp3`
- **Method:** `GET`
- **Query Param:** `url` (Link video YouTube)
- **Contoh:**
  ```
  http://localhost:3000/api/youtube/download-mp3?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
  ```
  _Browser akan otomatis mendownload file `.mp3`._

## Catatan

- File sementara disimpan di folder `temp/` dan akan dibersihkan secara otomatis setiap 5-10 menit.
