"use client";

export const dynamic = "force-static";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { RefreshCw, Server, Wifi, WifiOff } from "lucide-react";

export default function ServerDownPage() {
  const [checking, setChecking] = useState(false);
  const [ok, setOk] = useState<boolean | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  async function check() {
    try {
      setChecking(true);
      const res = await fetch("/api/health", { cache: "no-store" });
      setOk(res.ok);
      if (res.ok) {
        window.location.replace("/");
      } else {
        setRetryCount(prev => prev + 1);
      }
    } catch {
      setOk(false);
      setRetryCount(prev => prev + 1);
    } finally {
      setChecking(false);
    }
  }

  useEffect(() => {
    check(); // Initial check
    const t = setInterval(check, 15000);
    return () => clearInterval(t);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const pulseVariants: Variants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const rotateVariants: Variants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const floatingAnimation: Variants = {
    animate: {
      y: [0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const dotAnimation1: Variants = {
    animate: {
      scale: [1, 1.5, 1],
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: 3,
        repeat: Infinity,
      }
    }
  };

  const dotAnimation2: Variants = {
    animate: {
      scale: [1, 2, 1],
      opacity: [0.2, 0.5, 0.2],
      transition: {
        duration: 4,
        repeat: Infinity,
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#674CC4] via-[#7B64D6] to-[#9278F0] flex items-center justify-center px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="text-center text-white max-w-lg mx-auto"
      >
        {/* Animated Logo */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative inline-block">
            <motion.div
              variants={pulseVariants}
              className="absolute inset-0 bg-white/20 rounded-full blur-xl"
            />
            <Image
              className="mx-auto relative z-10"
              src="/zeonix-logo.png"
              width={120}
              height={120}
              alt="zeonix-logo"
            />
          </div>
        </motion.div>

        {/* Server Icon with Animation */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="relative inline-flex items-center justify-center">
            <motion.div
              variants={pulseVariants}
              className="absolute w-20 h-20 bg-white/10 rounded-full"
            />
            <motion.div variants={floatingAnimation}>
              {checking ? (
                <motion.div variants={rotateVariants}>
                  <RefreshCw className="w-12 h-12 text-white" />
                </motion.div>
              ) : ok === false ? (
                <WifiOff className="w-12 h-12 text-white" />
              ) : (
                <Server className="w-12 h-12 text-white" />
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent"
        >
          Service Temporarily Unavailable
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-purple-100 mb-8 opacity-90"
        >
          Our server is taking a quick break. We{`&apos`}re automatically retrying every 15 seconds.
        </motion.p>

        {/* Retry Counter */}
        <AnimatePresence mode="wait">
          {retryCount > 0 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-white/70 mb-6"
            >
              Attempt {retryCount} • Next retry in 15s
            </motion.p>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <Button
            onClick={check}
            disabled={checking}
            className="bg-white text-[#674CC4] hover:bg-white/90 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {checking ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.span>
                Checking...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Wifi className="w-4 h-4" />
                Try Again
              </span>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="border-white/30 text-gray-700 hover:shadow-md px-6 py-3 rounded-xl font-semibold backdrop-blur-sm"
          >
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </span>
          </Button>
        </motion.div>

        {/* Status Message */}
        <AnimatePresence mode="wait">
          {ok === false && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-white/60 mt-6 flex items-center justify-center gap-2"
            >
              <WifiOff className="w-4 h-4" />
              Still unavailable. We{`&apos`}re working on it!
            </motion.p>
          )}
        </AnimatePresence>

        {/* Background decorative elements */}
        <motion.div
          variants={dotAnimation1}
          animate="animate"
          className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full"
        />
        <motion.div
          variants={dotAnimation2}
          animate="animate"
          className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-white/20 rounded-full"
        />
      </motion.div>
    </div>
  );
}