import { CalendarDays, MapPin, Building2, Home, Laptop, Users, Mail } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getJob, listApplicants } from '@/http/recruitment-api/jobs';
import type { JobResponse } from '@/http/recruitment-api/jobs/types';
import { useAuth } from '@/contexts/auth-context';

interface JobDetailsDialogProps {
  job: JobResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const workModeMap = {
  on_site: { label: 'Presencial', icon: Building2 },
  hybrid: { label: 'Híbrido', icon: Home },
  remote: { label: 'Remoto', icon: Laptop },
} as const;

const JobDetailsDialog = ({
  job,
  open,
  onOpenChange,
}: JobDetailsDialogProps) => {
  const { user } = useAuth();
  const isOwner = user?.id === job?.owner_id;

  const { data: jobDetail, isLoading } = useQuery({
    queryKey: ['jobs', job?.id],
    queryFn: () => getJob(job!.id),
    enabled: open && !!job,
  });

  const { data: applicants } = useQuery({
    queryKey: ['jobs', job?.id, 'applicants'],
    queryFn: () => listApplicants(job!.id),
    enabled: open && !!job && isOwner,
  });

  if (!job) {
    return null;
  }

  const displayJob = jobDetail ?? job;
  const publishedAt = new Date(displayJob.created_at).toLocaleDateString('pt-BR');

  const workMode = displayJob.work_mode ? workModeMap[displayJob.work_mode] : null;
  const WorkModeIcon = workMode?.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl leading-tight">
            {displayJob.title}
          </DialogTitle>
          {displayJob.company && (
            <p className="text-sm font-medium text-muted-foreground">
              {displayJob.company}
            </p>
          )}
          <DialogDescription className="flex flex-wrap items-center gap-2 pt-1">
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-primary/10 text-primary"
            >
              <MapPin className="h-3.5 w-3.5" />
              {displayJob.location}
            </Badge>

            {workMode && WorkModeIcon && (
              <Badge variant="outline" className="flex items-center gap-1">
                <WorkModeIcon className="h-3.5 w-3.5" />
                {workMode.label}
              </Badge>
            )}

            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              Publicada em {publishedAt}
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Status badges */}
        <div className="flex flex-wrap gap-2">
          {displayJob.canceled_at && (
            <Badge variant="destructive" className="w-fit gap-1.5">
              Vaga encerrada
            </Badge>
          )}
          {!isLoading && (
            <Badge className="w-fit gap-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Users className="size-3.5" />
              {jobDetail?.application_count ?? 0}{' '}
              {jobDetail?.application_count === 1
                ? 'candidatura'
                : 'candidaturas'}
            </Badge>
          )}
        </div>

        {displayJob.labels && displayJob.labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {displayJob.labels.map((label, i) => (
              <Badge key={i} variant="secondary">
                {label}
              </Badge>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">
            Descrição da vaga
          </h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {displayJob.description}
          </p>
        </div>

        {/* Applicants list — only visible to the job owner */}
        {isOwner && applicants && applicants.length > 0 && (
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-sm font-medium text-foreground">
              Candidatos ({applicants.length})
            </h3>
            <div className="space-y-2">
              {applicants.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                      {app.user.name
                        ? app.user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                        : app.user.email[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {app.user.name || 'Sem nome'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {app.user.email}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`mailto:${app.user.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 ml-2 text-muted-foreground hover:text-primary transition-colors"
                    title="Enviar e-mail"
                  >
                    <Mail className="size-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {isOwner && applicants && applicants.length === 0 && (
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground text-center py-2">
              Nenhum candidato se inscreveu ainda.
            </p>
          </div>
        )}

        {isOwner && !applicants && (
          <div className="border-t pt-4 space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export { JobDetailsDialog };
