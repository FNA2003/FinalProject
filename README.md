#### *ABOUT*

> *This project was developed and designed by _Franco N. Angeletti_, a student of [CS50W](https://cs50.harvard.edu/web/2020/) (a web programming with python and javascript course) and, in this occasion, we are going to take a look at the last project of it, my last project.*

# PEN

Pen is a dynamic website developed in python with the aim of allowing all types of users to develop and launch static web pages. This website allows users to do projects in:
- **Hyper Text Markdown Language** - [ HTML ]
- **Cascading Styles Sheets** - [ CSS ]
- **Java Script** - [ JS ]

## Distinctiveness and Complexity:

In this section we are going to cover the difficulty and complexity that revolves around my project, first, we are going to start with the; **Distinctiveness**, this project were made by an idea that i had before starting the CS50W when i made my first web course, the [FreeCodeCamp](https://www.freecodecamp.org/) responsive course. I looked up the code camp page and i liked the idea of making a static page without creating any kind of file on my pc and then, i meet the [CodePen](https://codepen.io/) page, where i model my idea.
**Complexity**, while making the code camp course, i wasn't able to model my idea with the knowledge i got from it, for obviously reasons. And then, i started the CS50X course, that leaved me up to the CS50W where i get the knowledge to make a dynamic web page, but, without letting me how to make a safe file load (safe for the user that could receive an attack) and a file with text fields.

## What’s contained in each I've created

Now, you will see a list of every group or pair of files that were made by me, i'm gonna told you if it has an html, css or js variant. Also, the _"Page in"_ column it's just and index for you to search inside of this ___README___ what the page does. A last thing, i can not make a specific list of what all files do (it would be very tedious to read/ write)

| Basic Name | HTML | CSS | JS | Page in |
|------------|------|-----|----|--------------|
| edit       | ✔️   | ✔️  | ✔️ | "edit" page |
| files      | ✔️   | ✔️  | ✔️ | "files" page |
| fullPage   | ✔️   | ✔️  | ✔️ | "view" page  |
| index      | ✔️   | ✔️  | ✔️ | "home" page  |
| layout     | ✔️   | ✔️  | ❌ | template so we can make all of the pages |
| likes      | ✔️   | ✔️  | ✔️ | "likes" page |
| logIn      | ✔️   | ✔️  | ✔️ | "login" page |
| profile    | ✔️   | ✔️  | ✔️ | "profile" page |
| register   | ✔️   | ✔️  | ✔️ | "register" page |

 
## How to run the application

1. Download/ Fork the repository (if downloaded unzip the file)
2. Open up the console inside the folder
3. Install all of the requirements by:
```sh
pip3 install -r requirements.txt
```
4. Make the migrations on the project by writing this; 
```sh
python3 manage.py makemigrations pen
```
5. Migrate them:
```sh
python3 manage.py migrate
```
6. Run the server:
```sh
python3 manage.py runserver
```
7. Go to the url that the console show you up, it should say:
```sh
Django version 4.0.2, using settings 'final.settings'
Starting development server at "http://127.0.0.1:8000/"
Quit the server with CONTROL-C.
```
8. And that's all, now you can navigate through all of the pages, enjoy!

_If you want to stop the server just close the console or just press "Ctrl + C" inside of it_

***

## PAGES
 This website contains many routes, some of them are mostly unknown for the user (like _API_ routes) and others that, are the main focus for us, like;
 
 
### REGISTER

A simple page where you can request and post data, in other words, where you can receive a form page and send the data so you to registrate inside the database.

### LOG IN/ LOG OUT

I'm gonna mention two routes in a single article just because they are too simple to explain. We are going to start with the: **Log in** page, wich give us a form page so we can write all of the needed fields so we can send back the data to the backend and receive a cookie to stay logged in. **Log out**, just analyze if we were logged, if we are it removes our cookie and redirect us to the _home page_.

### PROFILE
***⚠️WE CAN ACCESS IF WE ARE LOGGED IN⚠️***

Profile just give us a page full of data, for example; the likes count that our files has, the likes that we gave to others files, our username and email. As you can see, this page is meant for self centered or forgetful people.

### FILES
***⚠️WE CAN ACCESS IF WE ARE LOGGED IN⚠️***

Here, you can see a list of all of your files (if you have any), navigate through them, update the visibility, delete a specific file, open it on full view or edit its content... Also, here you can make new file (the new file can't have the name of other file made by you).

### LIKES
***⚠️WE CAN ACCESS IF WE ARE LOGGED IN⚠️***

In this page, you can navigate through the list of files that you liked (if you didn't, the website will load an information image with an url to the home page) also, here, you can go to the full view of a project or dislike it to remove it from here.

### EDIT
***⚠️WE CAN ACCESS IF WE ARE LOGGED IN AND, THE PROJECT IT'S MADE BY US⚠️***

Here we will see a text area with three different tabs were you can change between languages (html, css and js) and write in the area your code so you can see it on the right window. When your happy with your code, you can save it by pressing the 'Save' button at the top, so you, and many people can see it's changes (if the project it's public).
*An added to the page; it autocomplete parentheses, brackets and braces, allow you to tabulate and remember your tabulation for the next line*

### VIEW

Here you can see the full page of a project, if the project it's empty, we will load a meme message. You can like/ dislike the project or go to the home page.

### HOME

The home page it's the default route on the website and, it loads the last six posts (or let us navigate for more of them, but if there is no post, we wil load a message). Also, we can see the project in a higher resolution _by pressing the fullScreen button_ like it (if we are logged in and we aren't the creator) or edit it (if we are logged in and we are the creator). Finally, at the bottom of the page we will see the contact urls, empty for this project.

***
## TURNING POINTS

1. I didn't talk about of the API routes and how they work cause they are supposed to be hidden to the user, but something that I have to mention about them, they use the csrf tokens. 
2. The pages has some functionality more on them, check them out!
3. The stetic of the pages were not mention to make more impact.
4. All of the pages has a mobile/ responsive version (not the view url, cause that it's meant to be developed by the creator), please, check it out!

***
#### How to install it?

By politics of cs50 web, i can't send or let someone to download this or other project made by me. 

##### *FINAL*

 *Thanks to every one that reached here, or, al least looked at the project, cheers!*
 *This page its inspired on the [CodePen](https://codepen.io/), I'm not trying to violate the rights of it, this is just a course project*