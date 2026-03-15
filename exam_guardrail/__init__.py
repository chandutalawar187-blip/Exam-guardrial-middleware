# exam_guardrail — Exam Proctoring Middleware
# Drop-in middleware for any FastAPI-based exam platform.
#
# Usage:
#   from exam_guardrail import init_guardrail, GuardrailConfig
#
#   config = GuardrailConfig(
#       supabase_url="...",
#       supabase_key="...",
#       anthropic_api_key="...",       # optional
#       admin_username="admin",
#       admin_password="secret",
#   )
#   init_guardrail(app, config)
#
# This mounts all proctoring routes under /api/* and adds CORS middleware.

from exam_guardrail.config import GuardrailConfig
from exam_guardrail.core import init_guardrail

__all__ = ["init_guardrail", "GuardrailConfig"]
__version__ = "1.0.0"
