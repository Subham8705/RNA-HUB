import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  doc,
  setDoc,
  getDoc,
} from '@/firebase';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    reset: resetLogin,
  } = useForm();

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    reset: resetRegister,
  } = useForm();

  // Login handler
  const onLogin = async (data: any) => {
    try {
      setIsLoading(true);
      const { email, password } = data;
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully!');
      resetLogin();
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const onRegister = async (data: any) => {
    try {
      setIsLoading(true);
      const { name, email, password } = data;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
        photoURL: '',
      });

      toast.success('Account created successfully!');
      resetRegister();
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Google login handler
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || 'Doctor',
          email: user.email,
          photoURL: user.photoURL || '',
          createdAt: new Date().toISOString(),
        });
      }

      toast.success('Logged in with Google!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 px-4 py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/5 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-white/10 text-white">

          {/* Login Form */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Login</h2>
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-white/70">Email</label>
                <Input
                  {...loginRegister('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="bg-white/10 text-white placeholder-white/50"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-white/70">Password</label>
                <Input
                  {...loginRegister('password')}
                  type="password"
                  placeholder="••••••••"
                  className="bg-white/10 text-white placeholder-white/50"
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-white/50 mb-2">Or</p>
              <Button
                variant="outline"
                className="w-full text-white border-white/30 hover:bg-white/10"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Continue with Google'}
              </Button>
            </div>
          </div>

          {/* Register Form */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">Register</h2>
            <form onSubmit={handleRegisterSubmit(onRegister)} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-white/70">Name</label>
                <Input
                  {...registerRegister('name')}
                  type="text"
                  placeholder="Your Name"
                  className="bg-white/10 text-white placeholder-white/50"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-white/70">Email</label>
                <Input
                  {...registerRegister('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="bg-white/10 text-white placeholder-white/50"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-white/70">Password</label>
                <Input
                  {...registerRegister('password')}
                  type="password"
                  placeholder="••••••••"
                  className="bg-white/10 text-white placeholder-white/50"
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
