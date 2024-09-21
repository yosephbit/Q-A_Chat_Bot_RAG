# Contract Advisor RAG

## Building A High-Precision Legal Expert LLM APP

## Background Context

**What is RAG**: Retrieval Augmented Generation, commonly known as RAG, is a hybrid AI model that marries the expertise of powerful language models with the richness of external data sources. At its core, RAG leverages a large language model for generating responses, but with a twist – it first retrieves relevant information from a vast pool of external data. This retrieval phase empowers the model to augment its generated responses with information that goes beyond its initial training data, offering more accurate, informed, and context-rich outputs.

**Why is RAG Exciting**: Building a basic RAG system can be surprisingly straightforward, making it an enticing entry point for AI enthusiasts and students. However, crafting a high-quality, robust RAG system that performs exceptionally well is a complex and challenging endeavor. This complexity provides a rich learning ground for those aspiring to push the boundaries in AI.

## Installation front-end and back-end
* Clone the repo
* run this command:
  * docker run --name pgvector -e POSTGRES_HOST_AUTH_METHOD=trust -p 5412:5432 -d ankane/pgvector
* cd to back-end:
  * poetry install
  * langchain serve
* cd to front-end:
  * npm i
  * npm run dev

## Installation with docker
* Clone the repo 
* cd to the root folder
* docker compose up

