import arrow, re, json
from functools import lru_cache    # 添加缓存提升类型检查速度
import math, random
import asyncio
from types import SimpleNamespace
from copy import deepcopy
from termcolor import colored
from typing import Dict  # 添加类型注解导入


# 设置默认时区为上海
bj = 'Asia/Shanghai'
