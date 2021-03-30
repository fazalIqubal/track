class Response():
    def createSuccessResponse(self, data, message, statusCode):
        return{'type': 'success', 'data': data, 'message': message, 'statusCode': statusCode}
    def createDeleteSuccessResponse(self, message, statusCode):
        return{'type': 'success', 'message': message, 'statusCode': statusCode}
    def createFailResponse(self, message, statusCode):
        return{'type': 'error', 'message': message, 'statusCode': statusCode}

