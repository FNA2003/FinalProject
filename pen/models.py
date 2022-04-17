from django.db import models
from django.core.exceptions import ValidationError

# Create your models here.

class User(models.Model): 
    """
        User its a model who can store all the information for a user, like the;
       username(obligatory), password(obligatory), eMail(obligatory), avatarURL(it is not obligatory). And
       validate them via a built in function (userValidations)
    """
    username = models.CharField(max_length=50, blank=False, editable=True, null=False)
    password = models.CharField(max_length=100, blank=False, editable=True, null=False)
    eMail = models.EmailField(max_length=320, blank=False, editable=False, null=False)
    avatarURL = models.URLField(max_length=2048, blank=True, editable=True, null=False)

    def userValidations(self):
        if len(self.username) < 5 or len(self.username) > 50:
            raise ValidationError
        if len(self.password) < 6 or len(self.password) > 100:
            raise ValidationError
        if len(self.eMail) < 8 or len(self.eMail) > 320 or ("@" not in self.eMail) or ("." not in self.eMail):
            raise ValidationError 

        if len(self.avatarURL) > 1:
            if len(self.avatarURL) > 2048 or ("http" not in self.avatarURL) or ("." not in self.avatarURL):
                raise ValidationError


class Code(models.Model):
    """
        The Code model stores all of the HTML, CSS and JAVASCRIPT code of a specific user. This model has no verification
       and, if the user is deleted, we will delete the code.


       Variables used in this model; 
            -code_HTML (stores the html code, it can be empty and edited)

            -code_CSS (stores the css code, it can be empty and edited)

            -code_JS (stores the javascript code, it can be empty and edited)
    """

    userFK = models.ForeignKey("User", on_delete=models.CASCADE)

    code_HTML = models.TextField(editable=True, blank=True)
    code_CSS = models.TextField(editable=True, blank=True)
    code_JS = models.TextField(editable=True, blank=True)