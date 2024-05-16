from django.urls import path
from . import views

urlpatterns = [
    path('', views.frontend),
    path("get_records/", views.get_records),
]
