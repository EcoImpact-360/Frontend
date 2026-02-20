// Ejemplo de la función de envío en el Frontend
export const submitWaste = async (formData) => {

  const payload = {
    classroomId: parseInt(formData.aulaId), 
    wasteTypeId: parseInt(formData.tipoId), 
    quantityKg: parseFloat(formData.cantidad)
  };

  const response = await fetch('http://localhost:8080/api/v1/waste-entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  return response.json();
};