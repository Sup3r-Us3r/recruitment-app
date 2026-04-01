import { MapPin, Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useJobCard } from './hooks/use-job-card';
import type { JobResponse } from '@/http/recruitment-api/jobs/types';

interface JobCardProps {
  job: JobResponse;
  initialHasApplied?: boolean;
}

const JobCard = ({ job, initialHasApplied = false }: JobCardProps) => {
  const { isOwner, hasApplied, isApplying, isRecruiter, handleApply } =
    useJobCard({
      jobId: job.id,
      ownerId: job.owner_id,
      initialHasApplied,
    });

  // Format date relatively (e.g. "há 2 dias", simple fallback to locale date string)
  const dateObj = new Date(job.created_at);
  const formattedDate = dateObj.toLocaleDateString('pt-BR');

  return (
    <Card className="flex flex-col h-full transition-all duration-200 hover:shadow-md hover:border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-lg line-clamp-2 leading-tight flex-1">
            {job.title}
          </CardTitle>
          <Badge
            variant="secondary"
            className="flex items-center gap-1 shrink-0 bg-primary/10 text-primary hover:bg-primary/20"
          >
            <MapPin className="h-3 w-3" />
            {job.location}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <p className="text-muted-foreground text-sm line-clamp-3 text-pretty">
          {job.description}
        </p>
        <div className="flex items-center text-xs text-muted-foreground gap-1">
          <Clock className="h-3 w-3" />
          <span>Publicado em {formattedDate}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t">
        {isOwner ? (
          <Badge
            variant="outline"
            className="w-full justify-center h-10 text-muted-foreground"
          >
            Sua vaga
          </Badge>
        ) : isRecruiter ? (
          <Badge
            variant="outline"
            className="w-full justify-center h-10 text-muted-foreground"
          >
            Apenas candidatos podem se candidatar
          </Badge>
        ) : hasApplied ? (
          <Badge
            variant="secondary"
            className="w-full justify-center h-10 bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
          >
            Candidatura enviada
          </Badge>
        ) : (
          <Button
            className="w-full transition-all duration-200"
            onClick={handleApply}
            disabled={isApplying}
          >
            {isApplying ? 'Enviando...' : 'Candidatar-se'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export { JobCard };
