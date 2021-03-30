Feature: frd_mmo_acc endpoints

    Background:
        Given I am a client <username> and password <password>
        And I am logged in

    Scenario: User makes requests to /frd_mmo_acc endpoint
        When I send a <method> request to <endpoint> with payload <payload>
        Then the HTTP response status should be <response_status>
        And the response payload should be <response_data> <check_meta_only>

        Examples:
            | method   | endpoint                | payload | username       | password  | response_status | response_data                                              | check_meta_only |
            | GET      | /api/frd_mmo_acc        |         |                |           | 401             | {"message": "Not authorized."}                             |                 |
            | GET      | /api/frd_mmo_acc        |         | NON_EXISTENT   |           | 401             | {"message": "Not authorized."}                             |                 |
            | GET      | /api/frd_mmo_acc        |         | BST_EXEC       | bst_exec  | 403             | {"message": "User doesn't have the required permissions."} |                 |
            | GET      | /api/frd_mmo_acc        |         | FRD_OWNER      | frd_owner | 200             |                                                            | True            |
            | POST     | /api/frd_mmo_acc        |         |                |           | 401             | {"message": "Not authorized."}                             |                 |
            | POST     | /api/frd_mmo_acc        |         | NON_EXISTENT   |           | 401             | {"message": "Not authorized."}                             |                 |
            | POST     | /api/frd_mmo_acc        |         | BST_EXEC       | bst_exec  | 403             | {"message": "User doesn't have the required permissions."} |                 |


    Scenario: User makes POST requests to /frd_mmo_acc endpoint
        When I send a POST request to <endpoint> with payload <payload>
        Then the HTTP response status should be <response_status>
        And the JSON response payload should contain the keys <response_keys>
        And the new newly created entry with <payload> exists on the database

        Examples:
            | endpoint         | payload                                                                        | username       | password  | response_status | response_keys          |
            | /api/frd_mmo_acc | {"base_entity": "test_entity", "ps_affiliate": "larger_column"}                | FRD_OWNER      | frd_owner | 400             | ["errors", "message"]  |
            | /api/frd_mmo_acc | {"base_entity": "test_e", "ps_affiliate": "test"}                              | FRD_OWNER      | frd_owner | 201             | ["id", ]               |
