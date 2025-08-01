from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import GoogleGenerativeAIEmbeddings
from langchain.vectorstores import Chroma
import google.generativeai as genai
import os

# 🔐 Set your Gemini API Key
GOOGLE_API_KEY = "AIzaSyACrj-z-cFd3oXv-6YJ8lB9u-JjPf6gcyM"
# ⚙️ Configure Gemini
genai.configure(api_key=GOOGLE_API_KEY)

# 🌐 FastAPI App Setup
app = FastAPI()

# 🔓 Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🧠 Initialize Gecko Embedding Model
embedding = GoogleGenerativeAIEmbeddings(
    model="models/embedding-gecko-001",
    google_api_key=GOOGLE_API_KEY
)

# 📚 Load and Embed Documents (Only on First Run)
def load_documents():
    print("🔁 Loading and embedding documents...")
    loader = PyPDFLoader("sample.pdf")  # Replace with your actual PDF
    documents = loader.load()

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(documents)

    vectorstore = Chroma.from_documents(
        chunks,
        embedding=embedding,
        persist_directory="db"
    )
    vectorstore.persist()
    return vectorstore

# 📂 Load from existing DB or create it
if not os.path.exists("db/index"):
    vectorstore = load_documents()
else:
    print("✅ Using existing ChromaDB vector store...")
    vectorstore = Chroma(persist_directory="db", embedding_function=embedding)

# 🤖 Query Endpoint
@app.post("/query")
async def query_handler(req: Request):
    data = await req.json()
    query = data.get("query")

    # 🔍 Get relevant chunks from ChromaDB
    docs = vectorstore.similarity_search(query, k=3)
    context = "\n".join([doc.page_content for doc in docs])

    # 🧠 Gemini LLM Prompt
    model = genai.GenerativeModel("gemini-1.5-pro")
    response = model.generate_content(f"""
Use the following context to answer the user's question.

Context:
{context}

Question:
{query}

Answer:
""")

    return {"response": response.text}
