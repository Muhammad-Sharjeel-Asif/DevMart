from sqlmodel import create_engine, Session
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Use DATABASE_URL from environment variables
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Create engine with echo=True for debugging
# Ensure arguments are compatible with the connection string (e.g., check_same_thread for sqlite)
engine = create_engine(DATABASE_URL, echo=True)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_session():
    """Dependency for getting DB session"""
    with Session(engine) as session:
        yield session


# Alternative dependency using SQLModel's Session
def get_sqlmodel_session():
    """SQLModel session dependency"""
    with Session(engine) as session:
        yield session