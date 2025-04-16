from fastapi import FastAPI, Request
import httpx
import uvicorn

app = FastAPI()

VLLM_URL = "http://localhost:9000"

@app.api_route("/test/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])  
async def proxy(request: Request, path: str):

    body = await request.body()
    
    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=request.method,
            url=f"{VLLM_URL}/{path}",
            content=body,
            headers=request.headers
        )
        return response.json()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000)  