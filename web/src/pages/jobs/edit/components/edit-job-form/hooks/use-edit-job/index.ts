import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { editJobSchema, type EditJobSchema } from './schema';
import { getJob, updateJob } from '@/http/recruitment-api/jobs';
import { toast } from 'sonner';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const useEditJob = () => {
  const { id } = useParams<{ id: string }>();
  const jobId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: job, isLoading: isLoadingJob, isSuccess } = useQuery({
    queryKey: ['jobs', jobId],
    queryFn: () => getJob(jobId),
    enabled: !!jobId,
  });

  const form = useForm<EditJobSchema>({
    resolver: zodResolver(editJobSchema),
    values: job
      ? {
          title: job.title,
          description: job.description,
          company: job.company,
          location: job.location,
          work_mode: job.work_mode,
          labels: job.labels ?? [],
        }
      : undefined,
    defaultValues: { title: '', description: '', company: '', location: '', work_mode: 'on_site', labels: [] },
  });

  const updateJobMutation = useMutation({
    mutationFn: (data: EditJobSchema) => updateJob(jobId, data),
    onSuccess: async () => {
      toast.success('Vaga atualizada com sucesso!');

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['jobs'] }),
        queryClient.invalidateQueries({ queryKey: ['jobs', 'mine'] }),
        queryClient.invalidateQueries({ queryKey: ['jobs', jobId] }),
      ]);

      navigate('/dashboard');
    },
    onError: (error: any) => {
      if (error?.response?.status === 403) {
        setErrorMsg('Você não tem permissão para editar esta vaga.');
      } else {
        setErrorMsg('Ocorreu um erro ao atualizar a vaga. Tente novamente mais tarde.');
      }
      toast.error('Falha ao atualizar vaga');
    },
  });

  const isLoading = form.formState.isSubmitting || updateJobMutation.isPending;

  const onSubmit = async (data: EditJobSchema) => {
    setErrorMsg(null);
    await updateJobMutation.mutateAsync(data);
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return { form, isLoading, isLoadingJob: isLoadingJob || !isSuccess, onSubmit, errorMsg, handleCancel };
};

export { useEditJob };
