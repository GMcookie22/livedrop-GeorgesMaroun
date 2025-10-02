import sys
import requests

API_URL = "https://nonpathogenic-dawna-thecate.ngrok-free.dev/chat"

def query_llama(user_input):
    """Send user input to the Flask API running in Colab and return the response."""
    try:
        response = requests.post(API_URL, json={"query": user_input})
        if response.status_code == 200:
            return response.json().get("response", "No response from server.")
        else:
            return f"Error: {response.status_code} {response.text}"
    except Exception as e:
        return f"Request failed: {str(e)}"

def main():
    print("Welcome to the Llama CLI chat! Type 'exit' to quit.\n")
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            print("Exiting chat. Goodbye!")
            break
        response = query_llama(user_input)
        print(f"Llama: {response}\n")

if __name__ == "__main__":
    main()
