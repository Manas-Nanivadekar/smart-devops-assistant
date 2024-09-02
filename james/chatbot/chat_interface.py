from transformers import AutoModelForCausalLM, AutoTokenizer
import torch


class ChatInterface:
    def __init__(self, model_name="google/codegemma-2b", use_gpu=True):
        self.device = "cuda" if torch.cuda.is_available() and use_gpu else "cpu"

        # Load the model and tokenizer
        self.model = AutoModelForCausalLM.from_pretrained(model_name).to(self.device)
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)

        # Add padding token if it doesn't exist
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token

    def handle_query(self, query, rag_context):
        # Prepare the input
        prompt = f"""You are an AI assistant helping users understand their AWS infrastructure.
    Below is the metadata about AWS resources: {rag_context} User Query: {query}"""
        inputs = self.tokenizer(
            prompt, return_tensors="pt", padding=True, truncation=True
        ).to(self.device)

        # Generate response
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=1000,
                temperature=0.7,
                top_p=0.95,
                do_sample=True,
                pad_token_id=self.tokenizer.pad_token_id,
                eos_token_id=self.tokenizer.eos_token_id,
            )

        # Decode and return the response
        response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return response.strip()
