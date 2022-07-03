from django.http import JsonResponse
from django.shortcuts import render, HttpResponseRedirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.db import IntegrityError
import json

from .models import *

# HOME PAGE↓
def index(request):
    """
        The index function only return a home page with the last 6 posts, we can request
       via get, post, etc. But, we'll always return the home page.
    """

    # The object where we'll store all of the posts
    codeArr = Code.objects.all().filter(isPublic=True).order_by("id")[::-1][:6]

    # We are going to try to get the last id in the post array, if we can't, we will send a fake last id
    try:
        lastId = codeArr[-1].id
    except IndexError:
        lastId = 0

    # Going to make a new array so we can store if the user liked (or not) x post in the last array
    newArr = []
    for i in codeArr:
        # All code of the bellow only help us to see if the user liked the actual post
        liked = True
        try: 
            a = Likes.objects.all().filter(codeFK__pk=i.pk).filter(likerFK__username=request.user.username)[0]
            if a.eliminated == True or request.user.username == "":
                raise IndexError  
        except IndexError:
            liked = False

        # An array of dictionaries
        newArr.append({ 
            "projectName":i.projectName,
            "userFK":i.userFK,
            "liked":liked
        })

    # Finally, we return the template the page with various the arguments
    return render(request, "pen/index.html", {
        "array":newArr,
        "last":lastId
    })

# REGISTER PAGE↓
def register(request):
    """
        The register function will return a register form if the method is get, otherwise, if the method
       is post, we will read all of the received data and analyze if we will register the user
    """

    if request.method == "GET":
        return render(request, "pen/register.html")

    elif request.method == "POST":
        # First, we will see if we received all of the information that we need to create a User object
        if ("user" not in request.POST or "email" not in request.POST or "password" 
            not in request.POST or "confirm" not in request.POST):
            return render(request, "pen/register.html", { "message":"You have to complete all of the fields" })
        
        # Second one, we will see if the passwords are the same
        if (request.POST["password"] != request.POST["confirm"]):
            return render(request, "pen/register.html", { "message":"The passwords must match" })

        # We'll try to make a user object, if we have an IntegrityError, any of django confirmations were wrong (most possible; username taken)
        try:
            username = request.POST["user"]
            password = request.POST["password"]
            email = request.POST["email"]
            user = User.objects.create_user(username, email, password)

            # A validations that i've wrote inside of the class, you can look at them in the "models.py"
            if user.userValidations() != True:
                return render(request, "pen/register.html", { "message":"Any of the fields were modified" })
        except IntegrityError:
            return render(request, "pen/register.html", { "message":"The username is taken" })  

        # If we reach here without any exception, we can log-in, and go to the home page
        login(request, user)

        return HttpResponseRedirect(reverse("index"))

# LOG IN PAGE↓
def logIn(request):
    """
        The logIn function accepts two methods, get(where we will return a form) and 
       post (where we'll read the received data)
    """

    if request.method == "GET":
        return render(request, "pen/logIn.html")

    elif request.method == "POST":
        # First, we will look  if we received all of the arguments that we need to log in
        if "user" not in request.POST or "password" not in request.POST:
            return render(request, "pen/logIn.html", {"message":"An input was not provided"})

        ur = request.POST["user"]
        pas = request.POST["password"]
        user = authenticate(username=ur, password=pas)
        
        # The django validations check for a user in the db, if it is not the same, we'll receive a None value
        if user is not None:
            login(request, user)
        else:
            return render(request, "pen/logIn.html", {"message":"The username and/or the password are incorrect"})

        return HttpResponseRedirect(reverse("index"))

# LOG OUT "PAGE"↓
@login_required(login_url="/login")
def logOut(request):
    """
        The logOut function just look for the user that requested the page and, take off his cookie.
       And, redirect him to the home page
    """

    logout(request)
    return HttpResponseRedirect(reverse("index"))

# THE USER PROFILE PAGE↓
@login_required(login_url="/login")
def profile(request):
    """
        The profile function will always return the profile page for the one that requested (if the user is logged in)
    """

    # Just save the files that the user has, and, how many likes the user made, so we can return a styled template
    files = Code.objects.all().filter(userFK=request.user).order_by("id")
    likes = len(Likes.objects.all().filter(likerFK=request.user).filter(eliminated=False))

    return render(request, "pen/profile.html", {
        "filesArr":files,
        "userLikes":likes,
    })

# THE LIKES PAGE↓
@login_required(login_url="/login")
def likesList(request):
    """
        The likesLIST function send a page where a logged in user can see all of the
       posts that it liked
    """

    # We'll make an array with the last 6 likes objects, and then, we will make another array to store the posts (connected by the likes object)
    a = Likes.objects.all().order_by("id").filter(likerFK=request.user).filter(codeFK__isPublic=True).filter(eliminated=False)[::-1][:6]
    b = []
    for i in a:
        b.append(i.codeFK)

    # Trying to get the last id of the array, if we can't we will store a fake id
    try:
        last = a[-1].id
    except IndexError:
        last = 0

    # Finally, we return all
    return render(request, "pen/likes.html",{
        "array":b,
        "lastID":last
    })

# THE FILES PAGE↓
@login_required(login_url="/login")
def files(request):
    """
        The files function can return a page with all of the files that the user has, if the method is post and the user is logged in
       also, if "files" can make a new file (if the method its post)
    """

    # Only one array so we just request the it once. And the lastId value, initialized with a fake value
    array = Code.objects.all().order_by("id").filter(userFK=request.user)[::-1][:6]
    lastId = 0
    if (len(array) > 0):
        lastId = array[-1].id

    if (request.method == "GET"):
        return render(request, "pen/files.html", {
            "projectsArray":array,
            "lastId":lastId
        })

    elif (request.method == "POST"):
        # First we check if we received the fileName
        if ("fileName" not in request.POST):
            return render(request, "pen/files.html", { 
                "projectsArray":array,
                "lastId":lastId,
                "message":"You have to provide the file name",
            })
        
        # The name, and a boolean (if the user didn't check the box in the form, we won't receive that)
        name = request.POST["fileName"].strip()    
        public = "isPublic" in request.POST
        
        # Check if the fileName is between the requested values
        if ((len(name) < 4) or (len(name) > 36)):
            return render(request, "pen/files.html", { 
                "projectsArray":array,
                "lastId":lastId,
                "message":"Wrong file name length" 
            })

        # Let's check if there is another file with the same name
        if len(Code.objects.all().filter(userFK=request.user).filter(projectName=name)) == 0:
            
            # We try to save the file... Personally, i don't know if we can receive an error, that's why in the message i wrote "There was an unexpected error"
            try:
                newFile = Code(userFK=request.user, projectName=name, isPublic=public)
                newFile.save()
            except IntegrityError:
                return render(request, "pen/files.html", { 
                    "projectsArray":array,
                    "lastId":lastId,
                    "message":"There was an unexpected error" 
                })

            # If we reach here, we will reload the array object and get all of the files
            return HttpResponseRedirect(reverse("files"))
        else:
            return render(request, "pen/files.html", { 
                "projectsArray":array,
                "message":"You have another file with the same name!" 
            })


""" FULL-PEN FUNCTIONS (THE SENSE OF ALL OF THIS) """


# THE VIEW PAGE↓
def fullPage(request, name, creator):
    """
        The fullPage function receive via url a name and creator so we check the code object corresponding to that
       description, we always return as the request is get.
    """

    # We try to get the post, if we can't, we'll proceed, otherwise, the user will be redirected to the home page
    try:
        creatorIn = User.objects.all().filter(username=creator)[0]
        nameIn = Code.objects.all().filter(projectName=name)[0]
        
        # Check if the only one that can see the page is the creator
        if (nameIn.isPublic == False) and (request.user.username != creatorIn.username):
            raise IndexError
    except IndexError:
        return HttpResponseRedirect(reverse("index"))

    # Let's check if we liked (or no) the actual post
    liked = True
    a = Likes.objects.all().filter(codeFK=nameIn).filter(likerFK=request.user)
    if len(a) != 0 or a[0].eliminated == True:
        liked = False
    
    # Finally, we will return the parts so we can make the fullPage
    return render(request, "pen/fullPage.html", {
        "javascript_CODE":nameIn.code_JS,
        "css_CODE":nameIn.code_CSS,
        "html_CODE":nameIn.code_HTML,
        "creator":creator,
        "liked":liked,
        "fileName":name
    })

# THE EDIT PAGE↓
@login_required(login_url="/login")
def edit(request, fileName):
    """
        The edit function takes a string via url and, process if we are the creator
       so it return a template where we can edit the project
    """

    # First, we save the object (if there is one)
    fileExist = Code.objects.all().filter(userFK=request.user).filter(projectName=fileName)

    # Then, we check if everything is ok
    if request.user.username == "" or len(fileExist) != 1:
        return HttpResponseRedirect(reverse("files"))

    # So we can return the template
    return render(request, "pen/edit.html", {
        "file":fileExist
    })


""" API FUNCTIONS """

# THE EDIT-FILE API↓
@login_required(login_url="/login")
def editFile(request):
    """
        The editFile function receive two requests, update and delete.
       The delete function removes a specific file, the update function change the isPublic variable of a project
    """

    # A variable for all of the methods
    jsonObject = json.loads(request.body.decode("UTF-8"))

    if (request.method == "UPDATE"):
        # We try to access the object and modify it
        try:
            hlp = Code.objects.all().filter(pk=jsonObject["fileID"]).filter(userFK=request.user)
            hlp = hlp[0]
            hlp.isPublic = (jsonObject["value"] == 1)
            hlp.save()
        except(KeyError, IndexError):
            # If we can't we'll send an error message
            return JsonResponse({"ERR":"NOT MODIFIED"},status=304)

        return JsonResponse({"OK":"MODIFIED"},status=200)

    elif (request.method == "DELETE"):
        # First, we try to locate the file and then, delete it
        try:
            hlp = Code.objects.all().filter(pk=jsonObject["fileID"]).filter(userFK=request.user)
            hlp = hlp[0]
            hlp.delete()
        except (KeyError, IndexError):
            # If we can't we'll send an error message
            return JsonResponse({"ERR":"NOT MODIFIED"},status=304)

        return JsonResponse({"OK":"MODIFIED"}, status=200)









def getPosts(request, lastId):
    if request.method == "GET":        
        objects = Code.objects.all().order_by("id").filter(id__lt=lastId)[::-1]
        array = []

        if (len(objects) > 6):
            objects = objects[:6]
        elif (len(objects) == 0):
            return JsonResponse({"OK":"No content"},status=200)

        for i in objects:
            liked = True
            if request.user.username != "":
                try:
                    a =  Likes.objects.all().filter(codeFK=i).filter(likerFK=request.user)[0]
                    if a.eliminated == True:
                        raise IndexError
                except IndexError:
                    liked = False
            else:
                liked = False

            array.append({ 
                "id":i.pk,
                "projectName":i.projectName,
                "creator":i.userFK.username,
                "liked":liked
            })

        return JsonResponse({ "array": array },status=200)







@login_required(login_url="/login")
def saveFile(request):
    if (request.method == "UPDATE"):
        jsonValues = json.loads(request.body.decode("utf-8"))
        obj = Code.objects.all().filter(projectName=jsonValues["fileName"]).filter(userFK__username=request.user.username)
        if len(obj) != 1:
            return JsonResponse({"ERR":"Error when trying to locate the code file"}, status=403)

        obj = obj[0]

        obj.code_HTML = jsonValues["html"]
        obj.code_CSS = jsonValues["css"]
        obj.code_JS = jsonValues["js"]

        obj.save()

        return JsonResponse({"OK":"Saved"}, status=201)




@login_required(login_url="/login")
def getPostsFiles(request, lastId):
    if request.method == "GET":
        a = Code.objects.all().order_by("id").filter(userFK=request.user).filter(id__lt=lastId)[::-1][:6]
        if (len(a) == 0):
            return JsonResponse({"ERR":"THERE IS NO MORE POSTS TO SHOW"}, status=400)
        b = []
        for i in a:
            b.append({
                "projectName":i.projectName,
                "creator":i.userFK.username,
                "id":i.id,
                "isPublic":i.isPublic
            })
        
        return JsonResponse({"array":b}, status=200)



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
def getMoreLikedPosts(request, lastId):
    if (request.method == "GET"):
        all = Likes.objects.all().order_by("id").filter(likerFK=request.user).filter(codeFK__isPublic=True).filter(eliminated=False).filter(id__lt=lastId)[::-1][:6]
        if len(all) == 0:
            return JsonResponse({"ERR":"THERE IS NO MORE POSTS TO SHOW!"}, status=400)
        b = []
        for i in all:
            b.append({
                "projectName":i.codeFK.projectName,
                "creator":i.codeFK.userFK.username,
                "id":i.id
            })
        
        return JsonResponse({"array":b}, status=200)


