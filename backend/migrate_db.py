import sys
import logging
from sqlalchemy import text
from app.database import engine, Base
# Import all models to ensure they are registered with Base
from app.models import AdminUser, Project, Experience, Skill, CV, Review, ReviewInvitation, BlogPost

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("migration")

def migrate():
    logger.info("🚀 Starting database migration (Direct SQL Method)...")
    
    try:
        # 1. Ensure all tables exist
        logger.info("📦 Step 1: Creating missing tables...")
        Base.metadata.create_all(bind=engine)
        
        # 2. Add columns using native SQL (IF NOT EXISTS for Postgres)
        # Note: SQLite doesn't support IF NOT EXISTS for columns, so we use a try-except per column.
        is_sqlite = engine.url.drivername == 'sqlite'
        
        migrations = [
            ("projects", "title_en", "VARCHAR(150)"),
            ("projects", "description_en", "TEXT"),
            ("experiences", "position_en", "VARCHAR(150)"),
            ("experiences", "description_en", "TEXT"),
            ("experiences", "location_en", "VARCHAR(150)"),
            ("skills", "name_en", "VARCHAR(100)"),
            ("skills", "category_en", "VARCHAR(100)"),
            ("reviews", "author_role_en", "VARCHAR(150)"),
            ("reviews", "content_en", "TEXT"),
            ("blog_posts", "title_en", "VARCHAR(300)"),
            ("blog_posts", "excerpt_en", "VARCHAR(500)"),
            ("blog_posts", "content_en", "TEXT"),
        ]

        logger.info("🔧 Step 2: Adding missing columns...")
        with engine.begin() as conn:
            for table, column, col_type in migrations:
                if is_sqlite:
                    # SQLite: no 'IF NOT EXISTS' for ADD COLUMN, so we try and catch
                    try:
                        conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {column} {col_type}"))
                        logger.info(f"✅ Table {table}: added {column}")
                    except Exception as e:
                        if "duplicate column name" in str(e).lower():
                            logger.debug(f"ℹ️  Table {table}: column {column} already exists.")
                        else:
                            logger.error(f"❌ Table {table}: error adding {column}: {e}")
                else:
                    # PostgreSQL (and others): 'IF NOT EXISTS' is supported and much cleaner
                    try:
                        sql = f"ALTER TABLE {table} ADD COLUMN IF NOT EXISTS {column} {col_type}"
                        conn.execute(text(sql))
                        logger.info(f"✅ Executed: {sql}")
                    except Exception as e:
                        logger.error(f"❌ Failed to execute migration for {table}.{column}: {e}")
                    
        logger.info("✨ Migration process finished successfully!")
        
    except Exception as e:
        logger.error(f"💥 Migration failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    migrate()
