import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createJobSchema, type CreateJobSchema } from './schema';
import { createJob } from '@/http/recruitment-api/jobs';
import { toast } from 'sonner';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useCreateJob = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const form = useForm<CreateJobSchema>({
    resolver: zodResolver(createJobSchema),
    defaultValues: { title: '', description: '', company: '', location: '', work_mode: 'on_site', labels: [] },
  });

  const createJobMutation = useMutation({
    mutationFn: createJob,
    onSuccess: async () => {
      toast.success('Vaga criada com sucesso!', {
        description: 'Sua vaga já está disponível para candidaturas.',
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['jobs'] }),
        queryClient.invalidateQueries({ queryKey: ['jobs', 'mine'] }),
      ]);

      navigate('/dashboard');
    },
    onError: () => {
      setErrorMsg(
        'Ocorreu um erro ao criar a vaga. Tente novamente mais tarde.',
      );
      toast.error('Falha ao criar vaga', {
        description: 'Não foi possível publicar a vaga.',
      });
    },
  });

  const isLoading = form.formState.isSubmitting || createJobMutation.isPending;

  const onSubmit = async (data: CreateJobSchema) => {
    setErrorMsg(null);
    await createJobMutation.mutateAsync(data);
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return { form, isLoading, onSubmit, errorMsg, handleCancel };
};

export { useCreateJob };
