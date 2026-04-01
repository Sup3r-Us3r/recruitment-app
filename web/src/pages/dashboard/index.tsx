import { Navbar } from '@/components/navbar';
import { useAuth } from '@/contexts/auth-context';
import { MyApplications } from './components/my-applications';
import { MyJobs } from './components/my-jobs';

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

          {!isRecruiter && <MyApplications />}
          {isRecruiter && <MyJobs />}
        </div>
      </main>
    </div>
  );
};

export { Dashboard };
