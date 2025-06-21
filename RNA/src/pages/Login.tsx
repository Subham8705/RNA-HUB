import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  doc,
  setDoc
} from '@/firebase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const navigate = useNavigate();

  // Login form
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    reset: resetLogin,
  } = useForm();

  // Register form
  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    reset: resetRegister,
  } = useForm();

  // Handle login
  const onLogin = async (data: any) => {
    try {
      const { email, password } = data;
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
      resetLogin();
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    }
  };

  // Handle registration and Firestore entry
  const onRegister = async (data: any) => {
    try {
      const { name, email, password } = data;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
      });

      toast.success("Account created successfully!");
      resetRegister();
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/5 backdrop-blur-md rounded-2xl p-10 shadow-lg text-white">
        
        {/* Login Form */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Login</h2>
          <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <Input
                {...loginRegister('email')}
                type="email"
                placeholder="you@example.com"
                className="bg-white/10 text-white placeholder-white/40"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <Input
                {...loginRegister('password')}
                type="password"
                placeholder="••••••••"
                className="bg-white/10 text-white placeholder-white/40"
              />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Sign In
            </Button>
          </form>
        </div>

        {/* Register Form */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Register</h2>
          <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <Input
                {...registerRegister('name')}
                type="text"
                placeholder="Your Name"
                className="bg-white/10 text-white placeholder-white/40"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <Input
                {...registerRegister('email')}
                type="email"
                placeholder="you@example.com"
                className="bg-white/10 text-white placeholder-white/40"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <Input
                {...registerRegister('password')}
                type="password"
                placeholder="••••••••"
                className="bg-white/10 text-white placeholder-white/40"
              />
            </div>
            <Button type="submit" size="lg" variant="outline" className="w-full">
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
