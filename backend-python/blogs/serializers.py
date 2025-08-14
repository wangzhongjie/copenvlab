from rest_framework import serializers
from .models import Blog

class BlogSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='_id', read_only=True)
    
    class Meta:
        model = Blog
        fields = ('id', 'title', 'content', 'created_at')