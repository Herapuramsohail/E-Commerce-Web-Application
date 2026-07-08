import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { User, Mail, ShieldAlert, Key } from 'lucide-react';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      profileImage: user?.profileImage || ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">Account Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your name, email, avatar, and credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card View */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center space-y-4 dark:border-slate-800 dark:bg-dark-900 transition-colors duration-300 h-fit">
          <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-850">
            <img
              src={user?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
              alt="avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-850 dark:text-white">{user?.name}</h3>
            <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-600 dark:bg-primary-950/20 dark:text-primary-400 mt-1 inline-block uppercase">
              {user?.role}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-dark-900">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase">Full Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full rounded-lg border border-slate-300 pl-10 px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
                />
              </div>
              {errors.name && <span className="text-xs text-red-500 mt-1 block">{errors.name.message}</span>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase">Email Address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full rounded-lg border border-slate-300 pl-10 px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
                />
              </div>
              {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>}
            </div>

            {/* Profile Avatar Image URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase">Profile Image URL</label>
              <input
                type="text"
                {...register('profileImage')}
                placeholder="https://images.unsplash.com/..."
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
              />
            </div>

            {/* Password edit note */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase">Change Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Key className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  {...register('password')}
                  placeholder="Leave blank to keep password"
                  className="w-full rounded-lg border border-slate-300 pl-10 px-3 py-2 text-sm focus:outline-none dark:border-slate-700 dark:bg-dark-800 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:bg-primary-400"
            >
              {isSubmitting ? 'Updating...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
