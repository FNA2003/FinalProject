from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser): 
    def userValidations(self):
        if len(self.username) < 5 or len(self.username) > 50:
            raise "ValidationError"
        if len(self.password) < 6 or len(self.password) > 100:
            raise "ValidationError"
        if len(self.email) < 8 or len(self.email) > 320:
            raise "ValidationError"


class Code(models.Model):
    userFK = models.ForeignKey("User", on_delete=models.CASCADE, related_name="coder_FK")

    code_HTML = models.TextField(editable=True, blank=True)
    code_CSS = models.TextField(editable=True, blank=True)
    code_JS = models.TextField(editable=True, blank=True)

    isPublic = models.BooleanField(editable=True, default=True)


class Likes(models.Model): 
    codeFK = models.ForeignKey("Code", on_delete=models.CASCADE)
    likerFK = models.ForeignKey("User", on_delete=models.CASCADE, related_name="liker_FK")

    eliminated = models.BooleanField(default=False, editable=True)