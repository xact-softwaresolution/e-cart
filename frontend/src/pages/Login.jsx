import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import authService from '../services/auth.service';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const loadingToast = toast.loading('Logging in...');
    try {
      const response = await authService.login(data);
      setAuth(response.data.user, response.token);
      toast.success('LoggedIn successfully!', { id: loadingToast });
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-128px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-gray-400">Please enter your details to sign in.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Email Address</label>
              <input 
                type="email" 
                {...register('email', { required: 'Email is required' })}
                className={`mt-1 w-full rounded-lg border bg-black px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-white/20'}`} 
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <input 
                type="password" 
                {...register('password', { required: 'Password is required' })}
                className={`mt-1 w-full rounded-lg border bg-black px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-white/20'}`} 
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-black text-blue-600 focus:ring-blue-500" />
              <label className="ml-2 block text-sm text-gray-400">Remember me</label>
            </div>
            <a href="#" className="text-sm font-medium text-blue-500 hover:text-blue-400">Forgot password?</a>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-blue-500 hover:text-blue-400">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
