Feature: Indicator maintenance
As user of DHIS2
I want to be able to add and manage indicators. Indicators are defined by
a mathematical formula containing data elements and their category option combinations.

    Background:
      Given that I am logged in

      @createUser
      Scenario: Add a valid indicator type without permissions
        When I fill in the fields for an indicator type with valid data:
        | name    | factor |
        | Percent | 100    |
        And I submit that indicator type to the server
        Then I should be informed I have no permission to do that operation.

    Scenario: Add a valid indicator type
        Given I have the necessary permissions to add and delete indicators
        When I fill in the fields for an indicator type with valid data:
        | name    | factor |
        | Percent | 100    |
        And I submit that indicator type to the server
        Then I should be informed that the indicator type was created successfully.

    Scenario: Add an indicator type with decimal factor
        Given I have the necessary permissions to add and delete indicators
        When I fill in the fields for an indicator type with valid data:
        | name     | factor    |
        | PercentZ | 100.1     |
        And I submit that indicator type to the server
        Then I should be informed that indicator type is invalid
        And receive the message "Allowed range for numeric property `factor` is [0 to 2,147,483,647], but number given was 100.1.".

    Scenario: Add an indicator type with negative factor
        Given I have the necessary permissions to add and delete indicators
        When I fill in the fields for an indicator type with valid data:
        | name     | factor    |
        | Perzent  | -1        |
        And I submit that indicator type to the server
        Then I should be informed that indicator type is invalid
        And receive the message "Allowed range for numeric property `factor` is [0 to 2,147,483,647], but number given was -1.".

    Scenario: Add an indicator type without name
        Given I have the necessary permissions to add and delete indicators
        When I fill in the fields for an indicator type with valid data:
        | name     | factor    |
        |          | 100       |
        And I submit that indicator type to the server
        Then I should be informed that indicator type is invalid
        And receive the message "Missing required property `name`.".

    Scenario: Add an indicator type without factor
        Given I have the necessary permissions to add and delete indicators
        When I fill in the fields for an indicator type with valid data:
        | name     | factor    |
        | Persent  |           |
        And I submit that indicator type to the server
        Then I should be informed that indicator type is invalid
        And receive the message "Missing required property `factor`.".

    Scenario: Add a valid indicator with a numerator and denominator
        Given I have the necessary permissions to add and delete indicators
        And I create the following category combinations:
        | name   | dataDimensionType | id             |
        | Baz    | DISAGGREGATION    | znHoMDcazDV    |
        | QuX    | DISAGGREGATION    | vDSrLNDcZxg    |
        And I create the following data elements:
        | name  | shortName | domainType | valueType | aggregationType  | categoryCombo | id            |
        | Foo   | FOO       | AGGREGATE  | NUMBER    | SUM              | vDSrLNDcZxg   | M3OggnM4gBb   |
        | Bar   | BAZ       | AGGREGATE  | NUMBER    | SUM              | znHoMDcazDV   | vtbfnINRXEE   |
        And I create an indicator type:
        | name          | id          |
        | PercentNumDen | TiOzznM4gBb |
        When I fill in the required fields for an indicator
        | name | shortName | indicatorType |
        | Eggs | Eggs      | TiOzznM4gBb   |
        And I define the indicator formula
        | numerator                   | denominator                 |
        | #{M3OggnM4gBb.znHoMDcazDV}  | #{vtbfnINRXEE.vDSrLNDcZxg}  |
        And I submit the indicator to the server
        Then I should be informed that the indicator was created
        And the indicator should correspond to what I submitted.

    Scenario: Add an indicator without a denominator
        Given I have the necessary permissions to add and delete indicators
        And I create the following category combinations:
        | name   | dataDimensionType | id             |
        | BazDen | DISAGGREGATION    | zxHoMDcazDV    |
        | QuXDen | DISAGGREGATION    | tDSrLNDcZxg    |
        And I create the following data elements:
        | name   | shortName | domainType | valueType | aggregationType  | categoryCombo | id            |
        | FooDen | FOO_DEN   | AGGREGATE  | NUMBER    | SUM              | tDSrLNDcZxg   | l3OggnM4gBb   |
        | BarDen | BAZ_DEN   | AGGREGATE  | NUMBER    | SUM              | zxHoMDcazDV   | vZbfnINRXEE   |
        And I create an indicator type:
        | name    | id         |
        | Number | ziOzznM4gBb |
        When I fill in the required fields for an indicator
        | name | shortName | indicatorType |
        | Eggs | Eggs      | ziOzznM4gBb   |
        And I define the indicator formula
        | numerator                                               |
        | #{l3OggnM4gBb.zxHoMDcazDV} + #{vZbfnINRXEE.tDSrLNDcZxg} |
        And I submit the indicator to the server
        Then I should be informed that indicator is invalid
        And receive the message "Missing required property `denominator`.".
