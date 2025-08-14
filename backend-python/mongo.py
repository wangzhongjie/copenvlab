import os
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

# 加载环境变量
load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))

class Conn:
    def __init__(self, app_name='default_app', app_module='default_module'):
        try:
            username = os.getenv('DB_USER')
            password = os.getenv('DB_PASS')
            
            if not username or not password:
                raise ValueError("DB_USER或DB_PASS环境变量未设置")
                
            mongo_uri = f"mongodb://{username}:{password}@192.168.31.211:27017/stock?authSource=stock"
            
            self.client = MongoClient(
                mongo_uri,
                serverSelectionTimeoutMS=30000,
                socketTimeoutMS=45000
            )
            # 测试连接
            self.client.admin.command('ping')
            self.db = self.client['stock']
            print("MongoDB连接成功")
            
        except ConnectionFailure as e:
            print(f"MongoDB连接失败: {e}")
            raise
        except Exception as e:
            print(f"初始化错误: {e}")
            raise

# 创建全局连接实例
try:
    mongo_conn = Conn()
    db = mongo_conn.db
except Exception as e:
    print(f"无法初始化MongoDB连接: {e}")
    db = None