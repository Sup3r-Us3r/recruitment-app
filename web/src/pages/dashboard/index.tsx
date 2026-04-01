import { Navbar } from '@/components/navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MyJobs } from './components/my-jobs';
import { MyApplications } from './components/my-applications';
import { useAuth } from '@/contexts/auth-context';

const Dashboard = () => {
  const { user } = useAuth();
  const isRecruiter = user?.role === 'recruiter';

  return (
    <div className="min-h-screen bg-muted/10 flex flex-col">
      <Navbar />
      <main className="container flex-1 mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Painel de Controle
            </h1>
            <p className="text-muted-foreground text-lg">
              Bem-vindo(a), {user?.email}
            </p>
          </div>

          <Tabs
            defaultValue={isRecruiter ? 'jobs' : 'applications'}
            className="w-full"
          >
            <TabsList
              className={`grid w-full max-w-md ${isRecruiter ? 'grid-cols-1' : 'grid-cols-1'}`}
            >
              {!isRecruiter && (
                <TabsTrigger value="applications">
                  Minhas Candidaturas
                </TabsTrigger>
              )}
              {isRecruiter && (
                <TabsTrigger value="jobs">Minhas Vagas</TabsTrigger>
              )}
            </TabsList>

            {!isRecruiter && (
              <TabsContent value="applications" className="min-h-100">
                <MyApplications />
              </TabsContent>
            )}

            {isRecruiter && (
              <TabsContent value="jobs" className="min-h-100">
                <MyJobs />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export { Dashboard };
