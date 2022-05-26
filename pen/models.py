from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser): 
    def userValidations(self):
        if len(self.username) < 5 or len(self.username) > 36:
            return f"Username length incorrect! {self.username}"
        if len(self.password) < 6 or len(self.password) > 100:
            return f"Password length incorrect! {self.password}"
        if len(self.email) < 8 or len(self.email) > 320:
            return f"Email length incorrect! {self.email}"
        
        return True


class Code(models.Model):
    userFK = models.ForeignKey("User", on_delete=models.CASCADE, related_name="coder_FK")
    projectName = models.CharField(max_length=36, editable=True, blank=False)

    code_HTML = models.TextField(editable=True, blank=True)
    code_CSS = models.TextField(editable=True, blank=True)
    code_JS = models.TextField(editable=True, blank=True)

    isPublic = models.BooleanField(editable=True, default=True)


class Likes(models.Model): 
    codeFK = models.ForeignKey("Code", on_delete=models.CASCADE)
    likerFK = models.ForeignKey("User", on_delete=models.CASCADE, related_name="liker_FK")

    eliminated = models.BooleanField(default=False, editable=True)