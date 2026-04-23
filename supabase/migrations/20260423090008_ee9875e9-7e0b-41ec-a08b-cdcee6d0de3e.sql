CREATE TABLE public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  poster_name text NOT NULL,
  poster_country text DEFAULT 'Kenya',
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'Research',
  budget numeric NOT NULL CHECK (budget > 0),
  currency text NOT NULL DEFAULT 'KES',
  due_date date,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tasks are viewable by everyone"
  ON public.tasks FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create tasks"
  ON public.tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = poster_id);

CREATE POLICY "Posters can update own tasks"
  ON public.tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = poster_id);

CREATE POLICY "Posters or admins can delete tasks"
  ON public.tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = poster_id OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.tasks (poster_name, poster_country, title, description, category, budget, due_date) VALUES
  ('Brooklyn Reed', 'United States', 'Discuss how poor coordination between government agencies affects service delivery.', 'Explain how lack of cooperation leads to delays and inefficiency.', 'Research', 2400, (CURRENT_DATE + INTERVAL '8 days')),
  ('Austin Murphy', 'United States', 'Discuss how water scarcity affects industrial production in urban areas.', 'Analyze the impact of limited water supply on manufacturing output.', 'Research', 2500, (CURRENT_DATE + INTERVAL '10 days')),
  ('Penelope Clark', 'United Kingdom', 'Analyze the role of sports academies in nurturing talent in Kenya.', 'Discuss how academies contribute to identifying and developing young athletes.', 'Analysis', 2200, (CURRENT_DATE + INTERVAL '12 days')),
  ('Mila Roberts', 'Canada', 'Discuss how poor market infrastructure affects small-scale traders.', 'Examine the challenges traders face due to inadequate market facilities.', 'Research', 2700, (CURRENT_DATE + INTERVAL '7 days')),
  ('Xavier Turner', 'United States', 'Analyze the effects of political instability on foreign investment inflows.', 'Discuss investor confidence and capital flows in unstable regimes.', 'Analysis', 1800, (CURRENT_DATE + INTERVAL '9 days')),
  ('Luna Mitchell', 'Australia', 'Discuss how lack of career guidance affects student subject choices in schools.', 'Explore the long-term consequences of poor academic counseling.', 'Research', 2200, (CURRENT_DATE + INTERVAL '11 days')),
  ('Cameron Adams', 'United Kingdom', 'Discuss how election cycles influence economic stability in Kenya.', 'Analyze how political transitions impact markets and policy.', 'Research', 1900, (CURRENT_DATE + INTERVAL '14 days'));