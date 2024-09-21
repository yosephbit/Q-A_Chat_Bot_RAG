import os
from operator import itemgetter
from typing import TypedDict

from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.vectorstores.pgvector import PGVector
from langchain_core.output_parsers.string import StrOutputParser
from langchain_core.runnables import RunnableParallel
from dotenv import load_dotenv


load_dotenv()

vector_store = PGVector(
    embedding_function=OpenAIEmbeddings(),
    collection_name="pdf_rag",
    connection_string=os.environ.get("POSTGRES_URL"),
)


template = """
You are a question and answer assistant that \
returns specific  clear and accurate answer given the following context:
{context}

Question: {question}
"""

ANSWER_PROMPT = ChatPromptTemplate.from_template(template)

llm = ChatOpenAI(temperature=0, model="gpt-4-1106-preview", streaming=True)


class RagInput(TypedDict):
    question: str


# final_chain = (
#     {
#         "context": itemgetter("question") | vector_store.as_retriever(),
#         "question": itemgetter("question")   
#     } | ANSWER_PROMPT | llm | StrOutputParser()
#     ).with_types(input_type=RagInput)

final_chain = (
    RunnableParallel(
        context=(itemgetter("question") | vector_store.as_retriever()),
        question=itemgetter("question")
    ) | RunnableParallel(
        answer=(ANSWER_PROMPT | llm),
        docs=itemgetter("context")
    )
    ).with_types(input_type=RagInput)