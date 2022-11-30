up:
	docker-compose up -d

logs:
	docker-compose logs -f

down:
	docker-compose down --volumes

nginx_bash:
	docker-compose exec nginx bash

frontend_bash:
	docker-compose exec frontend bash

backend_bash:
	docker-compose exec backend bash

db_bash:
	docker-compose exec db bash
