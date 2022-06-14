from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.db import IntegrityError
import json

from .models import *

# TODO: MAKE WORK THE 'last' KEY, AND THE API
# TODO: MAKE WORK THE PROJECT URL
# TODO: IFRAME SRC TO THE FILES

# TODO: IN THE FILES URL, MAYBE, WE DON'T NEED TO RELOAD THE PAGE... AND, THE NEW FILE NAME SHOULD BE REFRESH

def index(request):
    codeArr = Code.objects.all().filter(isPublic=True).order_by("id")[::-1][:10]
    try:
        lastId = codeArr[-1].id
    except IndexError:
        lastId = 0

    return render(request, "pen/index.html", {
        "array":codeArr,
        "last":lastId
    })

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
            return render(request, "pen/logIn.html", {"message":"The username and/or the password are incorrect"})

        return HttpResponseRedirect(reverse("index"))



@login_required(login_url="/login")
def logOut(request):

    logout(request)
    return HttpResponseRedirect(reverse("index"))

@login_required(login_url="/login")
def profile(request):
    files = Code.objects.all().filter(userFK=request.user)
    likes = len(Likes.objects.all().filter(likerFK=request.user).filter(eliminated=False))

    return render(request, "pen/profile.html", {
        "filesArr":files,
        "likesNumber":likes
    })


@login_required(login_url="/login")
def files(request):
    array = Code.objects.all().filter(userFK=request.user)
    if (request.method == "GET"):
        return render(request, "pen/files.html", {
            "projectsArray":array
        })

    elif (request.method == "POST"):
        if ("fileName" not in request.POST):
            return render(request, "pen/files.html", { 
                "projectsArray":array,
                "message":"You have to provide the file name" 
            })
        
        name = request.POST["fileName"]    
        public = "isPublic" in request.POST
        
        if ((len(name) < 4) or (len(name) > 36)):
            return render(request, "pen/files.html", { 
                "projectsArray":array,
                "message":"Wrong file name length" 
            })

        if (len(Code.objects.all().filter(userFK=request.user).filter(projectName=name)) == 0):
            try:
                newFile = Code(userFK=request.user, projectName=name, isPublic=public)
                newFile.save()
            except IntegrityError:
                return render(request, "pen/files.html", { 
                    "projectsArray":array,
                    "message":"There was an unexpected error" 
                })


            return HttpResponseRedirect(reverse("files"))
        else:
            return render(request, "pen/files.html", { 
                "projectsArray":array,
                "message":"You have another file with the same name!" 
            })
        
@login_required(login_url="/login")
def editFile(request):
    if (request.method == "UPDATE"):
        jsonObject = json.loads(request.body.decode("UTF-8"))
        
        try:
            hlp = Code.objects.all().filter(pk=jsonObject["fileID"]).filter(userFK=request.user)
            hlp = hlp[0]
            hlp.isPublic = (jsonObject["value"] == 1)
            hlp.save()
        except(KeyError, IndexError):
            return JsonResponse({"ERR":"NOT MODIFIED"},status=304)

        return JsonResponse({"OK":"MODIFIED"},status=200)

    elif (request.method == "DELETE"):
        jsonObject = json.loads(request.body.decode("UTF-8"))
        try:
            hlp = Code.objects.all().filter(pk=jsonObject["fileID"]).filter(userFK=request.user)
            hlp = hlp[0]
            hlp.delete()
        except (KeyError, IndexError):
            return JsonResponse({"ERR":"NOT MODIFIED"},status=304)

        return JsonResponse({"OK":"MODIFIED"}, status=200)

@login_required(login_url="/login")
def likesList(request):
    return HttpResponse("likes list")