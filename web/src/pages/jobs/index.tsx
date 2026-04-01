import { Navbar } from '@/components/navbar'
import { JobSearch } from './components/job-search'
import { JobList } from './components/job-list'
import { useJobList } from './components/job-list/hooks/use-job-list'

const Jobs = () => {
  const { jobs, appliedJobIds, isLoading, fetchJobs } = useJobList()

  const handleSearch = (search: string) => {
    fetchJobs(search)
  }

  return (
    <div className="min-h-screen bg-muted/10 flex flex-col">
      <Navbar />
      <main className="container flex-1 mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Vagas Disponíveis</h1>
            <p className="text-muted-foreground text-lg">
              Encontre a oportunidade perfeita para o seu próximo passo profissional.
            </p>
          </div>
          
          <JobSearch onSearch={handleSearch} />
          
          <JobList 
            jobs={jobs} 
            appliedJobIds={appliedJobIds} 
            isLoading={isLoading} 
          />
        </div>
      </main>
    </div>
  )
}

export { Jobs }
