import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useJobSearch } from './hooks/use-job-search'

interface JobSearchProps {
  onSearch: (search: string) => void
}

const JobSearch = ({ onSearch }: JobSearchProps) => {
  const { searchTerm, setSearchTerm } = useJobSearch({ onSearch })

  return (
    <div className="relative flex-1 min-w-0">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        type="search"
        placeholder="Buscar vagas por título ou descrição..."
        className="pl-9 h-12 text-base transition-all duration-200"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  )
}

export { JobSearch }
