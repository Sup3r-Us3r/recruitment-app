import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { applyToJob } from '@/http/recruitment-api/applications';
import { toast } from 'sonner';

interface UseJobCardProps {
  jobId: number;
  ownerId: number;
  initialHasApplied: boolean;
}

const useJobCard = ({ jobId, ownerId, initialHasApplied }: UseJobCardProps) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [hasApplied, setHasApplied] = useState(initialHasApplied);

  const isOwner = user?.id === ownerId;
  const isRecruiter = isAuthenticated && user?.role === 'recruiter';

  useEffect(() => {
    setHasApplied(initialHasApplied);
  }, [initialHasApplied]);

  const applyMutation = useMutation({
    mutationFn: () => applyToJob(jobId),
    onSuccess: async () => {
      setHasApplied(true);
      toast.success('Candidatura enviada!', {
        description: 'Você se candidatou a esta vaga com sucesso.',
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['applications', 'mine'] }),
        queryClient.invalidateQueries({ queryKey: ['jobs'] }),
      ]);
    },
    onError: () => {
      toast.error('Erro na candidatura', {
        description: 'Não foi possível enviar sua candidatura no momento.',
      });
    },
  });

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isRecruiter) {
      toast.error('Ação não permitida', {
        description: 'Somente candidatos podem se candidatar a vagas.',
      });
      return;
    }

    await applyMutation.mutateAsync();
  };

  return {
    isOwner,
    hasApplied,
    isApplying: applyMutation.isPending,
    isRecruiter,
    handleApply,
  };
};

export { useJobCard };
