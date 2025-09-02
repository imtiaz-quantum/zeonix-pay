import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import WithOutLayout from "./components/WithOutLayout";
import { getUserRole } from "./lib/auth";
import { Toaster } from "react-hot-toast";
import { getServerSession } from "next-auth";
import { authOptions } from "./lib/authOptions";
import Providers from "./providers";
import { getOverview } from "./lib/api/merchant/overview";
import { getMerchantProfile } from "./lib/api/merchant/profile";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const roboto = Roboto({
  weight: ['400', '700'], // Specify desired weights, e.g., regular and bold
  subsets: ['latin'], // Specify character subsets for smaller file size
  display: 'swap', // Ensures text is visible while the font loads
});


export const metadata: Metadata = {
  title: "ZeonixPay - One Payment Gateway for Bangladesh—built for scale",
  description: "Accept cards, mobile wallets, EMI, and bank transfers with instant checkout, intelligent fraud protection, and next day settlements. Built for SaaS, ecommerce, and high growth startups in Bangladesh.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const role = await getUserRole();
  const session = await getServerSession(authOptions);
  let balance = "100445";
  let profileData = null;

  if (role === "merchant") {
    const { data } = await getOverview();
    balance = data.balance;
    const { data: MProfileData } = await getMerchantProfile();
    profileData = MProfileData;
  }
  console.log(profileData);

  console.log(role !== null);
  console.log(role);



  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >  <Providers session={session}>
          <WithOutLayout role={role ?? undefined} balance={balance} profileData={profileData}> {children}</WithOutLayout>
          <Toaster position="bottom-right" />
        </Providers>

      </body>
    </html>
  );
}
