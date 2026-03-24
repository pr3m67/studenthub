from django.core.cache import cache
from django.core.paginator import Paginator
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from utils.storage import save_uploaded_file
from .models import Club, ClubPost
from .serializers import ClubPostSerializer, ClubSerializer


class ClubListView(APIView):
    def get(self, request):
        cache_key = "clubs:list"
        payload = cache.get(cache_key)
        if not payload:
            queryset = Club.objects.order_by("name")
            category = request.query_params.get("category")
            if category:
                queryset = queryset.filter(category__iexact=category)
            payload = ClubSerializer(queryset, many=True).data
            cache.set(cache_key, payload, timeout=300)
        return Response({"success": True, "data": payload})


class ClubDetailView(APIView):
    def get(self, request, club_id):
        club = Club.objects(id=club_id).first()
        if not club:
            return Response({"success": False, "error": {"code": "CLUB_404", "message": "Club not found.", "field_errors": {}}}, status=404)
        return Response({"success": True, "data": ClubSerializer(club).data})


class ClubJoinView(APIView):
    def post(self, request, club_id):
        club = Club.objects(id=club_id).first()
        if not club:
            return Response({"success": False, "error": {"code": "CLUB_404", "message": "Club not found.", "field_errors": {}}}, status=404)
        members = list(club.member_ids)
        if request.user.id in members:
            members.remove(request.user.id)
        else:
            members.append(request.user.id)
        club.member_ids = members
        club.save()
        if request.user.id in members and club_id not in request.user.joined_clubs:
            request.user.joined_clubs.append(club_id)
        if request.user.id not in members:
            request.user.joined_clubs = [cid for cid in request.user.joined_clubs if cid != club_id]
        request.user.save()
        cache.delete("clubs:list")
        return Response({"success": True, "data": ClubSerializer(club).data})


class ClubPostsView(APIView):
    def get(self, request, club_id):
        posts = ClubPost.objects(club_id=club_id).order_by("-created_at")
        paginator = Paginator(list(posts), 20)
        page = paginator.get_page(int(request.query_params.get("page", 1)))
        return Response({"success": True, "data": ClubPostSerializer(page.object_list, many=True).data, "count": paginator.count})

    def post(self, request, club_id):
        if request.user.role not in {"admin", "teacher"}:
            return Response({"success": False, "error": {"code": "CLUB_001", "message": "Only club admins can post.", "field_errors": {}}}, status=403)
        payload = request.data.copy()
        if request.FILES.get("image"):
            payload["image_url"] = save_uploaded_file(request.FILES["image"], optimize_image=True)["url"]
        payload["club_id"] = club_id
        serializer = ClubPostSerializer(data=payload)
        serializer.is_valid(raise_exception=True)
        post = ClubPost(**serializer.validated_data).save()
        return Response({"success": True, "data": ClubPostSerializer(post).data}, status=status.HTTP_201_CREATED)


class ClubPostDeleteView(APIView):
    def delete(self, request, club_id, post_id):
        if request.user.role not in {"admin", "teacher"}:
            return Response({"success": False, "error": {"code": "CLUB_001", "message": "Only club admins can delete posts.", "field_errors": {}}}, status=403)
        post = ClubPost.objects(id=post_id, club_id=club_id).first()
        if not post:
            return Response({"success": False, "error": {"code": "CLUBPOST_404", "message": "Post not found.", "field_errors": {}}}, status=404)
        post.delete()
        return Response({"success": True})
