// Ejemplo de la función de envío en el Frontend
export const submitWaste = async (formData) => {
  // formData viene del formulario de React
  const payload = {
    classroomId: parseInt(formData.aulaId), // Debe coincidir con el curl
    wasteTypeId: parseInt(formData.tipoId), // Debe coincidir con el curl
    quantityKg: parseFloat(formData.cantidad)
  };

  const response = await fetch('http://localhost:8080/api/v1/waste-entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  return response.json();
};