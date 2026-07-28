"""
Category mapping utilities: store categories as integers in DB,
but expose names in API responses.
"""
from typing import Dict
from typing import Union

# Default category mapping. Keys are integers stored in DB; values are display names.
CATEGORY_MAP: Dict[int, str] = {
    1: "野菜",
    2: "果物",
    3: "肉類",
    4: "魚介類",
    5: "乳製品",
    6: "卵",
    7: "調味料",
    8: "飲料",
    9: "その他",
}


def id_to_name(cat_id: int) -> str:
    try:
        return CATEGORY_MAP.get(int(cat_id), CATEGORY_MAP[9])
    except Exception:
        return CATEGORY_MAP[9]


def name_to_id(category: Union[int, str]) -> int:
    if isinstance(category, int):
        return category if category in CATEGORY_MAP else 9

    normalized = str(category).strip()
    for k, v in CATEGORY_MAP.items():
        if v == normalized:
            return k
    return 9
