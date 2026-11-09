# PANGANITA – Computer Vision

**Deteksi Bahan Pangan Menggunakan YOLO26n Detection**

## 1. Deskripsi Proyek

PANGANITA (Pangan dan Gizi untuk Keluarga) merupakan proyek yang bertujuan membantu perempuan produsen pangan dalam mengelola hasil panen untuk mendukung pemenuhan kebutuhan gizi keluarga dan pencegahan stunting.

Pada bagian Computer Vision, dikembangkan fitur **Pindai Panen** yang dapat mengenali dan mendeteksi bahan pangan melalui gambar menggunakan model YOLO26.

Fitur ini diharapkan dapat membantu pengguna mengidentifikasi hasil panen secara lebih mudah sehingga informasi bahan pangan dapat dimanfaatkan dalam pengelolaan hasil panen dan pemenuhan kebutuhan gizi keluarga.

## Struktur Folder dan Keterangan

Berikut struktur direktori proyek Computer Vision PANGANITA beserta fungsi masing-masing folder dan file.

```text
panganita-cv/
│
├── README.md
│   └── Dokumentasi utama proyek Computer Vision PANGANITA.
│
├── eksperimen_yolo26_detect.ipynb
│   └── Notebook utama eksperimen YOLO26n Detection,
│       mulai dari konversi dataset hingga pengujian prediksi.
│
├── analisisgambar.ipynb
│   └── Notebook eksperimen terdahulu menggunakan
│       YOLO26n-seg untuk analisis dan segmentasi gambar.
│
├── foto-mentah/
│   └── Kumpulan foto asli bahan pangan yang digunakan
│       sebagai data awal eksperimen.
│
├── dataset-yolo/
│   └── Dataset dengan format anotasi YOLO
│       untuk eksperimen deteksi atau segmentasi awal.
│
├── dataset-yolo-detect/
│   └── Dataset hasil konversi anotasi ke format
│       YOLO Detection menggunakan bounding box.
│
├── dataset-yolo-stratified/
│   └── Dataset yang telah melalui preprocessing
│       dan pembagian data secara stratified.
│       Berisi gambar, label, dan konfigurasi data.yaml.
│
├── models/
│   └── yolo26n_seg_v1/
│       └── best.pt
│           └── Bobot model hasil eksperimen
│               YOLO26n-seg terdahulu.
│
├── runs/
│   └── yolo26n_detect_v1/
│       └── weights/
│           ├── best.pt
│           │   └── Bobot terbaik hasil training
│           │       YOLO26n Detection.
│           │
│           └── last.pt
│               └── Bobot model pada epoch terakhir.
│
├── yolo26n.pt
│   └── Pretrained model YOLO26n Detection
│       yang digunakan sebagai model awal training.
│
└── yolo26n-seg.pt
    └── Pretrained model YOLO26n Segmentation
        untuk eksperimen terdahulu.
```

**Keterangan tambahan:**

- `foto-mentah/`: Menyimpan gambar sebelum preprocessing.
- `dataset-yolo/`: Menyimpan dataset dalam format YOLO untuk eksperimen awal.
- `dataset-yolo-detect/`: Menyimpan dataset yang sudah dikonversi menjadi format deteksi objek.
- `dataset-yolo-stratified/`: Menyimpan dataset hasil pembagian training, validation, dan testing.
- `models/`: Menyimpan bobot model dari eksperimen terdahulu.
- `runs/`: Menyimpan hasil training, evaluasi, dan checkpoint model.
- File `.pt` pada direktori utama merupakan pretrained model, sedangkan `best.pt` dan `last.pt` merupakan checkpoint hasil training.

**Catatan:** Notebook `eksperimen_yolo26_detect.ipynb` merupakan acuan utama pipeline yang digunakan dalam pengembangan Computer Vision PANGANITA. Notebook `analisisgambar.ipynb` hanya menjadi dokumentasi eksperimen terdahulu.

## 2. Teknologi yang Digunakan

Teknologi dan library yang digunakan dalam pengembangan Computer Vision PANGANITA: Python 3.12, YOLO26n Detection, Ultralytics, PyTorch, OpenCV, NumPy, Pandas, Pillow, Matplotlib, dan Jupyter Notebook.

## 3. Pipeline Computer Vision

Pipeline utama yang digunakan dalam pengembangan fitur Pindai Panen:

```text
Input Gambar
     |
     v
Preprocessing
     |
     v
Konversi Dataset
Segmentation -> Detection
     |
     v
Training YOLO26n Detection
     |
     v
Inference / Prediksi
     |
     v
Output Deteksi
     |
     v
Nama Kelas, Confidence Score,
dan Bounding Box
```

**Penjelasan tahapan:**

1. **Input gambar:** Foto bahan pangan digunakan sebagai masukan sistem.
2. **Preprocessing:** Melakukan pemeriksaan dataset, persiapan gambar, dan anotasi.
3. **Konversi dataset:** Mengubah anotasi polygon YOLO Segmentation menjadi anotasi bounding box untuk YOLO Detection.
4. **Training:** Melakukan fine-tuning pretrained model YOLO26n menggunakan dataset PANGANITA.
5. **Inference:** Model melakukan prediksi terhadap gambar bahan pangan baru.
6. **Output:** Menghasilkan nama kelas bahan pangan, confidence score, dan bounding box.

## 4. Kelas Bahan Pangan

Model dikembangkan untuk mengenali 15 kelas bahan pangan yang disesuaikan dengan kebutuhan PANGANITA.

| No. | Nama Kelas     |
| --: | -------------- |
|   1 | Wortel         |
|   2 | Udang          |
|   3 | Singkong       |
|   4 | Pisang         |
|   5 | Ubi Jalar      |
|   6 | Jagung         |
|   7 | Tomat          |
|   8 | Ikan Lele      |
|   9 | Ikan Kembung   |
|  10 | Ikan Tongkol   |
|  11 | Ikan Gurame    |
|  12 | Bayam          |
|  13 | Kangkung       |
|  14 | Buah Naga      |
|  15 | Telur Ayam Ras |

## 5. Notebook Eksperimen

Dalam pengembangan Computer Vision PANGANITA terdapat dua notebook eksperimen.

### A. eksperimen_yolo26_detect.ipynb

**Notebook Utama – YOLO26n Detection**

Notebook ini merupakan pipeline utama yang digunakan dalam pengembangan fitur Pindai Panen PANGANITA.

Tahapan yang dilakukan:

- Pemeriksaan dan persiapan dataset.
- Konversi anotasi Segmentation menjadi Detection.
- Fine-tuning pretrained model YOLO26n.
- Pengujian menggunakan model `best.pt`.
- Prediksi gambar bahan pangan.
- Pengujian pada kumpulan gambar.
- Visualisasi hasil deteksi.
- Pengujian melalui antarmuka upload gambar.

### B. analisisgambar.ipynb

**Eksperimen Terdahulu – YOLO26n Segmentation**

Notebook ini merupakan dokumentasi eksperimen awal menggunakan pendekatan Instance Segmentation.

Tahapan eksperimen:

- Analisis dan pemeriksaan dataset.
- Konversi anotasi LabelMe JSON ke format YOLO Segmentation.
- Pembagian dataset menggunakan Stratified Split.
- Fine-tuning YOLO26n-seg.
- Evaluasi hasil training.
- Pengujian dan visualisasi segmentation mask.

**Catatan:** Notebook ini tidak digunakan sebagai pipeline utama karena pendekatan tersebut belum memenuhi kebutuhan sistem secara konsisten. Notebook dipertahankan sebagai dokumentasi eksperimen terdahulu dan pembelajaran pengembangan Computer Vision.

## 6. Hasil Eksperimen

Hasil eksperimen utama berupa model hasil training dan visualisasi prediksi bahan pangan.

File model yang dihasilkan:

- `best.pt`: Bobot model terbaik selama proses training.
- `last.pt`: Bobot model pada epoch terakhir.

Output prediksi meliputi:

- Nama kelas bahan pangan yang terdeteksi.
- Confidence score setiap objek.
- Bounding box lokasi objek.
- Gambar hasil visualisasi deteksi.
- Laporan hasil pengujian.

Pengujian dilakukan menggunakan foto bahan pangan untuk melihat kemampuan model dalam mengenali objek berdasarkan 15 kelas yang telah ditentukan.

**Catatan evaluasi:** Hasil deteksi masih perlu dievaluasi lebih lanjut menggunakan data pengujian dan metrik seperti Precision, Recall, mAP50, dan mAP50-95. Confidence score tidak selalu menunjukkan bahwa prediksi benar.

## 7. Cara Menjalankan

### A. Clone Repository

```bash
git clone <URL_REPOSITORY>
cd panganita-cv
```

### B. Membuat Virtual Environment

```bash
python -m venv .venv
```

### C. Mengaktifkan Environment

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

### D. Menginstal Library

```bash
pip install ultralytics opencv-python numpy pandas pillow matplotlib ipywidgets jupyter
```

### E. Menjalankan Notebook

Buka project menggunakan VS Code, aktifkan kernel Python dari virtual environment, kemudian buka:

```text
eksperimen_yolo26_detect.ipynb
```

Jalankan setiap cell secara berurutan sesuai tahapan eksperimen.

**Catatan:** Pastikan dataset, file pretrained model, dan path direktori sudah sesuai sebelum menjalankan notebook. Jika diperlukan, sesuaikan lokasi file berdasarkan komputer yang digunakan.

## 8. Keterbatasan dan Pengembangan Selanjutnya

Model masih memiliki beberapa keterbatasan, antara lain:

- Kemampuan deteksi pada objek yang bertumpuk.
- Perbedaan kondisi pencahayaan.
- Sudut pengambilan gambar.
- Kemiripan visual antarjenis bahan pangan.
- Keterbatasan variasi dataset pangan lokal.

Pengembangan berikutnya diarahkan pada:

1. Penambahan dan peningkatan kualitas dataset.
2. Peningkatan kualitas anotasi.
3. Evaluasi performa model secara berkala.
4. Fine-tuning menggunakan data pangan lokal yang lebih beragam.
5. Integrasi model ke aplikasi web PANGANITA.
6. Eksplorasi estimasi berat dan volume bahan pangan menggunakan pendekatan Computer Vision tambahan.

## 9. Kesimpulan

Pengembangan Computer Vision PANGANITA difokuskan pada pembangunan fitur Pindai Panen menggunakan YOLO26n Detection.

Pipeline eksperimen mencakup persiapan dataset, preprocessing, konversi anotasi, fine-tuning model, pengujian, dan visualisasi hasil prediksi.

Model ini menjadi dasar pengembangan sistem pengenalan bahan pangan yang nantinya diintegrasikan dengan fitur pengelolaan hasil panen dan informasi gizi pada aplikasi PANGANITA.

---

**PANGANITA – Pangan dan Gizi untuk Keluarga**

_Computer Vision Development | YOLO26n Detection_
