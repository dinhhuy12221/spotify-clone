from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to the Music Project!")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/app/', include('app.urls')),
    path('', home),
]
