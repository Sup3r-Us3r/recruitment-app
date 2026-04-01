import { CalendarDays, MapPin } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { JobResponse } from '@/http/recruitment-api/jobs/types';

interface JobDetailsDialogProps {
  job: JobResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JobDetailsDialog = ({
  job,
  open,
  onOpenChange,
}: JobDetailsDialogProps) => {
  if (!job) {
    return null;
  }

  const publishedAt = new Date(job.created_at).toLocaleDateString('pt-BR');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl leading-tight">
            {job.title}
          </DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-2 pt-1">
            <Badge
              variant="secondary"
              className="flex items-center gap-1 bg-primary/10 text-primary"
            >
              <MapPin className="h-3.5 w-3.5" />
              {job.location}
            </Badge>

            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              Publicada em {publishedAt}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground">
            Descrição da vaga
          </h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {job.description}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { JobDetailsDialog };
