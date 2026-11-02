// Helper UI Error & Success
export const setError = (input, message) => {
    const formGroup = input.parentElement;
    const errorDisplay = formGroup.querySelector('.error-text');
    input.classList.add('input-error');
    input.classList.remove('input-success');
    if (errorDisplay) errorDisplay.textContent = message;
};

export const setSuccess = (input) => {
    const formGroup = input.parentElement;
    const errorDisplay = formGroup.querySelector('.error-text');
    input.classList.add('input-success');
    input.classList.remove('input-error');
    if (errorDisplay) errorDisplay.textContent = '';
};

// Validasi Form Login
export const validateLoginForm = () => {
    const emailInput = document.querySelector('#login-email');
    const passwordInput = document.querySelector('#login-password');
    let isValid = true;

    if (!emailInput || !passwordInput) return false;

    // Validasi Email
    const emailValue = emailInput.value.trim();
    if (emailValue === '') {
        setError(emailInput, 'Email wajib diisi!');
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(emailValue)) {
        setError(emailInput, 'Format email tidak valid!');
        isValid = false;
    } else {
        setSuccess(emailInput);
    }

    // Validasi Password
    const passwordValue = passwordInput.value;
    if (passwordValue === '') {
        setError(passwordInput, 'Kata sandi wajib diisi!');
        isValid = false;
    } else if (passwordValue.length < 6) {
        setError(passwordInput, 'Kata sandi minimal 6 karakter!');
        isValid = false;
    } else {
        setSuccess(passwordInput);
    }

    return isValid;
};

// Validasi Form Register (Disesuaikan dengan ID di register.html)
export const validateRegisterForm = () => {
    const nameInput = document.querySelector('#reg-username');
    const emailInput = document.querySelector('#reg-email');
    const passwordInput = document.querySelector('#reg-password');
    const confirmPasswordInput = document.querySelector('#reg-confirm-password');
    let isValid = true;

    if (!nameInput || !emailInput || !passwordInput) return false;

    if (nameInput.value.trim() === '') {
        setError(nameInput, 'Nama lengkap wajib diisi!');
        isValid = false;
    } else {
        setSuccess(nameInput);
    }

    if (emailInput.value.trim() === '' || !/\S+@\S+\.\S+/.test(emailInput.value.trim())) {
        setError(emailInput, 'Format email tidak valid!');
        isValid = false;
    } else {
        setSuccess(emailInput);
    }

    if (passwordInput.value.length < 6) {
        setError(passwordInput, 'Kata sandi minimal 6 karakter!');
        isValid = false;
    } else {
        setSuccess(passwordInput);
    }

    if (confirmPasswordInput) {
        if (confirmPasswordInput.value !== passwordInput.value || confirmPasswordInput.value === '') {
            setError(confirmPasswordInput, 'Konfirmasi kata sandi tidak cocok!');
            isValid = false;
        } else {
            setSuccess(confirmPasswordInput);
        }
    }

    return isValid;
};

// Validasi Form Lahan
export const validateLandForm = () => {
    const landName = document.querySelector('#land-name');
    const areaSize = document.querySelector('#area-size');
    const location = document.querySelector('#location');
    let isValid = true;

    if (!landName || !areaSize || !location) return false;

    if (landName.value.trim() === '') {
        setError(landName, 'Nama lahan wajib diisi!');
        isValid = false;
    } else {
        setSuccess(landName);
    }

    if (!areaSize.value || parseFloat(areaSize.value) <= 0) {
        setError(areaSize, 'Luas lahan harus lebih dari 0!');
        isValid = false;
    } else {
        setSuccess(areaSize);
    }

    if (location.value.trim() === '') {
        setError(location, 'Lokasi lahan wajib diisi!');
        isValid = false;
    } else {
        setSuccess(location);
    }

    return isValid;
};