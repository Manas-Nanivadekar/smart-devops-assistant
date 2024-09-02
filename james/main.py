from aws_interactions.resource_fetcher import ResourceFetcher
from rag_system.document_processor import DocumentProcessor
from chatbot.chat_interface import ChatInterface
from utils.logger import setup_logger
import os


def main():
    # Setup logger
    logger = setup_logger("aws_monitoring_chatbot", "bot.log")

    # Fetch AWS resources
    fetcher = ResourceFetcher(service_name="ec2", region_name="us-west-2")
    resources = fetcher.generate_demo_metadata()  # Use demo metadata
    if resources:
        logger.info("Fetched AWS resources successfully")

    # Process documents
    processor = DocumentProcessor()
    documents = [str(resources)]  # Convert metadata to string for processing
    chunks = processor.process_documents(documents)
    logger.info(f"Processed {len(chunks)} document chunks")

    # Initialize chat interface with local model path
    # Pass the processed chunks to query as context
    context = " ".join(chunks)
    chat_interface = ChatInterface()
    query = "What is my IP address?"
    response = chat_interface.handle_query(query, context)
    print(response)


if __name__ == "__main__":
    main()
