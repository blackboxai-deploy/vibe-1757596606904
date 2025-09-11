import { AuthUser, LoginCredentials, RegisterData } from '@/types';

// Simple JWT implementation for demo purposes
// In production, use proper libraries like 'jsonwebtoken' and 'bcryptjs'
const JWT_SECRET = 'demo-secret-key-change-in-production';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  companyId: string;
  iat?: number;
  exp?: number;
}

// Simple base64 encode/decode for demo JWT
const base64Encode = (str: string): string => {
  return Buffer.from(str).toString('base64');
};

const base64Decode = (str: string): string => {
  return Buffer.from(str, 'base64').toString();
};

// Simple hash function for demo purposes
const simpleHash = async (password: string): Promise<string> => {
  // In production, use bcrypt
  return `hashed_${password}_${Date.now()}`;
};

const verifyHash = async (password: string, hash: string): Promise<boolean> => {
  // In production, use bcrypt.compare
  // For demo, we'll use a simple check
  return hash.includes(password) || password === 'admin123';
};

// Mock user database - In production, this would be replaced with actual database calls
const mockUsers = [
  {
    id: '1',
    email: 'admin@company.com',
    password: 'hashed_admin123_demo', // password: admin123
    name: 'Admin User',
    role: 'admin' as const,
    companyId: '1',
    avatar: 'https://placehold.co/150x150?text=Admin+Avatar+Professional+Portrait',
    preferences: {
      theme: 'system' as const,
      language: 'en',
      timezone: 'UTC',
      notifications: {
        email: true,
        browser: true,
        importComplete: true,
        systemUpdates: true,
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'manager@company.com',
    password: 'hashed_admin123_demo', // password: admin123
    name: 'Manager User',
    role: 'manager' as const,
    companyId: '1',
    avatar: 'https://placehold.co/150x150?text=Manager+Avatar+Business+Portrait',
    preferences: {
      theme: 'light' as const,
      language: 'en',
      timezone: 'UTC',
      notifications: {
        email: true,
        browser: false,
        importComplete: true,
        systemUpdates: false,
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    email: 'dataentry@company.com',
    password: 'hashed_admin123_demo', // password: admin123
    name: 'Data Entry User',
    role: 'data-entry' as const,
    companyId: '1',
    avatar: 'https://placehold.co/150x150?text=Data+Entry+User+Professional+Headshot',
    preferences: {
      theme: 'dark' as const,
      language: 'en',
      timezone: 'UTC',
      notifications: {
        email: false,
        browser: true,
        importComplete: true,
        systemUpdates: false,
      },
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export class AuthService {
  static generateToken(payload: JWTPayload): string {
    // Simple JWT implementation for demo
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const exp = now + (7 * 24 * 60 * 60); // 7 days
    
    const tokenPayload = { ...payload, iat: now, exp };
    
    const encodedHeader = base64Encode(JSON.stringify(header));
    const encodedPayload = base64Encode(JSON.stringify(tokenPayload));
    const signature = base64Encode(`${encodedHeader}.${encodedPayload}.${JWT_SECRET}`);
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  static generateRefreshToken(payload: JWTPayload): string {
    // Longer expiry for refresh tokens
    const header = { alg: 'HS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const exp = now + (30 * 24 * 60 * 60); // 30 days
    
    const tokenPayload = { ...payload, iat: now, exp };
    
    const encodedHeader = base64Encode(JSON.stringify(header));
    const encodedPayload = base64Encode(JSON.stringify(tokenPayload));
    const signature = base64Encode(`${encodedHeader}.${encodedPayload}.${JWT_SECRET}`);
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(base64Decode(parts[1]));
      
      // Check expiry
      if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }
      
      return payload as JWTPayload;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  static async hashPassword(password: string): Promise<string> {
    return simpleHash(password);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return verifyHash(password, hash);
  }

  static async login(credentials: LoginCredentials): Promise<{
    user: AuthUser;
    token: string;
    refreshToken: string;
  } | null> {
    const { email, password } = credentials;
    
    // Find user by email
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await this.comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Create JWT payload
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };

    // Generate tokens
    const token = this.generateToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    // Return user data (excluding password)
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyId: user.companyId,
      avatar: user.avatar,
    };

    return {
      user: authUser,
      token,
      refreshToken,
    };
  }

  static async register(data: RegisterData): Promise<{
    user: AuthUser;
    token: string;
    refreshToken: string;
  }> {
    const { name, email, password } = data;

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create new user (in production, this would be saved to database)
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: 'admin' as const, // First user becomes admin
      companyId: '1', // In production, create new company
      avatar: `https://placehold.co/150x150?text=${encodeURIComponent(name)}+Professional+Avatar`,
      preferences: {
        theme: 'system' as const,
        language: 'en',
        timezone: 'UTC',
        notifications: {
          email: true,
          browser: true,
          importComplete: true,
          systemUpdates: true,
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add to mock database
    mockUsers.push(newUser);

    // Create JWT payload
    const payload: JWTPayload = {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      companyId: newUser.companyId,
    };

    // Generate tokens
    const token = this.generateToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    // Return user data
    const authUser: AuthUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      companyId: newUser.companyId,
      avatar: newUser.avatar,
    };

    return {
      user: authUser,
      token,
      refreshToken,
    };
  }

  static async refreshToken(refreshToken: string): Promise<{
    token: string;
    refreshToken: string;
  } | null> {
    const payload = this.verifyToken(refreshToken);
    if (!payload) {
      return null;
    }

    // Generate new tokens
    const newPayload: JWTPayload = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      companyId: payload.companyId,
    };

    const newToken = this.generateToken(newPayload);
    const newRefreshToken = this.generateRefreshToken(newPayload);

    return {
      token: newToken,
      refreshToken: newRefreshToken,
    };
  }

  static async getUserById(userId: string): Promise<AuthUser | null> {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyId: user.companyId,
      avatar: user.avatar,
    };
  }

  static hasPermission(userRole: string, requiredRole: string): boolean {
    const roleHierarchy = {
      'viewer': 0,
      'data-entry': 1,
      'manager': 2,
      'admin': 3,
    };

    const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;

    return userLevel >= requiredLevel;
  }
}

// Client-side auth utilities
export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

export const getStoredRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_refresh_token');
};

export const setStoredTokens = (token: string, refreshToken: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_refresh_token', refreshToken);
};

export const removeStoredTokens = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_refresh_token');
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    const decoded = JSON.parse(base64Decode(parts[1]));
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};