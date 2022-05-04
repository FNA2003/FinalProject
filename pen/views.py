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
    else:
        if ("user" not in request.POST or "email" not in request.POST or "password" 
            not in request.POST or "confirm" not in request.POST):
            return render(request, "pen/register.html", { "message":"You have to complete all of the fields" })
        
        if (request.POST["password"] != request.POST["confirm"]):
            return render(request, "pen/register.html", { "message":"The passwords must match" })


        newUser = User.objects.create(username=request.POST["user"], email=request.POST["email"], password=request.POST["password"])

        if newUser.userValidations() == "ValidationError":
            return render(request, "pen/register.html", { "message": "Any of the fields didn't reach the specified length" })


        # We should be able to use the authenticate() and log in... Next step!

        newUser.save()
        login(request, newUser.id)

        return HttpResponseRedirect(reverse("index"))


def logIn(request):
    return HttpResponse("Log In????!")