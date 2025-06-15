
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Lead } from '@/components/leads/types/leadTypes';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, User, Calendar, Tag, Search, Briefcase } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import Header from '@/components/Header';
import LeadRemarksEditor from '@/components/leads/LeadRemarksEditor';

interface Remark {
  id: string;
  remark: string;
  created_at: string;
  user_id: string | null;
}

const LeadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lead, setLead] = useState<Lead | null>(null);
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeadDetails = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', id)
        .single();

      if (leadError) throw leadError;
      setLead(leadData);

      const { data: remarksData, error: remarksError } = await supabase
        .from('lead_remarks')
        .select('*')
        .eq('lead_id', id)
        .order('created_at', { ascending: false });

      if (remarksError) throw remarksError;
      setRemarks(remarksData || []);

    } catch (error: any) {
      console.error('Error fetching lead details:', error);
      toast.error('Failed to fetch lead details.');
      navigate('/leads');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchLeadDetails();
  }, [id]);

  const handleRemarksChange = async (leadId: string, newRemark: string) => {
    if (!user) {
      toast.error('You must be logged in to add remarks.');
      return;
    }
    
    try {
      const { error: remarkError } = await supabase
        .from('lead_remarks')
        .insert({ lead_id: leadId, remark: newRemark, user_id: user.id });
      if (remarkError) throw remarkError;
      
      const { error: leadError } = await supabase
        .from('leads')
        .update({ remarks: newRemark, updated_at: new Date().toISOString() })
        .eq('id', leadId);
      if (leadError) throw leadError;
      
      toast.success('Remark added successfully.');
      fetchLeadDetails(); // Refetch to show updates
    } catch (error: any) {
      console.error('Error adding remark:', error);
      toast.error(error.message || 'Failed to add remark.');
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!lead) {
    return <div className="p-6">Lead not found.</div>;
  }
  
  const leadFullName = lead.name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'N/A';

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Header title={`Lead Details: ${leadFullName}`} />
        <Button variant="outline" onClick={() => navigate('/leads')} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Leads
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lead Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center"><User className="w-4 h-4 mr-2 text-gray-500" /> <strong>Name:</strong> <span className="ml-2">{leadFullName}</span></div>
                <div className="flex items-center"><User className="w-4 h-4 mr-2 text-gray-500" /> <strong>Email:</strong> <span className="ml-2">{lead.email || 'N/A'}</span></div>
                <div className="flex items-center"><User className="w-4 h-4 mr-2 text-gray-500" /> <strong>Phone:</strong> <span className="ml-2">{lead.phone || 'N/A'}</span></div>
                <div className="flex items-center"><Briefcase className="w-4 h-4 mr-2 text-gray-500" /> <strong>Company:</strong> <span className="ml-2">{lead.company || 'N/A'}</span></div>
                <div className="flex items-center"><Tag className="w-4 h-4 mr-2 text-gray-500" /> <strong>Source:</strong> <span className="ml-2">{lead.source || 'N/A'}</span></div>
                <div className="flex items-center"><Tag className="w-4 h-4 mr-2 text-gray-500" /> <strong>Campaign:</strong> <span className="ml-2">{lead.campaign || 'N/A'}</span></div>
                <div className="flex items-center"><Search className="w-4 h-4 mr-2 text-gray-500" /> <strong>Search Keyword:</strong> <span className="ml-2">{lead.search_keyword || 'N/A'}</span></div>
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-gray-500" /> <strong>Created:</strong> <span className="ml-2">{new Date(lead.created_at).toLocaleString()}</span></div>
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-gray-500" /> <strong>Updated:</strong> <span className="ml-2">{new Date(lead.updated_at).toLocaleString()}</span></div>
                <div className="flex items-start"><MessageSquare className="w-4 h-4 mr-2 mt-1 text-gray-500" /> <strong>Message:</strong> <p className="ml-2">{lead.message || 'N/A'}</p></div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
             <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Remarks</span>
                  <LeadRemarksEditor 
                    leadId={lead.id} 
                    remarks={lead.remarks}
                    onRemarksChange={handleRemarksChange} 
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {remarks.length > 0 ? (
                  <ul className="space-y-4">
                    {remarks.map(remark => (
                      <li key={remark.id} className="border-b pb-2">
                        <p className="text-sm">{remark.remark}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(remark.created_at).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No remarks yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailPage;

