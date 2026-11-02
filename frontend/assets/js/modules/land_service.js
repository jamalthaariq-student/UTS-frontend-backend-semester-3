let landsData = JSON.parse(localStorage.getItem('taniKuy_lands')) || [];

const syncStorage = () => {
    localStorage.setItem('taniKuy_lands', JSON.stringify(landsData));
    console.log("💾 [Storage] Data Lahan tersimpan ke LocalStorage:", landsData);
};

export const getLands = () => {
    console.log("🌾 [LandService] Mengambil daftar lahan:", landsData);
    return landsData;
};

export const getLandById = (id) => {
    return landsData.find(l => l.id === Number(id));
};

// FUNGSI FILTER LAHAN BERDASARKAN STATUS
export const filterLandsByStatus = (status) => {
    if (status === 'Semua') {
        console.log("🔍 [HOF Filter] Menampilkan seluruh lahan (Filter: Semua)");
        return landsData;
    }
    const filtered = landsData.filter(land => land.status === status);
    console.log(`🔍 [HOF Filter] Menyaring Lahan berdasarkan Status '${status}':`, filtered);
    return filtered;
};

// FUNGSI PENCARIAN & FILTER LAHAN (HOF Filter)
export const searchLands = (query = '', status = 'Semua') => {
    let result = landsData;

    if (status !== 'Semua') {
        result = result.filter(land => land.status === status);
    }

    if (query.trim() !== '') {
        const q = query.toLowerCase();
        result = result.filter(land => 
            land.landName.toLowerCase().includes(q) || 
            land.location.toLowerCase().includes(q) ||
            land.soilType.toLowerCase().includes(q)
        );
    }

    console.log(`🔍 [HOF Search] Hasil Pencarian Lahan ('${query}', Status: '${status}'):`, result);
    return result;
};

export const calculateTotalArea = (lands = landsData) => {
    const total = lands.reduce((acc, land) => acc + (Number(land.areaSize) || 0), 0);
    return total.toFixed(1);
};

export const addLand = (newLand) => {
    const entry = {
        id: landsData.length > 0 ? landsData[landsData.length - 1].id + 1 : 1,
        ...newLand
    };
    landsData.push(entry);
    syncStorage();
    console.log("✨ [LandService] Lahan Baru Ditambahkan:", entry);
    return entry;
};

export const updateLand = (id, updatedData) => {
    const index = landsData.findIndex(l => l.id === Number(id));
    if (index !== -1) {
        landsData[index] = { id: Number(id), ...updatedData };
        syncStorage();
        console.log(`✏️ [LandService] Lahan ID ${id} Diperbarui:`, landsData[index]);
        return landsData[index];
    }
    return null;
};

export const deleteLand = (id) => {
    landsData = landsData.filter(l => l.id !== Number(id));
    syncStorage();
    console.log(`🗑️ [LandService] Lahan ID ${id} Berhasil Dihapus`);
    return landsData;
};