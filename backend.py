from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from agents import GameModel

app = FastAPI()
model = GameModel()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/generate_world")
async def generate_world():
    model.step()
    terrain = [{"x": agent.position[0], "y": agent.position[1], "texture": agent.texture, "output": agent.output} for agent in model.schedule.agents]
    return {"terrain": terrain}

@app.get("/update_world")
async def update_world():
    model.step()
    terrain = [{"x": agent.position[0], "y": agent.position[1], "texture": agent.texture, "output": agent.output} for agent in model.schedule.agents]
    return {"terrain": terrain}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)