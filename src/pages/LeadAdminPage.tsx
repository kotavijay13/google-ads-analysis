
import Header from '@/components/Header';
import LeadAdmin from '@/components/leads/LeadAdmin';
import { useAuth } from '@/context/AuthContext';

const LeadAdminPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Please log in to access lead administration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <Header title="Lead Administration" />
      <LeadAdmin />
    </div>
  );
};

export default LeadAdminPage;
