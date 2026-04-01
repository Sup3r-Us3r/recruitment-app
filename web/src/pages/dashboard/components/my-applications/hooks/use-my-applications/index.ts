import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listMyApplications } from '@/http/recruitment-api/applications';
import { toast } from 'sonner';

const useMyApplications = () => {
  const applicationsQuery = useQuery({
    queryKey: ['applications', 'mine'],
    queryFn: listMyApplications,
  });

  useEffect(() => {
    if (applicationsQuery.isError) {
      toast.error('Erro ao buscar candidaturas', {
        description:
          'Não foi possível carregar as vagas nas quais você se candidatou.',
      });
    }
  }, [applicationsQuery.isError]);

  return {
    applications: applicationsQuery.data ?? [],
    isLoading: applicationsQuery.isLoading,
  };
};

export { useMyApplications };
