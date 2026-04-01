import { useCreateJob } from './hooks/use-create-job'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { AlertCircle } from 'lucide-react'

const CreateJobForm = () => {
  const { form, isLoading, onSubmit, errorMsg, handleCancel } = useCreateJob()

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
            {isLoading ? 'Publicando...' : 'Publicar Vaga'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export { CreateJobForm }
