# manage.py

import os
from flask_script import Manager # class for handling a set of commands
from flask_migrate import Migrate, MigrateCommand
from project.app import db, create_app
#from app import models

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.config.settings')
app = create_app()
migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)


if __name__ == '__main__':
    manager.run()