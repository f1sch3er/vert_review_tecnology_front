import api from './api'; 
import type { 
    RegisterFormData, 
    UserResponse, 
    LoginCredentials, 
    LoginResponse, 
    CompleteRegistrationData
} from '../types/user';


export const userService = {
  register: async (formData: RegisterFormData): Promise<UserResponse> => {
    const payload = {
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      password: formData.password,
      password_confirm: formData.confirmPassword
    };

    const { data } = await api.post<UserResponse>('/users/', payload);
    return data;
  },

  completeRegistration: async (data: CompleteRegistrationData) => {
    const response = await api.post('/accounts/complete-profile/', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/', credentials);
    return data;
  },

  check_profile: async (email:string) => {
    const { data } = await api.get('/users/has-profile/', { params: { email } });
    return data.has_profile;
  }

};