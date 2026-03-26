from minio import Minio

# global client
client = Minio(
    "localhost:9000",
    access_key="admin",
    secret_key="password123",
    secure=False
)

HOMEWORK_BUCKET = "homeworks"
AVATAR_BUCKET = "avatars"

for bucket in [HOMEWORK_BUCKET,AVATAR_BUCKET]:
    if not client.bucket_exists(bucket):
        client.make_bucket(bucket)