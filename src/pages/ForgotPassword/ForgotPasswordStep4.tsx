import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ForgotPasswordStep4Props {
  setStep: (step: number) => void;
}

export function ForgotPasswordStep4() {
  const navigate = useNavigate();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      className="flex flex-col items-center"
    >
      <motion.div
        className="bg-[#5F24E0] rounded-[24px] p-[15px] mb-[32px]"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        <CheckCircle className="w-[50px] h-[50px] text-white" />
      </motion.div>
      <motion.h1
        className="font-['Archivo'] text-[32px] font-semibold text-center text-[#5F24E0]"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        Password Reset Successful
      </motion.h1>
      <motion.p
        className="font-['Archivo'] text-base text-[#A6B5BB] text-center mt-[8px]"
        variants={fadeIn}
        initial="initial"
        animate="animate"
      >
        Your password has been updated
      </motion.p>

      <motion.div variants={fadeIn} initial="initial" animate="animate">
        <Button className="mt-[32px] w-[400px] h-[80px] bg-[#5F24E0] hover:bg-[#9F7CEC] text-[#EFE9FC] font-['Archivo'] text-[22px] font-semibold rounded-[24px]" onClick={() => navigate('/signin')}>
          Go to Sign In
        </Button>
      </motion.div>
    </motion.div>
  );
}
