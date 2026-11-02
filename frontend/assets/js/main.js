import { addLand, updateLand, filterLandsByStatus, getLands, searchLands } from './modules/land_service.js';
import { addPlant, updatePlant, filterPlantsByStatus, addPlantAtomic, searchPlants } from './modules/plant_service.js';
import { renderLandCards, renderMetrics, renderLandsCRUD, renderPlantsCRUD, renderPlantCardsDashboard } from './modules/ui_renderer.js';
import { validateRegisterForm, validateLandForm } from './modules/validator.js';
import { getRealtimeDate } from './modules/dateTime_service.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("=== Client-Side Modular Application Initialized ===");

    // ==========================================
    // LOGIKA SINKRONISASI AKUN USER DINAMIS (ALL PAGES)
    // ==========================================
    const updateUIUserDisplay = () => {
        const registeredUser = JSON.parse(localStorage.getItem('taniKuy_registeredUser'));
        if (registeredUser) {
            console.log("👤 [UserAuth] Akun Terdaftar Aktif:", registeredUser);

            const displayNameElem = document.querySelector('#user-display-name');
            const sidebarNameElem = document.querySelector('#sidebar-user-name');

            if (displayNameElem && registeredUser.username) displayNameElem.textContent = registeredUser.username;
            if (sidebarNameElem && registeredUser.username) sidebarNameElem.textContent = registeredUser.username;

            const profileNameElem = document.querySelector('#profile-name');
            const profileEmailElem = document.querySelector('#profile-email');
            const profileInfoSubElem = document.querySelector('#profile-info-sub');

            if (profileNameElem && registeredUser.username) profileNameElem.textContent = registeredUser.username;
            if (profileEmailElem && registeredUser.email) profileEmailElem.textContent = registeredUser.email;
            if (profileInfoSubElem && registeredUser.email) profileInfoSubElem.textContent = `Email: ${registeredUser.email}`;
        } else {
            console.warn("⚠️ [UserAuth] Belum ada sesi akun terdaftar di LocalStorage");
        }
    };

    updateUIUserDisplay();

    // ==========================================
    // LOGIKA FITUR EDIT PROFIL (profile.html)
    // ==========================================
    const btnToggleEdit = document.querySelector('#btn-toggle-edit');
    const btnCancelEdit = document.querySelector('#btn-cancel-profile-edit');
    const profileDisplayMode = document.querySelector('#profile-display-mode');
    const profileEditForm = document.querySelector('#profile-edit-form');

    if (btnToggleEdit && profileEditForm) {
        btnToggleEdit.addEventListener('click', () => {
            const registeredUser = JSON.parse(localStorage.getItem('taniKuy_registeredUser')) || {};
            
            document.querySelector('#edit-username').value = registeredUser.username || '';
            document.querySelector('#edit-user-email').value = registeredUser.email || '';

            profileDisplayMode.style.display = 'none';
            profileEditForm.style.display = 'block';
            console.log("✏️ [ProfileUI] Mode Edit Profil Dibuka");
        });
    }

    if (btnCancelEdit && profileEditForm) {
        btnCancelEdit.addEventListener('click', () => {
            profileEditForm.style.display = 'none';
            profileDisplayMode.style.display = 'flex';
            console.log("❌ [ProfileUI] Mode Edit Profil Dibatalkan");
        });
    }

    if (profileEditForm) {
        profileEditForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const feedback = document.querySelector('#profile-form-feedback');
            const newUsername = document.querySelector('#edit-username').value.trim();
            const newEmail = document.querySelector('#edit-user-email').value.trim();

            if (!newUsername || !newEmail) {
                if (feedback) {
                    feedback.textContent = "Nama lengkap dan email tidak boleh kosong!";
                    feedback.className = "feedback-msg error";
                }
                return;
            }

            let registeredUser = JSON.parse(localStorage.getItem('taniKuy_registeredUser')) || {};
            registeredUser.username = newUsername;
            registeredUser.email = newEmail;

            localStorage.setItem('taniKuy_registeredUser', JSON.stringify(registeredUser));
            console.log("✅ [UserAuth] Informasi Profil Berhasil Diperbarui:", registeredUser);

            updateUIUserDisplay();

            if (feedback) {
                feedback.textContent = "Profil berhasil diperbarui! ✨";
                feedback.className = "feedback-msg success";
            }

            setTimeout(() => {
                if (feedback) feedback.textContent = '';
                profileEditForm.style.display = 'none';
                profileDisplayMode.style.display = 'flex';
            }, 1200);
        });
    }

    // ==========================================
    // LOGIKA TANGGAL REAL-TIME
    // ==========================================
    const dateBadge = document.querySelector('#realtime-date-badge');
    if (dateBadge) {
        const currentDate = getRealtimeDate();
        dateBadge.textContent = currentDate;
        console.log("🕒 [RealtimeDate] Tanggal Sistem Diberlakukan:", currentDate);
    }

    // ==========================================
    // LOGIKA HALAMAN REGISTRASI (REGISTER)
    // ==========================================
    const registerForm = document.querySelector('#register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const feedback = document.querySelector('#form-feedback');

            if (validateRegisterForm()) {
                const usernameInput = document.querySelector('#reg-username');
                const emailInput = document.querySelector('#reg-email');
                const passwordInput = document.querySelector('#reg-password');

                const userAccount = {
                    username: usernameInput.value.trim(),
                    email: emailInput.value.trim(),
                    password: passwordInput.value
                };
                localStorage.setItem('taniKuy_registeredUser', JSON.stringify(userAccount));
                console.log("📝 [Register] Akun Baru Berhasil Didaftarkan:", userAccount);

                localStorage.removeItem('taniKuy_lands');
                localStorage.removeItem('taniKuy_plants');

                feedback.textContent = "Registrasi akun berhasil! Mengalihkan ke Halaman Login...";
                feedback.className = "feedback-msg success";

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1200);
            } else {
                feedback.textContent = "Mohon perbaiki kolom masukan yang belum valid!";
                feedback.className = "feedback-msg error";
                console.warn("⚠️ [Register] Validasi Formulir Gagal");
            }
        });
    }

    // ==========================================
    // LOGIKA HALAMAN LOGIN
    // ==========================================
    const loginForm = document.querySelector('#login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const feedback = document.querySelector('#form-feedback');
            const emailElem = document.querySelector('#login-email');
            const passwordElem = document.querySelector('#login-password');

            const inputEmail = emailElem ? emailElem.value.trim() : '';
            const inputPassword = passwordElem ? passwordElem.value : '';

            if (!inputEmail || !inputPassword) {
                if (feedback) {
                    feedback.textContent = "Mohon isi alamat email dan kata sandi Anda!";
                    feedback.className = "feedback-msg error";
                }
                return;
            }

            const regUser = JSON.parse(localStorage.getItem('taniKuy_registeredUser'));

            if (!regUser) {
                if (feedback) {
                    feedback.textContent = "Anda belum memiliki akun! Silakan daftar akun baru terlebih dahulu.";
                    feedback.className = "feedback-msg error";
                }
                console.warn("⚠️ [Login] Mencoba login tanpa akun terdaftar");
                return;
            }

            if (regUser.email === inputEmail && regUser.password === inputPassword) {
                console.log("🔓 [Login] Otentikasi Berhasil untuk Email:", inputEmail);
                if (feedback) {
                    feedback.textContent = "Login berhasil! Mengalihkan ke Dashboard...";
                    feedback.className = "feedback-msg success";
                }
                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1000);
            } else {
                console.warn("❌ [Login] Otentikasi Kredensial Gagal");
                if (feedback) {
                    if (regUser.email !== inputEmail) {
                        feedback.textContent = "Email yang Anda masukkan salah!";
                    } else {
                        feedback.textContent = "Kata sandi yang Anda masukkan salah!";
                    }
                    feedback.className = "feedback-msg error";
                }
            }
        });
    }

    // ==========================================
    // 1. LOGIKA DASHBOARD, FILTER & SEARCH REAL-TIME
    // ==========================================
    if (document.querySelector('#land-card-container')) {
        console.log("📊 [Dashboard] Memuat Komponen UI Dashboard");
        renderMetrics();
        renderLandCards();
        renderPlantCardsDashboard();

        let activeLandFilter = 'Semua';
        let activePlantFilter = 'Semua';

        const searchLandInput = document.querySelector('#search-land-input');
        const searchPlantInput = document.querySelector('#search-plant-input');

        // A. FILTER & SEARCH LAHAN
        const landFilterButtons = document.querySelectorAll('.btn-filter-land');
        landFilterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                landFilterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                activeLandFilter = e.target.getAttribute('data-filter') || e.target.textContent.trim();
                const query = searchLandInput ? searchLandInput.value : '';
                renderLandCards(searchLands(query, activeLandFilter));
            });
        });

        if (searchLandInput) {
            searchLandInput.addEventListener('input', (e) => {
                const query = e.target.value;
                renderLandCards(searchLands(query, activeLandFilter));
            });
        }

        // B. FILTER & SEARCH TANAMAN
        const plantFilterButtons = document.querySelectorAll('.btn-filter-plant');
        plantFilterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                plantFilterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                activePlantFilter = e.target.getAttribute('data-filter') || e.target.textContent.trim();
                const query = searchPlantInput ? searchPlantInput.value : '';
                renderPlantCardsDashboard(searchPlants(query, activePlantFilter));
            });
        });

        if (searchPlantInput) {
            searchPlantInput.addEventListener('input', (e) => {
                const query = e.target.value;
                renderPlantCardsDashboard(searchPlants(query, activePlantFilter));
            });
        }
    }

    // ==========================================
    // 2. LOGIKA KELOLA LAHAN (lands.html)
    // ==========================================
    if (document.querySelector('#land-crud-container')) {
        console.log("🌾 [LandsPage] Memuat Komponen CRUD Lahan");
        renderLandsCRUD();

        const landForm = document.querySelector('#land-form');
        const cancelEditBtn = document.querySelector('#btn-cancel-edit');

        const resetLandForm = () => {
            if (!landForm) return;
            landForm.reset();
            document.querySelector('#edit-land-id').value = '';
            document.querySelector('#form-title').textContent = 'Tambah Lahan Baru';
            document.querySelector('#btn-submit-land').textContent = 'Simpan Data Lahan ✨';
            if (cancelEditBtn) cancelEditBtn.style.display = 'none';
        };

        if (cancelEditBtn) cancelEditBtn.addEventListener('click', resetLandForm);

        if (landForm) {
            landForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const feedback = document.querySelector('#form-feedback');

                if (validateLandForm()) {
                    const landData = {
                        landName: document.querySelector('#land-name').value.trim(),
                        soilType: document.querySelector('#soil-type').value,
                        areaSize: parseFloat(document.querySelector('#area-size').value),
                        status: document.querySelector('#land-status').value,
                        location: document.querySelector('#location').value.trim()
                    };

                    const editId = document.querySelector('#edit-land-id').value;
                    if (editId) {
                        updateLand(editId, landData);
                        feedback.textContent = `Lahan berhasil diperbarui!`;
                    } else {
                        addLand(landData);
                        feedback.textContent = `Lahan berhasil disimpan!`;
                    }

                    feedback.className = "feedback-msg success";
                    renderLandsCRUD();
                    resetLandForm();

                    setTimeout(() => {
                        feedback.textContent = '';
                        feedback.className = 'feedback-msg';
                    }, 2500);
                }
            });
        }
    }

    // ==========================================
    // 3. LOGIKA KELOLA TANAMAN (plants.html)
    // ==========================================
    if (document.querySelector('#plant-crud-container')) {
        console.log("🌿 [PlantsPage] Memuat Komponen CRUD Tanaman");

        const updateLandDropdown = () => {
            const selectLandElem = document.querySelector('#plant-land-id');
            if (selectLandElem) {
                const lands = getLands();
                selectLandElem.innerHTML = '<option value="">-- Pilih Lahan --</option>';
                lands.forEach(land => {
                    selectLandElem.innerHTML += `<option value="${land.id}">${land.landName} (${land.location})</option>`;
                });
            }
        };

        updateLandDropdown();
        renderPlantsCRUD();

        const btnModeRegular = document.querySelector('#btn-mode-regular');
        const btnModeAtomic = document.querySelector('#btn-mode-atomic');
        const wrapperRegular = document.querySelector('#wrapper-regular-form');
        const wrapperAtomic = document.querySelector('#wrapper-atomic-form');

        if (btnModeRegular && btnModeAtomic) {
            btnModeRegular.addEventListener('click', () => {
                btnModeRegular.classList.add('active');
                btnModeAtomic.classList.remove('active');
                wrapperRegular.style.display = 'block';
                wrapperAtomic.style.display = 'none';
            });

            btnModeAtomic.addEventListener('click', () => {
                btnModeAtomic.classList.add('active');
                btnModeRegular.classList.remove('active');
                wrapperRegular.style.display = 'none';
                wrapperAtomic.style.display = 'block';
            });
        }

        const plantForm = document.querySelector('#plant-form');
        const cancelPlantEditBtn = document.querySelector('#btn-cancel-plant-edit');

        const resetPlantForm = () => {
            if (!plantForm) return;
            plantForm.reset();
            document.querySelector('#edit-plant-id').value = '';
            document.querySelector('#plant-form-title').textContent = 'Tambah Tanaman Baru';
            document.querySelector('#btn-submit-plant').textContent = 'Simpan Data Tanaman ✨';
            if (cancelPlantEditBtn) cancelPlantEditBtn.style.display = 'none';
        };

        if (cancelPlantEditBtn) cancelPlantEditBtn.addEventListener('click', resetPlantForm);

        if (plantForm) {
            plantForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const feedback = document.querySelector('#plant-form-feedback');

                const landId = document.querySelector('#plant-land-id').value;
                const name = document.querySelector('#plant-name').value.trim();

                if (!landId || name === '') {
                    feedback.textContent = "Mohon pilih lahan dan isi nama tanaman!";
                    feedback.className = "feedback-msg error";
                    return;
                }

                const plantData = {
                    landId: Number(landId),
                    name: name,
                    type: document.querySelector('#plant-type').value,
                    quantity: parseInt(document.querySelector('#plant-quantity').value) || 1,
                    status: document.querySelector('#plant-status').value
                };

                const editId = document.querySelector('#edit-plant-id').value;
                if (editId) {
                    updatePlant(editId, plantData);
                    feedback.textContent = `Tanaman berhasil diperbarui!`;
                } else {
                    addPlant(plantData);
                    feedback.textContent = `Tanaman berhasil disimpan!`;
                }

                feedback.className = "feedback-msg success";
                renderPlantsCRUD();
                resetPlantForm();

                setTimeout(() => {
                    feedback.textContent = '';
                    feedback.className = 'feedback-msg';
                }, 2500);
            });
        }

        const atomicForm = document.querySelector('#atomic-plant-form');
        if (atomicForm) {
            atomicForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const feedback = document.querySelector('#atomic-form-feedback');

                const atomicData = {
                    landName: document.querySelector('#atomic-land-name').value.trim(),
                    soilType: document.querySelector('#atomic-soil-type').value,
                    areaSize: parseFloat(document.querySelector('#atomic-area-size').value) || 0,
                    location: document.querySelector('#atomic-location').value.trim(),
                    plantName: document.querySelector('#atomic-plant-name').value.trim(),
                    plantType: document.querySelector('#atomic-plant-type').value,
                    plantQuantity: parseInt(document.querySelector('#atomic-plant-quantity').value) || 1
                };

                if (!atomicData.landName || !atomicData.location || !atomicData.plantName || atomicData.areaSize <= 0) {
                    feedback.textContent = "Mohon isi data Lahan dan Tanaman secara lengkap!";
                    feedback.className = "feedback-msg error";
                    return;
                }

                try {
                    addPlantAtomic(atomicData);

                    feedback.textContent = "⚡ Transaksi Atomik Sukses! Lahan Baru & Tanaman Pertama Berhasil Disimpan.";
                    feedback.className = "feedback-msg success";

                    renderPlantsCRUD();
                    updateLandDropdown();
                    atomicForm.reset();

                    setTimeout(() => {
                        feedback.textContent = '';
                        feedback.className = 'feedback-msg';
                    }, 3000);

                } catch (err) {
                    feedback.textContent = "⚠️ Gagal melakukan transaksi atomik!";
                    feedback.className = "feedback-msg error";
                }
            });
        }
    }
});