# exam-guardrial/backend/config.py

import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load .env.backend from the parent directory
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env.backend"))

class Settings(BaseSettings):
    anthropic_api_key: str
    supabase_url: str
    supabase_key: str
    supabase_service_key: str
    jwt_secret: str = 'changeme'
    environment: str = 'development'
    port: int = 8000

    class Config:
        env_file = ".env.backend" # This will search for .env.backend starting from the CWD

settings = Settings()
