// services/api/auth.ts - Servicio para autenticación
import axios from 'axios'

// Tipos para NestJS
export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: {
    id: number
    name: string
    email: string
    createdAt: string
    updatedAt: string
  }
  access_token: string
  refresh_token?: string
}

export interface ApiError {
  message: string
  statusCode: number
  error?: string
}

class AuthService {
  private baseURL = 'http://localhost:3001' // URL de tu NestJS

  // Simulación de API para desarrollo
  private mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  // Mock data para desarrollo
  private mockUsers = [
    {
      id: 1,
      name: 'Demo User',
      email: 'demo@museum.com',
      password: 'password123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      // TODO: Reemplazar con llamada real a NestJS
      await this.mockDelay(800)
      
      // Simulación de validación
      if (this.mockUsers.some(u => u.email === data.email)) {
        throw { 
          message: 'El email ya está registrado',
          statusCode: 409 
        }
      }

      const newUser = {
        id: this.mockUsers.length + 1,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      this.mockUsers.push(newUser)

      return {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt
        },
        access_token: `mock-jwt-token-${Date.now()}`,
        refresh_token: `mock-refresh-token-${Date.now()}`
      }
    } catch (error) {
      throw error
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      // TODO: Reemplazar con llamada real a NestJS
      await this.mockDelay(600)
      
      const user = this.mockUsers.find(u => 
        u.email === data.email && u.password === data.password
      )

      if (!user) {
        throw {
          message: 'Credenciales inválidas',
          statusCode: 401
        }
      }

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        access_token: `mock-jwt-token-${Date.now()}`,
        refresh_token: `mock-refresh-token-${Date.now()}`
      }
    } catch (error) {
      throw error
    }
  }

  async logout(): Promise<void> {
    // TODO: Implementar logout con NestJS
    await this.mockDelay(300)
  }

  async getProfile(token: string) {
    // TODO: Implementar con NestJS
    await this.mockDelay(500)
    
    return {
      id: 1,
      name: 'Demo User',
      email: 'demo@museum.com'
    }
  }
}

export const authService = new AuthService()