class EmailTemplate():
    def tenantEmailVerification(data):
        template = '<p>Your Email has been registered successfully email : {email} and password :{password} </p>'.format(**data)
        return template
    

