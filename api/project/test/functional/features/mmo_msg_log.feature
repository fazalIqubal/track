Feature: mmo_msg_log endpoints

    Background:
        Given I am a client <username> and password <password>
        And I am logged in

    Scenario: User makes requests to /mmo_msg_log endpoint
        When I send a <method> request to <endpoint> with payload <payload>
        Then the HTTP response status should be <response_status>
        And the response payload should be <response_data> <check_meta_only>

        Examples:
            | method   | endpoint         | payload | username       | password  | response_status | response_data                                              | check_meta_only |
            | GET      | /api/mmo_msg_log |         |                |           | 401             | {"message": "Not authorized."}                             |                 |
            | GET      | /api/mmo_msg_log |         | NON_EXISTENT   |           | 401             | {"message": "Not authorized."}                             |                 |
            | GET      | /api/mmo_msg_log |         | BST_EXEC       | bst_exec  | 403             | {"message": "User doesn't have the required permissions."} |                 |
            | GET      | /api/mmo_msg_log |         | FRD_OWNER      | frd_owner | 200             |                                                            | True            |
