from server.utils import notion

def obtener_ultimo_codigo(database_id: str) -> str:
    """Obtiene el último registro de una base de datos en Notion"""
    query = {"sorts": [{"property": "Created time", "direction": "descending"}]}
    response: dict = notion.Database(database_id).read_data(query).json()
    codes: list[dict] = [
        notion.ParserNotionResponse(item).get_simple()
        for item in response.get("results")
    ]
    last_code = codes[0].get("Code")
    return last_code