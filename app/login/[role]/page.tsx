'use client';

export const dynamic = "force-static";
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { role } = useParams();
    const supportedRole = ["admin", "merchant", "staff"];

    if (!supportedRole.includes(role as string)) {
        notFound();
    }

    const handleLogin = async (e?: React.FormEvent) => {
        e?.preventDefault(); // Prevent page reload

        // Required validation
        if (!username.trim() || !password.trim()) {
            toast.error("Username and Password are required");
            return;
        }

        const result = await signIn('credentials', {
            username,
            password,
            role,
            redirect: false,
        });

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Login successful");
            window.location.href = `/${role}/dashboard`;
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Image
                        src="/zeonix-logo.png"
                        alt="Zeonix Logo"
                        width={200}
                        height={200}
                        className="mx-auto mb-4"
                    />
                    <p className="text-gray-600 mt-2">A secure and reliable way to manage your payments</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin}>
                    {/* Username Input */}
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            id="username"
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-4 relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 mt-2 pr-12"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div
                            className="absolute right-4 top-11 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                    </div>

                    {/* Login Button */}
                    <div className="flex justify-center mb-4">
                        <button
                            type="submit"
                            className="w-full py-3 bg-customViolet text-white font-semibold rounded-lg hover:bg-customViolet/90 transition duration-200 cursor-pointer"
                        >
                            Login
                        </button>
                    </div>
                </form>

                {/* About Text */}
                <div className="text-center mt-4 text-sm text-gray-500">
                    <p>By logging in, you agree to our <a href="#" className="text-blue-600">Terms of Service</a> and <a href="#" className="text-blue-600">Privacy Policy</a>.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
