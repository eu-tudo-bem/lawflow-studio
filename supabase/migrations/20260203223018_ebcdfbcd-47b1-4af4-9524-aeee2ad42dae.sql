-- 1. Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'staff');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'staff',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 3. Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Create security definer function to check roles (avoids recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. Drop existing permissive policies on clients
DROP POLICY IF EXISTS "Authenticated users can view clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can create clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can update clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can delete clients" ON public.clients;

-- 7. Create proper RLS policies for clients (admin or owner)
CREATE POLICY "Users can view own clients or admins all"
ON public.clients FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') 
  OR created_by = auth.uid()
);

CREATE POLICY "Users can create clients"
ON public.clients FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own clients or admins all"
ON public.clients FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') 
  OR created_by = auth.uid()
);

CREATE POLICY "Admins can delete clients"
ON public.clients FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 8. Drop existing permissive policies on cases
DROP POLICY IF EXISTS "Authenticated users can view cases" ON public.cases;
DROP POLICY IF EXISTS "Authenticated users can create cases" ON public.cases;
DROP POLICY IF EXISTS "Authenticated users can update cases" ON public.cases;
DROP POLICY IF EXISTS "Authenticated users can delete cases" ON public.cases;

-- 9. Create proper RLS policies for cases
CREATE POLICY "Users can view assigned cases or admins all"
ON public.cases FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') 
  OR assigned_to = auth.uid()
  OR client_id IN (SELECT id FROM public.clients WHERE created_by = auth.uid())
);

CREATE POLICY "Users can create cases for own clients"
ON public.cases FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin')
  OR client_id IN (SELECT id FROM public.clients WHERE created_by = auth.uid())
);

CREATE POLICY "Users can update assigned cases or admins all"
ON public.cases FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') 
  OR assigned_to = auth.uid()
);

CREATE POLICY "Admins can delete cases"
ON public.cases FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 10. Drop existing permissive policies on appointments
DROP POLICY IF EXISTS "Authenticated users can view appointments" ON public.appointments;
DROP POLICY IF EXISTS "Authenticated users can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Authenticated users can update appointments" ON public.appointments;
DROP POLICY IF EXISTS "Authenticated users can delete appointments" ON public.appointments;

-- 11. Create proper RLS policies for appointments
CREATE POLICY "Users can view assigned appointments or admins all"
ON public.appointments FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') 
  OR assigned_to = auth.uid()
  OR client_id IN (SELECT id FROM public.clients WHERE created_by = auth.uid())
);

CREATE POLICY "Users can create appointments for own clients"
ON public.appointments FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin')
  OR client_id IN (SELECT id FROM public.clients WHERE created_by = auth.uid())
);

CREATE POLICY "Users can update assigned appointments or admins all"
ON public.appointments FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') 
  OR assigned_to = auth.uid()
);

CREATE POLICY "Admins can delete appointments"
ON public.appointments FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 12. Create trigger to assign default 'staff' role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'staff');
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_role
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();