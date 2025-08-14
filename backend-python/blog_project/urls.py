from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from blogs.views import CSRFTokenView, DealListCreateAPIView
from django.urls import path
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse

@ensure_csrf_cookie
def get_csrf(request):
    return JsonResponse({'detail': 'CSRF cookie set'})

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('api/python/csrf', get_csrf, name='get_csrf'),
    path('csrf/', CSRFTokenView.as_view(), name='csrf-token'),  # 新增CSRF路由
    path('api/python/deals/', DealListCreateAPIView.as_view(), name='deal-list-create'),
]


