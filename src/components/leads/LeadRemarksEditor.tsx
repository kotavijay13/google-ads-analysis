
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageCircle, Save } from 'lucide-react';

interface LeadRemarksEditorProps {
  remarks: string | null;
  leadId: string;
  onRemarksChange: (leadId: string, remarks: string) => void;
}

const LeadRemarksEditor = ({ remarks, leadId, onRemarksChange }: LeadRemarksEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentRemarks, setCurrentRemarks] = useState(remarks || '');

  const handleSave = () => {
    onRemarksChange(leadId, currentRemarks);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MessageCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Remarks</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Add your feedback or notes here..."
            value={currentRemarks}
            onChange={(e) => setCurrentRemarks(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadRemarksEditor;
