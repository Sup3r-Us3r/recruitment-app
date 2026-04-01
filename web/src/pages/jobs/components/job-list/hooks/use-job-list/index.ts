import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listJobs } from '@/http/recruitment-api/jobs';
import { listMyApplications } from '@/http/recruitment-api/applications';
import { useAuth } from '@/contexts/auth-context';

const useJobList = () => {
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const isCandidate = isAuthenticated && user?.role === 'candidate';

  const jobsQuery = useQuery({
    queryKey: ['jobs', searchTerm],
    queryFn: () => listJobs({ search: searchTerm || undefined }),
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

    return new Set((applicationsQuery.data ?? []).map((app) => app.job_id));
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
