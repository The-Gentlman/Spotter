FROM python:3.11-slim

WORKDIR /app 

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y netcat-traditional && apt-get -y install libpq-dev gcc gettext

RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt


COPY ./entrypoint.sh .
RUN sed -i 's/\r$//g' /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh


EXPOSE 8888

COPY . .

ENTRYPOINT ["/app/entrypoint.sh"]