import os

from project.app import create_app

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)