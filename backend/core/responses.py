"""
Standardized API response wrapper for consistent API responses.
"""
from rest_framework.response import Response
from rest_framework import status


class StandardResponse:
    """
    Standard API response format.
    
    All API responses should follow this format:
    {
        "success": true,
        "message": "",
        "data": {},
        "errors": null
    }
    """
    
    @staticmethod
    def success(data=None, message="Success", status_code=status.HTTP_200_OK):
        """
        Return a successful response.
        
        Args:
            data: The data to return
            message: Success message
            status_code: HTTP status code
            
        Returns:
            Response object with standard format
        """
        response_data = {
            "success": True,
            "message": message,
            "data": data if data is not None else {},
            "errors": None
        }
        return Response(response_data, status=status_code)
    
    @staticmethod
    def error(message="Error occurred", errors=None, status_code=status.HTTP_400_BAD_REQUEST):
        """
        Return an error response.
        
        Args:
            message: Error message
            errors: Detailed error information
            status_code: HTTP status code
            
        Returns:
            Response object with standard format
        """
        response_data = {
            "success": False,
            "message": message,
            "data": None,
            "errors": errors if errors is not None else {}
        }
        return Response(response_data, status=status_code)
    
    @staticmethod
    def created(data=None, message="Resource created successfully"):
        """
        Return a response for successful resource creation.
        
        Args:
            data: The created resource data
            message: Success message
            
        Returns:
            Response object with 201 status
        """
        return StandardResponse.success(data, message, status.HTTP_201_CREATED)
    
    @staticmethod
    def no_content(message="Resource deleted successfully"):
        """
        Return a response for successful deletion.
        
        Args:
            message: Success message
            
        Returns:
            Response object with 204 status
        """
        response_data = {
            "success": True,
            "message": message,
            "data": None,
            "errors": None
        }
        return Response(response_data, status=status.HTTP_204_NO_CONTENT)
    
    @staticmethod
    def not_found(resource="Resource"):
        """
        Return a response for resource not found.
        
        Args:
            resource: Name of the resource
            
        Returns:
            Response object with 404 status
        """
        return StandardResponse.error(
            message=f"{resource} not found",
            status_code=status.HTTP_404_NOT_FOUND
        )
    
    @staticmethod
    def bad_request(message="Bad request", errors=None):
        """
        Return a response for bad request.
        
        Args:
            message: Error message
            errors: Detailed error information
            
        Returns:
            Response object with 400 status
        """
        return StandardResponse.error(message, errors, status.HTTP_400_BAD_REQUEST)
    
    @staticmethod
    def unauthorized(message="Authentication required"):
        """
        Return a response for unauthorized access.
        
        Args:
            message: Error message
            
        Returns:
            Response object with 401 status
        """
        return StandardResponse.error(message, status_code=status.HTTP_401_UNAUTHORIZED)
    
    @staticmethod
    def forbidden(message="Permission denied"):
        """
        Return a response for forbidden access.
        
        Args:
            message: Error message
            
        Returns:
            Response object with 403 status
        """
        return StandardResponse.error(message, status_code=status.HTTP_403_FORBIDDEN)
    
    @staticmethod
    def conflict(message="Resource conflict"):
        """
        Return a response for resource conflict.
        
        Args:
            message: Error message
            
        Returns:
            Response object with 409 status
        """
        return StandardResponse.error(message, status_code=status.HTTP_409_CONFLICT)
    
    @staticmethod
    def validation_error(errors=None, message="Validation failed"):
        """
        Return a response for validation errors.
        
        Args:
            errors: Validation error details
            message: Error message
            
        Returns:
            Response object with 422 status
        """
        return StandardResponse.error(message, errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
    
    @staticmethod
    def server_error(message="Internal server error"):
        """
        Return a response for server error.
        
        Args:
            message: Error message
            
        Returns:
            Response object with 500 status
        """
        return StandardResponse.error(message, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
