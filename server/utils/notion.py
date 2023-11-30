import json
import time

import requests
API_NOTION = 'secret_dA1lJoGAuKyILJuh8qtTOlSAGr1D8Z0RMi5ZFPXOjko'

HTTP_VERIFY = False
TIMEOUT = 300


class ApiNotion:
    headers = {
        "Authorization": "Bearer " + API_NOTION,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
    }


class RequestData:

    def __init__(self):
        self.data = {"properties": {}}
        self.type = {
            "checkbox": self.make_checkbox,
            "date": self.make_date,
            "multi_select": self.make_multi_select,
            "number": self.make_number,
            "people": self.make_people,
            "rich_text": self.make_rich_text,
            "select": self.make_select,
            "status": self.make_status,
            "title": self.make_title,
            "url": self.make_url,
            "email": self.make_email,
            "relation": self.make_relation,
        }

    @staticmethod
    def make_checkbox(value):
        return {"checkbox": value}

    @staticmethod
    def make_date(value):
        return {"date": {"start": value}}

    @staticmethod
    def make_multi_select(value):
        return {"multi_select": [{"name": item} for item in value]}

    @staticmethod
    def make_number(value):
        return {"number": float(value)}

    @staticmethod
    def make_people(value):
        return {"people": [{"id": value}]}

    @staticmethod
    def make_rich_text(value):
        return {"rich_text": [{"text": {"content": value}}]}

    @staticmethod
    def make_select(value):
        return {"select": {"name": value}}

    @staticmethod
    def make_status(value):
        return {"status": {"name": value}}

    @staticmethod
    def make_title(value):
        return {"title": [{"text": {"content": value}}]}

    @staticmethod
    def make_url(value):
        return {"url": value}

    @staticmethod
    def make_email(value):
        return {"email": value}

    @staticmethod
    def make_relation(value: str | list):
        if type(value) is str:
            return {"relation": [{"id": value}]}
        elif type(value) is list:
            return {"relation": [{"id": i} for i in value]}

    def update(self, field_name, field_type, value):
        if value and value != "None":
            function = self.type.get(field_type, None)
            if not function:
                raise TypeError("Field type not found in Notion")
            self.data["properties"][field_name] = function(value)


class Database(ApiNotion):

    def __init__(self, database_id: str = None) -> None:
        super().__init__()
        self.headers = ApiNotion.headers
        self.database_id = database_id

    def create(self, content: dict) -> requests.Response:
        endpoint = "https://api.notion.com/v1/Databases"
        response = requests.post(
            url=endpoint,
            headers=self.headers,
            data=json.dumps(content),
            verify=HTTP_VERIFY,
            timeout=TIMEOUT,
        )
        response.raise_for_status()
        return response

    def read(self) -> requests.Response:
        endpoint = f"https://api.notion.com/v1/Databases/{self.database_id}"
        response = requests.get(
            url=endpoint,
            headers=self.headers,
            verify=HTTP_VERIFY,
            timeout=TIMEOUT,
        )
        response.raise_for_status()
        return response

    def update(self, content: dict) -> requests.Response:
        endpoint = f"https://api.notion.com/v1/Databases/{self.database_id}"
        response = requests.patch(
            url=endpoint,
            headers=self.headers,
            data=json.dumps(content),
            verify=HTTP_VERIFY,
            timeout=TIMEOUT,
        )
        response.raise_for_status()
        return response

    def read_data(self, query: dict) -> requests.Response:
        query = query or {}
        endpoint = f"https://api.notion.com/v1/Databases/{self.database_id}/query"
        response = requests.post(
            url=endpoint,
            headers=ApiNotion.headers,
            data=json.dumps(query),
            verify=HTTP_VERIFY,
            timeout=TIMEOUT,
        )
        response.raise_for_status()
        return response


class Page(ApiNotion):

    def __init__(self, page_id: str = None) -> None:
        super().__init__()
        self.headers = ApiNotion.headers
        self.page_id = page_id

    def create(self, database_id: str, request_data: RequestData) -> requests.Response:
        time.sleep(1)
        endpoint = "https://api.notion.com/v1/pages"
        data = {"parent": {"database_id": database_id}}
        data.update(request_data.data)
        response = requests.post(
            url=endpoint,
            headers=self.headers,
            data=json.dumps(data),
            verify=HTTP_VERIFY,
            timeout=TIMEOUT,
        )
        response.raise_for_status()
        return response

    def read(self) -> requests.Response:
        endpoint = f"https://api.notion.com/v1/pages/{self.page_id}"
        response = requests.get(
            url=endpoint,
            headers=self.headers,
            verify=HTTP_VERIFY,
            timeout=TIMEOUT,
        )
        response.raise_for_status()
        return response

    def update(self, request_data: RequestData) -> requests.Response:
        time.sleep(1)
        endpoint = f"https://api.notion.com/v1/pages/{self.page_id}"
        response = requests.patch(
            url=endpoint,
            headers=self.headers,
            data=json.dumps(request_data.data),
            verify=HTTP_VERIFY,
            timeout=TIMEOUT,
        )
        response.raise_for_status()
        return response

    def delete(self) -> requests.Response:
        endpoint = f"https://api.notion.com/v1/pages/{self.page_id}"
        response = requests.patch(
            url=endpoint,
            headers=self.headers,
            data=json.dumps({"archived": True}),
            verify=HTTP_VERIFY,
            timeout=TIMEOUT,
        )
        response.raise_for_status()
        return response


class Users:

    def __init__(self) -> None:
        super().__init__()
        self.headers = ApiNotion.headers

    def read(self) -> requests.Response:
        endpoint = "https://api.notion.com/v1/users"
        response = requests.get(
            url=endpoint,
            headers=self.headers,
            verify=HTTP_VERIFY,
            timeout=TIMEOUT,
        )
        response.raise_for_status()
        return response


class Blocks:

    def __init__(self, page_id: str) -> None:
        super().__init__()
        self.headers = ApiNotion.headers
        self.page_id = page_id

    def read(self):
        endpoint = (
            f"https://api.notion.com/v1/blocks/{self.page_id}/children?page_size=100"
        )
        response = requests.get(
            url=endpoint,
            headers=self.headers,
            verify=HTTP_VERIFY,
            timeout=TIMEOUT,
        )
        response.raise_for_status()
        return response


class Comments:

    def __init__(self, page_id: str) -> None:
        super().__init__()
        self.headers = ApiNotion.headers
        self.page_id = page_id

    def create(self, content: str):
        endpoint = "https://api.notion.com/v1/comments"
        data = {
            "parent": {"page_id": self.page_id},
            "rich_text": [{"text": {"content": content}}],
        }
        response = requests.post(
            url=endpoint,
            headers=self.headers,
            data=json.dumps(data),
            verify=HTTP_VERIFY,
            timeout=TIMEOUT,
        )
        response.raise_for_status()
        return response

    def read(self):
        endpoint = f"https://api.notion.com/v1/comments?block_id={self.page_id}"
        response = requests.get(
            url=endpoint,
            headers=self.headers,
            verify=HTTP_VERIFY,
            timeout=TIMEOUT,
        )
        response.raise_for_status()
        return response


class ParserNotionComments:

    @staticmethod
    def get_comments(content: dict):
        comments = [
            comment.get("rich_text", [])[0].get("plain_text", None)
            for comment in content.get("results", {})
        ]
        comments = [comment for comment in comments if comment]
        return comments if comments else None


class ParserNotionResponse:

    def __init__(self, content: dict) -> None:
        self.content = content
        self.type_functions = {
            "id": self.get_id,
            "created_time": self.get_created_time,
            "last_edited_time": self.get_last_edited_time,
            "created_by": self.get_created_by,
            "last_edited_by": self.get_last_edited_by,
            "parent": self.get_parent,
            "people": self.get_people,
            "phone_number": self.get_phone_number,
            "email": self.get_email,
            "url": self.get_url,
            "files": self.get_files,
            "title": self.get_title,
            "rich_text": self.get_text,
            "number": self.get_number,
            "checkbox": self.get_checkbox,
            "date": self.get_date,
            "select": self.get_select,
            "multi_select": self.get_multi_select,
            "status": self.get_status,
            "relation": self.get_relation,
        }

    @staticmethod
    def get_id(content: str) -> str:
        return content

    @staticmethod
    def get_created_time(content: dict) -> str:
        return content

    @staticmethod
    def get_last_edited_time(content: dict) -> str:
        return content

    @staticmethod
    def get_created_by(content: dict) -> str:
        return content.get("id")

    @staticmethod
    def get_last_edited_by(content: dict):
        return content.get("id")

    @staticmethod
    def get_parent(content: dict) -> str:
        return content.get("database_id", None)

    @staticmethod
    def get_url(content: dict) -> str:
        return content

    @staticmethod
    def get_people(content: dict[dict]) -> list[str | None]:
        people = [person.get("id", None) for person in content]
        return people[0]

    @staticmethod
    def get_email(content: dict) -> str:
        return content.get("email", None)

    @staticmethod
    def get_phone_number(content: dict) -> str:
        return content.get("phone_number", None)

    @staticmethod
    def get_files(content: list[dict]) -> str:
        files = [file.get("file", {}).get("url", None) for file in content]
        return files[0]

    @staticmethod
    def get_title(content: dict[dict]) -> str:
        titles = [text.get("plain_text", None) for text in content]
        return titles[0]

    @staticmethod
    def get_text(content: dict[dict]) -> str:
        texts = [text.get("plain_text", None) for text in content]
        return ".".join(texts)

    @staticmethod
    def get_number(
        content: dict,
    ) -> float:
        return content

    @staticmethod
    def get_checkbox(content: dict) -> str:
        return content

    @staticmethod
    def get_date(content: dict) -> str:
        return content.get("start", None)

    @staticmethod
    def get_select(content: dict) -> str:
        return content.get("name", None)

    @staticmethod
    def get_multi_select(content: dict[dict]) -> list[str | None]:
        return [select.get("name", None) for select in content]

    @staticmethod
    def get_status(content: dict) -> str:
        return content.get("name", None)

    @staticmethod
    def get_relation(content: dict[dict]) -> list[str | None]:
        return [select.get("id", None) for select in content]

    def get_simple(self) -> dict:
        properties = self.content["properties"]
        del self.content["properties"]
        meta_data = self.content
        processed_data = {}

        for item in meta_data:
            function = self.type_functions.get(item, None)
            if not function:
                continue
            processed_data.update({f"{item}_meta": function(meta_data[item])})

        for property in properties:
            property_content: dict = properties[property]
            property_name = property
            property_type = property_content.get("type", None)
            function = self.type_functions.get(property_type, None)
            if not function:
                continue
            value = property_content.get(property_type, None)
            value = function(value) if value else None
            processed_data.update({property_name: value})

        return processed_data

    def get_filter(self, fields: tuple):
        properties = self.content["properties"]
        del self.content["properties"]
        meta_data = self.content
        processed_data = {}

        for item in meta_data:
            function = self.type_functions.get(item, None)
            if not function:
                continue
            if f"{item}_meta" in fields:
                processed_data.update({f"{item}_meta": function(meta_data[item])})

        for property in properties:
            property_content: dict = properties[property]
            property_name = property
            property_type = property_content.get("type", None)
            function = self.type_functions.get(property_type, None)
            if not function:
                continue
            value = property_content.get(property_type, None)
            value = function(value) if value else None
            if property_name in fields:
                processed_data.update({property_name: value})

        return processed_data


class QueryDatabase:

    def __init__(self, database_id: str, query: dict = None) -> None:
        query = query or {}
        endpoint = f"https://api.notion.com/v1/Databases/{database_id}/query"
        response_has_more = True
        data = []
        while response_has_more:
            response = requests.post(
                url=endpoint,
                headers=ApiNotion.headers,
                data=json.dumps(query),
                verify=HTTP_VERIFY,
                timeout=TIMEOUT,
            )
            response.raise_for_status()
            response = json.loads(response.text)
            data.extend(response["results"])
            query.update({"start_cursor": str(response["next_cursor"])})
            response_has_more = response["has_more"]
        self.data = data

    def get_simple(self) -> list[dict]:
        return [ParserNotionResponse(item).get_simple() for item in self.data]

    def get_filter(self, fields: tuple) -> list[dict[str, str]]:
        return [ParserNotionResponse(item).get_filter(fields) for item in self.data]

    def get_key_value(self, key: str = "Code", value="id_meta") -> dict[str, str]:
        data = {}
        for item in self.data:
            key_value = ParserNotionResponse(item).get_filter((key, value))
            data.update({key_value[key]: key_value[value]})
        return data


def get_context(database_id: str) -> dict[str, list]:
    db: dict = json.loads(Database(database_id).read().text)
    db_fields: list = list(db.get("properties").keys())
    response: dict[str, list] = {}
    for db_field in db_fields:
        response.update({db_field: []})
    fields = response.keys()
    db_records = QueryDatabase(database_id).get_simple()
    for db_record in db_records:
        for field in fields:
            response[field].append(db_record.get(field))
    response_2 = {}
    for field in fields:
        response_2.update({field: sorted([i for i in set(response.get(field)) if i])})
    return response_2


def sort_list_dicts_by_value(
    list_to_sort: list[dict], list_of_sorted_values: list[str | int], key: str
) -> list[dict]:
    """
    Función usada para ordenar los valores dados por Notion según otra lista que indica como debe ser el orden.

    Args:
        list_to_sort (list[dict]): lista que contienen los objetos a ordenar.
        list_of_sorted_values (list[str  |  int]): lista que indica el orden según la posción de los valores.
        key (str): clave del diccionario por el que se ordenan los obejtos.

    Returns:
        list[dict]: lista con los objetos ordenados
    """
    no_sorted_value_index = []

    # Determinar la posición del objeto según la lista ordenada según el valor en el campo clave
    for index, item in enumerate(list_to_sort):
        index_sorted = list_of_sorted_values.index(item.get(key))
        no_sorted_value_index.append((index_sorted, index))
        # lista de tuplas con la posición del objeto según el orden y la posición original del objeto.

    sorted_values_indexs: list[tuple] = sorted(
        no_sorted_value_index, key=lambda x: x[0]
    )  # Lista de tuplas ordeanda según el orden definido en la lista

    sorted_list = [
        list_to_sort[index[1]] for index in sorted_values_indexs
    ]  # Lista original ordenada.

    return sorted_list


def obtener_usuarios_activos_notion():
    users: dict = Users().read().json()
    users_notion = {}
    for user in users.get("results"):
        users_notion.update({user.get("id"): user.get("name")})
    return users_notion


def sustituir_id_usuario_notion_iniciales_usuario(
    row: dict, field: str, users_notion: dict
):
    users_iniciales = []

    if not row[field]:
        return ""

    users_ids_str: str = row.get(field)
    users_ids = users_ids_str.split(",")

    for user_id in users_ids:
        username = users_notion.get(user_id)
        if username:
            users_iniciales.append(username)

    if users_iniciales:
        return ",".join(users_iniciales)

    return ""


def obtener_ultimo_codigo(database_id: str) -> str:
    """Obtiene el último registro de una base de datos en Notion"""
    query = {"sorts": [{"property": "Created time", "direction": "descending"}]}
    response: dict = Database(database_id).read_data(query).json()
    codes: list[dict] = [
        ParserNotionResponse(item).get_simple()
        for item in response.get("results")
    ]
    last_code = codes[0].get("Code")
    return last_code