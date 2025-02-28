import React from 'react';
import { ForgotPasswordStep1 } from './ForgotPasswordStep1';
import { ForgotPasswordHeader } from '@/components/ForgotPassword/ForgotPasswordHeader';
import { ForgotPasswordFooter } from '@/components/ForgotPassword/ForgotPasswordFooter';
import { useState } from 'react';
import { ForgotPasswordStep2 } from './ForgotPasswordStep2';
import { ForgotPasswordStep3 } from './ForgotPasswordStep3';
import { ForgotPasswordStep4 } from './ForgotPasswordStep4';
import { motion } from 'framer-motion';

export function ForgotPassword() {
  const [step, setStep] = useState(1);

  return (
    <div className="flex h-screen w-full flex-col bg-gradient-to-b from-white via-[#F9F6FE] to-[#F5F0FD] dark:from-[#1C0B43] dark:to-[#1C0B43]">
      <ForgotPasswordHeader />
      <div className="flex-1 flex items-center justify-center">
        {step === 1 && <ForgotPasswordStep1 />}
        {step === 2 && <ForgotPasswordStep2 />}
        {step === 3 && <ForgotPasswordStep3 />}
        {step === 4 && <ForgotPasswordStep4 />}
      </div>
      <ForgotPasswordFooter step={step} />
    </div>
  );
}
