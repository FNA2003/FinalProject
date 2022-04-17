import email
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
            

