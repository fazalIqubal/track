Feature: authentication endpoints

    Scenario: Client tries to login with incorrect and correct credentials
        Given I am a client <username> and password <password>
        When I login
        Then the HTTP response status should be <response_status>
        And the JSON response payload should contain the keys <response_keys>

        Examples:
            | username  | password  | response_status | response_keys                     |
            |           |           | 401             | []                                |
            | random    | random    | 401             | []                                |
            | FRD_OWNER | frd_owner | 200             | ["access_token", "refresh_token"] |


    Scenario: Client logs out
        Given I am a client <username> and password <password>
        And I am logged in
        When I logout
        Then the HTTP response status should be <response_status>
        And my access token should be revoked

        Examples:
            | username  | password  | response_status |
            |           |           | 401             |
            | random    | random    | 401             |
            | FRD_OWNER | frd_owner | 200             |



    Scenario: Client ask for a new access token
        Given I am a client <username> and password <password>
        And I am logged in
        When I refresh a token providing my <token_for_refresh>
        Then the HTTP response status should be <response_status>
        And the JSON response payload should contain the keys <response_keys>

        Examples:
            | username | password   | token_for_refresh | response_status | response_keys |
            |           |           |                   | 401             | ["message", ]      |
            | random    | random    |                   | 401             | ["message", ]      |
            | FRD_OWNER | frd_owner | access_token      | 401             | ["message", ]      |
            | FRD_OWNER | frd_owner | refresh_token     | 200             | ["access_token", ] |
