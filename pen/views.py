import re
from django.http import HttpResponse
from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.db import IntegrityError


from .models import *

# Create your views here.
def index(request):
    return render(request, "pen/index.html")


def register(request):
    if request.method == "GET":
        return render(request, "pen/register.html")
    elif request.method == "POST":
        if ("user" not in request.POST or "email" not in request.POST or "password" 
            not in request.POST or "confirm" not in request.POST):
            return render(request, "pen/register.html", { "message":"You have to complete all of the fields" })
        
        if (request.POST["password"] != request.POST["confirm"]):
            return render(request, "pen/register.html", { "message":"The passwords must match" })

        try:
            username = request.POST["user"]
            password = request.POST["password"]
            email = request.POST["email"]
            user = User.objects.create_user(username, email, password)


            if user.userValidations() != True:
                return render(request, "pen/register.html", { "message":"Any of the fields were modified" })

        except IntegrityError:
            return render(request, "pen/register.html", { "message":"The username is taken" })  


        login(request, user)

        return HttpResponseRedirect(reverse("index"))


def logIn(request):
    if request.method == "GET":
        return render(request, "pen/logIn.html")
    elif request.method == "POST":
        if "user" not in request.POST or "password" not in request.POST:
            return render(request, "pen/logIn.html", {"message":"An input was not provided"})

        pas = request.POST["password"]
        ur = request.POST["user"]
        
        user = authenticate(username=ur, password=pas)
        
        if user is not None:
            login(request, user)
        else:
            return render(request, "pen/logIn.html", {"message":"The user is not in the database"})

        return HttpResponseRedirect(reverse("index"))



@login_required(login_url="/login")
def logOut(request):

    logout(request)
    return HttpResponseRedirect(reverse("index"))
