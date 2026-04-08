from fastapi import FastAPI, UploadFile
import whisper
import shutil
import os

app = FastAPI()

model = whisper.load_model("base")

@app.get("/")
def home():
    return {"status": "AI running"}

@app.post("/process")
async def process(file: UploadFile):
    file_path = f"temp_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = model.transcribe(file_path)

    text = result["text"]

    summary = text[:300]

    os.remove(file_path)

    return {
        "transcript": text,
        "summary": summary
    }