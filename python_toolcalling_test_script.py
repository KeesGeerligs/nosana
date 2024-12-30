from openai import OpenAI
import json

client = OpenAI(base_url="https://vzt2pMV3zhBc2jZF2nCfqrXr8vhBzjDYo9vodo3x1tA.node.k8s.prd.nos.ci/v1", api_key="dummy")

def get_weather(location: str, unit: str):
    return f"Getting the weather for {location} in {unit}..."
tool_functions = {"get_weather": get_weather}

tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get the current weather in a given location",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "City and state, e.g., 'San Francisco, CA'"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },
            "required": ["location", "unit"]
        }
    }
}]

response = client.chat.completions.create(
    model=client.models.list().data[0].id,
    messages=[
        {"role": "user", "content": "What's the weather like in San Francisco?"}
    ],
    tools=tools,
    tool_choice={"type": "function", "function": {"name": "get_weather"}}
)

# After receiving the response
print(response)

if not response.choices[0].message.tool_calls:
    # The model returned no function calls
    print("No function calls. Plain text response:")
    print(response.choices[0].message.content)
else:
    # The model made a tool call
    tool_call = response.choices[0].message.tool_calls[0].function
    print(f"Function called: {tool_call.name}")
    print(f"Arguments: {tool_call.arguments}")
    print(f"Result: {get_weather(**json.loads(tool_call.arguments))}")
