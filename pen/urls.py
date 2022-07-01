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
    path("edit/<str:fileName>", views.edit, name="edit"),


    # API
    path("editFile", views.editFile, name="editFile"),
    path("likeFile", views.likeFile, name="likeFile"),
    path("getPosts/<int:lastId>", views.getPosts, name="getPosts"),
    path("getPostsLikes/<int:lastId>", views.getMoreLikedPosts, name="getPostsLikes"),
    path("getPostsFiles/<int:lastId>", views.getPostsFiles, name="getPostsFiles"),
    path("saveFile", views.saveFile, name="saveFile"),
]