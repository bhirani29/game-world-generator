from mesa import Agent, Model
from mesa.time import RandomActivation
import torch
import random

class TerrainAgent(Agent):
    def __init__(self, unique_id, model):
        super().__init__(unique_id, model)
        self.model = torch.jit.load('terrain_model.pt')
        # Assign unique position in a 5x2 grid
        grid_x = unique_id % 5  # 0 to 4
        grid_y = unique_id // 5  # 0 or 1
        self.position = (grid_x, grid_y)
        self.texture = "grass"
        self.output = 0.0

    def step(self):
        player_input = torch.tensor([random.random()])
        self.model.eval()
        with torch.no_grad():
            output = self.model(player_input)
        self.output = output.item()
        self.texture = "forest" if output > 0.5 else "grass"
        print(f"Agent {self.unique_id}: output={self.output}, texture={self.texture}")  # Debug
        self.model.adapt(player_input)

class GameModel(Model):
    def __init__(self):
        super().__init__()
        self.schedule = RandomActivation(self)
        for i in range(10):
            agent = TerrainAgent(i, self)
            self.schedule.add(agent)

    def step(self):
        self.schedule.step()