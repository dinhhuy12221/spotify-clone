import traceback
from django.http import JsonResponse
from django.core.exceptions import PermissionDenied
from django.http import Http404
from django.utils.deprecation import MiddlewareMixin

class JsonExceptionMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        if isinstance(exception, Http404):
            return JsonResponse({'error': 'Not found'}, status=404)

        elif isinstance(exception, PermissionDenied):
            return JsonResponse({'error': 'Permission denied'}, status=403)

        else:
            return JsonResponse({
                'error': 'Server error',
                'message': str(exception),
                # Bạn có thể bật phần này để debug chi tiết hơn
                # 'trace': traceback.format_exc(),
            }, status=500)



# import json
# from django.http import JsonResponse
# from django.core.exceptions import PermissionDenied
# from django.http import Http404

# class JsonExceptionMiddleware:
#     def __init__(self, get_response):
#         self.get_response = get_response

#     def __call__(self, request):
#         try:
#             return self.get_response(request)
#         except Http404:
#             return JsonResponse({'error': 'Not found'}, status=404)
#         except PermissionDenied:
#             return JsonResponse({'error': 'Permission denied'}, status=403)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)
