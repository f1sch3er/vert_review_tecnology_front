export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface CompleteRegistrationData {
  phone_number: string;
  birth_date: string;
  document_number: string;
  document_type: string;
  address: Address;
}

export interface UserResponse {
  message?: string;
  id?: string;
  email?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    email: string;
    first_name: string;
    last_name: string;
    is_any_admin: boolean;
  };
  links: {
    self: string;
    refresh: string;
    me: string;
  };
}

