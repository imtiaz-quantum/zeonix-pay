'use client';

export const dynamic = "force-static";
import { motion, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  const fadeIn: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer: Variants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const floatingAnimation: Variants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const rotateAnimation: Variants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const reverseRotateAnimation: Variants = {
    animate: {
      rotate: -360,
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const pulseAnimation: Variants = {
    animate: {
      scale: [1, 1.5, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 3,
        repeat: Infinity,
      }
    }
  };

  const largePulseAnimation: Variants = {
    animate: {
      scale: [1, 2, 1],
      opacity: [0.3, 0.7, 0.3],
      transition: {
        duration: 4,
        repeat: Infinity,
      }
    }
  };

  const floatUpDownAnimation: Variants = {
    animate: {
      y: [0, -20, 0],
      opacity: [0.4, 0.8, 0.4],
      transition: {
        duration: 5,
        repeat: Infinity,
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#674CC4] via-[#7B64D6] to-[#9278F0] flex items-center justify-center px-4">
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="text-center text-white max-w-2xl"
      >
        {/* Animated 404 Number */}
        <motion.div
          variants={floatingAnimation}
          className="mb-8"
        >
          <motion.h1
            variants={fadeIn}
            className="text-9xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent drop-shadow-2xl"
          >
            404
          </motion.h1>
        </motion.div>

        {/* Main Message */}
        <motion.h2
          variants={fadeIn}
          className="text-3xl md:text-4xl font-semibold mb-6"
        >
          Oops! Page Not Found
        </motion.h2>

        <motion.p
          variants={fadeIn}
          className="text-xl text-purple-100 mb-12 opacity-90"
        >
          The page your{`&apos`}e looking for seems to have vanished into the digital void.
        </motion.p>

        {/* Animated Graphic */}
        <motion.div
          variants={fadeIn}
          className="mb-12"
        >
          <div className="relative inline-block">
            <motion.div
              variants={rotateAnimation}
              className="w-24 h-24 border-4 border-white/20 border-t-white rounded-full"
            />
            <motion.div
              variants={reverseRotateAnimation}
              className="absolute inset-0 w-24 h-24 border-4 border-white/10 border-b-white rounded-full"
            />
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={fadeIn}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="px-8 py-4 bg-white text-[#674CC4] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            ← Go Back
          </motion.button>

{/*           <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
          >
            🏠 Go Home
          </motion.button> */}
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          variants={pulseAnimation}
          className="absolute top-10 left-10 w-4 h-4 bg-white/20 rounded-full"
        />

        <motion.div
          variants={largePulseAnimation}
          className="absolute bottom-20 right-10 w-6 h-6 bg-white/30 rounded-full"
        />

        <motion.div
          variants={floatUpDownAnimation}
          className="absolute top-1/3 left-1/4 w-3 h-3 bg-white/40 rounded-full"
        />
      </motion.div>
    </div>
  );
}