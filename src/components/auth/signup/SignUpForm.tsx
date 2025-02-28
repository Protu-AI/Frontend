import { Contact, Mail, Phone } from 'lucide-react';
import { InputWithIcon } from './InputWithIcon';
import { GenderSelect } from './GenderSelect';
import { useState } from 'react';
import { VerificationStep } from './VerificationStep';
import { FinalStep } from './FinalStep';
import { SignUpButton } from './SignUpButton';
import { AnimatePresence, motion } from 'framer-motion';
import { useFormValidation } from './useFormValidation';

export function SignUpForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    verificationCode: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const { errors, validateStep } = useFormValidation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(step, formData)) {
      setStep(prev => prev + 1);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (step === 2) {
    return <VerificationStep email={formData.email} onVerify={() => setStep(3)} />;
  }

  if (step === 3) {
    return <FinalStep onSubmit={() => {}} />;
  }

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="flex-1 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="text-center mb-16">
        <h1 className="font-['Archivo'] text-[48px] font-semibold text-[#5F24E0] mb-2">
          Create Your Account
        </h1>
        <p className="font-['Archivo'] text-base text-[#A6B5BB]">
          Let's get started with some basic information
        </p>
      </div>

      <div className="w-[830px] space-y-8">
        <div className="flex gap-8">
          <InputWithIcon
            icon={<Contact className="w-5 h-5" />}
            placeholder="First Name"
            showDivider
            value={formData.firstName}
            onChange={(value) => updateField('firstName', value)}
            error={errors.firstName}
          />
          <InputWithIcon
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(value) => updateField('lastName', value)}
            error={errors.lastName}
          />
        </div>

        <InputWithIcon
          icon={<Mail className="w-5 h-5" />}
          placeholder="Email Address"
          type="email"
          showDivider
          value={formData.email}
          onChange={(value) => updateField('email', value)}
          error={errors.email}
        />

        <InputWithIcon
          icon={<Phone className="w-5 h-5" />}
          placeholder="Phone Number"
          type="tel"
          showDivider
          value={formData.phone}
          onChange={(value) => updateField('phone', value)}
          error={errors.phone}
        />

        <GenderSelect
          value={formData.gender}
          onChange={(value) => updateField('gender', value)}
          error={errors.gender}
        />

        <div className="flex justify-center mt-16">
          <AnimatePresence mode="wait">
            <SignUpButton type="submit" key={`step-${step}-button`}>
              Next
            </SignUpButton>
          </AnimatePresence>
        </div>
      </div>
    </motion.form>
  );
}