'use client'
 
import { createContext, useContext, useState } from "react";
 
interface RegisterData {
    name: string;
    email: string;
    password: string;
    cpf: string;
    rg: string;
    transactionPassword: string;
}
 
interface RegisterContextData {
    formData: RegisterData;
    updateFormData: (data: Partial<RegisterData>) => void;
    currentStep: number;
    nextStep: () => void;
    prevStep: () => void;
    resetForm: () => void;
    handleEditField: (step: number, filedId: string) => void;
    isEditing: boolean;
    setIsEditing: (value: boolean) => void;
    setCurrentStep: (step: number) => void;
}
 
export const RegisterContext = createContext({} as RegisterContextData );
 
export function RegisterProvider({ children }: {children : React.ReactNode}) {
    const [formData, setFormData] = useState<RegisterData>({
      name: '',
      email: '',
      password: '',
      cpf: '',
      rg: '',
      transactionPassword: ''
    });
 
    const [currentStep, setCurrentStep] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
 
    const nextStep = () => {
        setIsEditing(false)
        setCurrentStep(prev => prev + 1);
    };
 
    const prevStep = () => {
      setIsEditing(false);
      setCurrentStep(prev => prev - 1);    
    };
 
    const updateFormData = (data: Partial<RegisterData>) => {
      setFormData((prev) => ({
        ...prev,
        ...data,
      }));
    };
 
    const handleEditField = (step: number, fieldId: string) => {
      setIsEditing(true);
      setCurrentStep(step);
      setTimeout(() => document.getElementById(fieldId)?.focus(), 100);
    };
 
    const resetForm = () => {
      setFormData({
        name: '',
        email: '',
        password: '',
        cpf: '',
        rg: '',
        transactionPassword: ''
      });
      setCurrentStep(1);
      setIsEditing(false);
    };
 
    return (
      <RegisterContext.Provider value={{
        formData,
        updateFormData,
        currentStep,
        nextStep,
        prevStep,
        handleEditField,
        isEditing,
        setIsEditing,
        setCurrentStep,
        resetForm
      }}>
        {children}
      </RegisterContext.Provider>
    );
}
 
export const useRegister = () => useContext(RegisterContext);