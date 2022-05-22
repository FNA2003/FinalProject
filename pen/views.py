from django.http import HttpResponse
from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.urls import reverse


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

        for i in User.objects.values_list("username"):
            if i[0] == request.POST["user"]:
                return render(request, "pen/register.html", { "message":"The username is taken" })  

        newUser = User(username=request.POST["user"], email=request.POST["email"], password=request.POST["password"])

        if newUser.userValidations() != True:
            return render(request, "pen/register.html", { "message":"Any of the fields were modified" })

        newUser.save()
        login(request, newUser)

        return HttpResponseRedirect(reverse("index"))


def logIn(request):
    if request.method == "GET":
        return render(request, "pen/logIn.html")
    elif request.method == "POST":
        if "user" not in request.POST or "password" not in request.POST:
            return render(request, "pen/logIn.html", {"message":"AN INPUT('S) WAS NOT PROVIDED"})

        password = request.POST["password"]
        username = request.POST["user"]

        user = authenticate(request, username=username, password=password)

        # The user is always None, why?

        return HttpResponseRedirect(reverse("index"))



@login_required(login_url="/login")
def logOut(request):

    logout(request)
    return HttpResponseRedirect(reverse("index"))
