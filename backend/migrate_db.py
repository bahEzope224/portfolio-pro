import sys
import os
import logging
from sqlalchemy import text, inspect
from app.database import engine, Base
# Import all models to ensure they are registered with Base
from app.models import AdminUser, Project, Experience, Skill, CV, Review, ReviewInvitation, BlogPost

# Setup logging to see output in Render logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("migration")

def migrate():
    logger.info("🚀 Starting database migration...")
    
    try:
        # First, ensure all tables exist
        logger.info("📦 Creating missing tables (if any)...")
        Base.metadata.create_all(bind=engine)
        
        # List of columns to add: (table_name, column_name, column_type)
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

        # Use begin() to ensure everything is committed properly in PostgreSQL
        with engine.begin() as conn:
            # Important: Get inspector INSIDE the connection to have fresh state
            inspector = inspect(conn)
            
            for table, column, col_type in migrations:
                # Check if table exists
                if not inspector.has_table(table):
                    logger.warning(f"⚠️  Table {table} does not exist yet. Skipping column {column}.")
                    continue
                    
                # Check if column exists
                columns = [c['name'] for c in inspector.get_columns(table)]
                if column not in columns:
                    logger.info(f"➕ Adding column {column} to table {table}...")
                    try:
                        conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {column} {col_type}"))
                        logger.info(f"✅ Successfully added {column}")
                    except Exception as e:
                        logger.error(f"❌ Error adding {column} to {table}: {e}")
                else:
                    logger.debug(f"ℹ️  Column {column} already exists in {table}.")
                    
        logger.info("\n✨ Migration complete!")
        
    except Exception as e:
        logger.error(f"💥 Migration failed: {e}")
        # On Render, we might want to exit with 0 to allow the app to try to start anyway,
        # but exit with 1 is better for visibility of failure.
        sys.exit(1)

if __name__ == "__main__":
    migrate()
