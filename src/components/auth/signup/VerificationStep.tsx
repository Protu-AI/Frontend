import { useState } from 'react';
import { VerificationInput } from './VerificationInput';
import { SignUpButton } from './SignUpButton';
import { AnimatePresence, motion } from 'framer-motion';
import { useFormValidation } from './useFormValidation';

interface VerificationStepProps {
  email: string;
  onVerify: () => void;
}

export function VerificationStep({ email, onVerify }: VerificationStepProps) {
  const [code, setCode] = useState('');
  const { errors, validateField } = useFormValidation();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateField('verificationCode', code)) {
      onVerify();
    }
  };

  return (
    <motion.form 
      onSubmit={handleVerify}
      className="flex-1 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="text-center mb-16">
        <h1 className="font-['Archivo'] text-[48px] font-semibold text-[#5F24E0] mb-2">
          Verify Your Email
        </h1>
        <p className="font-['Archivo'] text-base text-[#A6B5BB]">
          A verification code has been sent to{' '}
          <span className="text-[#5F24E0]">{email}</span>
        </p>
      </div>

      <div className="w-[830px] flex flex-col items-center">
        <VerificationInput value={code} onChange={setCode} />
        
        {errors.verificationCode && (
          <p className="mt-2 text-red-500 text-sm font-['Archivo']">
            {errors.verificationCode}
          </p>
        )}
        
        <div className="mt-16">
          <AnimatePresence mode="wait">
            <SignUpButton type="submit" key="verify-button">
              Verify
            </SignUpButton>
          </AnimatePresence>
        </div>

        <div className="mt-6 font-['Archivo'] text-base">
          <span className="text-[#A6B5BB]">Didn't receive the code? </span>
          <button 
            type="button"
            className="text-[#5F24E0] hover:text-[#9F7CEC] transition-colors"
            onClick={() => {/* Implement resend logic */}}
          >
            Resend Code
          </button>
        </div>
      </div>
    </motion.form>
  );
}