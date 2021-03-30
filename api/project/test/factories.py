import cx_Oracle
from factory import fuzzy, Factory
from factory.faker import faker
from factory.fuzzy import BaseFuzzyAttribute
from sqlalchemy import Sequence

from app.authentication.models.user import UserRole
from app.frd.models.frd_prod_subpr import FRDProdSubpr
from app.mmo_acc.models.frd_mmo_acc import FRDMmoAcc
from app.mmo_acc.models.mmo_msg_log import MmoMsgLog
from app.shared.models.base import (
    BaseModel,
    Column,
    DateTimeColumn,
    IntegerColumn,
    TextColumn,
    DateColumn,
)
from app.test.utils import get_fuzzy_date


class Factory:
    @classmethod
    def get_instance(cls, parameters: dict = {}) -> Factory:
        """ Build a factory model instance.

        A factory instance can accept parameters to be set on the model
        or will just initialize the fuzzy attribute.

        :param parameters: the model factory attributes
        :return: a model factory

        """
        if parameters and not isinstance(parameters, dict):
            raise ValueError("Invalid parameters.")

        instance = cls()
        for attr_name, attr_value in cls.__dict__.items():
            if attr_name in parameters:
                setattr(instance, attr_name, parameters[attr_name])
            elif isinstance(attr_value, Column) and isinstance(
                attr_value.value, BaseFuzzyAttribute
            ):
                value = attr_value.value.fuzz()
            else:
                value = attr_value
            setattr(instance, attr_name, value)

        return instance


class ExampleFactory(BaseModel, Factory):
    def __init__(self, column_1, column_2):
        self.column_1 = Column("column_1", column_1)
        self.column_2 = Column("column_2", column_2)
        self.other_var = True


class FRDProdSubprFactory(FRDProdSubpr, Factory):
    product_code = TextColumn(
        "product_code", fuzzy.FuzzyText(length=10), length=10, nullable=False
    )
    sub_product = TextColumn(
        "sub_product", fuzzy.FuzzyText(length=10), length=10, nullable=False
    )
    sub_prod_descr = TextColumn("sub_prod_descr", fuzzy.FuzzyText(length=75), length=75)
    subordinated = TextColumn("subordinated", fuzzy.FuzzyChoice(["Y", "N"]), length=1)
    ps_prod_s_2 = TextColumn("ps_prod_s_2", fuzzy.FuzzyText(length=6), length=6)
    ps_prod_l_2 = TextColumn("ps_prod_l_2", fuzzy.FuzzyText(length=6), length=6)
    fix_flo = TextColumn("fix_flo", fuzzy.FuzzyText(length=20), length=20)
    remark = TextColumn("remark", fuzzy.FuzzyText(length=30), length=30)
    creation_appr_date = DateColumn("creation_appr_date")
    close_appr_date = DateColumn("close_appr_date")
    created_by = TextColumn("created_by", fuzzy.FuzzyText(length=30), length=30)
    creation_date = DateTimeColumn("creation_date")
    last_updated_by = TextColumn(
        "last_updated_by", fuzzy.FuzzyText(length=30), length=30
    )
    last_update_date = DateTimeColumn("last_update_date")
    created_appr_by = TextColumn(
        "created_appr_by", fuzzy.FuzzyText(length=30), length=30
    )
    closed_by = TextColumn("closed_by", fuzzy.FuzzyText(length=30), length=30)
    closed_date = DateTimeColumn("closed_date")
    closed_appr_by = TextColumn("closed_appr_by", length=30)
    chk = TextColumn("chk", fuzzy.FuzzyChoice(["Y", "N"]), length=2, nullable=False)
    status = TextColumn(
        "status", fuzzy.FuzzyChoice(["PU", "PC"]), length=1, nullable=False
    )
    id = IntegerColumn("id", Sequence(FRDProdSubpr.__tablename__ + "_SEQ").next_value())


class FRDMmoAccFactory(FRDMmoAcc, Factory):
    base_entity = TextColumn("base_entity", fuzzy.FuzzyText(length=10), length=10)
    ps_affiliate = TextColumn("ps_affiliate", fuzzy.FuzzyText(length=5), length=5)
    amount_in_bce = IntegerColumn("amount_in_bce")
    mmo_account = TextColumn("mmo_account", fuzzy.FuzzyText(length=10), length=10)
    base_ccy = TextColumn("base_ccy", fuzzy.FuzzyText(length=3), length=3)
    as_of_date = DateTimeColumn("as_of_date", get_fuzzy_date(0, 0))
    start_date = DateTimeColumn("start_date", get_fuzzy_date(5, 4))
    end_date = DateTimeColumn("end_date", get_fuzzy_date(0, 0))
    source_view = TextColumn("source_view", fuzzy.FuzzyText(length=64), length=64)
    reporting_y_n = TextColumn("reporting_y_n", fuzzy.FuzzyText(length=1), length=1)
    ps_account = TextColumn("ps_account", fuzzy.FuzzyText(length=10), length=10)
    ps_customer = TextColumn("ps_customer", fuzzy.FuzzyText(length=6), length=6)
    ps_product = TextColumn("ps_product", fuzzy.FuzzyText(length=8), length=8)
    ps_risk = TextColumn("ps_risk", fuzzy.FuzzyText(length=6), length=6)
    validation_rule = TextColumn("validation_rule", fuzzy.FuzzyText(length=4), length=4)
    validation_rule_description = TextColumn(
        "validation_rule_description", fuzzy.FuzzyText(length=40), length=40
    )
    val_rule_type = TextColumn("val_rule_type", fuzzy.FuzzyText(length=30), length=30)
    validation_group = TextColumn(
        "validation_group", fuzzy.FuzzyText(length=20), length=20
    )
    bal_sheet_value = IntegerColumn("bal_sheet_value", fuzzy.FuzzyInteger(low=0, high=1000))
    rem_mat = IntegerColumn("rem_mat", fuzzy.FuzzyInteger(low=0, high=1000))
    product_code = TextColumn("product_code", fuzzy.FuzzyText(length=6), length=6)
    sub_product_code = TextColumn(
        "sub_product_code", fuzzy.FuzzyText(length=10), length=10
    )
    account_type = TextColumn("account_type", fuzzy.FuzzyText(length=15), length=15)
    fix_flo_ind = TextColumn("fix_flo_ind", fuzzy.FuzzyText(length=30), length=30)
    fo_no = TextColumn("fo_no", fuzzy.FuzzyText(length=34), length=34)
    internal_ind = TextColumn("internal_ind", fuzzy.FuzzyText(length=34), length=34)
    isin_code = TextColumn("isin_code", fuzzy.FuzzyText(length=12), length=12)
    cpty_centre = TextColumn("cpty_centre", fuzzy.FuzzyText(length=10), length=10)
    number_nom = IntegerColumn("number_nom", fuzzy.FuzzyInteger(low=0, high=100))
    proficenter = TextColumn("proficenter", fuzzy.FuzzyText(length=4), length=4)
    pay_receive_ind = TextColumn("pay_receive_ind", fuzzy.FuzzyText(length=1), length=1)
    cashflow_date = DateTimeColumn("start_date", get_fuzzy_date(3, 3))
    amount_in_eur = IntegerColumn("amount_in_eur", fuzzy.FuzzyInteger(low=0, high=100000))
    duration_code = TextColumn("duration_code", fuzzy.FuzzyText(length=1), length=1)
    duration_code_grp = TextColumn(
        "duration_code_grp", fuzzy.FuzzyText(length=1), length=1
    )
    duration_descr = TextColumn("duration_descr", fuzzy.FuzzyText(length=30), length=30)
    mmo_account_description = TextColumn(
        "mmo_account_description", fuzzy.FuzzyText(length=50), length=50
    )
    val_cat = IntegerColumn("val_cat", fuzzy.FuzzyInteger(low=0, high=500))
    created_by = TextColumn("created_by", fuzzy.FuzzyText(length=50), length=50)
    created_date = DateTimeColumn("created_date", get_fuzzy_date(6, 6))
    last_updated_by = TextColumn(
        "last_updated_by", fuzzy.FuzzyText(length=50), length=50
    )
    last_update_date = DateTimeColumn("last_update_date")
    frd_source_view = TextColumn(
        "frd_source_view", fuzzy.FuzzyText(length=32), length=32
    )
    rpt_amnt_bce = IntegerColumn("rpt_amnt_bce", fuzzy.FuzzyInteger(low=0, high=10000))
    nom_amnt_bce = IntegerColumn("nom_amnt_bce", fuzzy.FuzzyInteger(low=0, high=10000))
    cshflw_amnt_bce = IntegerColumn("cshflw_amnt_bce", fuzzy.FuzzyInteger(low=0, high=10000))
    fix_flo_dflt_ind = IntegerColumn("fix_flo_dflt_inc", fuzzy.FuzzyInteger(low=0, high=10000))
    ccy = TextColumn("ccy", fuzzy.FuzzyText(length=3), length=3)
    id = IntegerColumn("id", Sequence(FRDMmoAcc.__tablename__ + "_SEQ").next_value())
    frd_id = IntegerColumn("frd_id")
    record_type = TextColumn("record_type", "A", length=1)
    remark = TextColumn("remark", fuzzy.FuzzyText(length=24), length=24)
    edf_id = IntegerColumn("edf_id")
    book = TextColumn("book", fuzzy.FuzzyText(length=4), length=4)
    security_code = TextColumn("security_code", length=34)
    mmo_key = TextColumn("mmo_key", fuzzy.FuzzyText(length=30), length=30)
    hedge_id = TextColumn("hedge_id", fuzzy.FuzzyText(length=12), length=12)
    hedge_id_type = TextColumn("hedge_id_type", fuzzy.FuzzyText(length=10), length=10)
    hedge_proportion = IntegerColumn("hedge_proportion", fuzzy.FuzzyInteger(low=1, high=500))


class MmoMsgLogFactory(MmoMsgLog, Factory):
    datetimestamp = DateTimeColumn("datetimestamp")
    process = TextColumn("process", fuzzy.FuzzyText(length=128), length=128)
    as_of_date = DateTimeColumn("as_of_date")
    pack = TextColumn("pac", fuzzy.FuzzyText(length=30), length=30)
    proc = TextColumn("proc", fuzzy.FuzzyText(length=30), length=30)
    label = TextColumn("status", fuzzy.FuzzyText(length=10), length=10)
    status = TextColumn("status", fuzzy.FuzzyText(length=1), length=1)
    sqlcode = IntegerColumn("sqlcode", fuzzy.FuzzyInteger(low=0, high=1000))
    sqlerrm = TextColumn("sqlerrm", fuzzy.FuzzyText(length=400), length=400)
    msg = TextColumn("msg", fuzzy.FuzzyText(length=400), length=400)
    id = IntegerColumn("id", Sequence(MmoMsgLog.__tablename__ + "_SEQ").next_value())
    edf_id = IntegerColumn("edf_id")


class UserRoleFactory(UserRole, Factory):
    username = TextColumn("username", fuzzy.FuzzyText(length=12), length=12)
    granted_role = TextColumn("granted_role", fuzzy.FuzzyText(length=12), length=12)
