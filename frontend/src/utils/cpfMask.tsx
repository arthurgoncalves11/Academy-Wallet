export const handleCPFInput = (event: React.FormEvent<HTMLInputElement>) => {
  let cpf = event.currentTarget.value;
  const originalLength = cpf.length;

  cpf = CPFStaticFormater(cpf)

  const newLength = cpf.length;
  const selectionStart = event.currentTarget.selectionStart;
  event.currentTarget.value = cpf;

  if (originalLength > newLength && selectionStart && selectionStart > 0) {
    event.currentTarget.setSelectionRange(
      selectionStart - 1,
      selectionStart - 1
    );
  }
};

export const CPFStaticFormater = (cpf: string) => {
  if (!cpf) return "";

  return cpf
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{2})$/, "$1-$2");
};
