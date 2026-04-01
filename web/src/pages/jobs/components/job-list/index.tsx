import { Skeleton } from '@/components/ui/skeleton';
import { JobCard } from '../job-card';
import type { JobResponse } from '@/http/recruitment-api/jobs/types';
import { Briefcase } from 'lucide-react';

interface JobListProps {
  jobs: JobResponse[];
  appliedJobIds: Set<number>;
  isLoading: boolean;
  onSelectJob?: (job: JobResponse) => void;
}

const JobList = ({
  jobs,
  appliedJobIds,
  isLoading,
  onSelectJob,
}: JobListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-50 w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-muted/20 rounded-lg border border-dashed">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Briefcase className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Nenhuma vaga encontrada</h3>
        <p className="text-muted-foreground max-w-sm">
          Não conseguimos encontrar vagas correspondentes à sua busca. Tente
          buscar por outros termos.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          initialHasApplied={appliedJobIds.has(job.id)}
          onSelectJob={onSelectJob}
        />
      ))}
    </div>
  );
};

export { JobList };
