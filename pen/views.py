from django.http import HttpResponse
from django.shortcuts import render, HttpResponse

# Create your views here.
def index(request):
    return render(request, "pen/index.html")


def register(request):
    if request.method == "GET":
        return render(request, "pen/register.html")
    else:
        return HttpResponse("You submitted this?")

def logIn(request):
    return HttpResponse("Log In????!")