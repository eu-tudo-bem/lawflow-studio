
# Adicionar ancora nos links do Blog no Header e Footer

## O que sera feito
Adicionar a ancora `#conteudo` nos links do Blog no menu (Header) e no rodape (Footer), e inserir um `id="conteudo"` na secao principal de artigos da pagina Blog.tsx. Assim, ao clicar nos links, a pagina rola automaticamente ate o conteudo, igual ao comportamento dos simuladores com `#simulador`.

## Alteracoes

### 1. `src/pages/Blog.tsx`
- Adicionar `id="conteudo"` na secao principal onde ficam os artigos (abaixo do hero/headline)
- Adicionar `useEffect` para scroll automatico quando houver `#conteudo` na URL (mesmo padrao usado nos simuladores)

### 2. `src/components/landing/Header.tsx`
- Alterar links do Blog de `/blog` para `/blog#conteudo` (desktop e mobile)

### 3. `src/components/landing/Footer.tsx`
- Alterar todos os links do Blog de `/blog` e `/blog?categoria=...` para incluir `#conteudo` (ex: `/blog?categoria=direito-trabalhista#conteudo`)
- Incluir o link geral `/blog#conteudo` no rodape
