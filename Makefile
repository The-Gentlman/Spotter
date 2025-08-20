PROJECT_NAME = spotter-test
COMPOSE_FILE = docker-compose.dev.yml
MANAGE_CMD = docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) exec backend python manage.py

up:
	@docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) up -d --build

down:
	@docker compose -f $(COMPOSE_FILE) -p $(PROJECT_NAME) down -v

migrate:
	@$(MANAGE_CMD) makemigrations 
	@$(MANAGE_CMD) migrate 
	@echo "Migrations completed."

shell:
	$(MANAGE_CMD) shell

dbshell:
	$(MANAGE_CMD) dbshell

clean:
	@read -p "Are you sure? (y/N): " ans; \
	if [ "$$ans" = "y" ]; then \
		docker compose -p ${PROJECT_NAME} down --volumes; \
	else \
		echo "Aborted"; \
	fi
