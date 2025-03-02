import { User, Lock } from 'lucide-react';
import { InputWithIcon } from './InputWithIcon';
import { useState } from 'react';
import { useFormValidation } from './useFormValidation';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface FinalStepProps {
  onSubmit: (data: { username: string; password: string; confirmPassword: string }) => void;
}

export function FinalStep({ onSubmit }: FinalStepProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const { errors, validateStep } = useFormValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(3, formData)) {
      await onSubmit(formData);
      navigate('/signin');
    }
  };

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
          Complete Your Profile
        </h1>
        <p className="font-['Archivo'] text-base text-[#A6B5BB]">
          Create your login credentials to get started
        </p>
      </div>

      <div className="w-[830px] space-y-8">
        <InputWithIcon
          icon={<User className="w-5 h-5" />}
          placeholder="Choose a username"
          showDivider
          value={formData.username}
          onChange={(value) => setFormData(prev => ({ ...prev, username: value }))}
          error={errors.username}
        />

        <InputWithIcon
          icon={<Lock className="w-5 h-5" />}
          placeholder="Create a password"
          type="password"
          showDivider
          value={formData.password}
          onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
          error={errors.password}
        />

        <InputWithIcon
          icon={<Lock className="w-5 h-5" />}
          placeholder="Confirm password"
          type="password"
          showDivider
          value={formData.confirmPassword}
          onChange={(value) => setFormData(prev => ({ ...prev, confirmPassword: value }))}
          error={errors.confirmPassword}
        />

        <div className="flex justify-center mt-16">
          <button 
            type="submit"
            className="py-[27px] px-[110px] bg-[#5F24E0] hover:bg-[#9F7CEC] text-white font-['Archivo'] text-[22px] font-semibold rounded-[24px] transition-colors duration-300"
          >
            Complete Sign-Up
          </button>
        </div>
      </div>
    </motion.form>
  );
}
