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


# 🧠 Log Analyzer using FastAPI, LangChain, and TinyLLaMA

This is a Retrieval-Augmented Generation (RAG) backend built using **FastAPI**, **LangChain**, and **TinyLLaMA** via **Ollama**. Upload a `.log` file and ask questions — the system will extract relevant content using embeddings and respond intelligently using the local LLM.

---

## 🔧 Setup Instructions

1. **Clone the repo**:
   ```bash
   git clone https://github.com/your-username/log-analyzer.git
   cd log-analyzer/project/rag-backend

2.   **Create Virtual Enviornment**
python -m venv env
source env/bin/activate      # Linux/macOS
env\Scripts\activate         # Windows

3. **Install Dependencies**
pip install -r requirements.txt

4. **Install and run Ollama**
ollama pull tinyllama

5. **Run the Server**
uvicorn main:app --reload --port 8080
