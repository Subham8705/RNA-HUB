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

  // Login handler
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

  // Register handler
  const onRegister = async (data: any) => {
    try {
      const { name, email, password } = data;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user info in Firestore
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 px-6 py-12">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden shadow-xl">
        
        {/* Login Section */}
        <div className="p-10 text-white border-r border-white/10">
          <h2 className="text-3xl font-bold mb-6">Login</h2>
          <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-5">
            <div>
              <label className="block text-sm mb-1">Email</label>
              <Input
                {...loginRegister('email')}
                type="email"
                placeholder="you@example.com"
                className="bg-white/10 text-white placeholder:text-white/40"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <Input
                {...loginRegister('password')}
                type="password"
                placeholder="••••••••"
                className="bg-white/10 text-white placeholder:text-white/40"
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>
          </form>
        </div>

        {/* Register Section */}
        <div className="p-10 text-white">
          <h2 className="text-3xl font-bold mb-6">Register</h2>
          <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-5">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <Input
                {...registerRegister('name')}
                type="text"
                placeholder="Your Name"
                className="bg-white/10 text-white placeholder:text-white/40"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <Input
                {...registerRegister('email')}
                type="email"
                placeholder="you@example.com"
                className="bg-white/10 text-white placeholder:text-white/40"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Password</label>
              <Input
                {...registerRegister('password')}
                type="password"
                placeholder="••••••••"
                className="bg-white/10 text-white placeholder:text-white/40"
              />
            </div>
            <Button type="submit" className="w-full" size="lg" variant="outline">
              Create Account
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
