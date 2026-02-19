import { useState, useCallback } from 'react';
import useFetch from './useFetch';
import { request } from '../services/apiClient';

const API_BASE = '/api/contenedores';

/**
 * useContenedores - TK-001-07
 * Hook personalizado que maneja carga, creación, edición y eliminación de contenedores
 * Similar al de aulas, pero para contenedores
 */
function useContenedores() {
  const { data, loading, error, refetch } = useFetch(API_BASE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Crear un nuevo contenedor
  const createContenedor = useCallback(async (contenedorData) => {
    setIsSubmitting(true);
    try {
      const newContenedor = {
        ...contenedorData,
        id: Date.now(), // ID temporal hasta que json-server lo asigne
        capacidad_max: contenedorData.capacidad_max || 500,
        nivel_actual: contenedorData.nivel_actual || 0,
        depositos_por_aula: contenedorData.depositos_por_aula || [],
        ultima_vaciada: new Date().toISOString().split('T')[0],
      };
      
      await request(API_BASE, {
        method: 'POST',
        body: newContenedor,
      });
      
      // TK-001-11: Refresco automático después de CRUD
      await refetch();
      return { success: true };
    } catch (err) {
      console.error('Error creating contenedor:', err);
      return { success: false, error: err.message || 'Error al crear contenedor' };
    } finally {
      setIsSubmitting(false);
    }
  }, [refetch]);

  // Editar un contenedor existente
  const updateContenedor = useCallback(async (id, contenedorData) => {
    setIsSubmitting(true);
    try {
      await request(`${API_BASE}/${id}`, {
        method: 'PUT',
        body: contenedorData,
      });
      
      // TK-001-11: Refresco automático después de CRUD
      await refetch();
      return { success: true };
    } catch (err) {
      console.error('Error updating contenedor:', err);
      return { success: false, error: err.message || 'Error al actualizar contenedor' };
    } finally {
      setIsSubmitting(false);
    }
  }, [refetch]);

  // Eliminar un contenedor
  const deleteContenedor = useCallback(async (id) => {
    setIsSubmitting(true);
    try {
      await request(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });
      
      // TK-001-11: Refresco automático después de CRUD
      await refetch();
      return { success: true };
    } catch (err) {
      console.error('Error deleting contenedor:', err);
      return { success: false, error: err.message || 'Error al eliminar contenedor' };
    } finally {
      setIsSubmitting(false);
    }
  }, [refetch]);

  return {
    contenedores: data || [],
    loading,
    error,
    isSubmitting,
    refetch,
    createContenedor,
    updateContenedor,
    deleteContenedor,
  };
}

export default useContenedores;
