import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EditJobForm } from './components/edit-job-form'
import { Navbar } from '@/components/navbar'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const EditJob = () => {
  return (
    <div className="min-h-screen bg-muted/10 flex flex-col">
      <Navbar />
      <main className="container flex-1 mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4 -ml-4 text-muted-foreground">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao painel
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Editar Vaga</h1>
          <p className="text-muted-foreground mt-2">
            Atualize as informações da vaga.
          </p>
        </div>

        <Card className="shadow-sm border-muted/50">
          <CardHeader>
            <CardTitle>Detalhes da Posição</CardTitle>
            <CardDescription>
              As informações inseridas aqui ficarão visíveis para todos os candidatos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EditJobForm />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export { EditJob }
