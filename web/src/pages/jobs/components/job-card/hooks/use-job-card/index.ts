import { useState } from 'react';
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

  const [hasApplied, setHasApplied] = useState(initialHasApplied);
  const [isApplying, setIsApplying] = useState(false);

  const isOwner = user?.id === ownerId;
  const isRecruiter = isAuthenticated && user?.role === 'recruiter';

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

    setIsApplying(true);
    try {
      await applyToJob(jobId);
      setHasApplied(true);
      toast.success('Candidatura enviada!', {
        description: 'Você se candidatou a esta vaga com sucesso.',
      });
    } catch {
      toast.error('Erro na candidatura', {
        description: 'Não foi possível enviar sua candidatura no momento.',
      });
    } finally {
      setIsApplying(false);
    }
  };

  return {
    isOwner,
    hasApplied,
    isApplying,
    isRecruiter,
    handleApply,
  };
};

export { useJobCard };
