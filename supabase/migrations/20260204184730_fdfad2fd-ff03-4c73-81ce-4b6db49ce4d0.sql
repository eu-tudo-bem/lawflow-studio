-- Add 'client' role to the enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'client';

-- Add user_id column to clients table to link with auth.users
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_clients_user_id ON public.clients(user_id);

-- Create messages table for client-lawyer communication
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id uuid NOT NULL,
    receiver_id uuid NOT NULL,
    client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
    case_id uuid REFERENCES public.cases(id) ON DELETE SET NULL,
    content text NOT NULL,
    read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view messages they sent or received
CREATE POLICY "Users can view own messages"
ON public.messages FOR SELECT
TO authenticated
USING (sender_id = auth.uid() OR receiver_id = auth.uid());

-- RLS: Users can send messages
CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (sender_id = auth.uid());

-- RLS: Users can mark their received messages as read
CREATE POLICY "Users can update received messages"
ON public.messages FOR UPDATE
TO authenticated
USING (receiver_id = auth.uid());

-- Update clients RLS: Clients can view their own record
CREATE POLICY "Clients can view their own record"
ON public.clients FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Update appointments RLS: Clients can view their own appointments
CREATE POLICY "Clients can view their own appointments"
ON public.appointments FOR SELECT
TO authenticated
USING (
    client_id IN (
        SELECT id FROM public.clients WHERE user_id = auth.uid()
    )
);

-- Clients can create appointments for themselves
CREATE POLICY "Clients can create their own appointments"
ON public.appointments FOR INSERT
TO authenticated
WITH CHECK (
    client_id IN (
        SELECT id FROM public.clients WHERE user_id = auth.uid()
    )
);

-- Update cases RLS: Clients can view their own cases
CREATE POLICY "Clients can view their own cases"
ON public.cases FOR SELECT
TO authenticated
USING (
    client_id IN (
        SELECT id FROM public.clients WHERE user_id = auth.uid()
    )
);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;