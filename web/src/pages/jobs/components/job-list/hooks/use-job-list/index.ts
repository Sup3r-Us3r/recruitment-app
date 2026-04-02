import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listJobs } from '@/http/recruitment-api/jobs';
import { listMyApplications } from '@/http/recruitment-api/applications';
import { useAuth } from '@/contexts/auth-context';
import type { JobFiltersState } from '@/pages/jobs';

const useJobList = (filters: JobFiltersState) => {
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const isCandidate = isAuthenticated && user?.role === 'candidate';

  const jobsQuery = useQuery({
    queryKey: ['jobs', searchTerm, filters.workModes, filters.labels],
    queryFn: () =>
      listJobs({
        search: searchTerm || undefined,
        work_mode: filters.workModes.length > 0 ? filters.workModes.join(',') : undefined,
        labels: filters.labels.length > 0 ? filters.labels.join(',') : undefined,
      }),
  });

  const applicationsQuery = useQuery({
    queryKey: ['applications', 'mine'],
    queryFn: listMyApplications,
    enabled: isCandidate,
  });

  const appliedJobIds = useMemo(() => {
    if (!isCandidate) {
      return new Set<number>();
    }

    return new Set(
      (applicationsQuery.data ?? [])
        .filter((app) => !app.canceled_at)
        .map((app) => app.job_id)
    );
  }, [applicationsQuery.data, isCandidate]);

  const fetchJobs = useCallback((search?: string) => {
    setSearchTerm(search ?? '');
  }, []);

  const isLoading =
    jobsQuery.isLoading || (isCandidate && applicationsQuery.isLoading);

  return {
    jobs: jobsQuery.data ?? [],
    appliedJobIds,
    isLoading,
    fetchJobs,
  };
};

export { useJobList };
