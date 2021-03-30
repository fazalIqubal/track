from datetime import datetime
import random
import unittest

import pytest

from app import get_db_session
from config import DB_USERNAME
from frd.models.frd_prod_subpr import FRDProdSubpr
from shared.exceptions import InvalidColumnException
from shared.models.base import DateTimeColumn, ChoiceColumn
from test.factories import ExampleFactory, Column, FRDMmoAccFactory


class TestBaseModel(unittest.TestCase):
    def setUp(self) -> None:
        self.test_model = ExampleFactory("test_str1", "test_str2")
        self.test_real_model = FRDMmoAccFactory()
        self.db = get_db_session(DB_USERNAME)

    def tearDown(self) -> None:
        self.db.rollback()

    def test_hash_is_set(self):
        assert hasattr(self.test_model, "hash")
        assert len(self.test_model.hash.value) > 0

    def test_to_json(self):
        expected_json = {
            "column_1": "test_str1",
            "column_2": "test_str2",
            "hash": self.test_model.hash.value,
        }

        assert self.test_model.to_json() == expected_json

    def test_from_db_result_proxy(self):
        owner = DB_USERNAME
        table_name = "FRD_PROD_SUBPR"

        count_query = """SELECT count(*) FROM {owner}.{table_name}""".format(
            owner=owner, table_name=table_name
        )

        with self.db.cursor() as cur:
            num_rows = cur.execute(count_query).fetchone()[0]

        query = """SELECT * FROM {owner}.{table_name}""".format(
            owner=owner, table_name=table_name
        )

        with self.db.cursor() as cur:
            res = FRDProdSubpr.from_db(cur.execute(query).fetchall(), cur)

        assert len(res) > 0
        assert num_rows == len(res)

    def test_from_db_fetch_all(self):
        owner = DB_USERNAME
        table_name = "FRD_PROD_SUBPR"

        count_query = """SELECT count(*) FROM {owner}.{table_name}""".format(
            owner=owner, table_name=table_name
        )

        with self.db.cursor() as cur:
            num_rows = cur.execute(count_query).fetchone()[0]

        query = """SELECT * FROM {owner}.{table_name}""".format(
            owner=owner, table_name=table_name
        )

        with self.db.cursor() as cur:
            res = FRDProdSubpr.from_db(cur.execute(query).fetchall(), cur)

        assert len(res) > 0
        assert num_rows == len(res)

    def test_from_db_fetch_one(self):
        owner = DB_USERNAME
        table_name = "FRD_PROD_SUBPR"

        query = """SELECT * FROM {owner}.{table_name}""".format(
            owner=owner, table_name=table_name
        )

        with self.db.cursor() as cur:
            res = FRDProdSubpr.from_db(cur.execute(query).fetchone(), cur)

        assert isinstance(res, FRDProdSubpr)
        assert hasattr(res, "id")
        assert hasattr(res, "hash") and res.hash is not None

    def test_all(self):
        owner = DB_USERNAME
        table_name = self.test_real_model.__tablename__

        count_query = """SELECT count(*) FROM {owner}.{table_name}""".format(
            owner=owner, table_name=table_name
        )

        with self.db.cursor() as cur:
            num_rows = cur.execute(count_query).fetchone()[0]

        res = FRDMmoAccFactory.all(self.db, results_per_page=num_rows)
        assert len(res) == num_rows

        max_results = 5
        res1 = FRDMmoAccFactory.all(self.db, results_per_page=max_results)
        assert len(res1) <= max_results

        # Different page should have different results
        page = 1
        res2 = FRDMmoAccFactory.all(self.db, page=page, results_per_page=max_results)
        res1_ids = [row.id for row in res1]
        assert len(res2) <= max_results
        assert not any(row.id in res1_ids for row in res2)

    def test_get_by_id(self):
        owner = DB_USERNAME
        table_name = self.test_real_model.__tablename__

        select_query = """SELECT * FROM {owner}.{table_name} WHERE ROWNUM <= 1""".format(
            owner=owner, table_name=table_name
        )

        with self.db.cursor() as cur:
            res = cur.execute(select_query).fetchone()
            columns = [d[0].lower() for d in cur.description]
            raw_res = dict(zip(columns, res))

        res = FRDMmoAccFactory.get_by_id(self.db, raw_res["id"])

        assert res.id.value == raw_res["id"]
        assert res.product_code.value == raw_res["product_code"]
        assert len(res.to_json()) == len(raw_res) - 1  # - 1 due hash column


class TestColumn(unittest.TestCase):
    def setUp(self) -> None:
        self.column_name = "name"
        self.column_value = "value"
        self.column = Column(self.column_name, self.column_value)

    def test_to_json(self):
        expected_json = {self.column_name: self.column_value}

        assert self.column.to_json() == expected_json


class TestDatetimeColumn(unittest.TestCase):
    def setUp(self) -> None:
        self.column_name = "name"
        self.column_value = datetime.now()
        self.column = DateTimeColumn(self.column_name, self.column_value)

    def test_to_json_default_dt_fmt(self):
        dt_str = self.column_value.strftime(self.column.fmt)

        expected_json = {self.column_name: dt_str}

        assert self.column.to_json() == expected_json

    def test_to_json_custom_dt_fmt(self):
        column_name = "name"
        column_value = datetime.now()
        fmt = "%d-%m-%Y"
        dt_str = column_value.strftime(fmt)
        self.column = DateTimeColumn(column_name, column_value, fmt=fmt)

        expected_json = {self.column_name: dt_str}

        assert self.column.to_json() == expected_json


class TestSelectForUpdateContextManager(unittest.TestCase):
    def test_invalid_select_for_update(self):
        pass

    def test_exception_occurs(self):
        pass


class TestChoiceColumn(unittest.TestCase):
    def setUp(self) -> None:
        self.name = "choices_column"
        self.choices = [1, 2, 3, 4]
        self.selected = random.choice(self.choices)
        self.choice_column = ChoiceColumn(
            self.name, int, value=self.selected, choices=self.choices
        )

    def test_to_json(self):
        expected = {self.name: self.selected}
        assert self.choice_column.to_json() == expected

    def test_properties(self):
        expected = {
            self.name: {
                "type": self.choice_column.datatype.__name__,
                "choices": self.choice_column.choices,
            }
        }
        assert self.choice_column.properties() == expected


class TestDateTimeColumn(unittest.TestCase):
    def setUp(self) -> None:
        self.fmt = "%d-%m-%Y %H"
        self.name = "dt_column"
        self.dt = datetime.now()
        self.dt_str = self.dt.strftime(self.fmt)
        self.dt_column = DateTimeColumn(self.name, value=self.dt, fmt=self.fmt)

    def test_to_json_invalid_type(self):
        self.dt_column.value = "test"
        with pytest.raises(InvalidColumnException):
            self.dt_column.to_json()

    def test_to_json(self):
        expected = {self.name: self.dt_str}
        res = self.dt_column.to_json()
        assert res == expected
