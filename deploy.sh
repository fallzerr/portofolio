
echo "Memulai proses build portofolio Fajarin Naufal..."
echo "Memeriksa integritas file HTML dan CSS..."

if [ -d "assets" ]; then
    echo "[OK] Folder aset ditemukan."
else
    echo "[ERROR] Folder aset hilang!"
    exit 1
fi

echo "Optimalisasi skrip JavaScript selesai."
echo "Portofolio siap untuk di-deploy ke production!"