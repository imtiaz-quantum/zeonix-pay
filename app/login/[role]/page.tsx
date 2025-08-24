'use client';

export const dynamic = "force-static";
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';


const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { role } = useParams();
    const supportedRole = ["admin", "merchant", "staff"];
    console.log(role);

    if (!supportedRole.includes(role as string)) {
        notFound();
    }

    const handleLogin = async () => {
        const result = await signIn('credentials', {
            username,
            password,
            role,
            redirect: false,
        });

        if (result?.error) {
            console.log(result);
            toast.error(result.error);

        } else {
            toast.success("Login successfull")
            console.log('Login successful!');
            window.location.href = `/${role}/dashboard`;
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-10 rounded-lg  w-full max-w-lg">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <Image
                        src="/zeonix-logo.png"
                        alt="Zeonix Logo"
                        width={200}
                        height={200}
                        className="mx-auto mb-4"
                    />
                    <h2 className="text-3xl font-extrabold text-gray-800 hidden">Zeonix Payment System</h2>
                    <p className="text-gray-600 mt-2">A secure and reliable way to manage your payments</p>
                </div>

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
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {/* Login Button */}
                <div className="flex justify-center mb-4">
                    <button
                        onClick={handleLogin}
                        className="w-full bg-customViolet text-white font-semibold py-3 rounded-lg hover:bg-customViolet/90 transition duration-200 cursor-pointer"
                    >
                        Login
                    </button>
                </div>

                {/* About Text */}
                <div className="text-center mt-4 text-sm text-gray-500">
                    <p>By logging in, you agree to our <a href="#" className="text-blue-600">Terms of Service</a> and <a href="#" className="text-blue-600">Privacy Policy</a>.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
