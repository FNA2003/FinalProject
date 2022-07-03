# Django way to manage path and urls
from django.urls import path

# My functions for the corresponding paths
from . import views

urlpatterns = [
    # The "basic" urls
    path("", views.index, name="index"),
    path("register", views.register, name="register"),
    path("login", views.logIn, name="login"),
    path("logout", views.logOut, name="logout"),

    # Kind of specific urls
    path("profile", views.profile, name="profile"),
    path("likes", views.likesList, name="likes"),
    path("files", views.files, name="files"),

    # The sense of all of this
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