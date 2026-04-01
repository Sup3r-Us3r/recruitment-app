import { useMyJobs } from './hooks/use-my-jobs'
import { JobCard } from '@/pages/jobs/components/job-card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Briefcase, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

const MyJobs = () => {
  const { jobs, isLoading } = useMyJobs()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-lg border shadow-sm">
        <div>
          <h2 className="text-xl font-semibold">Minhas Vagas</h2>
          <p className="text-sm text-muted-foreground">Gerencie as vagas que você publicou</p>
        </div>
        <Button asChild>
          <Link to="/jobs/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Vaga
          </Link>
        </Button>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4 border border-dashed rounded-lg bg-muted/10">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Briefcase className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Você ainda não criou nenhuma vaga</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Crie sua primeira vaga para começar a receber candidaturas de profissionais.
          </p>
          <Button asChild>
            <Link to="/jobs/create">Criar primeira vaga</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} initialHasApplied={false} />
          ))}
        </div>
      )}
    </div>
  )
}

export { MyJobs }
