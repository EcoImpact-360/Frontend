import { useState, useCallback } from 'react';
import useFetch from './useFetch';
import { request } from '../services/apiClient';

const API_BASE = '/api/aulas';

/**
 * useAulas - TK-001-06
 * Hook personalizado que maneja carga, creación, edición y eliminación de aulas
 * Incluye refresco automático después de operaciones CRUD
 */
function useAulas() {
  const { data, loading, error, refetch } = useFetch(API_BASE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Crear un nueva aula
  const createAula = useCallback(async (aulaData) => {
    setIsSubmitting(true);
    try {
      const newAula = {
        ...aulaData,
        id: Date.now(), // ID temporal hasta que json-server lo asigne
        cubos_por_dia: aulaData.cubos_por_dia || [
          { dia: 'lunes', cubos_basura: 0, cubos_reciclables: 0 },
          { dia: 'martes', cubos_basura: 0, cubos_reciclables: 0 },
          { dia: 'miércoles', cubos_basura: 0, cubos_reciclables: 0 },
          { dia: 'jueves', cubos_basura: 0, cubos_reciclables: 0 },
          { dia: 'viernes', cubos_basura: 0, cubos_reciclables: 0 },
        ],
        total_cubos_semana: 0,
        gestor_id: aulaData.gestor_id || null,
      };
      
      await request(API_BASE, {
        method: 'POST',
        body: newAula,
      });
      
      // TK-001-11: Refresco automático después de CRUD
      await refetch();
      return { success: true };
    } catch (err) {
      console.error('Error creating aula:', err);
      return { success: false, error: err.message || 'Error al crear aula' };
    } finally {
      setIsSubmitting(false);
    }
  }, [refetch]);

  // Editar un aula existente
  const updateAula = useCallback(async (id, aulaData) => {
    setIsSubmitting(true);
    try {
      await request(`${API_BASE}/${id}`, {
        method: 'PUT',
        body: aulaData,
      });
      
      // TK-001-11: Refresco automático después de CRUD
      await refetch();
      return { success: true };
    } catch (err) {
      console.error('Error updating aula:', err);
      return { success: false, error: err.message || 'Error al actualizar aula' };
    } finally {
      setIsSubmitting(false);
    }
  }, [refetch]);

  // Eliminar un aula
  const deleteAula = useCallback(async (id) => {
    setIsSubmitting(true);
    try {
      await request(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });
      
      // TK-001-11: Refresco automático después de CRUD
      await refetch();
      return { success: true };
    } catch (err) {
      console.error('Error deleting aula:', err);
      return { success: false, error: err.message || 'Error al eliminar aula' };
    } finally {
      setIsSubmitting(false);
    }
  }, [refetch]);

  return {
    aulas: data || [],
    loading,
    error,
    isSubmitting,
    refetch,
    createAula,
    updateAula,
    deleteAula,
  };
}

export default useAulas;
