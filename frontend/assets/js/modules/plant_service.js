import { addLand } from './land_service.js';

let plantsData = JSON.parse(localStorage.getItem('taniKuy_plants')) || [];

const syncStorage = () => {
    localStorage.setItem('taniKuy_plants', JSON.stringify(plantsData));
    console.log("💾 [Storage] Data Tanaman tersimpan ke LocalStorage:", plantsData);
};

export const getPlants = () => {
    console.log("🌿 [PlantService] Mengambil daftar tanaman:", plantsData);
    return plantsData;
};

export const getPlantById = (id) => {
    return plantsData.find(p => p.id === Number(id));
};

// FUNGSI FILTER TANAMAN HOF filter()
export const filterPlantsByStatus = (status) => {
    if (status === 'Semua') {
        console.log("🔍 [HOF Filter] Menampilkan seluruh tanaman (Filter: Semua)");
        return plantsData;
    }
    const filtered = plantsData.filter(plant => plant.status.includes(status) || status.includes(plant.status));
    console.log(`🔍 [HOF Filter] Menyaring Tanaman berdasarkan Kondisi '${status}':`, filtered);
    return filtered;
};

// FUNGSI PENCARIAN & FILTER TANAMAN (HOF Filter)
export const searchPlants = (query = '', status = 'Semua') => {
    let result = plantsData;

    if (status !== 'Semua') {
        result = result.filter(plant => plant.status.includes(status) || status.includes(plant.status));
    }

    if (query.trim() !== '') {
        const q = query.toLowerCase();
        result = result.filter(plant => 
            plant.name.toLowerCase().includes(q) || 
            plant.type.toLowerCase().includes(q)
        );
    }

    console.log(`🔍 [HOF Search] Hasil Pencarian Tanaman ('${query}', Status: '${status}'):`, result);
    return result;
};

// TAMBAH TANAMAN BIASA (Lahan Eksisting)
export const addPlant = (newPlant) => {
    const entry = {
        id: plantsData.length > 0 ? plantsData[plantsData.length - 1].id + 1 : 1,
        ...newPlant
    };
    plantsData.push(entry);
    syncStorage();
    console.log("✨ [PlantService] Tanaman Baru Ditambahkan:", entry);
    return entry;
};

// TAMBAH ATOMIK (Buka Lahan Baru + Tanaman Pertama Sekaligus)
export const addPlantAtomic = (atomicData) => {
    try {
        const newLand = addLand({
            landName: atomicData.landName,
            soilType: atomicData.soilType,
            areaSize: atomicData.areaSize,
            status: 'Aktif',
            location: atomicData.location
        });

        const entryPlant = {
            id: plantsData.length > 0 ? plantsData[plantsData.length - 1].id + 1 : 1,
            landId: newLand.id,
            name: atomicData.plantName,
            type: atomicData.plantType,
            quantity: atomicData.plantQuantity,
            status: 'Baik'
        };

        plantsData.push(entryPlant);
        syncStorage();

        console.log("⚡ [AtomicService] Berhasil Menyimpan Lahan & Tanaman Secara Atomik:", { newLand, entryPlant });
        return { land: newLand, plant: entryPlant };

    } catch (error) {
        console.error("❌ [AtomicService] Proses Atomik Gagal:", error);
        throw error;
    }
};

export const updatePlant = (id, updatedData) => {
    const index = plantsData.findIndex(p => p.id === Number(id));
    if (index !== -1) {
        plantsData[index] = { id: Number(id), ...updatedData };
        syncStorage();
        console.log(`✏️ [PlantService] Tanaman ID ${id} Diperbarui:`, plantsData[index]);
        return plantsData[index];
    }
    return null;
};

export const deletePlant = (id) => {
    plantsData = plantsData.filter(p => p.id !== Number(id));
    syncStorage();
    console.log(`🗑️ [PlantService] Tanaman ID ${id} Berhasil Dihapus`);
    return plantsData;
};