import { MapPin, Building2, Home, Laptop, Pencil, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useJobCard } from './hooks/use-job-card';
import type { JobResponse } from '@/http/recruitment-api/jobs/types';

interface JobCardProps {
  job: JobResponse;
  initialHasApplied?: boolean;
  showEditButton?: boolean;
  onSelectJob?: (job: JobResponse) => void;
}

const workModeMap = {
  on_site: { label: 'Presencial', icon: Building2 },
  hybrid: { label: 'Híbrido', icon: Home },
  remote: { label: 'Remoto', icon: Laptop },
} as const;

const JobCard = ({
  job,
  initialHasApplied = false,
  showEditButton = false,
  onSelectJob,
}: JobCardProps) => {
  const { isOwner, hasApplied, isApplying, isWithdrawing, isCanceling, isRecruiter, handleApply, handleWithdraw, handleCancelJob } =
    useJobCard({
      jobId: job.id,
      ownerId: job.owner_id,
      initialHasApplied,
    });

  const isCanceled = !!job.canceled_at;
  const workMode = job.work_mode ? workModeMap[job.work_mode] : null;
  const WorkModeIcon = workMode?.icon;
  const timeAgo = getRelativeTime(job.created_at);

  return (
    <Card
      className={`group flex flex-col h-full p-5 transition-all duration-200 cursor-pointer ${
        isCanceled
          ? 'opacity-60 border-dashed'
          : 'hover:shadow-md hover:border-primary/20'
      }`}
      onClick={() => onSelectJob?.(job)}
    >
      {/* Header: title + meta */}
      <div className="flex-1 space-y-3">
        <div>
          <div className="flex items-start gap-2">
            <h3 className="font-semibold leading-snug line-clamp-2 flex-1">
              {job.title}
            </h3>
            {isCanceled && (
              <Badge variant="destructive" className="shrink-0 text-xs">
                Encerrada
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
            {job.company && <span>{job.company}</span>}
            {job.company && job.location && <span className="text-border">·</span>}
            {job.location && (
              <span className="inline-flex items-center gap-0.5">
                <MapPin className="size-3" />
                {job.location}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Tags row */}
        <div className="flex flex-wrap items-center gap-1.5">
          {workMode && WorkModeIcon && (
            <Badge variant="outline" className="text-xs font-normal gap-1">
              <WorkModeIcon className="size-3" />
              {workMode.label}
            </Badge>
          )}
          {job.labels?.slice(0, 3).map((label, i) => (
            <Badge key={i} variant="secondary" className="text-xs font-normal">
              {label}
            </Badge>
          ))}
          {job.labels && job.labels.length > 3 && (
            <span className="text-xs text-muted-foreground">+{job.labels.length - 3}</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{timeAgo}</span>

        {isCanceled ? (
          // Canceled job — no actions
          null
        ) : isOwner && showEditButton ? (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 cursor-pointer"
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <Link to={`/jobs/${job.id}/edit`}>
                <Pencil className="size-3.5 mr-1.5" />
                Editar
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
              onClick={(event) => {
                event.stopPropagation();
                void handleCancelJob();
              }}
              disabled={isCanceling}
            >
              <XCircle className="size-3.5 mr-1.5" />
              {isCanceling ? 'Encerrando...' : 'Encerrar'}
            </Button>
          </div>
        ) : hasApplied ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            onClick={(event) => {
              event.stopPropagation();
              void handleWithdraw();
            }}
            disabled={isWithdrawing}
          >
            {isWithdrawing ? 'Cancelando...' : 'Cancelar candidatura'}
          </Button>
        ) : isOwner || isRecruiter ? null : (
          <Button
            size="sm"
            className="h-8 cursor-pointer"
            onClick={(event) => {
              event.stopPropagation();
              void handleApply();
            }}
            disabled={isApplying}
          >
            {isApplying ? 'Enviando...' : 'Candidatar-se'}
          </Button>
        )}
      </div>
    </Card>
  );
};

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `${diffDays}d atrás`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}sem atrás`;
  return date.toLocaleDateString('pt-BR');
}

export { JobCard };
