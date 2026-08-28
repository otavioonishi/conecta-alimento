# Conecta Alimento

Crie um sistema web chamado "ConectaAlimento" (MVP acadêmico para TCC), plataforma de doação de alimentos conectando ESTABELECIMENTOS DOADORES a INSTITUIÇÕES SOCIAIS.

STACK: React + Vite + JavaScript puro (não TypeScript), sem Next.js. CSS puro/CSS Modules/Tailwind, mantendo simples. Rotas com React Router. Persistência via localStorage através de um serviço centralizado (storageService.js) — SEM back-end real neste momento (apenas organizar o código para futura migração a Node/Express/PostgreSQL). Estrutura de pastas simples: src/components, src/pages, src/services, src/utils, App.jsx, main.jsx. Evitar overengineering, componentes sem uso, arquivos de documentação/testes/Docker/CI desnecessários. Projeto deve rodar com `npm install` && `npm run dev`.

TIPOS DE USUÁRIO: donor (doador), institution (instituição), admin.

FLUXO PRINCIPAL: Doador cria doação (status Disponível) → Instituição solicita (status solicitação Aguardando) → Doador aceita (doação vira Reservada, solicitação Aprovada, demais solicitações daquela doação são recusadas/bloqueadas) ou recusa → Após retirada, doador marca Concluída (doação e solicitação ficam Concluída) → doação some da lista de disponíveis. Doações vencidas (validade passada) devem aparecer como Expiradas ao carregar os dados (sem job em background). Regras: instituição não pode solicitar a mesma doação duas vezes; doação Concluída/Cancelada/Expirada não pode ser solicitada.

STATUS: Doação: Disponível, Reservada, Concluída, Cancelada, Expirada. Solicitação: Aguardando, Aprovada, Recusada, Cancelada, Concluída.

MODELO DE DADOS (mesmo que simulado): USERS(id,name,email,password,role,phone,createdAt), DONORS(id,userId,businessName,businessType,cnpj,address,city,state), INSTITUTIONS(id,userId,institutionName,institutionType,description,address,city,state), DONATIONS(id,donorId,foodName,category,quantity,unit,expirationDate,pickupDeadline,description,notes,address,city,status,createdAt), REQUESTS(id,donationId,institutionId,status,createdAt,approvedAt,completedAt).

TELAS/ROTAS:
- "/" Landing page moderna: headline "Alimento que sobra para alguns pode fazer diferença para outros.", subheadline "Conectamos estabelecimentos que possuem alimentos disponíveis a instituições sociais que precisam deles.", botões "Quero doar alimentos" e "Sou uma instituição", seção como funciona, benefícios, impacto social, CTA final, rodapé.
- "/login" (e-mail, senha, entrar, criar conta, recuperar senha só visual).
- "/register" pergunta primeiro "Como você deseja utilizar o ConectaAlimento?" (Quero doar alimentos / Represento uma instituição), depois mostra o formulário certo. Cadastro doador: nome do responsável, nome do estabelecimento, CNPJ (opcional), e-mail, telefone, senha, endereço, cidade, estado, tipo de estabelecimento. Cadastro instituição: nome da instituição, nome do responsável, e-mail, telefone, senha, endereço, cidade, estado, tipo, descrição breve.
- "/donor/dashboard": cards (doações disponíveis, solicitações aguardando, concluídas, total aproximado doado), botão "Nova doação" em destaque, lista das últimas doações (alimento, quantidade, status, data, instituição interessada).
- "/donor/donations/new": nome do alimento, categoria (Frutas, Verduras, Legumes, Padaria, Refeições prontas, Alimentos não perecíveis, Laticínios, Outros), quantidade, unidade (kg, unidades, litros, caixas, pacotes), validade, horário limite retirada, descrição, observações, endereço (com opção de usar o cadastrado), botão "Publicar doação".
- "/donor/donations": minhas doações, permitir editar (se ainda disponível) e cancelar/remover com confirmação.
- "/donor/requests": solicitações recebidas — instituição, alimento, quantidade, data, telefone, status, botões Aceitar/Recusar, e após aceitar "Marcar como retirado".
- "/donations": lista para instituições, cards com nome, categoria, quantidade, cidade, estabelecimento, validade, horário máximo retirada, status, botão "Ver detalhes"; filtros por categoria, cidade, quantidade, mais recentes.
- "/donations/:id": detalhes completos + placeholder de foto + botão "Solicitar doação" com confirmação "Deseja solicitar esta doação?".
- "/institution/dashboard": início da instituição.
- "/institution/requests": minhas solicitações com badges (Aguardando, Aprovada, Recusada, Concluída), botão detalhes, permitir cancelar enquanto Aguardando.
- Histórico (doador e instituição): doações/solicitações concluídas.
- "/admin": dashboard com contagem de doadores, instituições, doações cadastradas, concluídas, solicitações, alimentos destinados aproximados; tabela simples de usuários com opção de bloquear/remover registros problemáticos.
- "/profile": perfil do usuário logado.

Proteção simples de rotas por tipo de usuário (donor/institution/admin), com menus diferentes para cada perfil conforme especificado.

ESTADOS VAZIOS: sempre mostrar mensagem amigável + botão de próximo passo (ex: "Nenhuma doação disponível no momento.", "Você ainda não realizou nenhuma solicitação.", "Você ainda não cadastrou nenhuma doação.").

FEEDBACK: toasts simples para ações (doação cadastrada, solicitação enviada/aprovada, doação concluída/cancelada, etc).

VALIDAÇÃO: campos obrigatórios, validação de e-mail, senha não exibida em texto puro na tela, confirmação antes de excluir/cancelar.

DESIGN: moderno, leve, profissional, transmitindo solidariedade/confiança/sustentabilidade/organização (nada infantil). Bastante espaço em branco, cards com bordas arredondadas e sombras leves, ícones, boa hierarquia visual, totalmente responsivo (desktop/tablet/celular).

DADOS INICIAIS PARA DEMO (seed no localStorage): doador "Mercado Boa Mesa" com doação de 15kg de bananas; instituição "Projeto Alimentar Esperança"; outras doações de exemplo (30 pães franceses, 10kg de tomates), variando status para demonstrar o fluxo completo.

Código deve ficar claro e didático para um aluno explicar em apresentação de TCC (evitar padrões avançados/arquitetura corporativa desnecessária). Antes de finalizar, garanta que todas as rotas funcionam, não há imports quebrados nem componentes não usados, o projeto builda/roda sem erros, e o fluxo principal (cadastro → login → criar doação → solicitar → aprovar → concluir → histórico) é demonstrável de ponta a ponta.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/caa6aeae-70d6-40b3-b151-9e3ca4217944).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
