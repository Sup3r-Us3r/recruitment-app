import { useEditJob } from './hooks/use-edit-job'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TagInput } from '@/components/ui/tag-input'
import { Skeleton } from '@/components/ui/skeleton'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { AlertCircle, Building2, Home, Laptop } from 'lucide-react'
import { cn } from '@/lib/utils'

const workModeOptions = [
  { value: 'on_site', label: 'Presencial', icon: Building2 },
  { value: 'hybrid', label: 'Híbrido', icon: Home },
  { value: 'remote', label: 'Remoto', icon: Laptop },
] as const

const EditJobForm = () => {
  const { form, isLoading, isLoadingJob, onSubmit, errorMsg, handleCancel } = useEditJob()

  if (isLoadingJob) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 text-sm rounded-md bg-destructive/15 text-destructive font-medium">
            <AlertCircle className="h-4 w-4" />
            {errorMsg}
          </div>
        )}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título da Vaga</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Desenvolvedor Front-end Sênior" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Empresa</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Acme Corp" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Localização</FormLabel>
              <FormControl>
                <Input placeholder="Ex: São Paulo, SP (ou Remoto)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="work_mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo de Trabalho</FormLabel>
              <FormControl>
                <div className="grid grid-cols-3 gap-2">
                  {workModeOptions.map((option) => {
                    const Icon = option.icon
                    const isSelected = field.value === option.value
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => field.onChange(option.value)}
                        className={cn(
                          'flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 text-sm font-medium transition-all cursor-pointer',
                          isSelected
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-muted-foreground/30 text-muted-foreground'
                        )}
                      >
                        <Icon className="size-5" />
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="labels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Labels</FormLabel>
              <FormControl>
                <TagInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Ex: React, TypeScript, Node.js..."
                />
              </FormControl>
              <FormDescription>
                Digite uma label e pressione Enter para adicionar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva as responsabilidades, requisitos e benefícios da vaga..."
                  className="min-h-[150px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Seja claro e objetivo para atrair os melhores candidatos.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 justify-end pt-4" style={{ marginTop: '2rem' }}>
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export { EditJobForm }
