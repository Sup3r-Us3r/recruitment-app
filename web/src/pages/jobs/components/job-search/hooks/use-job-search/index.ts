import { useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/use-debounce'

interface UseJobSearchProps {
  onSearch: (search: string) => void
}

const useJobSearch = ({ onSearch }: UseJobSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 400)

  useEffect(() => {
    onSearch(debouncedSearchTerm)
  }, [debouncedSearchTerm, onSearch])

  return {
    searchTerm,
    setSearchTerm,
  }
}

export { useJobSearch }
