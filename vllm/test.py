from vllm import LLM

prompts = ["What colour is the sky?"]  # Sample prompts.
llm = LLM(model="meta-llama/Meta-Llama-3-8B-Instruct")  # Create an LLM.
outputs = llm.generate(prompts)
print(outputs)