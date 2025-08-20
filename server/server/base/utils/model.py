from dateutil.relativedelta import relativedelta


def init_kwargs(model, arg_dict):
    model_fields = [f.name for f in model._meta.get_fields()]
    return {k: v for k, v in arg_dict.items() if k in model_fields}


def remaining_time(start, end):
    delta = relativedelta(end, start)
    remaining_months = delta.years * 12 + delta.months
    remaining_days = delta.days

    return {"months": remaining_months, "days": remaining_days}
