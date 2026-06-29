from prompt_builder import create_prompt

from ollama_client import ask_phi3


prompt = create_prompt(

    latency=82,

    packet_loss=5,

    cpu=91,

    risk=88

)


response = ask_phi3(prompt)


print(response)