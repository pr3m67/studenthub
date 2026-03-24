from bson import ObjectId
from mongoengine.queryset.visitor import Q
from datetime import datetime, date


def parse_object_id(value):
    try:
        return ObjectId(str(value))
    except Exception:
        return None


def object_id_str(value):
    if isinstance(value, ObjectId):
        return str(value)
    return value


def build_search_query(search_fields, search_term):
    query = Q()
    if search_term:
        for field in search_fields:
            query |= Q(**{f"{field}__icontains": search_term})
    return query


def sanitize_mongo_value(value):
    if isinstance(value, ObjectId):
        return str(value)
    if isinstance(value, dict):
        return {key: sanitize_mongo_value(item) for key, item in value.items()}
    if isinstance(value, (list, tuple, set)):
        return [sanitize_mongo_value(item) for item in value]
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    return value
