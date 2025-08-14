from djongo import models
import pandas as pd  
from scipy.spatial.distance import cosine, euclidean  # 添加相似度计算所需导入

class Blog(models.Model):
    _id = models.ObjectIdField(primary_key=True, editable=False)
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'blogs_blog'
    def __str__(self):
        return self.title 
