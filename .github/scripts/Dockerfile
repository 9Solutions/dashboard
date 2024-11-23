FROM node:23-alpine3.19

WORKDIR /app

# Copia o script de inicialização para o container
COPY entrypoint.dashboard.sh /app/entrypoint.dashboard.sh
RUN chmod +x /app/entrypoint.dashboard.sh

# Define as variáveis de ambiente para o repositório Git e o branch
ENV GIT_REPO=https://github.com/9Solutions/dashboard.git
ENV GIT_BRANCH=main

# Comando para rodar a aplicação Spring Boot
CMD ["/app/entrypoint.dashboard.sh"]