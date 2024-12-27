# Configurações GLPI

Após subir o backup da base de dados antiga do GLPI, deverá realizar uma série de configurações.

## 1 - Configurar o perfil self-service
Na aba Administração > Perfis > Self-Service
- 1.1 - Alterar interface do perfil de "Interface simplificada" para "Interface padrão".
![image](https://github.com/user-attachments/assets/d2a5f27e-dd40-4d3e-b75e-13abaef7d11b)

- 1.2 - Na aba Todos mostrará todas as sessões e suas permissões, altere de acordo com as imagens abaixo:
   Chamados
![image](https://github.com/user-attachments/assets/4b8ec413-d0fa-4205-ad28-708cf2175dd9)

- Acompanhamento/tarefas
![image](https://github.com/user-attachments/assets/bcc07caf-7954-4c5a-ac18-8c34a60aba00)

- Gerência
![image](https://github.com/user-attachments/assets/c2304844-377c-4ed9-9afa-adab789284d9)

- Administração
![image](https://github.com/user-attachments/assets/90ffb99e-813f-4ccc-9929-d54701a441e1)

- Configurar
![image](https://github.com/user-attachments/assets/7e5081ac-de93-4a6c-a924-0596a533d21e)

## 2 - Configuração de listagens. 
- 2.1 - Listagem de usuários, vá até a aba Administração > Usuários.
 - Nessa tela, procure o ícone:
![image](https://github.com/user-attachments/assets/e76bd94e-40ab-42bf-a3b9-0dbe945e4264)

- Clicando no ícone abrirá um modal para configurar as colunas que serão exibidas na listagem, use a configuração a seguir: 
![image](https://github.com/user-attachments/assets/c98c666d-dc5a-4a3f-8bf5-230eb352c477)


- 2.2 - Listagem de chamados, vá até a aba Assitência > Chamados.
 - Procure o mesmo ícone informado anteriormente e configure as seguintes colunas para exibição:
![image](https://github.com/user-attachments/assets/8e820cc5-3041-4900-a4ab-940c777c737a)
![image](https://github.com/user-attachments/assets/2830a2c9-a71d-4f88-836e-e5eaf5e89494)

- 2.3 - Listagem de documentos, vá até a aba Gerência > Documentos
 - Procure o mesmo ícone informado anteriormente e configure as seguintes colunas para exibição:
![image](https://github.com/user-attachments/assets/4448f694-91e9-4c47-90d8-6802afb2ff6e)



## 3 - Configuração da Pesquisa de Satisfação
### A pesquisa de satisfação é necessária para que as avaliações dos chamados sejam possíveis, para isso deve-se realizar uma configuração no painel de administração do GLPI.

- 3.1 - Pesquisa de satisfação, vá até a aba Adminstração > Entidades > [SUA ENTIDADE] > Assistência > Configurando a pesquisa de satisfação (ultima sessão).
Realize as seguintes alterações
Configurando a pesquisa de satisfação: Pesquisa Interna
Criar pesquisa após: O mais breve possível
Taxa para ativar pesquisa: 100%
Duração da pesquisa: Não especificado
- 3.2 - Ação automática, vá até a aba Configurar > Ações automáticas > procure por [createInquest], entre para configurar.
Frequência de execução: 5 minutos
Status: Agendado
Modo de execução: CLI
Período de execução: 0 -> 24
