from flask import Flask, render_template, request, jsonify
from aws_interactions.resource_fetcher import ResourceFetcher
from rag_system.document_processor import DocumentProcessor
from chatbot.chat_interface import ChatInterface
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
import torch

app = Flask(__name__)


def setup_chatbot():
    torch.cuda.empty_cache()
    fetcher = ResourceFetcher(service_name="ec2", region_name="ap-south-1")
    resources = fetcher.generate_demo_metadata()
    processor = DocumentProcessor()
    documents = [str(resources)]
    chunks = processor.process_documents(documents)
    embeddings = HuggingFaceEmbeddings()
    vectorstore = FAISS.from_texts(chunks, embedding=embeddings)
    chat_interface = ChatInterface()
    return vectorstore, chat_interface


vectorstore, chat_interface = setup_chatbot()


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/ask", methods=["POST"])
def ask():
    user_message = request.json["message"]
    relevant_docs = vectorstore.similarity_search(user_message, k=1)
    context = relevant_docs[0].page_content
    response = chat_interface.handle_query(user_message, context)
    return jsonify({"response": response})


if __name__ == "__main__":
    app.run(debug=True)
