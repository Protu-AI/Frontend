import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignInStepOne } from './SignInStepOne';
import { SignInStepTwo } from './SignInStepTwo';
import { useFormValidation } from '../signup/useFormValidation';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [isStepTwo, setIsStepTwo] = useState(false);
  const { validateField } = useFormValidation();

  const handleContinue = () => {
    if (validateField('email', email)) {
      setIsStepTwo(true);
    }
  };

  const handleBack = () => {
    setIsStepTwo(false);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto">
      <AnimatePresence mode="wait">
        {isStepTwo ? (
          <SignInStepTwo 
            key="step-two"
            email={email}
            onBack={handleBack}
          />
        ) : (
          <SignInStepOne
            key="step-one"
            email={email}
            onEmailChange={setEmail}
            onContinue={handleContinue}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
