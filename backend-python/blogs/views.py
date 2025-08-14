from rest_framework import generics
# from .serializers import BlogSerializer
from bson import ObjectId, json_util
from django.http import Http404, JsonResponse
from django.views import View
import common
import arrow # 使用 arrow 处理日期时间
from mongo import db  # 导入全局的 db 对象  
import json, re
import common 
from django.middleware.csrf import get_token
from datetime import timezone, timedelta

import traceback
import logging

logger = logging.getLogger(__name__)


class CSRFTokenView(View):
    def get(self, request, *args, **kwargs):
        csrf_token = get_token(request)
        return JsonResponse({'csrfToken': csrf_token})

class DealListCreateAPIView(View):
    # 查询博客列表
    def get(self, request):
        try:
            # blogs = list(db.blogs_blog.find({}).sort('created_at', -1))
            # 模拟从数据库查询数据
            deals = [
                {
                        "name": "沪金:250924 领口策略 776/824", 
                        "pnl": -2030, 
                        "pnlRate": "-0.25%", 
                        "createTime": "2025-08-11 14:26:08", 
                        "closeTime": None, 
                        "daysLeft": 41, 
                        "expiry": "2025-09-24"
                }, 
                {
                        "name": "沪银:250924 自定义策略 9200/9500", 
                        "pnl": 101.25, 
                        "pnlRate": "+0.07%", 
                        "createTime": "2025-08-09 11:03:58", 
                        "closeTime": None, 
                        "daysLeft": 41, 
                        "expiry": "2025-09-24"
                }, 
                {
                        "name": "螺纹钢:250924 领口策略 3250/3100", 
                        "pnl": -42.5, 
                        "pnlRate": "-0.13%", 
                        "createTime": "2025-08-08 21:40:00", 
                        "closeTime": None, 
                        "daysLeft": 41, 
                        "expiry": "2025-09-24"
                }, 
                {
                        "name": "rb2510领口", 
                        "pnl": 80, 
                        "pnlRate": "+10.13%", 
                        "createTime": "2025-08-08 21:30:00", 
                        "closeTime": "2025-08-08 21:40:21", 
                        "daysLeft": 41, 
                        "expiry": "2025-09-24"
                }, 
                {
                        "name": "沪银:250924 自定义策略 9200/9500", 
                        "pnl": -213.75, 
                        "pnlRate": "-0.15%", 
                        "createTime": "2025-08-08 21:07:30", 
                        "closeTime": None, 
                        "daysLeft": 41, 
                        "expiry": "2025-09-24"
                }
            ]

            # print('list', deals)
            if deals and len(deals) > 0:
                return JsonResponse(json.loads(json_util.dumps(deals)), safe=False, status=200)
            else:
                return JsonResponse({'error': 'Not found'}, status=404)
        except Exception as e:
            traceback.print_exc()
            return JsonResponse({'error': str(e)}, status=500)
