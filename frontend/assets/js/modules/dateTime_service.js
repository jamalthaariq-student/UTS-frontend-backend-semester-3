// Fungsi Mengambil Tanggal Real-Time Hari Ini (Format: "31 Okt 2026 • Sabtu")
export const getRealtimeDate = () => {
    const now = new Date();
    
    // Formatting Hari
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = days[now.getDay()];

    // Formatting Tanggal, Bulan, Tahun
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const date = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();

    return `${date} ${monthName} ${year} • ${dayName}`;
};