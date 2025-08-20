from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class AppTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data["lifetime"] = int(refresh.access_token.lifetime.total_seconds())
        return data
