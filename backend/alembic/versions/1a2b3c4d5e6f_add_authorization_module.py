"""Add authorization module

Revision ID: 1a2b3c4d5e6f
Revises: 
Create Date: 2026-01-03 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '1a2b3c4d5e6f'
down_revision = None  # Assuming this is the first or I don't know the previous. 
# Ideally I should check the previous revision, but if there are none, None is fine.
# If there are existing revisions, this might cause a multiple head issue.
# Given I saw an empty versions folder, None is correct.

branch_labels = None
depends_on = None


def upgrade() -> None:
    # Authorization Applications
    op.create_table('authorization_applications',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('organization_id', sa.String(length=36), nullable=True),
        sa.Column('application_number', sa.String(length=20), nullable=True),
        sa.Column('status', sa.Enum('DRAFT', 'DOCUMENTS_PENDING', 'FINANCIAL_REVIEW', 'CONDUCT_CHECK', 'READY_FOR_SUBMISSION', 'SUBMITTED', 'APPROVED', 'REJECTED', name='applicationstatus'), nullable=False),
        sa.Column('application_type', sa.Enum('NEW', 'RENEWAL', 'MODIFICATION', name='applicationtype'), nullable=False),
        sa.Column('nca_country', sa.String(length=2), nullable=False),
        sa.Column('eori_number', sa.String(length=20), nullable=True),
        sa.Column('solvency_status', sa.Enum('PENDING_ASSESSMENT', 'APPROVED_LIKELY', 'GUARANTEE_REQUIRED', 'REJECTION_RISK', name='solvencystatus'), nullable=True),
        sa.Column('conduct_status', sa.String(length=20), nullable=True),
        sa.Column('guarantee_required', sa.Boolean(), nullable=True),
        sa.Column('guarantee_amount_eur', sa.Numeric(precision=12, scale=2), nullable=True),
        sa.Column('guarantee_amount_local', sa.Numeric(precision=12, scale=2), nullable=True),
        sa.Column('packet_generated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('packet_expires_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('packet_storage_path', sa.String(length=255), nullable=True),
        sa.Column('packet_download_url', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ),
        sa.UniqueConstraint('application_number')
    )
    op.create_index(op.f('ix_authorization_applications_id'), 'authorization_applications', ['id'], unique=False)
    op.create_index(op.f('ix_authorization_applications_user_id'), 'authorization_applications', ['user_id'], unique=False)

    # Financial Statements
    op.create_table('financial_statements',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('application_id', sa.String(length=36), nullable=False),
        sa.Column('fiscal_year', sa.String(length=9), nullable=False),
        sa.Column('currency', sa.String(length=3), nullable=False),
        sa.Column('total_assets', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('total_liabilities', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('total_equity', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('current_assets', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('current_liabilities', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('revenue', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('operating_profit', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('net_profit', sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column('balance_sheet_path', sa.String(length=255), nullable=True),
        sa.Column('pl_statement_path', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['application_id'], ['authorization_applications.id'], ),
        sa.UniqueConstraint('application_id', 'fiscal_year', name='uq_app_fiscal_year')
    )
    op.create_index(op.f('ix_financial_statements_id'), 'financial_statements', ['id'], unique=False)

    # Solvency Assessments
    op.create_table('solvency_assessments',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('application_id', sa.String(length=36), nullable=False),
        sa.Column('solvency_status', sa.Enum('PENDING_ASSESSMENT', 'APPROVED_LIKELY', 'GUARANTEE_REQUIRED', 'REJECTION_RISK', name='solvencystatus'), nullable=False),
        sa.Column('debt_to_equity_ratios', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('current_ratios', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('operating_margins', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('latest_debt_to_equity', sa.Float(), nullable=True),
        sa.Column('latest_current_ratio', sa.Float(), nullable=True),
        sa.Column('latest_operating_margin', sa.Float(), nullable=True),
        sa.Column('trend', sa.String(length=20), nullable=True),
        sa.Column('guarantee_required', sa.Boolean(), nullable=True),
        sa.Column('guarantee_amount_eur', sa.Numeric(precision=12, scale=2), nullable=True),
        sa.Column('guarantee_amount_local', sa.Numeric(precision=12, scale=2), nullable=True),
        sa.Column('guarantee_calculation', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('recommendation', sa.Text(), nullable=True),
        sa.Column('calculated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['application_id'], ['authorization_applications.id'], )
    )
    op.create_index(op.f('ix_solvency_assessments_id'), 'solvency_assessments', ['id'], unique=False)

    # Conduct Declarations
    op.create_table('conduct_declarations',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('application_id', sa.String(length=36), nullable=False),
        sa.Column('question_id', sa.String(length=10), nullable=False),
        sa.Column('question_text', sa.Text(), nullable=True),
        sa.Column('answer', sa.Boolean(), nullable=False),
        sa.Column('explanation', sa.Text(), nullable=True),
        sa.Column('is_critical', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['application_id'], ['authorization_applications.id'], )
    )
    op.create_index(op.f('ix_conduct_declarations_id'), 'conduct_declarations', ['id'], unique=False)

    # Import Threshold Tracking
    op.create_table('import_threshold_tracking',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('organization_id', sa.String(length=36), nullable=True),
        sa.Column('current_quarter', sa.String(length=10), nullable=False),
        sa.Column('total_tonnage', sa.Float(), nullable=False),
        sa.Column('covered_tonnage', sa.Float(), nullable=False),
        sa.Column('non_covered_tonnage', sa.Float(), nullable=False),
        sa.Column('contains_electricity', sa.Boolean(), nullable=True),
        sa.Column('contains_hydrogen', sa.Boolean(), nullable=True),
        sa.Column('threshold_status', sa.Enum('EXEMPT', 'APPROACHING', 'CRITICAL', 'REQUIRES_AUTHORIZATION', name='thresholdstatus'), nullable=False),
        sa.Column('projected_breach_date', sa.Date(), nullable=True),
        sa.Column('last_updated', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'], ),
        sa.UniqueConstraint('user_id', 'current_quarter', name='uq_user_quarter')
    )
    op.create_index(op.f('ix_import_threshold_tracking_id'), 'import_threshold_tracking', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_import_threshold_tracking_id'), table_name='import_threshold_tracking')
    op.drop_table('import_threshold_tracking')
    op.drop_index(op.f('ix_conduct_declarations_id'), table_name='conduct_declarations')
    op.drop_table('conduct_declarations')
    op.drop_index(op.f('ix_solvency_assessments_id'), table_name='solvency_assessments')
    op.drop_table('solvency_assessments')
    op.drop_index(op.f('ix_financial_statements_id'), table_name='financial_statements')
    op.drop_table('financial_statements')
    op.drop_index(op.f('ix_authorization_applications_user_id'), table_name='authorization_applications')
    op.drop_index(op.f('ix_authorization_applications_id'), table_name='authorization_applications')
    op.drop_table('authorization_applications')
    
    # Drop enums
    op.execute("DROP TYPE IF EXISTS applicationstatus")
    op.execute("DROP TYPE IF EXISTS applicationtype")
    op.execute("DROP TYPE IF EXISTS solvencystatus")
    op.execute("DROP TYPE IF EXISTS thresholdstatus")
