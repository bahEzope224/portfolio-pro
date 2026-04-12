import sys
import os
from sqlalchemy import text, inspect
from app.database import engine, Base
# Import models to ensure they are registered with Base
from app.models import AdminUser, Project, Experience, Skill, CV, Review, ReviewInvitation, BlogPost

def migrate():
    print("🚀 Starting database migration...")
    
    # First, create all tables if they don't exist
    print("📦 Creating missing tables...")
    Base.metadata.create_all(bind=engine)
    
    # List of columns to add: (table_name, column_name, column_type)
    migrations = [
        # Projects
        ("projects", "title_en", "VARCHAR(150)"),
        ("projects", "description_en", "TEXT"),
        
        # Experiences
        ("experiences", "position_en", "VARCHAR(150)"),
        ("experiences", "description_en", "TEXT"),
        ("experiences", "location_en", "VARCHAR(150)"),
        
        # Skills
        ("skills", "name_en", "VARCHAR(100)"),
        ("skills", "category_en", "VARCHAR(100)"),
        
        # Reviews
        ("reviews", "author_role_en", "VARCHAR(150)"),
        ("reviews", "content_en", "TEXT"),
        
        # Blog Posts
        ("blog_posts", "title_en", "VARCHAR(300)"),
        ("blog_posts", "excerpt_en", "VARCHAR(500)"),
        ("blog_posts", "content_en", "TEXT"),
    ]

    inspector = inspect(engine)
    
    with engine.connect() as conn:
        for table, column, col_type in migrations:
            # Check if table exists
            if not inspector.has_table(table):
                print(f"⚠️  Table {table} does not exist? skipping.")
                continue
                
            # Check if column exists
            columns = [c['name'] for c in inspector.get_columns(table)]
            if column not in columns:
                print(f"➕ Adding column {column} to table {table}...")
                try:
                    conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {column} {col_type}"))
                    conn.commit()
                    print(f"✅ Successfully added {column}")
                except Exception as e:
                    print(f"❌ Error adding {column}: {e}")
            else:
                print(f"ℹ️  Column {column} already exists in {table}, skipping.")
                
    print("\n✨ Migration complete!")

if __name__ == "__main__":
    migrate()
