"""Lowercase all existing usernames

Revision ID: f9a17c2b8e3d
Revises: ec44611e62c4
Create Date: 2025-09-30 18:45:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'f9a17c2b8e3d'
down_revision = 'ec44611e62c4'
branch_labels = None
depends_on = None


def upgrade():
    # Normalize existing usernames to lowercase
    op.execute(sa.text("""
        UPDATE accounts
        SET username = lower(username)
        WHERE username <> lower(username)
    """))


def downgrade():
    # Irreversible data migration (original casing cannot be reconstructed)
    pass