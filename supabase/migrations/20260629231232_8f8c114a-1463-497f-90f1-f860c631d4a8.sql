
INSERT INTO public.seo_services (slug, name, short_name, icon, keyword, area, active) VALUES
('desconto-indevido-inss','Desconto Indevido no INSS','Desconto Indevido INSS','🛡️','desconto-indevido-inss','Previdenciário',true),
('consignado-nao-contratado','Empréstimo Consignado Não Contratado','Consignado Não Contratado','🏦','consignado-nao-contratado','Bancário',true),
('negativacao-indevida','Negativação Indevida','Negativação Indevida','📉','negativacao-indevida','Consumidor',true),
('cobranca-indevida','Cobrança Indevida','Cobrança Indevida','💳','cobranca-indevida','Consumidor',true),
('produto-nao-entregue','Produto Não Entregue','Produto Não Entregue','📦','produto-nao-entregue','Consumidor',true),
('direito-arrependimento','Direito de Arrependimento','Direito de Arrependimento','↩️','direito-arrependimento','Consumidor',true),
('voo-atrasado-cancelado','Voo Atrasado ou Cancelado','Voo Atrasado/Cancelado','✈️','voo-atrasado-cancelado','Consumidor',true),
('veiculo-nao-transferido','Veículo Vendido e Não Transferido','Veículo Não Transferido','🚗','veiculo-nao-transferido','Civil',true),
('fgts-nao-depositado','FGTS Não Depositado','FGTS Não Depositado','💼','fgts-nao-depositado','Trabalhista',true),
('verbas-rescisorias-nao-pagas','Verbas Rescisórias Não Pagas','Verbas Rescisórias','📄','verbas-rescisorias-nao-pagas','Trabalhista',true)
ON CONFLICT (slug) DO UPDATE SET active = true, name = EXCLUDED.name, short_name = EXCLUDED.short_name, area = EXCLUDED.area;
