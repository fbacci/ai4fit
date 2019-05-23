from django.urls import path

from . import views

app_name = 'ai4fitapp'
urlpatterns = [
    path('', views.loginUser, name='loginUser'),
    path('logout/', views.logoutUser, name='logoutUser'),
    path('home/', views.home, name='home'),
    path('index/', views.index, name='index'),
    path('ask/', views.askInfo, name='askInfo'),
    path('ask/infodataset', views.infodataset, name='infodataset'),
    path('index/training/', views.training, name='training')
]

