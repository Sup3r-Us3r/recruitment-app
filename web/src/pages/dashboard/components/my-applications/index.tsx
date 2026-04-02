import { useMyApplications } from './hooks/use-my-applications';
import { Skeleton } from '@/components/ui/skeleton';
import { Inbox, ExternalLink, CalendarDays, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ApplicationResponse } from '@/http/recruitment-api/applications/types';

function getStatusBadge(app: ApplicationResponse) {
  // Application was canceled (either by user or job was closed)
  if (app.canceled_at) {
    // Job was closed — that's why the application was canceled
    if (app.job?.canceled_at) {
      return (
        <Badge variant="destructive" className="shrink-0 text-xs">
          Vaga encerrada
        </Badge>
      );
    }
    // User canceled their own application
    return (
      <Badge variant="outline" className="shrink-0 text-xs text-muted-foreground">
        Cancelada
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="bg-green-100 text-green-800 shrink-0 text-xs"
    >
      Enviada
    </Badge>
  );
}

const MyApplications = () => {
  const { applications, isLoading } = useMyApplications();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-45 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4 border border-dashed rounded-lg bg-muted/10 mt-6">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Inbox className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">Sem candidaturas</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Você ainda não se candidatou a nenhuma vaga. Explore as oportunidades
          disponíveis.
        </p>
        <Button asChild>
          <Link to="/jobs">Explorar vagas</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {applications.map((app) => {
        const dateObj = new Date(app.created_at);
        const formattedDate = dateObj.toLocaleDateString('pt-BR');
        const isCanceled = !!app.canceled_at;

        return (
          <Card
            key={app.id}
            className={`flex flex-col ${isCanceled ? 'opacity-60 border-dashed' : 'bg-muted/30'}`}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base line-clamp-2">
                    {app.job?.title || `Vaga #${app.job_id}`}
                  </CardTitle>
                  {app.job?.company && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {app.job.company}
                      {app.job.location && (
                        <span className="inline-flex items-center gap-0.5 ml-1.5">
                          <MapPin className="size-3" />
                          {app.job.location}
                        </span>
                      )}
                    </p>
                  )}
                </div>
                {getStatusBadge(app)}
              </div>
            </CardHeader>
            <CardContent className="flex-1 pb-3">
              <div className="flex items-center text-sm text-muted-foreground gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>Candidatou-se em {formattedDate}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full text-xs h-8">
                <Link to="/jobs">
                  <ExternalLink className="mr-2 h-3 w-3" />
                  Ver mais vagas
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export { MyApplications };
