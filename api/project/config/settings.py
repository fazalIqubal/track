import os
from sqlalchemy import create_engine, 
from sqlalchemy.orm import sessionmaker

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP_NAME='CreateX'

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET = '9xb@9g7c#m&z106@i(2srrk639la!o+$j(6p)-p#0$wyo8!i_x'

APP_SETTINGS = "development"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases
DB_NAME = "trackify"
DB_HOST = "localhost"
DB_PORT = 5432
DB_USERNAME = "postgres"
DB_PASSWORD = "1994"
# SERVICE_NAME = "orcl"
#DATABASE_URL = f"oracle+cx_oracle://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
DATABASE_URL = f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
#"postgresql://postgres:password@localhost:5432/twitter"#os.environ['DATABASE_URL']
#edit here
DATABASE_TEST_URL = "postgresql://postgres:password@localhost:5432/twitter_test"#os.environ['DATABASE_TEST_URL']
#edit here

SENDGRID_API_KEY = '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'

MEDIA_ROOT =  os.path.join(BASE_DIR, 'media') 
MEDIA_URL = '/media/'

# creting session
engine = create_engine(DATABASE_URL)
session_maker = sessionmaker(bind=engine)

# Here we are initializing a new session
session = session_maker()

# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

STATIC_URL = '/static/'
