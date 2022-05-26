help:
	@echo "show-container-logs - display logs for containers."
	@echo "run-local - Local environment setup with Dashboard"
	@echo "clean - cleans everything."

show-container-logs:
	@docker-compose logs -f

build-container:
	@echo "Building container..."
	@docker-compose build dashboard
	@echo "Done"

run-container: build-container
	@echo "Running dashboard..."
	@docker-compose up -d dashboard

run-services: run-container
	@echo "Starting dashboard..."

create-network:
	@echo "Creating network..."
	@docker network create arcana
	@echo "Done"

clean:
	@echo "Cleaning..."
	@docker-compose down
	@echo "Cleaned"

run-local:
	@(make create-network && make run-services) || make run-services
