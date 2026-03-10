# Pydantic Patterns Reference

## Type Mapping

| JSON schema type | Python type | Notes |
|---|---|---|
| `"string"` | `str` | |
| `"integer"` | `int` | |
| `"number"` | `float` | |
| `"boolean"` | `bool` | |
| `"a\|b\|c"` | `class T(str, Enum)` | Always `(str, Enum)`, not plain `Enum` |
| `[{...}]` | `List[SubModel]` | Define SubModel separately |
| `[string]` | `List[str]` | |
| `{...}` nested | nested `BaseModel` | |
| nullable / optional | `Optional[T] = None` | Always include `= None` |
| small fixed set (2-3, no reuse) | `Literal["a", "b"]` | Prefer Enum for 4+ or reused values |

---

## Enum Rules

- Class name: SCREAMING_SNAKE_CASE for the class name is wrong — use PascalCase (e.g., `SentimentLabel`)
- Enum member names: SCREAMING_SNAKE_CASE (e.g., `POSITIVE = "positive"`)
- Values: preserve exactly as they appear in the original prompt literals
- Always inherit `(str, Enum)` — required for OpenAI structured outputs serialization

```python
from enum import Enum

class SentimentLabel(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"
```

---

## Definition Order

Always define in this order to avoid forward reference errors:
1. Enums
2. Leaf models (no nested BaseModel fields)
3. Composite models (reference leaf models or enums)

---

## Optional Fields

```python
from typing import Optional

class ArticleInfo(BaseModel):
    title: str
    subtitle: Optional[str] = None   # always include = None
    word_count: Optional[int] = None
```

---

## List Fields

```python
from typing import List

class Report(BaseModel):
    tags: List[str]
    sections: List[Section]          # Section defined before Report
```

---

## Field Constraints

```python
from pydantic import BaseModel, Field

class Product(BaseModel):
    name: str = Field(description="Product display name")
    price: float = Field(ge=0, description="Price in USD, non-negative")
    rating: float = Field(ge=0, le=5, description="Star rating 0-5")
    sku: str = Field(pattern=r"^[A-Z]{3}-\d{4}$")
```

---

## Complete Mixed-Type Example

Original prompt excerpt:
```
Return JSON with:
- "title": string
- "sentiment": "positive"|"negative"|"neutral"
- "score": number between 0 and 1
- "keywords": list of strings
- "metadata": object with "author" (string) and "published_date" (string, optional)
```

Pydantic model set:

```python
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field

# 1. Enums first
class Sentiment(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"

# 2. Leaf models
class Metadata(BaseModel):
    author: str
    published_date: Optional[str] = None

# 3. Composite model
class ArticleAnalysis(BaseModel):
    title: str
    sentiment: Sentiment
    score: float = Field(ge=0, le=1)
    keywords: List[str]
    metadata: Metadata
```
