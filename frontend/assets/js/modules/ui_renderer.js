import { getLands, calculateTotalArea } from './land_service.js';
import { getPlants, getPlantById, deletePlant } from './plant_service.js';

export const renderMetrics = () => {
    const lands = getLands();
    const plants = getPlants();

    const totalAreaElem = document.querySelector('#metric-total-area');
    const activePlantsElem = document.querySelector('#metric-active-plants');
    const healthElem = document.querySelector('#metric-plant-health');
    const healthSubElem = document.querySelector('#metric-health-sub');
    const locationsElem = document.querySelector('#metric-locations');
    const locationsSubElem = document.querySelector('#metric-locations-sub');

    if (totalAreaElem) totalAreaElem.textContent = `${calculateTotalArea(lands)} ha`;

    if (activePlantsElem) {
        const totalPlot = plants.reduce((acc, p) => acc + (Number(p.quantity) || 1), 0);
        activePlantsElem.textContent = `${plants.length} Komoditas (${totalPlot} Plot)`;
    }

    if (healthElem && healthSubElem) {
        if (!plants || plants.length === 0) {
            healthElem.textContent = '0%';
            healthSubElem.textContent = 'Kondisi: Belum Ada Data';
        } else {
            const healthyPlants = plants.filter(p => p.status === 'Baik' || p.status === 'Baik & Subur').length;
            const healthPercentage = Math.round((healthyPlants / plants.length) * 100);
            healthElem.textContent = `${healthPercentage}%`;
            healthSubElem.textContent = healthPercentage >= 80 ? 'Kondisi: Baik' : 'Kondisi: Perlu Perhatian';
        }
    }

    if (locationsElem && locationsSubElem) {
        if (!lands || lands.length === 0) {
            locationsElem.textContent = '0 Lokasi';
            locationsSubElem.textContent = 'Tersebar di 0 Wilayah';
        } else {
            const uniqueLocations = new Set(lands.map(l => l.location));
            locationsElem.textContent = `${uniqueLocations.size} Lokasi`;
            locationsSubElem.textContent = `Tersebar di ${uniqueLocations.size} Wilayah`;
        }
    }
};

export const renderLandCards = (dataList = getLands()) => {
    const container = document.querySelector('#land-card-container');
    if (!container) return;

    container.innerHTML = '';

    if (!dataList || dataList.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 25px; background: #FAFCF8; border: 2px dashed #CBD5E1; border-radius: 12px;">
                <p style="color: #6C757D; font-size: 0.9rem;">Tidak ada data lahan untuk kategori ini.</p>
            </div>
        `;
        return;
    }

    dataList.forEach(land => {
        const card = document.createElement('article');
        card.className = 'land-card';
        const badgeClass = land.status === 'Aktif' ? 'badge-aktif' : 'badge-perhatian';

        card.innerHTML = `
            <div>
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                    <h3>${land.landName}</h3>
                    <span class="badge ${badgeClass}">${land.status}</span>
                </div>
                <p style="font-size:0.9rem; color:#6C757D;">Jenis Tanah: <strong>${land.soilType}</strong></p>
                <p style="font-size:0.9rem; color:#6C757D;">Luas: <strong>${land.areaSize} Ha</strong></p>
                <p style="font-size:0.9rem; color:#6C757D;">📍 ${land.location}</p>
            </div>
        `;

        container.append(card);
    });
};

// RENDER DAFTAR TANAMAN DI DASHBOARD (Dapat Difilter)
export const renderPlantCardsDashboard = (dataList = getPlants()) => {
    const container = document.querySelector('#plant-dashboard-container');
    if (!container) return;

    const lands = getLands();
    container.innerHTML = '';

    if (!dataList || dataList.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 25px; background: #FAFCF8; border: 2px dashed #CBD5E1; border-radius: 12px;">
                <p style="color: #6C757D; font-size: 0.9rem;">Tidak ada data tanaman untuk kategori ini.</p>
            </div>
        `;
        return;
    }

    dataList.forEach(plant => {
        const parentLand = lands.find(l => l.id === Number(plant.landId));
        const landName = parentLand ? parentLand.landName : 'Lahan Tidak Ditemukan';

        const card = document.createElement('article');
        card.className = 'land-card';

        const badgeClass = (plant.status === 'Baik' || plant.status === 'Baik & Subur') ? 'badge-aktif' : 'badge-perhatian';

        card.innerHTML = `
            <div>
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                    <h3>${plant.name}</h3>
                    <span class="badge ${badgeClass}">${plant.status}</span>
                </div>
                <p style="font-size:0.9rem; color:#6C757D;">Lokasi Lahan: <strong>🌾 ${landName}</strong></p>
                <p style="font-size:0.9rem; color:#6C757D;">Kategori: <strong>${plant.type}</strong></p>
                <p style="font-size:0.9rem; color:#6C757D;">Jumlah Plot: <strong>${plant.quantity} Plot</strong></p>
            </div>
        `;

        container.append(card);
    });
};

export const renderLandsCRUD = () => {
    const container = document.querySelector('#land-crud-container');
    if (!container) return;

    const lands = getLands();
    container.innerHTML = '';

    if (!lands || lands.length === 0) {
        container.innerHTML = `<p style="color: #6C757D; font-size: 0.9rem;">Belum ada data lahan yang tersimpan.</p>`;
        return;
    }

    lands.forEach(land => {
        const card = document.createElement('article');
        card.className = 'land-card';
        const badgeClass = land.status === 'Aktif' ? 'badge-aktif' : 'badge-perhatian';

        card.innerHTML = `
            <div>
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                    <h3>${land.landName}</h3>
                    <span class="badge ${badgeClass}">${land.status}</span>
                </div>
                <p style="font-size:0.9rem; color:#6C757D;">Jenis Tanah: <strong>${land.soilType}</strong></p>
                <p style="font-size:0.9rem; color:#6C757D;">Luas: <strong>${land.areaSize} Ha</strong></p>
                <p style="font-size:0.9rem; color:#6C757D;">📍 ${land.location}</p>
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
                <button class="btn-edit" data-id="${land.id}" style="background: #E2E8F0; color: #1E293B; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: 600;">Edit ✏️</button>
                <button class="btn-delete" data-id="${land.id}">Hapus 🗑️</button>
            </div>
        `;

        container.append(card);
    });
};

export const renderPlantsCRUD = () => {
    const container = document.querySelector('#plant-crud-container');
    if (!container) return;

    const plants = getPlants();
    const lands = getLands();
    container.innerHTML = '';

    if (!plants || plants.length === 0) {
        container.innerHTML = `<p style="color: #6C757D; font-size: 0.9rem;">Belum ada data tanaman yang tersimpan.</p>`;
        return;
    }

    plants.forEach(plant => {
        const parentLand = lands.find(l => l.id === Number(plant.landId));
        const landName = parentLand ? parentLand.landName : 'Lahan Tidak Ditemukan';

        const card = document.createElement('article');
        card.className = 'land-card';
        const badgeClass = (plant.status === 'Baik' || plant.status === 'Baik & Subur') ? 'badge-aktif' : 'badge-perhatian';

        card.innerHTML = `
            <div>
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                    <h3>${plant.name}</h3>
                    <span class="badge ${badgeClass}">${plant.status}</span>
                </div>
                <p style="font-size:0.9rem; color:#6C757D;">Lokasi Lahan: <strong>🌾 ${landName}</strong></p>
                <p style="font-size:0.9rem; color:#6C757D;">Kategori: <strong>${plant.type}</strong></p>
                <p style="font-size:0.9rem; color:#6C757D;">Jumlah Plot: <strong>${plant.quantity} Plot</strong></p>
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
                <button class="btn-edit" data-id="${plant.id}" style="background: #E2E8F0; color: #1E293B; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: 600;">Edit ✏️</button>
                <button class="btn-delete" data-id="${plant.id}">Hapus 🗑️</button>
            </div>
        `;

        card.querySelector('.btn-delete').addEventListener('click', () => {
            if (confirm(`Hapus tanaman ${plant.name}?`)) {
                deletePlant(plant.id);
                renderPlantsCRUD();
            }
        });

        container.append(card);
    });
};