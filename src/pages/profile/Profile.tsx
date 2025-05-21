import React, { useState } from 'react';
import { Save, User, Camera } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from 'date-fns';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || 'Demo User',
    email: user?.email || 'demo@example.com',
    role: user?.role || 'admin',
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const createdAt = user?.createdAt || new Date().toISOString();
  const lastLogin = user?.lastLogin || new Date().toISOString();
  const avatarUrl = user?.avatarUrl || '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (newPassword && newPassword.length < 6) newErrors.newPassword = 'Password too short';
    if (newPassword && newPassword !== confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);

    try {
      const updateData = {
        ...formData,
        ...(newPassword ? { password: newPassword } : {}),
      };

      const success = await updateProfile(updateData);
      if (success) {
        toast({ title: 'Profile updated successfully' });
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      toast({ title: 'Update failed', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen p-8"
      style={{
        backgroundImage: "url('/images/profile-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="space-y-6 bg-white/80 backdrop-blur rounded-xl p-6">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-gray-500">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editable Info */}
          <div className="col-span-2 bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-6">Profile Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.name ? 'border-red-400' : 'border-gray-300'
                    } rounded-md shadow-sm`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${
                      errors.email ? 'border-red-400' : 'border-gray-300'
                    } rounded-md shadow-sm`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input
                    name="role"
                    disabled
                    value={formData.role}
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Your role cannot be changed</p>
                </div>
              </div>

              {/* Password */}
              <div className="border-t pt-4">
                <h3 className="text-md font-medium mb-4">Change Password</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`w-full px-3 py-2 border ${
                        errors.newPassword ? 'border-red-400' : 'border-gray-300'
                      } rounded-md shadow-sm`}
                    />
                    {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full px-3 py-2 border ${
                        errors.confirmPassword ? 'border-red-400' : 'border-gray-300'
                      } rounded-md shadow-sm`}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Leave password fields empty if you don’t want to change your password.
                </p>
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  {submitting ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Profile Summary */}
          <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center text-center">
            <div className="relative mb-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  className="w-24 h-24 rounded-full object-cover border"
                  alt="Profile"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                  {formData.name?.charAt(0)}
                </div>
              )}
              <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow">
                <Camera size={16} />
              </button>
            </div>
            <h3 className="text-xl font-semibold">{formData.name}</h3>
            <p className="text-gray-500">{formData.email}</p>
            <span className="mt-2 text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {formData.role}
            </span>

            <div className="mt-6 border-t w-full pt-4 text-left text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Member Since</span>
                <span>{new Date(createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Login</span>
                <span>{formatDistanceToNow(new Date(lastLogin), { addSuffix: true })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">2FA</span>
                <span className="text-yellow-600">
                  Not Enabled <button className="underline ml-1 text-blue-600">Enable</button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
