"""
Base view classes with standardized API response format.
"""
from rest_framework import generics, status
from rest_framework.response import Response
from core.responses import StandardResponse


class BaseAPIView(generics.GenericAPIView):
    """
    Base API view with standardized response format.
    All views should inherit from this class for consistent responses.
    """
    
    def get_response(self, data=None, message="Success", status_code=status.HTTP_200_OK):
        """
        Return a standardized response.
        
        Args:
            data: The data to return
            message: Response message
            status_code: HTTP status code
            
        Returns:
            Response object with standard format
        """
        return StandardResponse.success(data, message, status_code)
    
    def get_error_response(self, message="Error occurred", errors=None, status_code=status.HTTP_400_BAD_REQUEST):
        """
        Return a standardized error response.
        
        Args:
            message: Error message
            errors: Detailed error information
            status_code: HTTP status code
            
        Returns:
            Response object with standard format
        """
        return StandardResponse.error(message, errors, status_code)


class BaseListCreateView(BaseAPIView, generics.ListCreateAPIView):
    """
    Base list/create view with standardized responses.
    """
    
    def list(self, request, *args, **kwargs):
        """
        Override list method to return standardized response.
        """
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return self.get_response(serializer.data, "Success")
    
    def create(self, request, *args, **kwargs):
        """
        Override create method to return standardized response.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return self.get_response(serializer.data, "Resource created successfully", status.HTTP_201_CREATED)


class BaseRetrieveUpdateDestroyView(BaseAPIView, generics.RetrieveUpdateDestroyAPIView):
    """
    Base retrieve/update/destroy view with standardized responses.
    """
    
    def retrieve(self, request, *args, **kwargs):
        """
        Override retrieve method to return standardized response.
        """
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return self.get_response(serializer.data, "Success")
    
    def update(self, request, *args, **kwargs):
        """
        Override update method to return standardized response.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
        
        return self.get_response(serializer.data, "Resource updated successfully")
    
    def destroy(self, request, *args, **kwargs):
        """
        Override destroy method to return standardized response.
        """
        instance = self.get_object()
        self.perform_destroy(instance)
        return self.get_response(None, "Resource deleted successfully", status.HTTP_204_NO_CONTENT)
