export default function formatNominalValue(value: number) {
  const numberValue = Number(value); // Converte explicitamente para número

  if (isNaN(numberValue)) return ""; // Tratamento para valores inválidos

  return "R$ " + numberValue.toFixed(2).replace('.', ',');
}