
-- Trigger para atualizar sitemap quando um blog post for inserido
CREATE OR REPLACE TRIGGER trigger_sitemap_on_blog_insert
AFTER INSERT ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.trigger_sitemap_update();

-- Trigger para atualizar sitemap quando um post for publicado (status muda para 'published')
CREATE OR REPLACE TRIGGER trigger_sitemap_on_blog_update
AFTER UPDATE OF status ON public.blog_posts
FOR EACH ROW
WHEN (NEW.status = 'published' AND OLD.status IS DISTINCT FROM 'published')
EXECUTE FUNCTION public.trigger_sitemap_update();
