from io import BytesIO
from uuid import uuid4

from django.conf import settings
from PIL import Image
from pymongo import MongoClient
from gridfs import GridFS


def _gridfs():
    client = MongoClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB]
    return GridFS(db)


def save_bytes_to_gridfs(data: bytes, filename: str, content_type: str):
    fs = _gridfs()
    return str(fs.put(data, filename=filename, content_type=content_type))


def save_uploaded_file(uploaded_file, optimize_image: bool = False):
    content = uploaded_file.read()
    if optimize_image:
        image = Image.open(BytesIO(content))
        image.thumbnail((1200, 1200))
        buffer = BytesIO()
        image.save(buffer, format="WEBP", quality=82)
        content = buffer.getvalue()
        filename = f"{uuid4().hex}.webp"
        content_type = "image/webp"
    else:
        filename = uploaded_file.name
        content_type = uploaded_file.content_type or "application/octet-stream"
    file_id = save_bytes_to_gridfs(content, filename, content_type)
    return {
        "file_id": file_id,
        "filename": filename,
        "url": f"/api/auth/files/{file_id}/",
        "content_type": content_type,
    }
