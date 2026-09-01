from rest_framework.permissions import BasePermission, IsAuthenticated


class EhAutenticado(IsAuthenticated):
    message = "Você não está autênticado!"


class IsSindico(BasePermission):
    message = "Você não está autenticado como sindíco!"

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False 

        return request.user.is_sindico or request.user.is_staff
 