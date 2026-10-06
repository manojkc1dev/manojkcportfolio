"""
Custom DRF Permission Classes for Manoj KC Portfolio.

Provides a single explicit permission class for administrative operations.
All admin mutation endpoints must use IsPortfolioAdmin rather than raw
IsAuthenticated so that:
  1. The permission intent is self-documenting.
  2. Staff flag is enforced at the DRF layer — not just the Django admin.
  3. Future role changes (e.g., adding a read-only reviewer) require
     touching only this module, not every individual view.
"""
from rest_framework.permissions import BasePermission


class IsPortfolioAdmin(BasePermission):
    """
    Grants access only to authenticated users with `is_staff=True`.

    This is appropriate for a single-administrator personal portfolio.
    All administrative mutation operations (create/update/delete on
    Projects, Inquiries, and future content types) must require this
    permission class.

    Security properties:
    - Unauthenticated requests → 401 Unauthorized.
    - Authenticated non-staff requests → 403 Forbidden.
    - Authenticated staff requests → allowed.
    """

    message = 'Administrator access required.'

    def has_permission(self, request, view) -> bool:
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.is_staff
        )
