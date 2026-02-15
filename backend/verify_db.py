from app.database import engine
from sqlmodel import SQLModel, select
from app.models import User
import sys
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def verify():
    # Attempt to create tables (this verifies connectivity and model definition)
    try:
        logger.info("Attempting to create database tables...")
        SQLModel.metadata.create_all(engine)
        logger.info("Tables created (or verified existing).")
        print("Verification Successful: Database connected and models registered.")
    except Exception as e:
        logger.error(f"Verification Failed: {e}")
        print(f"Verification Failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    verify()
