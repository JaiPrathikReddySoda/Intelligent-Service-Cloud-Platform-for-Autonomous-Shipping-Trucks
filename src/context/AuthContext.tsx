
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  // Mock API functions for now
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll mock a successful login
      const mockUser = {
        id: '1',
        name: 'Demo User',
        email: email,
        role: 'admin'
      };
      const mockToken = 'mock-jwt-token';
      
      // Save to local storage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Update state
      setUser(mockUser);
      setToken(mockToken);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid credentials. Please try again.",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll mock a successful signup
      const mockUser = {
        id: '1',
        name: name,
        email: email,
        role: 'user'
      };
      const mockToken = 'mock-jwt-token';
      
      // Save to local storage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Update state
      setUser(mockUser);
      setToken(mockToken);
      
      toast({
        title: "Account created successfully",
        description: "Welcome to the platform!",
      });
      
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: "There was a problem creating your account.",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update state
    setUser(null);
    setToken(null);
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll mock a successful update
      if (user) {
        const updatedUser = { ...user, ...userData };
        
        // Save to local storage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update state
        setUser(updatedUser);
        
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
      }
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was a problem updating your profile.",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
