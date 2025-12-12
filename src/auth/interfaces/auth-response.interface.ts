export interface AuthResponse {
  accessToken: string;
  user: {
    id: number;
    email: string;
    nombres: string;
    apellidos: string;
  };
}
