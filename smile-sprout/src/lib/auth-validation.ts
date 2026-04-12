export function isStrongPassword(password: string) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidBirthDate(value: string) {
  if (!value) {
    return true;
  }

  const [yearText, monthText, dayText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  if (!year || !month || !day) {
    return false;
  }

  const birthDate = new Date(year, month - 1, day);

  if (Number.isNaN(birthDate.getTime())) {
    return false;
  }

  const today = new Date();
  let age = today.getFullYear() - year;
  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return age >= 5;
}

interface RegistrationValidationInput {
  username: string;
  email: string;
  birthDate: string;
  password: string;
  confirmPassword: string;
}

export function validateRegistrationInput(input: RegistrationValidationInput) {
  if (!input.username.trim()) {
    return "Vui lòng nhập tên người dùng.";
  }

  if (!isValidEmail(input.email)) {
    return "Email không hợp lệ.";
  }

  if (!isValidBirthDate(input.birthDate)) {
    return "Ngày sinh không hợp lệ.";
  }

  if (!input.password.trim() || !input.confirmPassword.trim()) {
    return "Vui lòng điền mật khẩu và xác nhận lại mật khẩu.";
  }

  if (!isStrongPassword(input.password)) {
    return "Mật khẩu cần ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt.";
  }

  if (input.password !== input.confirmPassword) {
    return "Mật khẩu và xác nhận mật khẩu không khớp.";
  }

  return "";
}
