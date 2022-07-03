""" Django fields """
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser): 
    """
        The User class inherits from AbstractUser and add a validator to it
       This class uses the username, password and email fields
    """

    def userValidations(self):
        """
            The userValidations check if the length of all of the fields are correct
           It can return True if everything is ok, a string otherwise
        """
        if len(self.username) < 5 or len(self.username) > 36:
            return f"Username length incorrect! {self.username}"
        if len(self.password) < 6 or len(self.password) > 100:
            return f"Password length incorrect! {self.password}"
        if len(self.email) < 8 or len(self.email) > 320:
            return f"Email length incorrect! {self.email}"
        
        return True


class Code(models.Model):
    """
        The code class stores a code object that with the following fields
       userFK (creator foreign key), projectName (name of the project), likesCount (likes count of this object)
       code_HTML (a text field for the html code), code_CSS (a text field for the css code), 
       code_JS (a text field for the js code), isPublic (a boolean where we store wether the project is public)
    """

    userFK = models.ForeignKey("User", on_delete=models.CASCADE, related_name="coder_FK")

    projectName = models.CharField(max_length=36, editable=True, blank=False)
    likesCount = models.IntegerField(default=0, editable=True, blank=False)

    code_HTML = models.TextField(editable=True, blank=True, default="")
    code_CSS = models.TextField(editable=True, blank=True, default="")
    code_JS = models.TextField(editable=True, blank=True, default="")

    isPublic = models.BooleanField(editable=True, default=True)


class Likes(models.Model): 
    """
        Likes is a class that connects a code object and a user object
      if they are connected the "likerFK" is liking the "codeFK"... We have to know that the "eliminated"
      value should be false to mean that is liked
    """

    codeFK = models.ForeignKey("Code", on_delete=models.CASCADE)
    likerFK = models.ForeignKey("User", on_delete=models.CASCADE, related_name="liker_FK")

    eliminated = models.BooleanField(default=False, editable=True)

# The class Code has a foreign key with the user table
# The class Likes has a foreign key with the code (and by the code) with the user table