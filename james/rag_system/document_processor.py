from langchain.text_splitter import RecursiveCharacterTextSplitter


class DocumentProcessor:
    def __init__(self, chunk_size=500):
        self.splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size)

    def process_documents(self, documents):
        chunks = []
        for doc in documents:
            chunks.extend(self.splitter.split_text(doc))
        return chunks
