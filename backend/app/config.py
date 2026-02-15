import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL")
    SECRET_KEY = os.getenv("SECRET_KEY", "changethis_secret_key_to_match_nextjs")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")

settings = Settings()
