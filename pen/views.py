from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, HttpResponse, HttpResponseRedirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse
from django.db import IntegrityError
import json

from .models import *

# TODO: MAKE THE NAVIGATION IN THE INDEX PAGE

# TODO: I'VE DONE THE FULL VIEW OF THE PROJECT PAGE, NOW WE SHOULD BE ABLE TO EDIT IT

# TODO: RESPONSIVE DESIGN

# TODO: WE MAY USE THE CSFR TOKEN, NOT EXEMPT THAT

# TODO: UPDATE THE CONSOLE INFO WHEN FETCH, CHECK THE INDEX JS FILE

# TODO: MAKE THE ACTIONS WHEN WE LOAD THE NEWEST POSTS, LIKE THE FULL PAGE AND THE LIKE BUTTON (WE CAN MAKE IT BY ADDING FUNCTIONS AND REMOVING THE ANONYMUS FUNCTIONS)


def index(request):
    codeArr = Code.objects.all().filter(isPublic=True).order_by("id")[::-1][:10]
    try:
        lastId = codeArr[-1].id
    except IndexError:
        lastId = 0

    newArr = []
    for i in codeArr:
        liked = True
        try: 
            a = Likes.objects.all().filter(codeFK__pk=i.pk).filter(likerFK__username=request.user.username)[0]
            if a.eliminated == True:
                raise IndexError
            
        except IndexError:
            liked = False

        newArr.append({ 
            "projectName":i.projectName,
            "userFK":i.userFK,
            "liked":liked
        })

    return render(request, "pen/index.html", {
        "array":newArr,
        "last":lastId
    })

def getPosts(request, lastId):
    if request.method == "GET":
        if lastId <= 1:
            return JsonResponse({"Bad request":"That's the last post"},status=400)
        
        objects = Code.objects.all().order_by("id").filter(id__lt=lastId)[::-1]
        array = []

        if (len(objects) > 10):
            objects = objects[:10]
        elif (len(objects) < 1):
            return JsonResponse({"OK":"No content"},status=204)

        for i in objects:
            liked = False
            try:
                a =  Likes.objects.all().filter(codeFK=i).filter(likerFK=request.user)[0]
                if a.eliminated == True:
                    raise IndexError
                else:
                    liked = True
            except IndexError:
                pass

            array.append({ 
                "id":i.pk,
                "projectName":i.projectName,
                "creator":i.userFK.username,
                "liked":liked
            })

        return JsonResponse({ "array": array },status=200)

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
    files = Code.objects.all().filter(userFK=request.user).order_by("id")
    likes = len(Likes.objects.all().filter(likerFK=request.user).filter(eliminated=False))


    return render(request, "pen/profile.html", {
        "filesArr":files,
        "userLikes":likes,
    })

@login_required(login_url="/login")
def edit(request, fileName):
    fileExist = Code.objects.all().filter(userFK_id=request.user.id).filter(projectName=fileName)
    try:
        fileExist = fileExist[0]
        if (request.user.username == ""):
            raise IndexError
    except IndexError:
        return HttpResponseRedirect(reverse("files"))

    return HttpResponse(f"{request.user.username} and {fileExist}")

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
        
        name = request.POST["fileName"].strip()    
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

@csrf_exempt
@login_required(login_url="/login")
def likeFile(request):
    jsonObject = json.loads(request.body.decode("UTF-8"))
    
    try:
        project = Code.objects.all().filter(userFK__username=jsonObject["author"]).filter(projectName=jsonObject["file"])[0]
    except IndexError:
        return JsonResponse({"ERR":"Project not found!"},status=400)

    likeObject = 0
    try:
        likeObject = Likes.objects.all().filter(codeFK__pk=project.pk).filter(likerFK__username=request.user.username)[0]
    except IndexError:
        pass


    if (likeObject == 0):
        newLike = Likes(codeFK=project, likerFK=request.user)
        project.likesCount = int(project.likesCount) + 1
        project.save()
        newLike.save()
    else:
        if (likeObject.eliminated == False):
            likeObject.eliminated = True
            project.likesCount = int(project.likesCount) - 1
            project.save()
            likeObject.save()
        else:
            likeObject.eliminated = False
            project.likesCount = int(project.likesCount) + 1
            project.save()
            likeObject.save()

    return JsonResponse({"OK":"MODIFIED"},status=200)

@login_required(login_url="/login")
def likesList(request):
    a = Likes.objects.all().filter(likerFK=request.user).filter(codeFK__isPublic=True).filter(eliminated=False)
    b = []
    for i in a:
        b.append(i.codeFK)

    return render(request, "pen/likes.html",{
        "array":b
    })


def fullPage(request, name, creator):
    liked = True

    try:
        creatorIn = User.objects.all().filter(username=creator)[0]
        nameIn = Code.objects.all().filter(projectName=name)[0]
        
        if (nameIn.isPublic == False) and (request.user.username != creatorIn.username):
            raise IndexError
    except IndexError:
        return HttpResponseRedirect(reverse("index"))

    
    try:
        if (request.user.username != ""):
            a = Likes.objects.all().filter(codeFK__pk=nameIn.pk).filter(likerFK__username=request.user.username)[0]
            if (a.eliminated == True):     
                raise IndexError
    except IndexError:
        liked = False

    

    return render(request, "pen/fullPage.html", {
        "javascript":nameIn.code_JS,
        "css":nameIn.code_CSS,
        "html":nameIn.code_HTML,
        "title":f"{name} [{creator}]",
        "creator":creator,
        "liked":liked,
        "fileName":name
    })