# Provider API Reference

## Detection & Call Signatures

| Provider | Detection | Call | Result accessor |
|---|---|---|---|
| OpenAI | `from openai import OpenAI` | `.beta.chat.completions.parse(response_format=Model)` | `.choices[0].message.parsed` |
| Azure OpenAI | `from openai import AzureOpenAI` | Same as OpenAI; requires `api_version="2024-08-01-preview"` or later | `.choices[0].message.parsed` |
| Anthropic (raw) | `import anthropic` | `.messages.parse(output_format=Model)` | `.parsed_output` |
| Anthropic (instructor) | `import instructor` | `.messages.create(response_model=Model)` | direct instance |
| LangChain | `from langchain_openai import ChatOpenAI` | `.with_structured_output(Model).invoke(messages)` | direct instance |

---

## OpenAI

```python
from openai import OpenAI
from pydantic import BaseModel

client = OpenAI()

completion = client.beta.chat.completions.parse(
    model="gpt-4o-2024-08-06",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": user_prompt},
    ],
    response_format=MyModel,
)

result: MyModel = completion.choices[0].message.parsed

# Refusal handling (optional but recommended)
if completion.choices[0].message.refusal:
    raise ValueError(f"Model refused: {completion.choices[0].message.refusal}")
```

---

## Azure OpenAI

```python
from openai import AzureOpenAI
from pydantic import BaseModel

client = AzureOpenAI(
    azure_endpoint="https://<your-resource>.openai.azure.com/",
    api_version="2024-08-01-preview",   # must be this version or later
    api_key="<your-key>",
)

completion = client.beta.chat.completions.parse(
    model="<your-deployment-name>",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": user_prompt},
    ],
    response_format=MyModel,
)

result: MyModel = completion.choices[0].message.parsed
```

---

## Anthropic (raw SDK)

Structured outputs are native — pass the Pydantic model as `output_format` and read
`.parsed_output`. Forcing a tool call with `tool_choice` to extract JSON is the old
workaround; do not generate it for new code.

```python
import anthropic
from pydantic import BaseModel

client = anthropic.Anthropic()

response = client.messages.parse(
    model="claude-opus-5",
    max_tokens=16000,
    messages=[{"role": "user", "content": user_prompt}],
    output_format=MyModel,
)

result: MyModel = response.parsed_output
```

If you need the raw JSON schema instead of a Pydantic model, pass it through
`output_config` on the normal `create()` call:

```python
response = client.messages.create(
    model="claude-opus-5",
    max_tokens=16000,
    messages=[{"role": "user", "content": user_prompt}],
    output_config={
        "format": {
            "type": "json_schema",
            "schema": MyModel.model_json_schema(),  # must set additionalProperties: false
        }
    },
)
```

---

## Anthropic (instructor)

```python
import anthropic
import instructor
from pydantic import BaseModel

client = instructor.from_anthropic(anthropic.Anthropic())

result: MyModel = client.messages.create(
    model="claude-opus-5",
    max_tokens=16000,
    messages=[{"role": "user", "content": user_prompt}],
    response_model=MyModel,
)
# result is already a MyModel instance
```

---

## LangChain

```python
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel

llm = ChatOpenAI(model="gpt-4o-2024-08-06")
structured_llm = llm.with_structured_output(MyModel)

result: MyModel = structured_llm.invoke([
    SystemMessage(content="You are a helpful assistant."),
    HumanMessage(content=user_prompt),
])
# result is already a MyModel instance
```

---

## Refusal Handling Pattern (OpenAI / Azure)

```python
message = completion.choices[0].message

if message.refusal:
    # Model declined to respond (content policy, ambiguous request, etc.)
    raise ValueError(f"Model refused to complete the request: {message.refusal}")

result = message.parsed
```
