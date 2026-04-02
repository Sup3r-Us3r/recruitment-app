import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { applyToJob, withdrawApplication } from '@/http/recruitment-api/applications';
import { cancelJob } from '@/http/recruitment-api/jobs';
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

  const invalidateQueries = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['applications', 'mine'] }),
      queryClient.invalidateQueries({ queryKey: ['jobs'] }),
    ]);

  const applyMutation = useMutation({
    mutationFn: () => applyToJob(jobId),
    onSuccess: async () => {
      setHasApplied(true);
      toast.success('Candidatura enviada!', {
        description: 'Você se candidatou a esta vaga com sucesso.',
      });
      await invalidateQueries();
    },
    onError: () => {
      toast.error('Erro na candidatura', {
        description: 'Não foi possível enviar sua candidatura no momento.',
      });
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: () => withdrawApplication(jobId),
    onSuccess: async () => {
      setHasApplied(false);
      toast.success('Candidatura cancelada', {
        description: 'Sua candidatura foi removida com sucesso.',
      });
      await invalidateQueries();
    },
    onError: () => {
      toast.error('Erro ao cancelar', {
        description: 'Não foi possível cancelar sua candidatura no momento.',
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

  const handleWithdraw = async () => {
    await withdrawMutation.mutateAsync();
  };

  const cancelMutation = useMutation({
    mutationFn: () => cancelJob(jobId),
    onSuccess: async () => {
      toast.success('Vaga encerrada', {
        description: 'A vaga foi encerrada e todas as candidaturas foram canceladas.',
      });
      await invalidateQueries();
    },
    onError: () => {
      toast.error('Erro ao encerrar', {
        description: 'Não foi possível encerrar a vaga no momento.',
      });
    },
  });

  const handleCancelJob = async () => {
    await cancelMutation.mutateAsync();
  };

  return {
    isOwner,
    hasApplied,
    isApplying: applyMutation.isPending,
    isWithdrawing: withdrawMutation.isPending,
    isCanceling: cancelMutation.isPending,
    isRecruiter,
    handleApply,
    handleWithdraw,
    handleCancelJob,
  };
};

export { useJobCard };
