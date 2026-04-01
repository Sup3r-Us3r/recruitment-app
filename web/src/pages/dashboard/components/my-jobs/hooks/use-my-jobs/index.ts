import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listMyJobs } from '@/http/recruitment-api/jobs';
import { toast } from 'sonner';

const useMyJobs = () => {
  const jobsQuery = useQuery({
    queryKey: ['jobs', 'mine'],
    queryFn: listMyJobs,
  });

  useEffect(() => {
    if (jobsQuery.isError) {
      toast.error('Erro ao buscar vagas', {
        description: 'Não foi possível carregar suas vagas criadas.',
      });
    }
  }, [jobsQuery.isError]);

  return {
    jobs: jobsQuery.data ?? [],
    isLoading: jobsQuery.isLoading,
  };
};

export { useMyJobs };
