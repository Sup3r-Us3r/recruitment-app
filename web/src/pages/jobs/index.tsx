import { Navbar } from '@/components/navbar';
import { JobSearch } from './components/job-search';
import { JobList } from './components/job-list';
import { useJobList } from './components/job-list/hooks/use-job-list';
import { JobDetailsDialog } from './components/job-details-dialog';
import type { JobResponse } from '@/http/recruitment-api/jobs/types';
import { useState } from 'react';

const Jobs = () => {
  const { jobs, appliedJobIds, isLoading, fetchJobs } = useJobList();
  const [selectedJob, setSelectedJob] = useState<JobResponse | null>(null);

  const handleSearch = (search: string) => {
    fetchJobs(search);
  };

  const handleJobClick = (job: JobResponse) => {
    setSelectedJob(job);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedJob(null);
    }
  };

  return (
    <div className="min-h-screen bg-muted/10 flex flex-col">
      <Navbar />
      <main className="container flex-1 mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Vagas Disponíveis
            </h1>
            <p className="text-muted-foreground text-lg">
              Encontre a oportunidade perfeita para o seu próximo passo
              profissional.
            </p>
          </div>

          <JobSearch onSearch={handleSearch} />

          <JobList
            jobs={jobs}
            appliedJobIds={appliedJobIds}
            isLoading={isLoading}
            onSelectJob={handleJobClick}
          />

          <JobDetailsDialog
            job={selectedJob}
            open={Boolean(selectedJob)}
            onOpenChange={handleOpenChange}
          />
        </div>
      </main>
    </div>
  );
};

export { Jobs };
