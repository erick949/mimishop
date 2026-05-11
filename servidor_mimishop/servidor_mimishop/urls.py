from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def health(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path('admin/', admin.site.urls),

    path('health/', health),

    path('api/clients/', include('clients.urls')),
    path('api/users/', include('users.urls')),
    path('api/products/', include('products.urls')),
    path('api/providers/', include('providers.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/logistics/', include('logistics.urls')),
    path('api/payments/', include('payments.urls')),
]