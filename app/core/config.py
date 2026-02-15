from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class AppSettings(BaseSettings):
    postgres_user: str
    postgres_password: str
    postgres_host: str
    postgres_port: int
    postgres_db: str

    prod: bool = False

    def get_postgres_url(self):
        ssl_part = "?sslmode=require" if self.prod else ""
        return f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}{ssl_part}"

    model_config = {"env_file": ".env", "extra": "ignore"}

    # Google smtp that's responsible for sending emails
    smtp_host: str
    smtp_port: str
    smtp_user: str
    smtp_password: str


settings = AppSettings()
