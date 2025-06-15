
-- Add search_keyword column to the leads table if it doesn't exist
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS search_keyword TEXT NULL;

-- Create a table to store the history of lead remarks if it doesn't exist
CREATE TABLE IF NOT EXISTS public.lead_remarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID,
  remark TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key to auth.users if it doesn't exist
DO $$
BEGIN
   IF NOT EXISTS (
       SELECT 1 FROM pg_constraint
       WHERE conname = 'lead_remarks_user_id_fkey' AND conrelid = 'public.lead_remarks'::regclass
   ) THEN
       ALTER TABLE public.lead_remarks ADD CONSTRAINT lead_remarks_user_id_fkey
       FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
   END IF;
END;
$$;

-- Add a comment to describe the new table
COMMENT ON TABLE public.lead_remarks IS 'Stores historical remarks for leads.';

-- Enable Row-Level Security on the new table
ALTER TABLE public.lead_remarks ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies for the new lead_remarks table to be safe
DROP POLICY IF EXISTS "Users can view remarks for their own leads" ON public.lead_remarks;
CREATE POLICY "Users can view remarks for their own leads"
ON public.lead_remarks FOR SELECT
USING (EXISTS (SELECT 1 FROM leads WHERE leads.id = lead_remarks.lead_id));

DROP POLICY IF EXISTS "Users can create remarks for their own leads" ON public.lead_remarks;
CREATE POLICY "Users can create remarks for their own leads"
ON public.lead_remarks FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (SELECT 1 FROM leads WHERE leads.id = lead_remarks.lead_id)
);
