def chunk_text(text: str, chunk_size: int = 512, overlap: int = 50) -> list[str]:
    """
    Splits text into chunks of approximately chunk_size words with overlap.
    Uses word boundaries — never cuts mid-word.
    """
    if not text:
        return []
        
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = ' '.join(words[start:end])
        chunks.append(chunk)
        start += chunk_size - overlap
    return [c for c in chunks if len(c.strip()) > 20]  # discard micro-chunks
