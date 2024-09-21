import os
from dotenv import load_dotenv
from langchain_community.document_loaders import DirectoryLoader, UnstructuredPDFLoader
from langchain_openai import OpenAIEmbeddings
from langchain_experimental.text_splitter import SemanticChunker
from langchain_community.vectorstores.pgvector import PGVector


# print(EMBEDDING_MODEL)
EMBEDDING_MODEL = 'text-embedding-ada-002'

load_dotenv()

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
loader = DirectoryLoader(
    os.path.abspath("../data"),
    glob="**/*.pdf",
    use_multithreading=True,
    max_concurrency=50,
    loader_cls=UnstructuredPDFLoader,
)

docs = loader.load()
embeddings = OpenAIEmbeddings(model=EMBEDDING_MODEL)


text_splitter = SemanticChunker(
    embeddings=embeddings
)

chunks = text_splitter.split_documents(docs)
PGVector.from_documents(
    documents=chunks,
    embedding=embeddings,
    collection_name="pdf_rag",
    connection_string=os.environ.get("POSTGRES_URL"),
    pre_delete_collection=True,
)