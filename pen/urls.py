from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("register", views.register, name="register"),
    path("login", views.logIn, name="login"),
    path("logout", views.logOut, name="logout"),
    path("profile", views.profile, name="profile"),
    path("likes", views.likesList, name="likes"),
    path("files", views.files, name="files"),

    
    path("view/<str:name>/<str:creator>", views.fullPage, name="fullPage"),


    # API
    path("editFile", views.editFile, name="editFile"),
]