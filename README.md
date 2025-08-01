# AI-Powered Log Analyzer

## Overview

**LogLens AI** is an intelligent, real-time log analysis platform designed to help DevOps engineers, SREs, and developers **monitor, detect, and understand anomalies** in large-scale log data using artificial intelligence and machine learning.

It not only **streams logs** and detects abnormal behavior, but also provides **root cause analysis**, **actionable insights**, and **trend reports** to improve system reliability and operational efficiency.

---

## Features

### **Real-Time Log Monitoring**

* Live stream of logs with syntax highlighting
* Filter by service, timestamp, error level
* NLP-powered search (e.g., "show all 500 errors in the past hour")

### **AI Anomaly Detection**

* ML-based anomaly and pattern recognition
* Severity scoring and confidence levels
* Root cause timeline and chain-of-event tracing


# RAG Backend with Gemini + FastAPI

This is a Retrieval-Augmented Generation (RAG) backend built using FastAPI and Google Gemini. Upload a PDF and ask questions — the system will extract relevant content using embeddings and respond using Gemini models.

---

## 🔧 Setup Instructions

1. **Clone the repo**:
   ```bash
   git clone https://github.com/teresa-elinjikkal/log-analyzer.git
   cd log-analyzer/rag-backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate    # Linux/macOS
   venv\Scripts\activate       # Windows
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up `.env` file**:
   Create a file named `.env` and add:
   ```env
   GOOGLE_API_KEY=your_google_api_key_here
   ```

---

## 🚀 Run the Server

```bash
uvicorn main:app --reload
```

Visit: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 🧪 Test API (Swagger & Postman)

### Swagger UI:
Visit [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)  
- Use `/ask` endpoint  
- Upload a `.pdf` file  
- Ask a question

### Postman Example:

```
POST http://127.0.0.1:8000/ask/?question=What is the document about?

Headers:
  Content-Type: multipart/form-data

Body (form-data):
  key: file
  type: File
  value: <your-pdf-file>
```

---

## 🧠 LLM & Embedding Models Used

- **LLM**: `models/gemini-2.5-pro`
- **Embeddings**: `models/embedding-001`
- **Vector Store**: `ChromaDB`

---

## 🗃️ Project Structure

```
rag-backend/
│
├── main.py               # FastAPI app
├── requirements.txt      # Dependencies
├── .env                  # API key config
├── temp_files/           # Uploaded PDFs
├── chroma_temp/          # Vector store DB
└── README.md
```

---

## 💡 Notes

- Make sure your Google API key has access to Gemini models.
- If errors occur, check your `.env` or model names.

---

## 📄 License

MIT License

