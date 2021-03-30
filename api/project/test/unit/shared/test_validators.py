from datetime import datetime
import pytest
import unittest

from shared.exceptions import InvalidInputException
from shared.validators import DateColumnValidator, ColumnValidator


class TestValidator(unittest.TestCase):
    def test_validator_not_strict(self):
        int_validator = ColumnValidator("int_test_column", int, strict=False)
        str_validator = ColumnValidator("str_test_column", str, strict=False)
        dict_validator = ColumnValidator("dict_test_column", dict, strict=False)
        float_validator = ColumnValidator("float_test_column", float, strict=False)
        bool_validator = ColumnValidator("bool_test_column", bool, strict=False)

        with pytest.raises(InvalidInputException):
            int_validator("abc")
        assert int_validator(1) == 1
        assert int_validator("1") == 1

        assert str_validator(123) == "123"
        assert str_validator("abc") == "abc"

        with pytest.raises(InvalidInputException):
            dict_validator("abc")
        assert dict_validator({"a": "b"}) == {"a": "b"}

        with pytest.raises(InvalidInputException):
            float_validator("abc")
        assert float_validator("1.5") == 1.5
        assert float_validator(1.5) == 1.5

        assert bool_validator("1")
        assert bool_validator(True)

    def test_validator_strict(self):
        int_validator = ColumnValidator("int_test_column", int)
        str_validator = ColumnValidator("str_test_column", str)
        dict_validator = ColumnValidator("dict_test_column", dict)
        float_validator = ColumnValidator("float_test_column", float)
        bool_validator = ColumnValidator("bool_test_column", bool)

        with pytest.raises(InvalidInputException):
            int_validator("1")
        assert int_validator(1) == 1

        with pytest.raises(InvalidInputException):
            str_validator(123)
        assert str_validator("abc") == "abc"

        with pytest.raises(InvalidInputException):
            dict_validator("abc")
        assert dict_validator({"a": "b"}) == {"a": "b"}

        with pytest.raises(InvalidInputException):
            float_validator("1.5")
        assert float_validator(1.5) == 1.5

        with pytest.raises(InvalidInputException):
            bool_validator("1")
        assert bool_validator(True)


class TestDateValidator(unittest.TestCase):
    def setUp(self) -> None:
        self.fmt = "%d-%m-%Y"
        self.date_validator = DateColumnValidator(
            "datetime_test_validator", fmt=self.fmt
        )
        self.dt = datetime.now().date()
        self.dt_str = self.dt.strftime(self.fmt)

    def test_date_validator(self):
        invalid_dt_str = "2015-10-2015"

        with pytest.raises(InvalidInputException):
            self.date_validator(invalid_dt_str)

        assert self.date_validator(self.dt_str) == self.dt
